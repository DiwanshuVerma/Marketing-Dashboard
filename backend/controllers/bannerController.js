const Banner = require('../models/Banner');
const uploadToCloudinary = require('../utils/cloudinary');
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose')

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
    const { id } = req.params;
    const { startDate, endDate, ...bodyFields } = req.body;

    // Find the banner document
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).send("Banner not found");

    delete bodyFields.clicks // clicks can only be modified via clickCounts

    // Update only the fields that are present in the request body
    const fieldsToUpdate = {};
    Object.keys(bodyFields).forEach(key => {
      if (bodyFields[key] !== undefined) { // Check if the field is provided
        fieldsToUpdate[key] = bodyFields[key];
      }
    });
    Object.assign(banner, fieldsToUpdate);

    // Update status based on the provided dates.
    let newStartDate = banner.startDate;
    let newEndDate = banner.endDate;

    if (startDate !== undefined || endDate !== undefined) {
      // Merge provided dates with existing ones
      newStartDate = startDate !== undefined ? new Date(startDate) : new Date(banner.startDate);
      newEndDate = endDate !== undefined ? new Date(endDate) : new Date(banner.endDate);

      // Update banner dates if provided
      if (startDate !== undefined) banner.startDate = startDate;
      if (endDate !== undefined) banner.endDate = endDate;

      // Determine the new status
      const now = new Date();
      if (now < newStartDate) {
        banner.status = "Upcoming";
      } else if (now > newEndDate) {
        banner.status = "Inactive";
      } else {
        banner.status = "Active";
      }
    }

    // default banner will always be active and have no dates
    if (banner.isDefault) {
      banner.status = "Active";
      banner.startDate = undefined;
      banner.endDate = undefined
    }

    // Handle image uploads if provided
    if (req.files) {
      if (req.files.photoWeb) {
        banner.photoWeb = await uploadToCloudinary(req.files.photoWeb[0].path, "collections");
      }
      if (req.files.photoApp) {
        banner.photoApp = await uploadToCloudinary(req.files.photoApp[0].path, "collections");
      }
    }

    await banner.save();
    res.json({ message: "Banner updated successfully", banner });
  } catch (err) {
    console.log("error while updating banner", err.message)
    res.status(400).json(err.message);
  }
};


// to delete
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // Check for last default banner
    if (banner.isDefault) {
      const defaultCount = await Banner.countDocuments({ isDefault: true });
      if (defaultCount <= 1) {
        return res.status(403).json({
          message: "At least one default banner must remain"
        });
      }
    }

    // Cloudinary deletion helper
    const deleteCloudinaryAsset = async (url) => {
      if (!url) return;
      const publicId = url.split('/upload/')[1]?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
    };

    // Parallel deletion
    await Promise.all([
      deleteCloudinaryAsset(banner.photoWeb),
      deleteCloudinaryAsset(banner.photoApp)
    ]);

    await Banner.findByIdAndDelete(id);
    return res.status(200).json({ message: "Banner deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      message: "Deletion failed. Please try again later"
    });
  }
};


// return active banners
exports.getActiveBanners = async (req, res) => {
  try {
    const activeBanners = await Banner.find({ status: 'Active' });
    res.status(200).json(activeBanners);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active banners', message: err.message });
  }
};


// POST: add a new click entry with the current date when user click on a banner
exports.clickCounts = async (req, res) => {
  try {
    const { _id } = req.params;

    // Add a new click entry with the current date
    const updatedBanner = await Banner.findByIdAndUpdate(
      _id,
      { $push: { clicks: { date: new Date() } } }, // Push a new click object
      { new: true }
    );

    res.status(200).json({
      Banner: updatedBanner.title,
      totalClicks: updatedBanner.clicks.length, // Total clicks = length of the array
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating banner click count: ",
      error: err.message,
    });
  }
};


// filter clicks by Today, This Week, or This Month, use MongoDB aggregation

// GET: get filtered clicks
exports.getClicksByTimeframe = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeframe } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid banner ID" });
    }

    const now = new Date();
    const utcNow = new Date(now.toISOString().slice(0, -1)); // Workaround for UTC parsing
    let startDate;

    switch (timeframe) {
      case "today":
        startDate = new Date(utcNow);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "week":
        // Start on Monday
        const day = utcNow.getUTCDay();
        const diff = day === 0 ? 6 : day - 1;
        startDate = new Date(utcNow);
        startDate.setUTCDate(utcNow.getUTCDate() - diff);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(Date.UTC(utcNow.getUTCFullYear(), utcNow.getUTCMonth(), 1));
        break;
      default:
        return res.status(400).json({ msg: "Invalid timeframe" });
    }

    const banner = await Banner.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $project: {
          totalClicks: { $size: "$clicks" },
          filteredClicks: {
            $size: {
              $filter: {
                input: "$clicks",
                as: "click",
                cond: { $gte: ["$$click.date", startDate] },
              },
            },
          },
        },
      },
    ]);

    if (!banner.length) {
      return res.status(404).json({ msg: "Banner not found" });
    }

    res.status(200).json({
      totalClicks: banner[0].totalClicks,
      timeframeClicks: banner[0].filteredClicks,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching clicks", error: err.message });
  }
};
