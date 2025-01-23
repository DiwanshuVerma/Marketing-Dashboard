const fs = require('fs');
const multer = require('multer');

// Ensure the directory exists
const createTempDir = () => {
  const dir = 'temp/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure multer to store files temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createTempDir(); // Create directory if it doesn't exist
    console.log('inside multer middleware')
    cb(null, 'temp/'); // Temporary storage folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
