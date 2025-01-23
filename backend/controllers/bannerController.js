const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');
const uploadToCloudinary = require('../utils/cloudinary');

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Create a new banner
exports.createBanner = async (req, res) => {
  try {
    const { title, type, isDefault, status } = req.body;

    const banner = new Banner({
      title,
      type,
      isDefault: isDefault || false,
      status: status || 'Inactive',
    });

    await banner.save();

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, type, isDefault, status, startDate, endDate } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(404).send('Banner not found');
    console.log('update banners')

    // Update the fields only if they are provided
    if (title) banner.title = title;
    if (type) banner.type = type;
    if (typeof isDefault !== 'undefined') banner.isDefault = isDefault;
    if (status) banner.status = status;
    if (startDate) banner.startDate = startDate;
    if (endDate) banner.endDate = endDate;
    // Handle image upload if provided
    if (req.file) {
      console.log('inside update banner api, file upload')
      banner.photo = await uploadToCloudinary(req.file.path, 'banners');
    }

    await banner.save();
    res.json({ message: 'Banner updated successfully', banner });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// to delete
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) return res.status(404).send('Banner not found');

    if (banner.photo) {
      fs.unlinkSync(path.join(__dirname, '../../', banner.photo));
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
