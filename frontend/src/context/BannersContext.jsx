
import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const BannersContext = createContext()

export const BannersProvider = ({children}) => {
    const [banners, setBanners] = useState([])
    const [selectedProduct, setSelectedProduct] = useState()

    const refetchBanners = () => {
      axios.get('https://marketing-dashboard-2wfk.onrender.com/banners')
        .then(response => {
          setBanners(response.data);
        })
        .catch(error => {
          console.error('Error fetching banners:', error);
        });
    };
  
    useEffect(() => {
      refetchBanners(); // Initial fetch when the component mounts
    }, []);
  
    useEffect(() => {
      if (banners.length > 0) {
        setSelectedProduct((prevSelected) => {
          const stillExists = banners.find(b => b._id === prevSelected?._id);
          return stillExists ? prevSelected : banners[0]; // Preserve selection if exists
        });
      }
    }, [banners]);
  
  
    const handleCreateBanner = (newBanner, imageFile) => {
      // Create a payload object
      const payload = {
        title: newBanner.title,
        type: newBanner.type,
        isDefault: newBanner.isDefault || false,
        status: newBanner.status || "Inactive",
        startDate: newBanner.startDate || null,
        endDate: newBanner.endDate || null,
        photoWeb: imageFile || null, // Pass the imageFile directly (if exists)
        photoApp: imageFile || null, // Pass the imageFile directly (if exists)
      };
    
      // Send the payload as JSON
      axios.post('https://marketing-dashboard-2wfk.onrender.com/banners', payload, {
        headers: {
          'Content-Type': 'application/json', // Specify JSON format
        },
      })
        .then(() => {
          refetchBanners(); // Re-fetch banners after creation
        })
        .catch(error => {
          console.error('Error creating banner:', error);
        });
    };
    
  
    const handleDeleteBanner = (bannerId) => {
      axios.delete(`https://marketing-dashboard-2wfk.onrender.com/banners/${bannerId}`)
        .then(() => {
          // Update the state to remove the deleted banner
          setBanners(prevBanners => prevBanners.filter(banner => banner._id !== bannerId));
          // Clear the selected product if it was the deleted banner
          if (selectedProduct && selectedProduct._id === bannerId) {
            setSelectedProduct(null); 
          }
        })
        .catch(error => {
          console.error('Error deleting banner:', error);
        });
    };
  
  
  const handleUpdateBanner = (bannerId, updatedFields) => {
    const formData = new FormData();
    
    // Append all updated fields to formData
    Object.keys(updatedFields).forEach(key => {
      if (key === 'photoWeb' || key === 'photoApp') {
        if (updatedFields[key] instanceof File) {
          formData.append(key, updatedFields[key]);
        }
      } else if (Array.isArray(updatedFields[key])) {
        // Append each array element individually
        updatedFields[key].forEach(value => {
          formData.append(key, value);
        });
      } else {
        formData.append(key, updatedFields[key]);
      }
    });
  
    axios.put(`https://marketing-dashboard-2wfk.onrender.com/banners/${bannerId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {

        // Update local state
        setBanners(prevBanners => 
          prevBanners.map(banner => 
            banner._id === bannerId ? { ...banner, ...updatedFields } : banner
          )
        )
        // Update selected product if it's the one being edited
        if (selectedProduct && selectedProduct._id === bannerId) {
          setSelectedProduct(prev => ({ ...prev, ...updatedFields }));
        }
        refetchBanners()
      })
      .catch(error => {
        console.error('Error updating banner:', error)
      });
  };

  return (
    <BannersContext.Provider value={{banners, selectedProduct, setSelectedProduct, handleCreateBanner, handleDeleteBanner, handleUpdateBanner}}>
        {children}
    </BannersContext.Provider>
  )
}

// custom hook to use provider
export const useBanners = () => useContext(BannersContext)