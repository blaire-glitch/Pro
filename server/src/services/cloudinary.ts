import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
}

export interface UploadOptions {
  folder?: string;
  transformation?: any[];
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  allowedFormats?: string[];
  maxFileSize?: number;
}

/**
 * Upload a file to Cloudinary
 */
export const uploadToCloudinary = async (
  file: string | Buffer,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const {
    folder = 'afrionex',
    transformation = [],
    resourceType = 'auto',
    allowedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'],
  } = options;

  try {
    const uploadOptions: any = {
      folder,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        ...transformation,
      ],
    };

    let result;

    if (typeof file === 'string' && file.startsWith('data:')) {
      // Base64 upload
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else if (typeof file === 'string') {
      // File path upload
      result = await cloudinary.uploader.upload(file, uploadOptions);
    } else {
      // Buffer upload
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(file);
      });
    }

    return {
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      width: (result as any).width,
      height: (result as any).height,
      format: (result as any).format,
      size: (result as any).bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to cloud storage');
  }
};

/**
 * Upload provider verification documents
 */
export const uploadVerificationDocument = async (
  file: string | Buffer,
  providerId: string,
  documentType: 'id_front' | 'id_back' | 'selfie' | 'business_license' | 'tax_certificate'
): Promise<UploadResult> => {
  return uploadToCloudinary(file, {
    folder: `afrionex/providers/${providerId}/documents`,
    transformation: [
      { width: 1200, crop: 'limit' },
    ],
    allowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
  });
};

/**
 * Upload service images
 */
export const uploadServiceImage = async (
  file: string | Buffer,
  serviceId: string
): Promise<UploadResult> => {
  return uploadToCloudinary(file, {
    folder: `afrionex/services/${serviceId}`,
    transformation: [
      { width: 800, height: 600, crop: 'fill' },
    ],
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  });
};

/**
 * Upload user profile image
 */
export const uploadProfileImage = async (
  file: string | Buffer,
  userId: string
): Promise<UploadResult> => {
  return uploadToCloudinary(file, {
    folder: `afrionex/users/${userId}`,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
    ],
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  });
};

/**
 * Delete a file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
};

/**
 * Generate a signed URL for private files
 */
export const getSignedUrl = (publicId: string, expiresIn: number = 3600): string => {
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    expires_at: Math.floor(Date.now() / 1000) + expiresIn,
  });
};

export default cloudinary;
