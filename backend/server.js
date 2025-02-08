require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const cron = require("node-cron");
const Offer = require('./models/Offers')
const PORT = process.env.PORT || 5000;

connectDB();

const url = `https://marketing-dashboard-8274.onrender.com`
const interval = 20000; // Interval in milliseconds (20 seconds)

async function reloadWebsite() {
  await fetch(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}

setInterval(reloadWebsite, interval);


// Function to update offer statuses
const updateOfferStatuses = async () => {
  try {
    const nowUTC = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);

    await Offer.updateMany(
      { startDate: { $gt: nowUTC } }, // Future start dates
      { $set: { status: "Upcoming" } }
    );

    await Offer.updateMany(
      { startDate: { $lte: nowUTC }, endDate: { $gte: nowUTC } }, // Ongoing offers
      { $set: { status: "Active" } }
    );

    await Offer.updateMany(
      { endDate: { $lt: nowUTC } }, // Past end dates
      { $set: { status: "Expired" } }
    );

    console.log("Offer statuses updated!");
  } catch (error) {
    console.error("Error updating offer statuses:", error);
  }
};

const updateBannerStatuses = async () => {
  try {
    const nowUTC = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);

    await Banner.updateMany(
      { startDate: { $gt: nowUTC } }, // Future banners
      { $set: { status: "Upcoming" } }
    );

    await Banner.updateMany(
      { startDate: { $lte: nowUTC }, endDate: { $gte: nowUTC } }, // Active banners
      { $set: { status: "Active" } }
    );

    await Banner.updateMany(
      { endDate: { $lt: nowUTC } }, // Expired banners
      { $set: { status: "Inactive" } }
    );

    console.log("Banner statuses updated!");
  } catch (error) {
    console.error("Error updating banner statuses:", error);
  }
};

// Schedule the job to run every minute
cron.schedule("* * * * *", updateBannerStatuses);

// Schedule the job to run every minute
cron.schedule("* * * * *", updateOfferStatuses);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
