import React from "react";
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardAnalytics from "../components/Dashboard/DashboardAnalytics";
import { OffersProvider } from "../context/OffersContext";
import { ResourceProvider } from "../context/Banner_CollectionContext";

export default function DashboardHome() {

  return (
    <div className="space-y-2">
      <div>
        <ResourceProvider resourceType="banners">
          <OffersProvider>

            <DashboardStats />
          </OffersProvider>

        </ResourceProvider>

      </div>

      <div className="md:flex-row flex flex-col gap-2 md:h-[70vh] h-[95vh]">
        <ResourceProvider resourceType="banners">
          <OffersProvider>
            <DashboardAnalytics />
          </OffersProvider>
        </ResourceProvider>
      </div>

      {/* <div className="md:flex-row flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
        <TodayOrdersSummary />
        <CommentList fullWidth={false} maxHeight={false} />
      </div> */}
    </div >
  );
}
