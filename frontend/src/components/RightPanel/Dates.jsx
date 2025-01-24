import React, { useEffect, useState } from "react";

const Dates = ({ isEditMode, details, onChange }) => {
  const [startDate, setStartDate] = useState(details.startDate || '')
  const [endDate, setEndDate] = useState(details.endDate || '')

  useEffect(() => {
    setStartDate(details.startDate || '')
    setEndDate(details.endDate || '')
  }, [details, isEditMode])


  const handleStartDate = (e) => {
    const newDate = e.target.value
    if (onChange) {
      onChange("startDate", newDate)
    }
  }

  const handleEndDate = (e) => {
    const newDate = e.target.value
    if (onChange) {
      onChange("endDate", newDate)
    }
  }

  return (
    <div className="mb-8 mt-4">
      <div className="grid grid-cols-2 gap-4">
        {/* start date */}
        <div>
          <div>
            <label className="block text-sm mb-1 ">Start Date</label>
            <input
              value={startDate ? new Date(startDate).toISOString().split("T")[0] : ''}
              type="date"
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
              onChange={(e) => handleStartDate(e)}
            />

          </div>
        </div>

        {/* end date */}

        <div>
          <label className="block text-sm mb-1 ">End Date</label>
          <input
            value={endDate ? new Date(endDate).toISOString().split("T")[0] : ''}
            type="date"
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
            onChange={(e) => handleEndDate(e)}
          />
        </div>

      </div>
    </div>
  )
}

export default Dates;
