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
import Offers from "./pages/Offers";
import OutletSettings from "./pages/OutletSettings";
import OutletInfo from "./pages/OutletInfo";
import Help from "./pages/Help";
import EmailTempalateEdit from "./components/EmailTempalateEdit";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/campaign-management" element={<CampaignManagement />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path='/email-tempalate-edit' element={<EmailTempalateEdit />} />

        <Route path="/taxes-charges" element={<TaxesAndCharges />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/outlet-settings" element={<OutletSettings />} />
        <Route path="/outlet-info" element={<OutletInfo />} />
        <Route path="/help" element={<Help />} />
        {/* If you need more pages, add them here */}
      </Route>
    </Routes>
  );
}
