// src/components/RightPanel/HeaderComponent.jsx
import React, {useEffect, useState} from "react";
import { FiEdit, FiTrash2, FiCopy, FiX } from "react-icons/fi";


const HeaderComponent = ({
  title,
  isEditMode,
  onEdit,
  onCancel,
  onDelete,
  onChange
}) => {
  const [editableTitle, setEditableTitle] = useState(title);

  useEffect(() => {
    setEditableTitle(title);
  }, [title, isEditMode]);

  const handleTitleChange = (e) => {
    const newValue = e.target.value;
    setEditableTitle(newValue);
    if (onChange) {
      onChange('title', newValue)
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onCancel();
    } else if (e.key === 'Escape') {
      setEditableTitle(title);
      if (onChange) {
        onChange('name', title);
      }
      onCancel();
    }
  }

  return (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      {isEditMode ? (
        <input
          type="text"
          value={editableTitle}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
          placeholder="Title..."
          className="text-2xl font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full mr-4"
          autoFocus
        />
      ) : (
        <input value={title} placeholder="Untitled" readOnly className="outline-none text-2xl font-semibold text-gray-800" />
      )}
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete"
        >
          <FiTrash2 size={20} />
        </button>
        {!isEditMode ? (
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-blue-500"
            title="Edit"
          >
            <FiEdit size={20} />
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500"
            title="Cancel"
          >
            <FiX size={20} />
          </button>
        )}
      </div>
    </div>
  );
};


// const HeaderComponent = ({
//   title,
//   isEditMode,
//   onEdit,
//   onCancel,
//   onDelete,
//   onDuplicate,
// }) => {
//   return (
//     <div className="flex justify-between items-center mb-4 border-b pb-2">
//       <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
//       <div className="flex gap-3">
//         <button
//           onClick={onDelete}
//           className="text-red-500 hover:text-red-700"
//           title="Delete"
//         >
//           <FiTrash2 size={20} />
//         </button>
//         {/* <button
//           onClick={onDuplicate}
//           className="text-blue-500 hover:text-blue-700"
//           title="Duplicate"
//         >
//           <FiCopy size={20} />
//         </button> */}
//         {!isEditMode ? (
//           <button
//             onClick={onEdit}
//             className="text-gray-500 hover:text-blue-500"
//             title="Edit"
//           >
//             <FiEdit size={20} />
//           </button>
//         ) : (
//           <button
//             onClick={onCancel}
//             className="text-gray-500 hover:text-red-500"
//             title="Cancel"
//           >
//             <FiX size={20} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

export default HeaderComponent;