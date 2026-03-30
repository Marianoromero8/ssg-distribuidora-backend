import multer from 'multer';
import { Request } from 'express';
import { cloudinary } from '../config/cloudinary';
import { AppError } from '../shared/errors/AppError';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req: Request, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only images (jpg, png, webp) and mp4 videos are allowed', 400));
    }
  },
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error || !result) return reject(new AppError('Image upload failed', 500));
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}
