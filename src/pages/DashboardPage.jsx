import { useState } from "react";
import AppSidebar from "../components/AppSidebar";
import ToolSection from "../components/ToolSection";
import HowToUseSection from "../components/HowToUseSection";
import HistorySection from "../components/HistorySection";
import RecentUpdatesPanel from "../components/RecentUpdatesPanel";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("tool");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar */}
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "tool" && <ToolSection />}
        {activeTab === "how" && <HowToUseSection />}
        {activeTab === "history" && <HistorySection />}
      </main>

      {/* Right Updates Panel */}
      <RecentUpdatesPanel />
    </div>
  );
}