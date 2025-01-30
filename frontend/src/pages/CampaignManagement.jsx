// src/pages/CampaignManagement.jsx
import React, { useState, useEffect } from 'react';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import TopBar from '../components/TopBar';

import axios from 'axios';

const CampaignManagement = () => {
  const [banners, setBanners] = useState([])
  const [selectedProduct, setSelectedProduct] = useState();

  const refetchBanners = () => {
    axios.get('http://localhost:5000/banners')
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

  // useEffect(() => {
  //   if (banners.length > 0) {
      // setSelectedProduct(banners[0]); // Set the first banner as the default
    // }
  // }, [banners]);


  const handleCreateBanner = (newBanner, imageFile) => {
    // Create a payload object
    const payload = {
      title: newBanner.title,
      type: newBanner.type,
      isDefault: newBanner.isDefault || false,
      status: newBanner.status || "Inactive",
      startDate: newBanner.startDate || null,
      endDate: newBanner.endDate || null,
      photo: imageFile || null, // Pass the imageFile directly (if exists)
    };
  
    // Send the payload as JSON
    axios.post('http://localhost:5000/banners', payload, {
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
    console.log('handle delte banner FE, bannerId: ',bannerId)
    axios.delete(`http://localhost:5000/banners/${bannerId}`)
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
    // Special handling for photo since it's a file
    if (key === 'photo' && updatedFields[key] instanceof File) {
      formData.append('photo', updatedFields[key]);
    } else {
      formData.append(key, updatedFields[key]);
    }
  })

  axios.put(`http://localhost:5000/banners/${bannerId}`, formData, {
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
    })
    .catch(error => {
      console.error('Error updating banner:', error)
    });
};


  const handleDuplicateItem = (duplicatedItem) => {
    setBanners(prevBanners => [...prevBanners, duplicatedItem])
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar title="Campaigns" placeholder="Search campaigns, types"/>
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          onProductSelect={setSelectedProduct}
          products={banners}
          onCreateBanner={handleCreateBanner}
        />
        {selectedProduct && (
          <RightPanel
            selectedProduct={selectedProduct}
            handleDeleteBanner={handleDeleteBanner}
            banners={banners}
            onDuplicate={handleDuplicateItem}
            handleUpdateBanner={handleUpdateBanner}
          />
        )}
      </div>
    </div>
  )
}

export default CampaignManagement;