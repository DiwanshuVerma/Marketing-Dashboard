require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cron = require("node-cron");
const Offer = require('./models/Offers');
const Banner = require('./models/Banner');
const Collection = require('./models/Collection');
const PORT = process.env.PORT || 3000;
const renderURL = process.env.renderURL

connectDB();

// Function to update offer statuses
const updateOfferStatuses = async () => {
  try {
    const now = new Date();
    await Offer.updateMany({ startDate: { $gt: now } }, { $set: { status: "Upcoming" } });
    await Offer.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "Active" } }
    );
    await Offer.updateMany({ endDate: { $lt: now } }, { $set: { status: "Expired" } })

  } catch (error) {
    console.error("Error updating offer statuses:", error.message);
  }
};

// Function to update banner statuses
const updateBannerStatuses = async () => {
  try {
    const now = new Date();

    await Banner.updateMany({ startDate: { $gt: now } }, { $set: { status: "Upcoming" } });
    await Banner.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "Active" } }
    );
    await Banner.updateMany({ endDate: { $lt: now } }, { $set: { status: "Inactive" } })

  } catch (error) {
    console.error("Error updating banner statuses:", error.message);
  }
};
// Function to update collection statuses
const updateCollectionStatuses = async () => {
  try {
    const now = new Date();

    await Collection.updateMany({ startDate: { $gt: now } }, { $set: { status: "Upcoming" } });
    await Collection.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: "Active" } }
    );
    await Collection.updateMany({ endDate: { $lt: now } }, { $set: { status: "Inactive" } })

  } catch (error) {
    console.error("Error updating Collection statuses:", error.message);
  }
};

// Run both status updates together every minute
cron.schedule("* * * * *", async () => {
  await updateOfferStatuses();
  await updateBannerStatuses();
  await updateCollectionStatuses();
}); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
