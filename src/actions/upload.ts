'use server';

import { cloudinary, CLOUDINARY_FOLDERS } from '@/lib/cloudinary';

export interface UploadActionResult {
  success?: boolean;
  url?: string;
  error?: string;
}

export async function uploadImageAction(
  formData: FormData,
  folder: keyof typeof CLOUDINARY_FOLDERS = 'PRODUCTS'
): Promise<UploadActionResult> {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { error: 'No image file provided.' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: CLOUDINARY_FOLDERS[folder],
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            resolve({ error: error?.message || 'Failed to upload image to Cloudinary.' });
          } else {
            resolve({ success: true, url: result.secure_url });
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during upload.';
    return { error: message };
  }
}
