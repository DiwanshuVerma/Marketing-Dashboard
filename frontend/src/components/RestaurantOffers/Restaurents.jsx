import { useState } from "react";
import { FiX } from "react-icons/fi";

import dummy from "../../data/dummy";

const Restaurant = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null); // Track selected row by ID
  const restaurants = dummy.restaurants

  // Filter restaurants based on search term
  const filteredTemplates = restaurants
    .filter((template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name

  const handleClick = (restaurant) => {

    onSelect(restaurant)
    setSelectedId(restaurant.id); // Set the clicked row as selected
    console.log("Restaurant selected:", restaurant);
  };

  const onCancel = (event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedId(null);
    onSelect(null);
    console.log("Cross clicked");
  };

  return (
    <div className="overflow-y-auto w-[40%] ">
      <input
        type="text"
        placeholder="Search restaurant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {filteredTemplates.length > 0 ? (
        <div className="space-y-2">
          {filteredTemplates.map((restaurant, index) => (
            <div
              key={restaurant.id}
              className={`p-3 border flex justify-between rounded-lg cursor-pointer hover:shadow-sm ${selectedId === restaurant.id ? "bg-gray-200" : "bg-white"
                }`}
              onClick={() => handleClick(restaurant)}
            >
              <div className="text-lg">
                {index + 1}. {restaurant.name}
              </div>

              {selectedId === restaurant.id && (
               <button
                onClick={onCancel}
                className="text-gray-500 hover:text-red-500"
                title="Cancel"
              >
                <FiX size={20} />
              </button> 
              )}
              
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500">No Restaurants found.</div>
      )}
    </div>
  );
};

export default Restaurant;
