require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
