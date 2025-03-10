// controllers/analyticsController.js
const OfferAnalytics = require('../models/OfferAnalytics');
const Offer = require('../models/Offer');
const mongoose = require('mongoose');

// Record order with offer
exports.recordOfferOrder = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { categories } = req.body;

    // Validate input
    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ msg: "Invalid offer ID" });
    }

    const offer = await Offer.findById(offerId);
    if (!offer) return res.status(404).json({ msg: "Offer not found" });

    const validCategories = ["Starters", "Main Course", "Combos", "Desserts"];
    const invalidCategory = categories.find(c => !validCategories.includes(c));
    if (invalidCategory) {
      return res.status(400).json({ msg: `Invalid category: ${invalidCategory}` });
    }

    // Get UTC date
    const now = new Date();
    const currentUTCDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ));

    // Update analytics
    const bulkOps = categories.map(category => ({
      updateOne: {
        filter: { 
          offerId: new mongoose.Types.ObjectId(offerId),
          category,
          date: currentUTCDate
        },
        update: { $inc: { count: 1 } },
        upsert: true
      }
    }));

    await OfferAnalytics.bulkWrite(bulkOps);
    res.status(200).json({ msg: "Order recorded successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error recording order", error: err.message });
  }
};

// Get analytics data
exports.getOfferAnalytics = async (req, res) => {
  try {
    const { offerId, timeframe = "Today" } = req.query;
    const validTimeframes = ["Today", "This Week", "This Month"];
    
    if (!validTimeframes.includes(timeframe)) {
      return res.status(400).json({ msg: "Invalid timeframe" });
    }

    // Calculate start date
    const now = new Date();
    const currentUTC = new Date(now.toISOString().slice(0, -1));
    let startDate;

    switch (timeframe) {
      case "Today":
        startDate = new Date(Date.UTC(
          currentUTC.getUTCFullYear(),
          currentUTC.getUTCMonth(),
          currentUTC.getUTCDate()
        ));
        break;
      case "This Week":
        const day = currentUTC.getUTCDay();
        const diff = day === 0 ? 6 : day - 1;
        startDate = new Date(currentUTC);
        startDate.setUTCDate(currentUTC.getUTCDate() - diff);
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "This Month":
        startDate = new Date(Date.UTC(
          currentUTC.getUTCFullYear(),
          currentUTC.getUTCMonth(),
          1
        ));
        break;
    }

    // Build query
    const matchQuery = { date: { $gte: startDate } };
    if (offerId && offerId !== "All") {
      if (!mongoose.Types.ObjectId.isValid(offerId)) {
        return res.status(400).json({ msg: "Invalid offer ID" });
      }
      matchQuery.offerId = new mongoose.Types.ObjectId(offerId);
    }

    // Get analytics
    const analytics = await OfferAnalytics.aggregate([
      { $match: matchQuery },
      { $group: { _id: "$category", total: { $sum: "$count" } } },
      { $project: { category: "$_id", count: "$total", _id: 0 } }
    ]);

    // Fill missing categories
    const categories = ["Starters", "Main Course", "Combos", "Desserts"];
    const result = categories.map(category => ({
      category,
      count: analytics.find(a => a.category === category)?.count || 0
    }));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching analytics", error: err.message });
  }
};