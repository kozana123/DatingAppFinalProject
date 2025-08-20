import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// /**
//  * Upload an image buffer or file path to Cloudinary
//  * @param {Buffer | string} file - Buffer or path of the image file
//  * @param {string} filename - Name of the file (optional)
//  * @param {string} folder - Folder name in Cloudinary
//  * @returns {Promise<string>} - The secure URL of the uploaded image
//  */
export async function uploadImage(file, filename, folder = 'DatingAppFinalProject') {
  try {
    const uploadOptions = {
      folder,
      use_filename: false,
      unique_filename: true,
      overwrite: false,
    };

    let result;
    if (Buffer.isBuffer(file)) {
      // Upload from buffer (e.g., file from multer memory storage)
      result = await cloudinary.uploader.upload_stream(uploadOptions, (error, res) => {
        if (error) console.log(error);
         error;
        return res;
      });
      // However, cloudinary.uploader.upload_stream is callback-based, so better to wrap in Promise:

      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, res) => {
          if (error) reject(error);
          else resolve(res);
        });
        stream.end(file);
      });
    } else {
      // Upload from path or URL
      result = await cloudinary.uploader.upload(file, uploadOptions);
    }

    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
}

function extractImageNameFromUrl(url) {
  // Split by '/upload/' to isolate the part after upload
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;

  // Remove version prefix (v1234567890/)
  let afterUpload = parts[1].replace(/^v\d+\//, '');

  // Remove the file extension (.jpg, .png, etc)
  const publicId = afterUpload.replace(/\.[^/.]+$/, '');

  // Now extract only the file name after the last slash
  const segments = publicId.split('/');
  return segments[segments.length - 1]; // last part is the file name
}

export async function replaceImage(newFile, fileName, folder = 'DatingAppFinalProject') {
  try {
    const publicId = extractImageNameFromUrl(fileName)
    console.log(publicId);
    
    const uploadOptions = {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
      folder, // optional, Cloudinary uses public_id's folder anyway
    };

    let result;
    if (Buffer.isBuffer(newFile)) {
      // Upload buffer with overwrite
      result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, res) => {
          if (error) reject(error);
          else resolve(res);
        });
        stream.end(newFile);
      });
    } else {
      // Upload from path or URL with overwrite
      result = await cloudinary.uploader.upload(newFile, uploadOptions);
    }

    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary replace failed: ' + error.message);
  }
}