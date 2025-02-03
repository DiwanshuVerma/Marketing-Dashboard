// src/components/LeftPanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiChevronDown,
  FiPlusCircle,
  FiLink,
  FiLayers,
  FiFolderPlus,
} from "react-icons/fi";
import { MdOutlineFiberManualRecord } from "react-icons/md";
import PopUp from "./PopUp";

const campaigns = [
  {
    name: 'Banners',
    categories: [
      {
        name: 'Default Banners'
      },
      {
        name: 'Discount Banners',
        subCategories: [
          {
            name: 'Restaurant Discount'
          },
          {
            name: 'Dishes Discount'
          }
        ]
      }
    ]
  },
  {
    name: 'Collections'
  }
]



const CreateCampaignModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("Restaurant Discount");
  const [status, setStatus] = useState("Inactive");

  const handleCreate = async () => {
    const newBanner = {
      title: name,
      type,
      status,
      isDefault: false
    }
    onCreate(newBanner)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md shadow-md w-1/3">
        <h2 className="text-xl font-bold mb-4">Create New Banner</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Banner Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter campaign title"
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Restaurant Discount">Restaurant Discount</option>
            <option value="Dishes Discount">Dishes Discount</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};


const LeftPanel = ({ onProductSelect, products = [], onCreateBanner }) => {
  const [openCategories, setOpenCategories] = useState(campaigns[0]);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpTitle, setPopUpTitle] = useState("");

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const filterBannersBySubCategory = (subCatgName) => {
    return products.filter(
      (banner) => banner.type === subCatgName && !banner.isDefault
    );
  };

  const filterUncategorizedBanners = () => {
    return products.filter(
      (banner) => !banner.isDefault && !banner.type
    );
  };

  const filterBannersByCategory = (catgName) => {
    if (catgName === "Default Banners") {
      return products.filter((banner) => banner.isDefault);
    }
    return [];
  };


  return (
    <div className="w-2/5 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Campaigns</h2>
        {campaigns.map((campaign) => (
          <div key={campaign.name} className="mb-4">
            <div
              onClick={() => toggleCategory(campaign.name)}
              className="flex justify-between items-center cursor-pointer mb-2 py-2 px-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300 ease-in-out"
            >
              <h3 className="font-medium text-gray-700">{campaign.name}</h3>
              <FiChevronDown
                className={`text-gray-500 transition-transform duration-300 ${openCategories[campaign.name] ? "rotate-180" : ""
                  }`}
              />
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openCategories[campaign.name] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              {campaign.categories?.map((catg) => (
                <div key={catg.name} className="ml-4">
                  <div className="flex justify-between">
                    <h4 className="text-gray-600 font-medium mb-2">{catg.name}</h4>
                    {catg.name !== "Default Banners" && (
                      <button
                        className="text-blue-400"
                        onClick={() => {
                          setIsPopUpOpen(true);
                          setPopUpTitle(catg.name);
                        }}
                       title="Add banner"
                      >
                        <FiPlusCircle size={18}/>
                      </button>
                    )}
                  </div>

                  {catg.subCategories?.map((subCatg) => {
                    const filteredBanners = filterBannersBySubCategory(subCatg.name);
                    if (filteredBanners.length === 0) return null

                    return (
                      <div key={subCatg.name} className="ml-4">
                        <h5 className="text-gray-500 font-medium mb-1">{subCatg.name}</h5>
                        {filterBannersBySubCategory(subCatg.name).map((banner) => (
                          <div
                            key={banner._id}
                            onClick={() => onProductSelect(banner)}
                            className="flex justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-md transition-all duration-200 ease-in-out"
                          >
                            <div className="flex items-center gap-2">
                              <MdOutlineFiberManualRecord
                                className={
                                  banner.status === "Active"
                                    ? "text-green-500"
                                    : banner.status === "Inactive"
                                      ? "text-red-500"
                                      : "text-yellow-500"
                                }
                              />
                              <span>{banner.title}</span>
                            </div>
                            <span
                              className={
                                banner.status === "Active"
                                  ? "text-green-500 text-sm"
                                  : banner.status === "Inactive"
                                    ? "text-red-500 text-sm"
                                    : "text-yellow-500 text-sm"
                              }
                            >
                              {banner.status}
                            </span>
                          </div>
                        ))}
                      </div>)
                  })}

                  {filterBannersByCategory(catg.name).map((banner) => (
                    <div
                      key={banner._id}
                      onClick={() => onProductSelect(banner)}
                      className="flex justify-between py-1 px-2 hover:bg-gray-100 cursor-pointer rounded-md transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center gap-2">
                        <MdOutlineFiberManualRecord
                          className={
                            banner.status === "Active"
                              ? "text-green-500"
                              : banner.status === "Inactive"
                                ? "text-red-500"
                                : "text-yellow-500"
                          }
                        />
                        <span>{banner.title}</span>
                      </div>
                      <span
                        className={
                          banner.status === "Active"
                            ? "text-green-500 text-sm"
                            : banner.status === "Inactive"
                              ? "text-red-500 text-sm"
                              : "text-yellow-500 text-sm"
                        }
                      >
                        {banner.status}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isPopUpOpen && (
        <CreateCampaignModal
          onClose={() => {
            setIsPopUpOpen(false);
            setPopUpTitle("");
          }}
          onCreate={(newBanner) => {
            onCreateBanner(newBanner);
            setIsPopUpOpen(false);
          }}
        />
      )}
    </div>
  )
}


export default LeftPanel;
