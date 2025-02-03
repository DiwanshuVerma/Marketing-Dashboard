// src/pages/Offers.jsx
import React, { useState, useEffect } from "react";
import Offers from "../components/RestaurantOffers/Offers";
import RestaurantsList from "../components/RestaurantOffers/RestaurantsList";
import RestaurantMenu from "../components/RestaurantOffers/RestaurantMenu";
import { motion } from "framer-motion";

function RestaurantOffers() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  useEffect(() => {
    console.log("Selected Restaurant updated:", selectedRestaurant);
  }, [selectedRestaurant])

  return (
    <div className="p-6 max-w-[1300px] mx-auto">
      <Offers />

      <motion.h1
          className="text-3xl font-bold text-gray-800 mb-6 mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Apply Offers
        </motion.h1>

      <div className="flex bg-white p-4 relative rounded shadow-sm h-[550px]">
        <RestaurantsList onSelect={setSelectedRestaurant} />
        <RestaurantMenu SelectedRestaurant={selectedRestaurant} />
      </div>

    </div>
  )
}

export default RestaurantOffers;
