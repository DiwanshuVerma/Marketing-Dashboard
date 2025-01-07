import React, { useState } from "react";
import { FiImage } from "react-icons/fi";

const ImagesComponent = ({ isEditMode, image, onImageChange }) => {
  const [previewImage, setPreviewImage] = useState(image); // Initialize with existing image

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result); // Preview the image
        onImageChange(file); // Pass the file to parent component
      };

      reader.readAsDataURL(file); // Convert to base64
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Banner Image</h3>
      <div className="w-80 h-64 border rounded-md overflow-hidden flex items-center justify-center">
        {isEditMode ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex items-center justify-center"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiImage size={32} className="text-gray-400" />
              )}
            </label>
          </>
        ) : previewImage ? (
          <img
            src={previewImage}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <FiImage size={32} className="text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default ImagesComponent;
