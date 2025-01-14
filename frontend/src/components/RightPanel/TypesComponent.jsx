import React, { useEffect, useState } from "react";

const TypesComponent = ({
  isEditMode,
  data,
  onChange,
  types
}) => {

  const [type, setType] = useState(data.type)

  useEffect(() => {
    setType(type)
  }, [data, isEditMode])

  const handleTypeChange = (e) => {
    console.log('salect')
    const newValue = e.tatget.value
    setType(newValue)
    if(onChange){
      onChange('type', newValue)
    }
  }

  return (  
    <>
      {/* Types */}
      <div className="mb-8">
        <label className="block text-gray-600 text-sm mb-1">Type</label>
        {isEditMode ? (
          <select
            value={type}
            onChange={ handleTypeChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        ) : (
          <div className="bg-gray-100 px-3 py-2 rounded-md">
            {data.type || "N/A"}
          </div>
        )}
      </div>

    </>
  )
}

export default TypesComponent