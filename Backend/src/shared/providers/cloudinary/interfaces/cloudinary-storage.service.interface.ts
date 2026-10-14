export interface CloudinaryStoredFile {
  publicId: string;
  assetId: string;
  bytes: number;
}

export interface ICloudinaryStorageService {
  uploadEncryptedKycFile(encryptedBuffer: Buffer,): Promise<CloudinaryStoredFile>;
  deleteEncryptedKycFile(publicId: string,): Promise<void>;
}
