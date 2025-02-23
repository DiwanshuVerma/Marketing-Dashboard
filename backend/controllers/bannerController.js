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
    const { title, isDefault, pages, offer, cities, startDate, endDate } = req.body;

    // Find the banner document
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).send("Banner not found");

    // update the fields explicitly
    Object.assign(banner, { title, isDefault, offer, pages, cities })

    // Update status based on the provided dates.
    // If both startDate and endDate are provided:
    if (startDate && endDate) {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (now < start) {
        banner.status = "Upcoming";
      } else if (now > end) {
        banner.status = "Inactive";  // or "Expired" if you prefer
      } else {
        banner.status = "Active";
      }
      // Ensure the banner dates are set to the provided values
      banner.startDate = startDate;
      banner.endDate = endDate;
    }
    // If only one date is provided, merge with the existing values in the banner
    else if (startDate || endDate) {
      // Use the current banner's dates as the fallback
      const newStart = startDate ? new Date(startDate) : new Date(banner.startDate);
      const newEnd = endDate ? new Date(endDate) : new Date(banner.endDate);
      // Update the banner's dates accordingly
      banner.startDate = startDate ? startDate : banner.startDate;
      banner.endDate = endDate ? endDate : banner.endDate;

      const now = new Date();
      if (now < newStart) {
        banner.status = "Upcoming";
      } else if (now > newEnd) {
        banner.status = "Inactive";  // or "Expired" if that is your convention
      } else {
        banner.status = "Active";
      }
    }
    // If neither date is provided, leave the status unchanged

    // Handle image uploads if provided
    if (req.files) {
      console.log('updating banner, file is present')
      if (req.files.photoWeb) {
        banner.photoWeb = await uploadToCloudinary(req.files.photoWeb[0].path, "banners");
      }
      if (req.files.photoApp) {
        banner.photoApp = await uploadToCloudinary(req.files.photoApp[0].path, "banners");
      }
    }

    await banner.save();
    res.json({ message: "Banner updated successfully", banner });
    console.log('error inside upda: ')
  } catch (err) {
    res.status(400).send(err.message);
  }
};


// to delete
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params

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
    res.status(500).json({ message: "Error deleting banner", Error: err.message });
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


// POST: add a new click entry with the current date
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
