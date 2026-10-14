import { ENV } from "./env.config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name:ENV.CLOUDINARY.CLOUD_NAME,
    api_key:ENV.CLOUDINARY.API_KEY,
    api_secret:ENV.CLOUDINARY.API_SECRET
})

export { cloudinary }