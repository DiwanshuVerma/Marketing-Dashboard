const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bannerRoutes = require('./routes/banners');
const collectionRoutes = require('./routes/collections')
const templateRoutes = require('./routes/templateRoutes');
const offerRoutes = require('./routes/offers')

const app = express();
app.use(bodyParser.json());
app.use(cors());

// banners
app.use('/uploads', express.static('uploads'));
app.use('/banners', bannerRoutes);

// collections
app.use('/collections', collectionRoutes)

//templates
app.use('/templates', templateRoutes);

//offers
app.use('/offers', offerRoutes)

module.exports = app;
