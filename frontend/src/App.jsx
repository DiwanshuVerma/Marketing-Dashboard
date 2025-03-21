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
import { ResourceProvider } from "./context/Banner_CollectionContext";
import CollectionManagement from "./pages/CollectionManagement";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardHome />} />

        <Route path="/campaign-management" element={
          <ResourceProvider resourceType="banners">
              <CampaignManagement />
          </ResourceProvider>
        } />

        <Route path="/collection-management" element={
          <ResourceProvider resourceType="collections">
              <CollectionManagement />
          </ResourceProvider>
        } />

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
      </Route>
    </Routes>
  );
}
