"use client";

import React, { useState } from "react";
import { Settings, Bell, Lock, Shield, Moon, Sun, Save, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/shared/theme-provider";

export default function CandidateSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailAlerts: true,
    whatsappAlerts: true,
    dailyStreakReminder: true,
    targetCommission: "PPSC",
    microphoneSensitivity: "High",
    audioSpeedPlayback: "1.0x",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Settings & Preferences"
        description="Configure your commission preferences, notifications, audio settings, and display theme"
        breadcrumbs={[{ label: "Settings" }]}
        actions={
          <Button onClick={handleSave} className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold">
            <Save className="h-4 w-4 mr-1.5" /> Save Changes
          </Button>
        }
      />

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs font-bold flex items-center gap-2 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          <span>Settings saved successfully.</span>
        </div>
      )}

      {/* Target Commission Setting */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Target Commission & Syllabus Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Primary Examination Board
            </label>
            <Select
              value={settings.targetCommission}
              onChange={(e) => setSettings({ ...settings, targetCommission: e.target.value })}
            >
              <option value="PPSC">Punjab Public Service Commission (PPSC CS Lecturer)</option>
              <option value="FPSC">Federal Public Service Commission (FPSC F.4)</option>
              <option value="KPPSC">Khyber Pakhtunkhwa PSC (KPPSC Lecturer)</option>
              <option value="SPSC">Sindh Public Service Commission (SPSC)</option>
              <option value="BPSC">Balochistan Public Service Commission (BPSC)</option>
              <option value="HEC">University Selection Board / HEC</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Official Commission Test Date Alerts
              </span>
              <span className="text-[11px] text-slate-500">
                Receive instant emails when PPSC/FPSC announces dates or roll number slips.
              </span>
            </div>
            <Switch
              checked={settings.emailAlerts}
              onCheckedChange={(val) => setSettings({ ...settings, emailAlerts: val })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Daily Study Streak & Mock Reminders
              </span>
              <span className="text-[11px] text-slate-500">
                Keep your consistency score active before the screening deadline.
              </span>
            </div>
            <Switch
              checked={settings.dailyStreakReminder}
              onCheckedChange={(val) => setSettings({ ...settings, dailyStreakReminder: val })}
            />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
          Appearance & Dark Theme
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Interface Color Theme
            </span>
            <span className="text-[11px] text-slate-500">
              Current active theme: <strong>{theme === "dark" ? "Academic Dark Navy" : "Crisp Academic Light"}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={theme === "light" ? "navy" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
              className="text-xs font-semibold"
            >
              Light Theme
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="text-xs font-semibold"
            >
              Dark Theme
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
