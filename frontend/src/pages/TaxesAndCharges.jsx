import React, { useState } from "react";
import { Transition } from "@headlessui/react"; // Optional if you want smoother collapses

export default function TaxesAndCharges() {
  const [gstRate, setGstRate] = useState(5);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [showGSTCard, setShowGSTCard] = useState(true);
  const [showServiceCard, setShowServiceCard] = useState(true);

  const handleSave = () => {
    alert(`GST: ${gstRate}%, Service: ₹${serviceCharge}`);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Taxes & Charges</h1>

      {/* GST Rate Card */}
      <div className="relative">
        <div
          onClick={() => setShowGSTCard(!showGSTCard)}
          className="flex items-center cursor-pointer bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded shadow text-white"
        >
          <h2 className="text-lg font-semibold flex-1">GST / Tax Rates</h2>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              showGSTCard ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <Transition
          show={showGSTCard}
          enter="transition-all duration-300"
          enterFrom="max-h-0 opacity-0"
          enterTo="max-h-40 opacity-100"
          leave="transition-all duration-300"
          leaveFrom="max-h-40 opacity-100"
          leaveTo="max-h-0 opacity-0"
        >
          <div className="bg-white rounded shadow p-4 mt-1 overflow-hidden">
            <p className="text-sm text-gray-500 mb-4">
              Configure the GST or other applicable taxes for your menu items.
            </p>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  GST Rate (%)
                </label>
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-20 focus:border-red-500 focus:outline-none transition"
                  value={gstRate}
                  onChange={(e) => setGstRate(Number(e.target.value))}
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </Transition>
      </div>

      {/* Service Charges Card */}
      <div className="relative">
        <div
          onClick={() => setShowServiceCard(!showServiceCard)}
          className="flex items-center cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded shadow text-white"
        >
          <h2 className="text-lg font-semibold flex-1">Service Charges</h2>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              showServiceCard ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        <Transition
          show={showServiceCard}
          enter="transition-all duration-300"
          enterFrom="max-h-0 opacity-0"
          enterTo="max-h-40 opacity-100"
          leave="transition-all duration-300"
          leaveFrom="max-h-40 opacity-100"
          leaveTo="max-h-0 opacity-0"
        >
          <div className="bg-white rounded shadow p-4 mt-1 overflow-hidden">
            <p className="text-sm text-gray-500 mb-4">
              Additional charges like service fee, packaging fee, etc.
            </p>
            <div className="flex gap-4 items-end">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Service Charge (₹)
                </label>
                <input
                  type="number"
                  className="border px-2 py-1 rounded w-28 focus:border-red-500 focus:outline-none transition"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(Number(e.target.value))}
                />
              </div>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
