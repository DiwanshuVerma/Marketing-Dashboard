// src/pages/Offers.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

import dummy from "../data/dummy";
import { initialOffers } from "../data/offersData";
import { filterCategoriesByOffers } from "../utils/filterMenu";

import CreateOfferForm from "../components/Offers/CreateOfferForm";
import OffersList from "../components/Offers/OffersList";
import CategoryDisplay from "../components/Offers/CategoryDisplay";

function Offers() {
  const { deliveryCategories, dineInCategories } = dummy;
  const [offers, setOffers] = useState(initialOffers);

  // Flatten items to build itemMap (for item-level offers)
  const allDeliveryItems = deliveryCategories.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.items)
  );
  const allDineInItems = dineInCategories.flatMap((cat) =>
    cat.subcategories.flatMap((sub) => sub.items)
  );
  const allItems = [...allDeliveryItems, ...allDineInItems];

  // itemMap: { itemId -> itemName }
  const itemMap = {};
  allItems.forEach((itm) => {
    itemMap[itm.id] = itm.name;
  });

  // Unique categories/subCategories for the form
  const uniqueCategories = [
    ...new Set([...deliveryCategories, ...dineInCategories].map((c) => c.name)),
  ];
  const uniqueSubCategories = [
    ...new Set(
      [...deliveryCategories, ...dineInCategories].flatMap((cat) =>
        cat.subcategories.map((sub) => sub.name)
      )
    ),
  ];

  // Handlers
  const handleAddOffer = (newOffer) => {
    setOffers((prev) => [...prev, newOffer]);
  };
  const handleRemoveOffer = (offerId) => {
    setOffers((prev) => prev.filter((off) => off.id !== offerId));
  };
  const handleEditOffer = (offerId, updatedFields) => {
    setOffers((prev) =>
      prev.map((off) =>
        off.id === offerId ? { ...off, ...updatedFields } : off
      )
    );
  };

  // Filter categories to show only items that have an offer
  const impactedDelivery = filterCategoriesByOffers(deliveryCategories, offers);
  const impactedDineIn = filterCategoriesByOffers(dineInCategories, offers);

  return (
    <motion.div
      className="min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-6 max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage Offers
        </motion.h1>

        {/**
         * 'md:items-stretch' ensures on medium screens or larger,
         * each column matches the tallest one's height.
         */}
        <div className="flex flex-col md:flex-row gap-8 md:items-stretch">
          {/* Left Column: Create Offer Form */}
          <div className="flex-1 bg-white shadow-sm rounded p-4">
            <CreateOfferForm
              onSave={handleAddOffer}
              categories={uniqueCategories}
              subCategories={uniqueSubCategories}
              items={allItems}
            />
          </div>

          {/* Right Column: Offers List */}
          <div className="flex-1 bg-white shadow-sm rounded p-4">
            <OffersList
              offers={offers}
              onRemoveOffer={handleRemoveOffer}
              onEditOffer={handleEditOffer}
              itemMap={itemMap}
            />
          </div>
        </div>

        {/* Items with Offers (Delivery) */}
        <CategoryDisplay
          data={impactedDelivery}
          offers={offers}
          title="Delivery"
        />
        {/* Items with Offers (Dine-In) */}
        <CategoryDisplay
          data={impactedDineIn}
          offers={offers}
          title="Dine-In"
        />
      </div>
    </motion.div>
  );
}

export default Offers;
