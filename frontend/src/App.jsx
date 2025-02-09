// ------------------------
// src/App.jsx
// ------------------------
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import CampaignManagement from "./pages/CampaignManagement";
import EmailTemplates from "./pages/EmailTemplates";
import TaxesAndCharges from "./pages/TaxesAndCharges";
import RestaurantOffers from "./pages/RestaurantOffers";
import ProfileManagement from "./pages/ProfileManagement";
import Help from "./pages/Help";
import EmailTempalateEdit from "./components/EmailTempalateEdit";
import { OffersProvider } from "./context/OffersContext";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/campaign-management" element={<CampaignManagement />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path='/email-tempalate-edit' element={<EmailTempalateEdit />} />

        <Route path="/CMS" element={<TaxesAndCharges />} />
        <Route path="/RestaurantOffers" element={
          <OffersProvider>
            <RestaurantOffers />
          </OffersProvider>
        } />
        <Route path="/profile-management" element={<ProfileManagement />} />
        <Route path="/help" element={<Help />} />
        {/* If you need more pages, add them here */}
      </Route>
    </Routes>
  );
}
