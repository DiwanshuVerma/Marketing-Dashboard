// src/components/RightPanel.jsx
import React, { useState, useEffect } from "react";
import HeaderComponent from "./RightPanel/HeaderComponent";
import TypesComponent from "./RightPanel/TypesComponent";
import Dates from "./RightPanel/Dates";
import ImagesComponent from "./RightPanel/ImagesComponent";
import ActionButtonsComponent from "./RightPanel/ActionButtonsComponent";
import PagesComponent from "./RightPanel/PagesComponent";
import axios from "axios";

const types = [
  "Restaurant Discount",
  "Dishes Discount"
];

const RightPanel = ({ selectedProduct, handleUpdateBanner, handleDeleteBanner, onDuplicate, banners }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState(selectedProduct || {});
  const [selectedPages, setSelectedPages] = useState(selectedProduct.pages || []);

  useEffect(() => {
    if (selectedProduct) {
      setData({ ...selectedProduct });
      console.log('slectd prodct: ', selectedProduct)
      setSelectedPages(selectedProduct.pages || []); // Dummy for now
    }
  }, [selectedProduct]);

  const handleFieldChange = (field, value) => {
    console.log('handle field change')
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedFields = {
      ...data,
      pages: selectedPages
    };
    console.log('handle save')
    handleUpdateBanner(data._id, updatedFields);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setData({ ...selectedProduct });
    setSelectedPages(selectedProduct.pages || []);
    setIsEditMode(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      handleDeleteBanner(data._id);
    }
  };

  const handleDuplicate = () => {
    const duplicatedItem = {
      ...data,
      id: Date.now(),
      name: `${data.name} (Copy)`,
    };
    onDuplicate(duplicatedItem);
    setData(duplicatedItem);
    setIsEditMode(true);
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
        title={data.title || "Untitled"}
        isEditMode={isEditMode}
        onEdit={() => setIsEditMode(true)}
        onCancel={handleCancel}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onChange={handleFieldChange}
      />

      {/* Banner Image */}

      <ImagesComponent
        isEditMode={isEditMode}
        image={data.photo} // Can be a URL (string) or a File object
        onImageChange={(file) => {
          setData((prev) => ({
            ...prev,
            'photo': file, // Store File object for FormData upload
          }));
        }}
      />

      {/* Types Dropdown */}
      <TypesComponent
        isEditMode={isEditMode}
        data={data}
        types={types}
        onChange={handleFieldChange}
      />

      {/* Dates */}
      <Dates
        isEditMode={isEditMode}
        details={data}
        onChange={handleFieldChange}
      />


      {/* Pages Selection */}
      <PagesComponent
        isEditMode={isEditMode}
        selectedPages={selectedPages}
        onChange={setSelectedPages}
      />

      {/* Save/Cancel */}
      {isEditMode && (
        <ActionButtonsComponent onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default RightPanel;
