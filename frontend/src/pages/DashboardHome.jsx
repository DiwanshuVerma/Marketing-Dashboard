import React from "react";
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardAnalytics from "../components/Dashboard/DashboardAnalytics";
import { BannersProvider } from "../context/BannersContext";
import { OffersProvider } from "../context/OffersContext";

export default function DashboardHome() {

  return (
    <div className="space-y-2">
      <div>
        <BannersProvider>
          <OffersProvider>

            <DashboardStats />
          </OffersProvider>

        </BannersProvider>

      </div>

      <div className="md:flex-row flex flex-col gap-2 md:h-[70vh] h-[95vh]">
        <BannersProvider>
          <OffersProvider>
            <DashboardAnalytics />
          </OffersProvider>
        </BannersProvider>
      </div>

      {/* <div className="md:flex-row flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
        <TodayOrdersSummary />
        <CommentList fullWidth={false} maxHeight={false} />
      </div> */}
    </div >
  );
}
