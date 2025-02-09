// src/components/LeftPanel.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiChevronDown,
  FiPlusCircle,
  FiLink,
  FiLayers,
  FiPlus,
} from "react-icons/fi";
import { MdOutlineFiberManualRecord } from "react-icons/md";
import PopUp from "./PopUp";
import { useBanners } from "../context/BannersContext";

const campaigns = [
  {
    name: "Banners",
    categories: [
      { name: "Default Banners" },
      { name: "Discount Banners" }
    ]
  },
  { name: "Collections" }
];


const CreateCampaignModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Inactive");

  const handleCreate = async () => {
    const newBanner = {
      title: name,
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


const LeftPanel = () => {
  const {banners, selectedProduct, setSelectedProduct, handleCreateBanner} = useBanners()

  const [openCategories, setOpenCategories] = useState({});
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [popUpTitle, setPopUpTitle] = useState("");
  
  // This state holds the status filter for each category by name.
  const [statusFilters, setStatusFilters] = useState({});

  const [selectedTemplateId, setSelectedTemplateId] = useState(selectedProduct?._id || null);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedTemplateId(selectedProduct._id);
    }
  }, [selectedProduct]);

  useEffect(() => {
    setOpenCategories((prev) => ({
      ...prev,
      ["Banners"]: true
    }))
  }, [])

  const handleBannerClick = (banner) => {
    setSelectedProduct(banner);
    setSelectedTemplateId(banner._id);
  };

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Filter banners by category – preserving your Default/Discount logic.
  const filterBannersByCategory = (catgName) => {
    if (catgName === "Default Banners") {
      return banners.filter((banner) => banner.isDefault);
    }
    if (catgName === "Discount Banners") {
      return banners.filter((banner) => !banner.isDefault);
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
              className="flex justify-between items-center cursor-pointer mb-2 py-2 px-3 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-all duration-300"
            >
              <h3 className="font-medium text-gray-700">{campaign.name}</h3>
              <FiChevronDown
                className={`text-gray-500 transition-transform duration-300 ${
                  openCategories[campaign.name] ? "rotate-180" : ""
                }`}
              />
            </div>

            {campaign.categories && (
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openCategories[campaign.name] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {campaign.categories.map((catg) => {
                  // Get the banners for this category
                  let bannersForCatg = filterBannersByCategory(catg.name);
                  // Get the current status filter for this category (default to "All")
                  const currentFilter = statusFilters[catg.name] || "All";
                  // Apply the status filter if it’s not "All"
                  if (currentFilter !== "All") {
                    bannersForCatg = bannersForCatg.filter(
                      (banner) => banner.status === currentFilter
                    );
                  }

                  return (
                    <div key={catg.name} className="ml-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-gray-600 font-medium mb-2">{catg.name}</h4>
                        <button
                          className="text-blue-400"
                          onClick={() => {
                            setIsPopUpOpen(true);
                            setPopUpTitle(catg.name);
                          }}
                          title="Add banner"
                        >
                          <FiPlus size={22} />
                        </button>
                      </div>

                      {/* Dropdown filter selector */}
                      {catg.name !== "Default Banners" && 
                      <div className="mb-2">
                        <select
                          className="border rounded p-1"
                          value={currentFilter}
                          onChange={(e) =>
                            setStatusFilters((prev) => ({
                              ...prev,
                              [catg.name]: e.target.value,
                            }))
                          }
                        >
                          <option value="All">All</option>
                          <option value="Active">Active</option>
                          <option value="Upcoming">Upcoming</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      }

                      {bannersForCatg.map((banner) => (
                        <div
                          key={banner._id}
                          onClick={() => handleBannerClick(banner)}
                          className={`flex justify-between py-1 px-2 hover:bg-gray-200 cursor-pointer rounded-md transition-all duration-200 ${
                            banner._id === selectedTemplateId ? "bg-gray-200" : ""
                          }`}
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
                  );
                })}
              </div>
            )}
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
            handleCreateBanner(newBanner);
            setIsPopUpOpen(false);
          }}
        />
      )}
    </div>
  );
};



export default LeftPanel;
