// src/pages/CampaignManagement.jsx
import React, { useState, useEffect } from 'react';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import { useResource } from '../context/Banner_CollectionContext';

const campaigns = [
  {
    name: "Banners",
    categories: [
      { name: "Default Banners" },
      { name: "Discount Banners" }
    ]
  }
];

const CampaignManagement = () => {
  const {selectedResource} = useResource()

  return (  
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel campaigns={campaigns} />
        {selectedResource && (
          <RightPanel />
        )}
      </div>
    </div>
  )
}

export default CampaignManagement; 