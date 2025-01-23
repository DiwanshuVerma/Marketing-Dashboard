const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bannerRoutes = require('./routes/banners');
const templateRoutes = require('./routes/templateRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/banners', bannerRoutes);
app.use('/templates', templateRoutes);
module.exports = app;
