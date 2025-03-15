require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cron = require("node-cron");
const Offer = require('./models/Offers');
const Banner = require('./models/Banner');
const Collection = require('./models/Collection');
const PORT = process.env.PORT || 5000;

connectDB();
// ping the server in evry 5min to prevent from going sleep
const url = `https://marketing-dashboard-2wfk.onrender.com`;
const interval = 300000; // 5mins

async function reloadWebsite() {
  try {
    const response = await fetch(url);
    console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
  } catch (error) {
    console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
  }
}

setInterval(reloadWebsite, interval);

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
