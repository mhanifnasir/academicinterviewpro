"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, Save, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [sysConfig, setSysConfig] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    autoEnrollFreePlan: true,
    ppscExamYear: "2026",
    fpscExamYear: "2026",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Platform & System Settings"
        description="System toggles, commission recruitment year cycles, maintenance mode, and backup preferences"
        badge={<Badge variant="navy">System Core</Badge>}
        actions={
          <Button onClick={handleSave} className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold">
            <Save className="h-4 w-4 mr-1.5" /> Save System Settings
          </Button>
        }
      />

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs font-bold flex items-center gap-2 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>Platform system settings saved successfully.</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Platform Operational Switches
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Public Candidate Registration
              </span>
              <span className="text-[11px] text-slate-500">
                Allow new Pakistani CS lecturer job applicants to create accounts.
              </span>
            </div>
            <Switch
              checked={sysConfig.registrationOpen}
              onCheckedChange={(val) => setSysConfig({ ...sysConfig, registrationOpen: val })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Auto-Enroll in Aspirant Free Tier
              </span>
              <span className="text-[11px] text-slate-500">
                Grant immediate access to daily 20 MCQs and 1 mock viva upon email verification.
              </span>
            </div>
            <Switch
              checked={sysConfig.autoEnrollFreePlan}
              onCheckedChange={(val) => setSysConfig({ ...sysConfig, autoEnrollFreePlan: val })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-rose-600 block">
                Maintenance Mode
              </span>
              <span className="text-[11px] text-slate-500">
                Temporarily lock candidate dashboard for syllabus database maintenance.
              </span>
            </div>
            <Switch
              checked={sysConfig.maintenanceMode}
              onCheckedChange={(val) => setSysConfig({ ...sysConfig, maintenanceMode: val })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
