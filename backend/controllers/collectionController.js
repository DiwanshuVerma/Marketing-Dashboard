const Collection = require('../models/Collection');
const uploadToCloudinary = require('../utils/cloudinary');
const cloudinary = require("cloudinary").v2;
const mongoose = require('mongoose')

// Get all collections
exports.getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find();
    res.json(collections);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// Create a new collection
exports.createCollection = async (req, res) => {
  try {
    const { title, isDefault, status } = req.body;
    const collection = new Collection({
      title,
      isDefault: isDefault || false,
      status: status || 'Inactive',
    });

    await collection.save();

    res.status(201).json({ message: 'Collection created successfully', collection });
  } catch (err) {
    res.status(400).send(err.message);
  }
};

// update a collection
exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isDefault, offer, restaurants, cities, startDate, endDate } = req.body;

    // Find the collection document
    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).send("Collection not found");

    // update the fields explicitly
    console.log(title)
    Object.assign(collection, { title, isDefault, offer, restaurants, cities })

    // Update status based on the provided dates.
    // If both startDate and endDate are provided:
    if (startDate && endDate) {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (now < start) {
        collection.status = "Upcoming";
      } else if (now > end) {
        collection.status = "Inactive";  // or "Expired" if you prefer
      } else {
        collection.status = "Active";
      }
      // Ensure the collection dates are set to the provided values
      collection.startDate = startDate;
      collection.endDate = endDate;
    }
    // If only one date is provided, merge with the existing values in the collection
    else if (startDate || endDate) {
      // Use the current collection's dates as the fallback
      const newStart = startDate ? new Date(startDate) : new Date(collection.startDate);
      const newEnd = endDate ? new Date(endDate) : new Date(collection.endDate);
      // Update the collection's dates accordingly
      collection.startDate = startDate ? startDate : collection.startDate;
      collection.endDate = endDate ? endDate : collection.endDate;

      const now = new Date();
      if (now < newStart) {
        collection.status = "Upcoming";
      } else if (now > newEnd) {
        collection.status = "Inactive";  // or "Expired" if that is your convention
      } else {
        collection.status = "Active";
      }
    }
    // If neither date is provided, leave the status unchanged

    // Handle image uploads if provided
    if (req.files) {
      if (req.files.photoWeb) {
        collection.photoWeb = await uploadToCloudinary(req.files.photoWeb[0].path, "collections");
      }
      if (req.files.photoApp) {
        collection.photoApp = await uploadToCloudinary(req.files.photoApp[0].path, "collections");
      }
    }

    await collection.save();
    res.json({ message: "Collection updated successfully", collection });
  } catch (err) {
    console.log("error while updating coll")
    res.status(400).send(err.message);
  }
};


// to delete
exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params

    const collection = await Collection.findById(req.params.id);
    if (!collection) return res.status(404).send('Collection not found');

    // Delete images if they exist
    if (collection.photoWeb) {
      const publicIdWeb = collection.photoWeb.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(`collections/${publicIdWeb}`);
    }

    if (collection.photoApp) {
      const publicIdApp = collection.photoApp.split('/').pop().split('.')[0]; // Extract public ID
      await cloudinary.uploader.destroy(`collections/${publicIdApp}`);
    }

    await Collection.findByIdAndDelete(id)

    return res.status(204).json({ message: "Collection deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting collection", Error: err.message });
  }
};


// return active collections
exports.getActiveCollections = async (req, res) => {
  try {
    const activeCollections = await Collection.find({ status: 'Active' });
    res.status(200).json(activeCollections);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching active collections', message: err.message });
  }
};


// POST: add a new click entry with the current date
exports.clickCounts = async (req, res) => {
  try {
    const { _id } = req.params;

    // Add a new click entry with the current date
    const updatedCollection = await Collection.findByIdAndUpdate(
      _id,
      { $push: { clicks: { date: new Date() } } }, // Push a new click object
      { new: true }
    );

    res.status(200).json({
      Collection: updatedCollection.title,
      totalClicks: updatedCollection.clicks.length, // Total clicks = length of the array
    });
  } catch (err) {
    res.status(500).json({
      msg: "Error updating collection click count: ",
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
      return res.status(400).json({ msg: "Invalid collection ID" });
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

    const collection = await Collection.aggregate([
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

    if (!collection.length) {
      return res.status(404).json({ msg: "Collection not found" });
    }

    res.status(200).json({
      totalClicks: collection[0].totalClicks,
      timeframeClicks: collection[0].filteredClicks,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching clicks", error: err.message });
  }
};
