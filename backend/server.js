require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cron = require("node-cron");
const Offer = require('./models/Offers');
const Banner = require('./models/Banners'); // Ensure correct path
const PORT = process.env.PORT || 5000;

connectDB();

const url = `https://marketing-dashboard-8274.onrender.com`;
const interval = 20000; // 20 seconds

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
    const nowUTC = new Date();
    nowUTC.setMinutes(nowUTC.getMinutes() - nowUTC.getTimezoneOffset());

    await Offer.updateMany({ startDate: { $gt: nowUTC } }, { $set: { status: "Upcoming" } });
    await Offer.updateMany(
      { startDate: { $lte: nowUTC }, endDate: { $gte: nowUTC } },
      { $set: { status: "Active" } }
    );
    await Offer.updateMany({ endDate: { $lt: nowUTC } }, { $set: { status: "Expired" } });

    console.log("Offer statuses updated!");
  } catch (error) {
    console.error("Error updating offer statuses:", error);
  }
};

// Function to update banner statuses
const updateBannerStatuses = async () => {
  try {
    const nowUTC = new Date();
    nowUTC.setMinutes(nowUTC.getMinutes() - nowUTC.getTimezoneOffset());

    await Banner.updateMany({ startDate: { $gt: nowUTC } }, { $set: { status: "Upcoming" } });
    await Banner.updateMany(
      { startDate: { $lte: nowUTC }, endDate: { $gte: nowUTC } },
      { $set: { status: "Active" } }
    );
    await Banner.updateMany({ endDate: { $lt: nowUTC } }, { $set: { status: "Inactive" } });

    console.log("Banner statuses updated!");
  } catch (error) {
    console.error("Error updating banner statuses:", error);
  }
};

// Run both status updates together every minute
cron.schedule("* * * * *", async () => {
  console.log("Running scheduled status updates...");
  await updateOfferStatuses();
  await updateBannerStatuses();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
