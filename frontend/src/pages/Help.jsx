import React, { useState } from "react";
import { Transition } from "@headlessui/react";

export default function Help() {
  const faqs = [
    {
      q: "How to add a new category?",
      a: 'Go to Delivery Menu (or Dine-in Menu) and click "+ Add Menu Category."',
    },
    {
      q: "How to set up image uploads?",
      a: "Integrate your server with multer or any other library, then call POST /api/upload from the frontend.",
    },
    {
      q: "How to integrate with third-party delivery?",
      a: "Use the official APIs for platforms like Swiggy or Zomato, or refer to their developer docs.",
    },
    {
      q: "Payment and refund policies?",
      a: "See your local regulations for refunds. Integrate a payment gateway with an event for charge-backs.",
    },
  ];

  const [openFAQIndex, setOpenFAQIndex] = useState(null);

  const toggleFAQ = (i) => {
    setOpenFAQIndex(openFAQIndex === i ? null : i);
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700">Help & Support</h1>

      <div className="bg-white rounded shadow p-4 space-y-3">
        <p className="text-sm text-gray-600">
          Frequently Asked Questions and support resources:
        </p>

        {faqs.map((item, i) => (
          <div key={i} className="border-b last:border-0 pb-2">
            <button
              onClick={() => toggleFAQ(i)}
              className="flex justify-between items-center w-full py-2 text-left text-gray-700 hover:text-red-500 transition"
            >
              <span className="font-medium">{item.q}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                  openFAQIndex === i ? "rotate-180" : ""
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
            </button>
            <Transition
              show={openFAQIndex === i}
              enter="transition-all duration-300"
              enterFrom="max-h-0 opacity-0"
              enterTo="max-h-40 opacity-100"
              leave="transition-all duration-300"
              leaveFrom="max-h-40 opacity-100"
              leaveTo="max-h-0 opacity-0"
            >
              <p className="text-sm text-gray-600 px-2 mt-1 overflow-hidden">
                {item.a}
              </p>
            </Transition>
          </div>
        ))}

        <p className="text-sm text-gray-600 mt-4">
          For direct assistance, email us at{" "}
          <span className="text-blue-500 underline cursor-pointer">
            support@zomato-style-app.com
          </span>
        </p>
      </div>
    </div>
  );
}
