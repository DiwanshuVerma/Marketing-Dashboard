const multer = require('multer');
const fs = require('fs');

const createTempDir = () => {
  const dir = 'temp/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    createTempDir();
    cb(null, 'temp/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer to accept two file fields (photoWeb & photoApp)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: 'photoWeb', maxCount: 1 },
  { name: 'photoApp', maxCount: 1 }
]);

module.exports = upload; // Directly exporting the configured multer instance
