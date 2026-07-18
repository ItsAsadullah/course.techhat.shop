import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * LMS specific folder base path.
 * This ensures all LMS media is isolated from e-commerce media.
 */
const LMS_FOLDER_PREFIX = 'techhat/lms';

export type LmsMediaType = 'course_thumbnail' | 'lesson_video' | 'instructor_avatar' | 'attachments';

/**
 * Uploads a file to Cloudinary under the strictly managed LMS folder structure.
 * 
 * @param fileData The file buffer or base64 string
 * @param mediaType The type of media being uploaded to determine subfolder
 * @returns Upload response from Cloudinary
 */
export const uploadLmsMedia = async (fileData: string, mediaType: LmsMediaType) => {
  let subFolder = '';

  switch (mediaType) {
    case 'course_thumbnail':
      subFolder = 'courses/thumbnails';
      break;
    case 'lesson_video':
      subFolder = 'lessons/videos';
      break;
    case 'instructor_avatar':
      subFolder = 'instructors/avatars';
      break;
    case 'attachments':
      subFolder = 'courses/attachments';
      break;
    default:
      subFolder = 'misc';
  }

  const folderPath = `${LMS_FOLDER_PREFIX}/${subFolder}`;

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileData, {
      folder: folderPath,
      resource_type: mediaType === 'lesson_video' ? 'video' : 'auto',
    });
    
    return uploadResponse;
  } catch (error) {
    console.error(`Error uploading LMS media to folder ${folderPath}:`, error);
    throw new Error('Failed to upload LMS media');
  }
};

/**
 * Deletes an LMS media file from Cloudinary.
 * Ensures the publicId includes the LMS prefix as a safety check.
 */
export const deleteLmsMedia = async (publicId: string, resourceType: 'image' | 'video' | 'raw' = 'image') => {
  if (!publicId.startsWith(LMS_FOLDER_PREFIX)) {
    throw new Error('Cannot delete media outside of the LMS folder scope for safety.');
  }

  try {
    const response = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return response;
  } catch (error) {
    console.error(`Error deleting LMS media (publicId: ${publicId}):`, error);
    throw new Error('Failed to delete LMS media');
  }
};
