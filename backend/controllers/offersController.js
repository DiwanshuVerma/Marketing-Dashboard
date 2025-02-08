const Offer = require('../models/Offers')

exports.getAllOffers = async (req, res) => {
    try{
        const offers = await Offer.find()
        return res.status(200).json(offers)
    } catch(err) {
        res.status(500).json({
            Message: 'Error while fetching offer:',
            Error: err.message
        })
    }
}

exports.createOffer = async (req, res) => {
    try{
    const {name, discount, type, status, startDate, endDate} = req.body;
    const offer = new Offer({
        name,
        discount,
        type,
        status,
        startDate,
        endDate
    })
    await offer.save()

    res.status(201).json({
        message: "Offer created succesfully",
        offer
    })
    }
    catch(error) {
        res.status(400).send({
            message: "error while creating offer",
            error: error.message
        })
    }
}

exports.updateOffer = async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate, ...rest } = req.body;

    try {
        const nowUTC = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
        let status = "Upcoming";

        if (nowUTC > new Date(endDate)) status = "Expired";
        else if (nowUTC >= new Date(startDate) && nowUTC <= new Date(endDate)) status = "Active";

        const updatedOffer = await Offer.findByIdAndUpdate(
            id,
            { ...rest, startDate, endDate, status },
            { new: true }
        );

        if (!updatedOffer) return res.status(404).json({ message: "Offer not found" });

        res.json({ message: "Offer updated", updatedOffer });
    } catch (err) {
        res.status(500).json({ message: "Failed to update offer", error: err.message });
    }
};


exports.deleteOffer = async (req, res) => {
    const {id} = req.params
    try {
        const offer = await Offer.findByIdAndDelete(id)
        if(!offer) return res.status(404).json({message: "offer not found"})
    
        res.status(204).json({message: "offer deleted", offerId: offer})
    } catch(err) {
        res.status(500).json({message: "failed to delete offer", error: err.message})
    }
}