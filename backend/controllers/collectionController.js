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
    const { startDate, endDate, ...bodyFields } = req.body;

    // find the collection document
    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).send("Collection not found");

    // update only the fields that are present in the request body
    const fieldsToUpdate = {};
    Object.keys(bodyFields).forEach(key => {
      if (bodyFields[key] !== undefined) { // Check if the field is provided
        fieldsToUpdate[key] = bodyFields[key];
      }
    });
    Object.assign(collection, fieldsToUpdate);

    // update status based on the provided dates.
    let newStartDate = collection.startDate;
    let newEndDate = collection.endDate;

    if (startDate !== undefined || endDate !== undefined) {
      // Merge provided dates with existing ones
      newStartDate = startDate !== undefined ? new Date(startDate) : new Date(collection.startDate);
      newEndDate = endDate !== undefined ? new Date(endDate) : new Date(collection.endDate);

      // Update collection dates if provided
      if (startDate !== undefined) collection.startDate = startDate;
      if (endDate !== undefined) collection.endDate = endDate;

      // Determine the new status
      const now = new Date();
      if (now < newStartDate) {
        collection.status = "Upcoming";
      } else if (now > newEndDate) {
        collection.status = "Inactive";
      } else {
        collection.status = "Active";
      }
    }

    // default collection will always be active and have no dates
    if (collection.isDefault) {
      collection.status = "Active";
      collection.startDate = undefined;
      collection.endDate = undefined
    }

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
    console.log("error while updating collection: ", err.message)
    res.status(400).json(err.message);
  }
};


// to delete
exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) return res.status(404).json({ message: "Collection not found" });

    // Check for last default Collection
    if (collection.isDefault) {
      const defaultCount = await Collection.countDocuments({ isDefault: true });
      if (defaultCount <= 1) {
        return res.status(403).json({
          message: "At least one default Collection must remain"
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
      deleteCloudinaryAsset(Collection.photoWeb),
      deleteCloudinaryAsset(Collection.photoApp)
    ]);

    await Collection.findByIdAndDelete(id);
    return res.status(200).json({ message: "Collection deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({
      message: "Deletion failed. Please try again later"
    });
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
