import { StatusCodes } from "http-status-codes"
import { ENV } from "../../config/env.config"
import { AppError } from "../errors/app.error"
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto"

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const KEY_LENGTH = 32

function getEncryptionKey():Buffer{
    const keyHex = ENV.KYC.ENCRYPTION_KEY
    if(!/^[0-9a-fA-F]{64}$/.test(keyHex)) throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR,"KYC encryption configuration is invalid",undefined,"KYC_ENCRYPTION_CONFIG_INVALID")
    return Buffer.from(keyHex,"hex")
}

export function encryptKycData(data:Buffer):Buffer {
    const key = getEncryptionKey()
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM,key,iv)
    const ciphertext = Buffer.concat([cipher.update(data),cipher.final()])
    const authTag = cipher.getAuthTag()
    return Buffer.concat([iv,authTag,ciphertext])
}

export function decryptKycData(encryptedData:Buffer):Buffer {
    const key = getEncryptionKey()

    if(encryptedData.length < IV_LENGTH + AUTH_TAG_LENGTH) throw new AppError(StatusCodes.BAD_REQUEST,"Invalid encrypted KYC data", undefined, "KYC_ENCRYPTED_DATA_INVALID")
    
    const iv = encryptedData.subarray(0,IV_LENGTH)
    const authTag = encryptedData.subarray(IV_LENGTH,IV_LENGTH + AUTH_TAG_LENGTH)
    const ciphertext = encryptedData.subarray(IV_LENGTH + AUTH_TAG_LENGTH)
    try {
        const decipher = createDecipheriv(ALGORITHM,key,iv)
        decipher.setAuthTag(authTag)
        return Buffer.concat([decipher.update(ciphertext),decipher.final()])
    }catch {
        throw new AppError( StatusCodes.BAD_REQUEST,"Unable to decrypt KYC data", undefined, "KYC_DECRYPTION_FAILED")
    }
}