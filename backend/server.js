require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cron = require("node-cron");
const Offer = require('./models/Offers');
const Banner = require('./models/Banner');
const PORT = process.env.PORT || 5000;

connectDB();

const url = `https://marketing-dashboard-8274.onrender.com`;
const interval = 600000; // 10mins

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

// Run both status updates together every minute
cron.schedule("* * * * *", async () => {
  await updateOfferStatuses();
  await updateBannerStatuses();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
