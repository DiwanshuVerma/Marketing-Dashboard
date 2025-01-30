// src/pages/Offers.jsx
import React, { useState, useEffect } from "react";
import Offers from "../components/RestaurantOffers/Offers";
import Restaurant from "../components/RestaurantOffers/Restaurents";
import RestaurantMenu from "../components/RestaurantOffers/RestaurantMenu";
import dummy from "../data/dummy"

function RestaurantOffers() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)

  useEffect(() => {
    console.log("Selected Restaurant updated:", selectedRestaurant);
  }, [selectedRestaurant])

  return (
    <div className="p-6 max-w-[1300px] mx-auto">
      <Offers />

      {/* <h1 className="text-3xl font-bold text-gray-800 mt-12 mb-6">Restaurants</h1> */}
      <div className="flex mt-14">
        <Restaurant onSelect={setSelectedRestaurant} />
        <RestaurantMenu SelectedRestaurant={selectedRestaurant} />
      </div>

    </div>
  )
}

export default RestaurantOffers;
