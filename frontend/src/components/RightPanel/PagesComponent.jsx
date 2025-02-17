// src/components/RightPanel/PagesComponent.jsx
import React from "react";
import { CiCircleInfo } from "react-icons/ci";

const availablePages = [
  "Homepage",
  "Order-online",
  "Dining-out",
  "Night-life",
];

const PagesComponent = ({ isEditMode, selectedPages, onChange }) => {
  
  const handleCheckboxChange = (page) => {
    if (selectedPages.includes(page)) {
      onChange(selectedPages.filter((p) => p !== page));
    } else {
      onChange([...selectedPages, page]);
    }
  };

  return (
    <div className="mt-8 mb-6">
      <h3 className="text-lg font-semibold mb-2">Select Pages</h3>
      <div className="flex flex-wrap gap-4 flex-col">
        {availablePages.map((page) => (
          <label key={page} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedPages.includes(page)}
              disabled={!isEditMode}
              onChange={() => handleCheckboxChange(page)}
              className="w-4 h-4"
            />
            <span>{page}</span>
            {page === "Homepage" && <div className="relative group">
              <CiCircleInfo className="w-5 h-5 text-red-500 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded w-48 px-2 py-2">
                Banner resolution: <span className="text-red-400">1400x380</span>
              </div>
            </div>}
          </label>
        ))}
      </div>
    </div>
  );
};

export default PagesComponent;
