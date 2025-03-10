// src/components/RightPanel/CampaignCities.jsx
import React from "react";

const availableCities = [
  "Mexico",
  "Los Angeles",
  "Toronto",
  "Montreal",
  "Phoenix",
];

const CampaignCities = ({ isEditMode, selectedCities, onChange }) => {
  const handleCheckboxChange = (city) => {
    if (selectedCities.includes(city)) {
      onChange(selectedCities.filter((p) => p !== city));
    } else {
      onChange([...selectedCities, city]);
    }
  };

  return (
    <div className="mt-8 mb-6 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Select Cities</h3>
      <div className="flex flex-wrap gap-4 flex-col">
        {availableCities.map((city) => (
          <label key={city} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCities.includes(city)}
              disabled={!isEditMode}
              onChange={() => handleCheckboxChange(city)}
              className="w-4 h-4"
            />
            <span>{city}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CampaignCities;
