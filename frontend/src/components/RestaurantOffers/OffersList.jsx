import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";

function OffersList({ offers, onRemoveOffer, onEditOffer }) {
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
    type: "",
  });

  const getOfferStatus = (offer) => {
    const today = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    if (today < start) return "Upcoming";
    if (today > end) return "Expired";
    return "Active";
  };

  const filteredOffers = offers.filter((offer) => {
    const status = getOfferStatus(offer);
    const statusMatch = statusFilter === "All" || status === statusFilter;
    const typeMatch = typeFilter === "All" || offer.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleEditClick = (offer) => {
    setEditingOfferId(offer.id);
    setFormData({
      name: offer.name,
      discount: offer.discount,
      startDate: offer.startDate,
      endDate: offer.endDate,
      type: offer.type,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (offerId) => {
    onEditOffer(offerId, formData);
    setEditingOfferId(null);
  };

  const handleCancelEdit = () => {
    setEditingOfferId(null);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Current Offers</h2>
        <div className="">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1 rounded mr-2"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1 rounded"
          >
            <option value="All">All</option>
            <option value="Restaurant-wide">Restaurant-wide</option>
            <option value="Dish-specific">Dish-specific</option>
            <option value="Menu-wide discounts">Menu-wide discounts</option>
          </select>
        </div>
      </div>
      
      {filteredOffers.length === 0 ? (
        offers.length === 0 ? (
          <p className="text-gray-500">No offers created yet.</p>
        ) : (
          <p className="text-gray-500">No offers match the current filters.</p>
        )
      ) : (
        <div className="overflow-auto max-h-96">
          <ul className="space-y-3 pr-2">
            <AnimatePresence>
              {filteredOffers.map((offer) => {
                const status = getOfferStatus(offer);
                const isEditing = editingOfferId === offer.id;

                return (
                  <motion.li
                    key={offer.id}
                    className="relative rounded p-4 flex flex-col border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    layout
                  >
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border px-2 py-1 rounded focus:outline-none
                                     focus:border-blue-400 w-full text-sm"
                            placeholder="Offer Name"
                          />
                          <span className={`text-xs font-medium ${status === "Expired" ? "text-red-500" : status === "Upcoming" ? "text-yellow-500" : "text-green-500"}`}>
                            ({status})
                          </span>

                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">
                              Discount
                            </label>
                            <input
                              type="text"
                              name="discount"
                              value={formData.discount}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none
                                       focus:border-blue-400"
                            />
                          </div>
                          <div>
                            <label htmlFor="type" className="block text-xs font-semibold text-gray-600">
                              Type
                            </label>
                            <select className="border px-2 py-1 rounded w-full focus:outline-none
                                       focus:border-blue-400 bg-transparent"
                              id="type" value={formData.type}
                              onChange={handleChange}>

                              <option value="Restaurant-wide">Restaurant-wide</option>
                              <option value="Dish-specific">Dish-specific</option>
                              <option value="Menu-wide discounts">Menu-wide discounts</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between gap-2">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600">
                              Start Date
                            </label>
                            <input
                              type="date"
                              name="startDate"
                              value={formData.startDate}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none
                                       focus:border-blue-400 text-sm"
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600">
                              End Date
                            </label>
                            <input
                              type="date"
                              name="endDate"
                              value={formData.endDate}
                              onChange={handleChange}
                              className="border px-2 py-1 rounded w-full focus:outline-none
                                       focus:border-blue-400 text-sm"
                            />
                          </div>
                        </div>
                         {/* Save / Cancel */}
                         <div className="flex items-center gap-3 mt-2">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm
                                     hover:bg-blue-700"
                            onClick={() => handleSave(offer.id)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm
                                     hover:bg-gray-400"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-base">{offer.name}</p>
                            <span className={`text-xs font-medium ${status === "Expired" ? "text-red-500" : status === "Upcoming" ? "text-yellow-500" : "text-green-500"}`}>
                              ({status})
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <PencilIcon
                              className="h-5 w-5 text-blue-600 cursor-pointer hover:text-blue-800"
                              onClick={() => handleEditClick(offer)}
                            />
                            <TrashIcon
                              className="h-5 w-5 text-red-500 cursor-pointer hover:text-red-700"
                              onClick={() => onRemoveOffer(offer.id)}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p>Discount: <span className="font-semibold text-gray-600"> {offer.discount}</span></p>
                          <p>Type: <span className="font-semibold text-gray-600">{offer.type}</span></p>

                          <div className="flex gap-8">
                            <p>Start Date: <span className="font-semibold text-gray-600">{offer.startDate}</span></p>
                            <p>End Date: <span className="font-semibold text-gray-600">{offer.endDate}</span></p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        </div>
      )}
    </div>
  );
}

export default OffersList;