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
      let updateData = { ...rest };
  
      // If both dates are provided, use them directly.
      if (startDate && endDate) {
        updateData.startDate = startDate;
        updateData.endDate = endDate;
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (now < start) {
          updateData.status = "Upcoming";
        } else if (now > end) {
          updateData.status = "Expired";
        } else {
          updateData.status = "Active";
        }
      }
      // If only one date is provided, merge with existing offer values.
      else if (startDate || endDate) {
        // Fetch the existing offer to get missing date(s)
        const existingOffer = await Offer.findById(id);
        if (!existingOffer) {
          return res.status(404).json({ message: "Offer not found" });
        }
        // Determine new start and end dates
        const newStart = startDate ? new Date(startDate) : new Date(existingOffer.startDate);
        const newEnd = endDate ? new Date(endDate) : new Date(existingOffer.endDate);
        updateData.startDate = startDate ? startDate : existingOffer.startDate;
        updateData.endDate = endDate ? endDate : existingOffer.endDate;
  
        const now = new Date();
        if (now < newStart) {
          updateData.status = "Upcoming";
        } else if (now > newEnd) {
          updateData.status = "Expired";
        } else {
          updateData.status = "Active";
        }
      }
      // If no date fields are being updated, no need to change the status.
      // The updateData will be processed by the pre-update hook if both dates are present.
  
      const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, { new: true });
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