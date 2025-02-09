const Banner = require('../models/Banner');
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
    const { title, isDefault, status } = req.body;
    const banner = new Banner({
      title,
      isDefault: isDefault || false,
      status: status || 'Inactive',
    });
    
    await banner.save();

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// update a banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, isDefault, pages, startDate, endDate } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (!banner) return res.status(404).send("Banner not found");

    console.log("Updating banner");

    // Update fields only if provided
    if (title) banner.title = title;
    if (typeof isDefault !== "undefined") banner.isDefault = isDefault;
    if (pages) banner.pages = pages;
    if (startDate) banner.startDate = startDate;
    if (endDate) banner.endDate = endDate;

    // Validate dates
    if (banner.startDate && banner.endDate && banner.startDate >= banner.endDate) {
      return res.status(400).send("End date must be after start date");
    }

    // Update status based on current time
    const nowUTC = new Date();

    if (nowUTC < new Date(banner.startDate)) {
      banner.status = "Upcoming";
    } else if (nowUTC >= new Date(banner.startDate) && nowUTC <= new Date(banner.endDate)) {
      banner.status = "Active";
    } else if (nowUTC > new Date(banner.endDate)) {
      banner.status = "Inactive";
    }

    // Handle images upload if provided
    if (req.files) {
      if (req.files.photoWeb) {
        banner.photoWeb = await uploadToCloudinary(req.files.photoWeb[0].path, "banners");
      }
      if (req.files.photoApp) {
        banner.photoApp = await uploadToCloudinary(req.files.photoApp[0].path, "banners");
      }
    }

    await banner.save();
    res.json({ message: "Banner updated successfully", banner });
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

    // Delete images if they exist
    if (banner.photoWeb) {
      const publicIdWeb = banner.photoWeb.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(`banners/${publicIdWeb}`);
    }

    if (banner.photoApp) {
      const publicIdApp = banner.photoApp.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(`banners/${publicIdApp}`);
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
    const activeBanners = await Banner.find({ status: 'Active' });
    res.status(200).json(activeBanners);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active banners', message: err.message });
  }
};
