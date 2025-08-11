import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary - put your credentials here or use env variables
cloudinary.config({
  cloud_name: 'dr9wfscl7',
  api_key: '618543579249246',
  api_secret: 'GW1AyOnnWpuFcNWTL-XbgDqMv-0',
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
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    let result;
    if (Buffer.isBuffer(file)) {
      // Upload from buffer (e.g., file from multer memory storage)
      result = await cloudinary.uploader.upload_stream(uploadOptions, (error, res) => {
        if (error) throw error;
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