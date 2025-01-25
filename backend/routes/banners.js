const express = require('express');
const { getAllBanners, getActiveResBanners, getActiveDisBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const upload = require('../middleware/multerConfig');

const router = express.Router();

router.get('/', getAllBanners);
router.post('/', createBanner);
router.get('/res/active', getActiveResBanners);
router.get('/dis/active', getActiveDisBanners);
router.put('/:id', upload.single('photo'), updateBanner, async (req, res) => {
    console.log('File received:', req.file);
})
router.delete('/:id', deleteBanner);

module.exports = router;
