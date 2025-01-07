const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// const mongoUrl = process.env.MONGO_URI

const app = express()
app.use(bodyParser.json())
app.use(cors())

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Folder to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});
const upload = multer({ storage });

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://diwanshu:Golu6061234@cluster0.ntchxhq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/campaignsNew') 
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Banner schema and model
const bannerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Upcoming', 'Inactive'], default: 'Inactive' },
  photo: { type: String },
  startDate: { type: Date, required: false }, // Required only when provided
  endDate: { type: Date, required: false }    // Same as above
});


const Banner = mongoose.model('Banner', bannerSchema);

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

// Get all banners
app.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new banner (with image upload)
app.post('/banners', upload.single('photo'), async (req, res) => {
  try {
    const { name, type, isDefault, status, startDate, endDate } = req.body;
    const photoPath = req.file ? `/uploads/${req.file.filename}` : null; // Store relative path

    const banner = new Banner({
      name,
      type,
      isDefault,
      status,
      photo: photoPath,
      startDate,
      endDate
    });

    await banner.save();
    return res.status(201).json({
      message: 'Banner created successfully',
      banner
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Update a banner (with image upload)
app.put('/banners/:id', upload.single('photo'), async (req, res) => {
  try {
    const { name, type, isDefault, status, startDate, endDate } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).send('Banner not found');
    }

    // Delete old image if a new image is uploaded
    if (req.file) {
      if (banner.photo) {
        fs.unlinkSync(path.join(__dirname, banner.photo));
      }
      banner.photo = `/uploads/${req.file.filename}`;
    }

    banner.name = name || banner.name;
    banner.type = type || banner.type;
    banner.isDefault = isDefault || banner.isDefault;
    banner.status = status || banner.status;
    banner.startDate = startDate || banner.startDate;
    banner.endDate = endDate || banner.endDate;

    await banner.save();
    res.json(banner);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Delete a banner
app.delete('/banners/:id', async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).send('Banner not found');
    }

    // Delete the image file if it exists
    if (banner.photo) {
      fs.unlinkSync(path.join(__dirname, banner.photo));
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
