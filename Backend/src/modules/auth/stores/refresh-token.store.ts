import { injectable } from "inversify";
import {IRefreshTokenStore,RefreshRotationResult,RotateRefreshTokenData,} from "../interfaces/refresh-token-store.interface";
import { RefreshTokenRecord } from "../types/auth-session.types";
import { redisClient } from "../../../config/redis.config";

@injectable()
export class RefreshTokenStore implements IRefreshTokenStore {
  async create(tokenHash: string,record: RefreshTokenRecord,ttlSeconds: number,): Promise<void> {
    await redisClient.set(`auth:refresh:${tokenHash}`, JSON.stringify(record), {
      EX: ttlSeconds,
    });
  }
  async findByHash(tokenHash: string): Promise<RefreshTokenRecord | null> {
    const value = await redisClient.get(`auth:refresh:${tokenHash}`);
    if (!value) return null;
    return JSON.parse(value) as RefreshTokenRecord;
  }
  
  async rotate(data: RotateRefreshTokenData): Promise<RefreshRotationResult> {
    const currentRefreshKey = `auth:refresh:${data.currentTokenHash}`;
    const newRefreshKey = `auth:refresh:${data.newTokenHash}`;
    const sessionKey = `auth:session:${data.sessionId}`;
    const familyKey = `auth:family:${data.familyId}`;

    const script = `
    local currentRaw = redis.call(
      'GET',
      KEYS[1]
    )

    if not currentRaw then
      return 'TOKEN_NOT_FOUND'
    end

    local current =
      cjson.decode(currentRaw)


    if current.status ~= 'ACTIVE' then

      if current.status == 'USED' then

        local sessionRaw =
          redis.call(
            'GET',
            KEYS[3]
          )

        if sessionRaw then
          local session =
            cjson.decode(sessionRaw)

          session.status = 'REVOKED'

          redis.call(
            'SET',
            KEYS[3],
            cjson.encode(session),
            'KEEPTTL'
          )
        end


        local familyRaw =
          redis.call(
            'GET',
            KEYS[4]
          )

        if familyRaw then
          local family =
            cjson.decode(familyRaw)

          family.status = 'REVOKED'

          redis.call(
            'SET',
            KEYS[4],
            cjson.encode(family),
            'KEEPTTL'
          )
        end

        return 'TOKEN_REUSED'
      end

      return 'TOKEN_NOT_FOUND'
    end


    local sessionRaw =
      redis.call(
        'GET',
        KEYS[3]
      )

    if not sessionRaw then
      return 'SESSION_INVALID'
    end

    local session =
      cjson.decode(sessionRaw)

    if session.status ~= 'ACTIVE' then
      return 'SESSION_INVALID'
    end


    local familyRaw =
      redis.call(
        'GET',
        KEYS[4]
      )

    if not familyRaw then
      return 'FAMILY_INVALID'
    end

    local family =
      cjson.decode(familyRaw)

    if family.status ~= 'ACTIVE' then
      return 'FAMILY_INVALID'
    end


    if current.sessionId ~= ARGV[1]
       or current.familyId ~= ARGV[2]
    then
      return 'TOKEN_NOT_FOUND'
    end


    -- Mark current refresh token as USED
    current.status = 'USED'
    current.replacedByHash = ARGV[3]

    redis.call(
      'SET',
      KEYS[1],
      cjson.encode(current),
      'KEEPTTL'
    )


    -- Create new refresh token
    local newToken = {
      sessionId = ARGV[1],
      familyId = ARGV[2],
      status = 'ACTIVE',
      expiresAt = ARGV[4],
      replacedByHash = cjson.null
    }

    redis.call(
      'SET',
      KEYS[2],
      cjson.encode(newToken),
      'EX',
      ARGV[6]
    )


    -- Update session with the new refresh token
    session.refreshTokenHash = ARGV[3]
    session.lastUsedAt = ARGV[5]

    redis.call(
      'SET',
      KEYS[3],
      cjson.encode(session),
      'KEEPTTL'
    )


    return 'ROTATED'
    `;

    const result = await redisClient.eval(script, {
        keys: [
            currentRefreshKey,
            newRefreshKey,
            sessionKey,
            familyKey
        ],
        arguments: [
            data.sessionId,
            data.familyId,
            data.newTokenHash,
            data.newTokenExpiresAt,
            data.now,
            String(data.ttlSeconds)
        ]
    });

    switch (result) {
        case "ROTATED":
            return { status: "ROTATED" };

        case "TOKEN_REUSED":
            return {
                status: "TOKEN_REUSED",
                sessionId: data.sessionId,
                familyId: data.familyId
            };

        case "SESSION_INVALID":
            return {
                status: "SESSION_INVALID"
            };

        case "FAMILY_INVALID":
            return {
                status: "FAMILY_INVALID"
            };

        default:
            return {
                status: "TOKEN_NOT_FOUND"
            };
    }
}

  async deleteByHash(tokenHash:string):Promise<void> {
    await redisClient.del(`auth:refresh:${tokenHash}`)
  }

  async revokeByHash(tokenHash: string): Promise<void> {
    const key = `auth:refresh:${tokenHash}`
    const value = await redisClient.get(key)
    if(!value) return
    const refreshToken = JSON.parse(value) as RefreshTokenRecord
    refreshToken.status = "REVOKED"
    await redisClient.set(key,JSON.stringify(refreshToken),{KEEPTTL:true})
  }
  
}
