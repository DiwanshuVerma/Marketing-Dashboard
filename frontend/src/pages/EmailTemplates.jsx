// src/pages/DineInMenu.jsx
// import React, { useState } from "react";
// import LeftPanel from "../components/LeftPanel";
// import RightPanel from "../components/RightPanel";
// import TopBar from "../components/TopBar";
// import dummyData from "../data/dummy";

// const {dineInCategories } = dummyData;

// export default function DineInMenu() {
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const handleProductSelect = (product) => {
//     setSelectedProduct(product);
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <TopBar title="Dine-In Menu" />
//       <div className="flex flex-1 overflow-hidden">
//         <LeftPanel
//           categories={dineInCategories}
//           onProductSelect={handleProductSelect}
//         />
//         {selectedProduct && (
//           <RightPanel
//             selectedProduct={selectedProduct}
//             onClose={() => setSelectedProduct(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }


const templatesData = [
  { id: 1, name: "Welcome Email", subject: "Welcome to Our Platform!", content: "Hi [User], thank you for joining!" },
  { id: 2, name: "Password Reset", subject: "Reset Your Password", content: "Click here to reset your password." },
  { id: 3, name: "Promotional Email", subject: "Exclusive Offer!", content: "Get 20% off on your next purchase." }
];


import React, { useState } from 'react';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState(templatesData);
  const [editingTemplate, setEditingTemplate] = useState(null);

  const handleDelete = (id) => {
    setTemplates(templates.filter((template) => template.id !== id));
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
  };

  const handleSave = () => {
    setTemplates(
      templates.map((template) =>
        template.id === editingTemplate.id ? editingTemplate : template
      )
    );
    setEditingTemplate(null);
  };

  const toggleActiveStatus = (id) => {
    setTemplates(
      templates.map((template) =>
        template.id === id ? { ...template, active: !template.active } : template
      )
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Email Templates</h1>
      <div className="bg-white p-4 rounded shadow">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border-b last:border-none py-4 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold text-lg">{template.name}</h2>
              <p className="text-sm text-gray-600">Subject: {template.subject}</p>
              <p
                className={`text-sm font-semibold mt-1 ${
                  template.active ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {template.active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(template)}
                className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(template.id)}
                className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => toggleActiveStatus(template.id)}
                className={`px-2 py-1 text-sm rounded ${
                  template.active
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {template.active ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Template</h2>
            <label className="block mb-2 font-semibold">Name</label>
            <input
              type="text"
              value={editingTemplate.name}
              onChange={(e) =>
                setEditingTemplate({ ...editingTemplate, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />

            <label className="block mb-2 font-semibold">Subject</label>
            <input
              type="text"
              value={editingTemplate.subject}
              onChange={(e) =>
                setEditingTemplate({ ...editingTemplate, subject: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />

            <label className="block mb-2 font-semibold">Content</label>
            <textarea
              value={editingTemplate.content}
              onChange={(e) =>
                setEditingTemplate({ ...editingTemplate, content: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            ></textarea>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



export default EmailTemplates;
