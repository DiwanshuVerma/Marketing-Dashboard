const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');
const uploadToCloudinary = require('../utils/cloudinary');
const cloudinary = require("cloudinary").v2;

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
    console.log('creating banner inside controller')

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (err) {
    res.status(400).send(err.message);
  }
};


// Update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, type, status, isDefault, startDate, endDate } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(404).send('Banner not found');
    console.log('Updating banner');

    // Update the fields only if they are provided
    if (title) banner.title = title;
    if (type) banner.type = type;
    if (status) banner.status = status;
    if (typeof isDefault !== 'undefined') banner.isDefault = isDefault;

    // Convert local time strings to UTC dates
    if (startDate) {
      banner.startDate = new Date(startDate); // Converts local time to UTC
    }
    if (endDate) {
      banner.endDate = new Date(endDate); // Converts local time to UTC
    }

    // Validate dates
    if (banner.startDate && banner.endDate && banner.startDate >= banner.endDate) {
      return res.status(400).send('End date must be after start date');
    }

    // Calculate and update the status dynamically using UTC
    const nowUTC = new Date(); // Current UTC time
    const startUTC = banner.startDate ? new Date(banner.startDate) : null;
    const endUTC = banner.endDate ? new Date(banner.endDate) : null;

    if (startUTC && endUTC) {
      if (nowUTC >= startUTC && nowUTC <= endUTC) {
        banner.status = 'Active';
      } else if (nowUTC < startUTC) {
        banner.status = 'Upcoming';
      } else {
        banner.status = 'Inactive';
      }
    } else {
      banner.status = 'Inactive'; // Default to Inactive if dates are missing
    }

    // Handle image upload if provided
    if (req.file) {
      console.log('Handling file upload in update banner API');
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
    const {id} = req.params

    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).send('Banner not found');

    const imageUrl = banner.photo
    if (imageUrl) {

      console.log('deleting banner photo')

      const publicIdMatch = imageUrl.match(/\/([^/]+)\.[a-z]+$/i);
      if (publicIdMatch) {
        const publicId = `banners/${publicIdMatch[1]}`; // Prepend folder name if applicable

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Banner.findByIdAndDelete(id)

    return res.status(204).json({ message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting banner", Error: err.message});
  }
};


// return active banners
exports.getActiveResBanners = async (req, res) => {
  try {
    const activeBanners = await Banner.find({ status: 'Active', type: 'Restaurant Discount' });
    res.status(200).json(activeBanners);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active banners', message: err.message });
  }
};
// return active banners
exports.getActiveDisBanners = async (req, res) => {
  try {
    const activeBanners = await Banner.find({ status: 'Active', type: 'Dishes Discount' });
    res.status(200).json(activeBanners);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active banners', message: err.message });
  }
};
