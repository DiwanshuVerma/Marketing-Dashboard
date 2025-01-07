import React from "react";

const Dates = ({ isEditMode, details, onChange }) => (
  <div className="mb-8 mt-4">
    <label className="block text-gray-600 text-sm mb-2">Mounting Dates</label>
    <div className="grid grid-cols-2 gap-4">
      {/* start date */}
      <div>
      <div>
        <label className="block text-sm mb-1 ">Start Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
          />
      </div>
      </div>

      {/* end date */}

      <div>
        <label className="block text-sm mb-1 ">End Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
          />
      </div>

    </div>
  </div>
);

export default Dates;
