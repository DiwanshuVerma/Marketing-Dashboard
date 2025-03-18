import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';



const ResourceContext = createContext();

export const ResourceProvider = ({ children, resourceType }) => {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('')

  // generic API path based on resourceType (e.g., "banners" or "collections")
  const API_PATH = `${import.meta.env.VITE_API_PATH}/${resourceType}`;

  const refetchResources = () => {
    axios.get(API_PATH)
      .then(response => setResources(response.data))
      .catch(console.error);
    console.log(resources)
  };

  useEffect(() => {
    setResources([]);         // Clear previous data
    setSelectedResource('')
    refetchResources();       // Fetch new data for the current resourceType
  }, [API_PATH, resourceType]);

  useEffect(() => {
    if (resources.length > 0) {
      setSelectedResource((prevSelected) => {
        const stillExists = resources.find(b => b._id === prevSelected?._id);
        return stillExists ? prevSelected : resources[0]; // Preserve selection if exists
      });
    }
  }, [resources]);

  const handleCreate = (newResource, imageFile) => {
    const payload = {
      ...newResource,
      photoWeb: imageFile || null,
      photoApp: imageFile || null,
    };
    
    axios.post(API_PATH, payload)
      .then(refetchResources)
      .catch(console.error);
  };


const handleDelete = (id) => {
  axios.delete(`${API_PATH}/${id}`)
    .then(() => {
      setResources(prev => prev.filter(r => r._id !== id));
      setSelectedResource(prev => prev?._id === id ? null : prev)
    })
    .catch((error) => {
      if (error.response && error.response.status === 403) {
        console.log(error.response.data.message)
        toast.error(error.response.data.message); // Error toast
      } else {
        toast.error("An error occurred while deleting the banner. Please try again.");
      }
    });
};


  // ------------------> update funtion
  const handleUpdate = (id, updatedFields) => {
    const formData = new FormData();
    Object.keys(updatedFields).forEach(key => {
      const value = updatedFields[key];
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(v => formData.append(key, v));
      } else {
        formData.append(key, value);
      }
    });

    axios.put(`${API_PATH}/${id}`, formData)
      .then(() => {
        setResources(prev => prev.map(r => r._id === id ? { ...r, ...updatedFields } : r));
        setSelectedResource(prev => prev?._id === id ? { ...prev, ...updatedFields } : prev);
        refetchResources()  // refech from database to update changes live
      })
      .catch(console.error);
  };

  return (
    <ResourceContext.Provider value={{
      resourceType,
      resources,
      selectedResource,
      setSelectedResource,
      handleCreate,
      handleDelete,
      handleUpdate
    }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = () => useContext(ResourceContext);