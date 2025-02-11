// src/components/RightPanel/PagesComponent.jsx
import React from "react";

const availablePages = [
  "Homepage",
  "Product Page",
  "Cart Page",
  "Checkout Page",
  "Offers Page"
];

const PagesComponent = ({ isEditMode, selectedPages, onChange }) => {
  const handleCheckboxChange = (page) => {
    if (selectedPages.includes(page)) {
      onChange(selectedPages.filter((p) => p !== page));
    } else {
      onChange([...selectedPages, 'pages', page]);
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
          </label>
        ))}
      </div>
    </div>
  );
};

export default PagesComponent;
