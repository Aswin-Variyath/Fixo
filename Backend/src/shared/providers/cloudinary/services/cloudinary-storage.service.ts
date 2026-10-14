import { randomUUID } from "node:crypto";
import { StatusCodes } from "http-status-codes";
import { cloudinary } from "../../../../config/cloudinary.config";
import { AppError } from "../../../errors/app.error";
import { CLOUDINARY_STORAGE } from "../constants/cloudinary-storage.constants";
import type {
  CloudinaryStoredFile,
  ICloudinaryStorageService,
} from "../interfaces/cloudinary-storage.service.interface";

export class CloudinaryStorageService implements ICloudinaryStorageService {
  async uploadEncryptedKycFile(
    encryptedBuffer: Buffer,
  ): Promise<CloudinaryStoredFile> {
    if (!Buffer.isBuffer(encryptedBuffer) || encryptedBuffer.length === 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Encrypted KYC file is required",
        undefined,
        "KYC_FILE_INVALID",
      );
    }

    const publicId =
      `${CLOUDINARY_STORAGE.KYC_FOLDER}/${randomUUID()}.enc`;

    try {
      const result = await cloudinary.uploader.upload(
        `data:application/octet-stream;base64,${encryptedBuffer.toString("base64")}`,
        {
          resource_type: CLOUDINARY_STORAGE.RESOURCE_TYPE,
          type: CLOUDINARY_STORAGE.DELIVERY_TYPE,
          public_id: publicId,
          overwrite: false,
          use_filename: false,
          unique_filename: false,
        },
      );

      return {
        publicId: result.public_id,
        assetId: result.asset_id,
        bytes: result.bytes,
      };
    } catch {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        "Failed to store encrypted KYC file",
        undefined,
        "KYC_STORAGE_FAILED",
      );
    }
  }

  async deleteEncryptedKycFile(publicId: string): Promise<void> {
    if (
      !publicId.startsWith(`${CLOUDINARY_STORAGE.KYC_FOLDER}/`) ||
      publicId.length <= CLOUDINARY_STORAGE.KYC_FOLDER.length + 1
    ) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Invalid KYC storage reference",
        undefined,
        "KYC_STORAGE_REFERENCE_INVALID",
      );
    }

    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: CLOUDINARY_STORAGE.RESOURCE_TYPE,
        type: CLOUDINARY_STORAGE.DELIVERY_TYPE,
        invalidate: true,
      });

      if (result.result !== "ok" && result.result !== "not found") {
        throw new Error("Cloudinary deletion was unsuccessful");
      }
    } catch {
      throw new AppError(
        StatusCodes.BAD_GATEWAY,
        "Failed to delete stored KYC file",
        undefined,
        "KYC_STORAGE_DELETE_FAILED",
      );
    }
  }
}