import { useState } from "react";
import { FiX } from "react-icons/fi";

import dummy from "../../data/dummy";

const Restaurant = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(null); // Track selected row by ID
  const restaurants = dummy.restaurants
  const [selectedType, setSelectedType] = useState('Restaurants');

  // Filter restaurants based on search term
  const filteredRestaurants = restaurants
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



  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  // Filter templates based on the selected type
  const filteredTypes = restaurants.filter((template) => template.type === selectedType);

  return (
    <div className="overflow-y-auto w-[30%] ">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleTypeChange('Restaurants')}
          className={`text-xl p-1 border-b-[3px] font-semibold text-gray-700 ${selectedType === 'Restaurants' ? 'border-red-600' : 'border-transparent'
            }`}
        >
          Restaurants
        </button>
        <button
          onClick={() => handleTypeChange('Tiffin Services')}
          className={`text-xl p-1 border-b-[3px] font-semibold text-gray-700 ${selectedType === 'Tiffin Services' ? 'border-red-600' : 'border-transparent'
            }`}
        >
          Tiffin Services
        </button>
      </div>
      <input
        type="text"
        placeholder="Search restaurant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      {filteredRestaurants.length > 0 ? (
        <div className="space-y-2">
          {filteredRestaurants.map((restaurant, index) => (
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
