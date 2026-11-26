"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard/dashboard-navbar";

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F2F5FA] dark:bg-[#0B1120] text-[#101B36] dark:text-slate-100 transition-colors">
      {/* Sidebar */}
      <DashboardSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
