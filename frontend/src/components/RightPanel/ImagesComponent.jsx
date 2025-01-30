import React, { useState, useEffect } from "react";
import { FiImage } from "react-icons/fi";
const imageUrl = 'https://placehold.co/1100x300'


const ImagesComponent = ({ isEditMode, image, onImageChange }) => {
  const [previewImage, setPreviewImage] = useState(null);

  // Update preview when the `image` prop changes
  useEffect(() => {
    if (!image) {
      // Reset preview image if no image is provided
      setPreviewImage(null);
    } else if (typeof image === "string") {
      setPreviewImage(image); // Set preview to the existing URL
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Set preview to base64 for File
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file)); // Preview the file
      onImageChange(file); // Pass the file to the parent component
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Banner Image</h3>
      <div className="w-full h-72 border rounded-md">
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
              className="cursor-pointer"
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Uploaded"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
          src={imageUrl}
          alt={'img'}
          className="w-full h-full object-cover transition-transform duration-300"
        />
              )}
            </label>
          </>
        ) : previewImage ? (
          <img
            src={previewImage}
            alt="Banner"
            className="w-full h-full object-contain"
          />
        ) : (
          <img
          src={imageUrl}
          alt={'img'}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        )}
      </div>
    </div>
  );
};

export default ImagesComponent;
