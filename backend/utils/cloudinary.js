const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder) => {
  try {
    console.log('inside utils cloudinary')
    const result = await cloudinary.uploader.upload(filePath, { folder });
    fs.unlinkSync(filePath); // Delete the local file after uploading to Cloudinary
    return result.secure_url; // Return the uploaded image's URL
  } catch (error) {
    throw new Error('Failed to upload to Cloudinary: ' + (error.message || error.error?.message || error));
  }
};

module.exports = uploadToCloudinary;
