import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = { url: string; publicId: string };

export async function uploadImage(file: File, folder: string = "refora/products"): Promise<UploadResult | null> {
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.warn("CLOUDINARY_API_SECRET is missing. Cannot upload image.");
    return null;
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        format: "webp",
        quality: "auto",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          resolve(null);
        } else {
          resolve(result ? { url: result.secure_url, publicId: result.public_id } : null);
        }
      }
    );
    stream.end(buffer);
  });
}
