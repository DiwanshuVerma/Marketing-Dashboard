// ------------------------
// src/App.jsx
// ------------------------
import React, { useEffect, useState } from "react";
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
import { px } from "framer-motion";

export default function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>

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

    {!isDesktop && (
        <div style={styles.backdrop}>
          <div style={styles.modal}>
            <h2>Unsupported Screen Size</h2>
            <p>Please access this site on a desktop or laptop for the best experience.</p>
          </div>
        </div>
      )}
    </>
  );
}


const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "auto", // enable blocking interaction
  },
  modal: {
    width: "80%",
    maxWidth: "500px",
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    textAlign: "center",
    backdrop: "40px",

    boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
  },
};