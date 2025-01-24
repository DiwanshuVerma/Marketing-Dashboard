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
    axios.get('https://marketing-dashboard-8274.onrender.com/banners')
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
      setSelectedProduct(banners[0]); // Set the first banner as the default
    }
  }, [banners]);


  const handleCreateBanner = (newBanner, imageFile) => {
    const formData = new FormData();
    formData.append('title', newBanner.title);
    formData.append('type', newBanner.type);
    formData.append('isDefault', newBanner.isDefault);
    formData.append('status', newBanner.status);
    if (imageFile) formData.append('photo', imageFile); // Append only if imageFile exists
    if (newBanner.startDate) formData.append('startDate', newBanner.startDate); // Append only if startDate exists
    if (newBanner.endDate) formData.append('endDate', newBanner.endDate); // Append only if endDate exists

    axios.post('https://marketing-dashboard-8274.onrender.com/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        refetchBanners(); // Re-fetch banners after creation
      })
      .catch(error => {
        console.error('Error creating banner:', error);
      });
  };

  const handleDeleteBanner = (bannerId) => {
    axios.delete(`https://marketing-dashboard-8274.onrender.com/banners/${bannerId}`)
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

  axios.put(`https://marketing-dashboard-8274.onrender.com/banners/${bannerId}`, formData, {
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