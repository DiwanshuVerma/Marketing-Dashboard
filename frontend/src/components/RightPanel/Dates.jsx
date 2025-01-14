import React, { useEffect, useState } from "react";

const Dates = ({ isEditMode, details, onChange }) => {
  const [startDate, setStartDate] = useState(details.startDate || '')
  const [endDate, setEndDate] = useState(details.endDate || '')

  useEffect(() => {
    setStartDate(details.startDate)
    setEndDate(details.endDate)
  }, [details, isEditMode])


  const handleDateChange = (e) => { 
    const newDate = e.target.value
    if(onChange){
      onChange(newDate)
    }
  }

  return (
    <div className="mb-8 mt-4">
      <label className="block text-gray-600 text-sm mb-2">Mounting Dates</label>
      <div className="grid grid-cols-2 gap-4">
        {/* start date */}
        <div>
          <div>
            <label className="block text-sm mb-1 ">Start Date</label>
            <input
              value={startDate}
              type="date"
              className="w-full border px-3 py-2 rounded-md bg-gray-100"
              onChange={() => handleDateChange(e)}
            />
          </div>
        </div>

        {/* end date */}

        <div>
          <label className="block text-sm mb-1 ">End Date</label>
          <input
            value={endDate}
            type="date"
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
            onChange={() => handleDateChange(e)}
          />
        </div>

      </div>
    </div>
  )
}

export default Dates;
