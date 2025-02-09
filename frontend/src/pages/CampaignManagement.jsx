// src/pages/CampaignManagement.jsx
import React, { useState, useEffect } from 'react';
import LeftPanel from '../components/LeftPanel';
import RightPanel from '../components/RightPanel';
import TopBar from '../components/TopBar';
import { useBanners } from '../context/BannersContext';

const CampaignManagement = () => {
  const {selectedProduct} = useBanners()

  return (  
    <div className="flex flex-col h-full">
      <TopBar title="Campaigns" placeholder="Search campaigns, types"/>
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel />
        {selectedProduct && (
          <RightPanel />
        )}
      </div>
    </div>
  )
}

export default CampaignManagement; 