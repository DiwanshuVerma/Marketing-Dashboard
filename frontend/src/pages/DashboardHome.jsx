import React from "react";
import DashboardStats from "../components/Dashboard/DashboardStats";
import DashboardAnalytics from "../components/Dashboard/DashboardAnalytics";

export default function DashboardHome() {

  return (
    <div className="space-y-2">
      <div>
        <DashboardStats />
      </div>

      <div className="md:flex-row flex flex-col gap-2 md:h-[70vh] h-[95vh]">
        <DashboardAnalytics />
      </div>

      {/* <div className="md:flex-row flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
        <TodayOrdersSummary />
        <CommentList fullWidth={false} maxHeight={false} />
      </div> */}
    </div >
  );
}
