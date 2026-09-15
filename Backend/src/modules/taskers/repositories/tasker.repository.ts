import { injectable } from "inversify";
import { ITaskerRepositoy } from "../interfaces/tasker-repository.interface";
import { NearbyTasker } from "../types/nearby-tasker.type";
import prisma from "../../../database/prisma/prisma";

@injectable()
export class TaskerRepository implements ITaskerRepositoy {
    async findNearbyTasker(serviceId: string, latitude: number, longitude: number, distanceKm: number): Promise<NearbyTasker[]> {
        const distanceMeters = distanceKm * 1000;

        return prisma.$queryRaw<NearbyTasker[]>`
            SELECT
                tp.id AS "taskerProfileId",
                u.id AS "userId",
                u."firstName",
                u."lastName",
                tp."profileImageUrl",
                tp."averageRating",
                tp."totalReviews",
                tso."hourlyRate"::double precision AS "hourlyRate",
                tso."dailyRate"::double precision AS "dailyRate",
                (
                    ST_Distance(
                        tl."location",
                        ST_SetSRID(
                            ST_MakePoint(
                                ${longitude},
                                ${latitude}
                            ),
                            4326
                        )::geography
                    ) / 1000
                )::double precision AS "distanceKm"
            FROM "TaskerLocation" tl
            INNER JOIN "TaskerProfile" tp
                ON tp.id = tl."taskerProfileId"
            INNER JOIN "users" u
                ON u.id = tp."userId"
            INNER JOIN "TaskerServiceOffering" tso
                ON tso."taskerProfileId" = tp.id
            WHERE
                tso."serviceId" = ${serviceId}
                AND tso.status = 'ACTIVE'
                AND tp."profileStatus" = 'COMPLETE'
                AND ST_DWithin(
                    tl."location",
                    ST_SetSRID(
                        ST_MakePoint(
                            ${longitude},
                            ${latitude}
                        ),
                        4326
                    )::geography,
                    ${distanceMeters}
                )
            ORDER BY "distanceKm" ASC
        `;
    }
}