const express = require('express');
const { getAllBanners, getActiveResBanners, getActiveDisBanners, createBanner, updateBanner, deleteBanner, clickCounts } = require('../controllers/bannerController');
const upload = require('../middleware/multerConfig');

const router = express.Router();

router.get('/', getAllBanners);
router.post('/', createBanner);
router.post('/banner-click/:_id', clickCounts)
router.get('/active', getActiveResBanners);

router.put('/:id', upload, updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;
