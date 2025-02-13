// src/components/RightPanel.jsx
import React, { useState, useEffect } from "react";
import HeaderComponent from "./RightPanel/HeaderComponent";
import Dates from "./RightPanel/Dates";
import ImagesComponent from "./RightPanel/ImagesComponent";
import ActionButtonsComponent from "./RightPanel/ActionButtonsComponent";
import PagesComponent from "./RightPanel/PagesComponent";
import CampaignCities from "./RightPanel/CampaignCities";
import { useBanners } from "../context/BannersContext";
import { OffersProvider } from "../context/OffersContext";

const RightPanel = () => {
  const { selectedProduct, handleUpdateBanner, handleDeleteBanner } = useBanners()

  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState(selectedProduct || {});
  const [selectedPages, setSelectedPages] = useState(selectedProduct.pages || []);
  const [selectedCities, setSelectedCities] = useState(selectedProduct.cities || []);

  useEffect(() => {
    if (selectedProduct) {
      setData({ ...selectedProduct });
      setSelectedPages(selectedProduct.pages || [])
      setSelectedCities(selectedProduct.cities || [])
    }
  }, [selectedProduct]);

  const handleFieldChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedFields = {
      ...data,
      pages: selectedPages,
      cities: selectedCities
    };
    handleUpdateBanner(data._id, updatedFields);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setData({ ...selectedProduct });
    setSelectedPages(selectedProduct.pages || [])
    setSelectedCities(selectedProduct.cities || [])
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      handleDeleteBanner(data._id);
    }
  };

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="w-2/3 p-6 bg-white shadow-md border-l border-gray-200">
        <p className="text-gray-500">
          No item selected. Please select an item from the left panel.
        </p>
      </div>
    );
  }

  return (
    <div className="w-3/5 p-6 bg-white shadow-md border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <HeaderComponent
        data={data}
        isEditMode={isEditMode}
        onEdit={() => setIsEditMode(true)}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onChange={handleFieldChange}
      />

      {/* Banner Images */}
      <OffersProvider>
        <ImagesComponent
          type="Web"
          isEditMode={isEditMode}
          image={data.photoWeb} // Separate state key for Web image
          onImageChange={(file) => {
            setData((prev) => ({
              ...prev,
              photoWeb: file, // Store Web image separately
            }));
          }}
          onChange={handleFieldChange}
        />

        <ImagesComponent
          type="App"
          isEditMode={isEditMode}
          image={data.photoApp} // Separate state key for App image
          onImageChange={(file) => {
            setData((prev) => ({
              ...prev,
              photoApp: file, // Store App image separately
            }));
          }}
        />
      </OffersProvider>

      {/* Dates */}
      <Dates
        isEditMode={isEditMode}
        details={data}
        onChange={handleFieldChange}
      />


      <div className="flex justify-between mr-36 max-h-72 overflow-hidden">
        {/* Pages Selection */}
        <PagesComponent
          isEditMode={isEditMode}
          selectedPages={selectedPages}
          onChange={setSelectedPages}
        />
        <div className="overflow-auto">
          <CampaignCities
            isEditMode={isEditMode}
            selectedCities={selectedCities}
            onChange={setSelectedCities}
          />
        </div>
      </div>

      {/* Save/Cancel */}
      {isEditMode && (
        <ActionButtonsComponent onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default RightPanel;
