const multer = require('multer');

// Configure multer to store files temporarily
const storage = multer.diskStorage({
  
  destination: (req, file, cb) => {
    console.log('inside multer middleware')
    cb(null, 'temp/'); // Temporary storage folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
