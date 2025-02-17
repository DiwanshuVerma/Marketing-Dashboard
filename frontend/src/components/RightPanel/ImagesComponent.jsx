import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { useOffers } from "../../context/OffersContext";
import { useBanners } from "../../context/BannersContext";
import { CiCircleInfo } from "react-icons/ci";

const ImagesComponent = ({ isEditMode, image, onImageChange, type, onChange }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isOfferSelected, setIsOfferSelected] = useState(false)
  const { selectedProduct } = useBanners()
  const [bannerOffer, setBannerOffer] = useState(selectedProduct?.offer || "--Select--")
  const navigate = useNavigate()

  const { offers } = useOffers()


  useEffect(() => {
    if (selectedProduct?.offer) {
      setBannerOffer(selectedProduct?.offer || "--Select--")
      setIsOfferSelected(true);
    } else {
      setBannerOffer("--Select--");
      setIsOfferSelected(false);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (!image) {
      setPreviewImage(null);
    } else if (typeof image === "string") {
      setPreviewImage(image);
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(image);
    }
  }, [image]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  const handleClearImage = () => {
    setPreviewImage(null);
    onImageChange(null);
  };

  const HandleBannerOffer = (e) => {
    const data = e.target.value;
    setBannerOffer(data); // Ensure the state updates
    if (onChange) {
      onChange("offer", data);
    }
  };

  return (
    <div className="mb-6">
      <div className="items-center w-full flex justify-between mb-4">

        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Banner Image for {type}{" "}
          {type === "Web" ? (
            <div className="relative group font-normal">
              <CiCircleInfo className="w-5 h-5 text-red-500 cursor-pointer" />
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded w-48 px-2 py-2">
                Banner Image resolutions <br /> <br />Homepage Banner: <span className="text-red-400">1400x380</span> <br /> Others: <span className="text-red-400">1100x300</span>
              </div>
            </div>
          ) : (
            <span className="text-sm text-red-500">*334x76</span>
          )}
        </h3>


        {type === 'Web' && (
          <div className="flex items-center gap-3">
            <div className="flex">
              <label className={`mr-1  font-bold ${isOfferSelected ? 'text-green-600' : 'text-red-500'}`} htmlFor="offer">{isOfferSelected ? 'Offer:' : 'Select Offer'}</label>
              <select className="p-1 rounded" value={bannerOffer} name="" id="offer" disabled={!isEditMode} onChange={HandleBannerOffer}>
                <option value="" >--Select--</option>
                {
                  offers.map((offer, offerIndex) => (
                    <option key={offerIndex} value={offer.name}>{offer.name}</option>
                  ))
                }
              </select>
            </div>
            <div>
              <button className="bg-green-600 rounded p-1 text-white" disabled={!isEditMode} onClick={() => navigate('/RestaurantOffers')}>Create new</button>
            </div>
          </div>
        )}


      </div>
      <div
        className={`h-auto border rounded-md flex flex-col items-center justify-center p-4 ${type === "Web" ? "w-full" : "w-1/2"
          }`}
      >
        {isEditMode ? (
          <>
            {previewImage ? (
              <div className="relative">
                <img
                  src={previewImage}
                  alt="Uploaded"
                  className="max-w-full h-auto"
                />
                <button
                  onClick={handleClearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  {type === "Web"
                    ? "Upload a banner image (1100x300 resolution recommended)"
                    : "334x76 resolution recommended"}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id={`image-upload-${type}`}
                />
                <label
                  htmlFor={`image-upload-${type}`}
                  className="text-sm cursor-pointer px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Upload Banner Image
                </label>
              </>
            )}
          </>
        ) : previewImage ? (
          <img src={previewImage} alt="Banner" className="max-w-full h-auto" />
        ) : (
          <p className="text-gray-500">No banner image available</p>
        )}
      </div>
    </div>
  );
};

export default ImagesComponent;
