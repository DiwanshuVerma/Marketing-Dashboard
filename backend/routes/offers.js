const express = require('express')
const router = express.Router()
const {getAllOffers, createOffer, updateOffer, deleteOffer} = require('../controllers/offersController')

router.get('/', getAllOffers)   // to get all the offers
router.post('/', createOffer)   // create a new offer
router.put('/:id', updateOffer) // upodate offer by id
router.delete('/:id', deleteOffer) // delete offer by id

module.exports = router