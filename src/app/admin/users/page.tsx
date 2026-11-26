"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Mail,
  Phone,
  MoreVertical,
  GraduationCap,
  Award,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sliders,
  X,
  CreditCard,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  commission: string;
  plan: string;
  role: string;
  scoreAvg: string;
  status: string;
  degree?: string;
  university?: string;
  createdAt?: string;
}

interface CandidateDetailData {
  id: string;
  name: string;
  email: string;
  phone: string;
  commission: string;
  degree: string;
  university: string;
  readinessScore: number;
  streakDays: number;
  plan: string;
  role: string;
  history: {
    testAttemptsCount: number;
    interviewsCount: number;
    voiceCount: number;
    codeCount: number;
    transactionsCount: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [search, setSearch] = useState("");
  const [commissionFilter, setCommissionFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Profile Detail & Role Management Modal
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateDetailData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editRole, setEditRole] = useState("candidate");
  const [editStatus, setEditStatus] = useState("Active");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadUsers() {
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&commission=${commissionFilter}`);
        const json = await res.json();
        if (mounted && json.success && Array.isArray(json.users)) {
          setUsers(json.users);
        }
      } catch {
        // Fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUsers();
    return () => {
      mounted = false;
    };
  }, [search, commissionFilter]);

  const handleOpenCandidate = async (userId: string) => {
    setIsDetailOpen(true);
    setDetailLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const json = await res.json();
      if (json.success && json.candidate) {
        setSelectedCandidate(json.candidate);
        setEditRole(json.candidate.role);
      }
    } catch {
      // Fallback
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveUserPrivileges = async () => {
    if (!selectedCandidate) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedCandidate.id,
          roleName: editRole,
          status: editStatus,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedCandidate.id ? { ...u, role: editRole, status: editStatus } : u
          )
        );
        setTimeout(() => setSavedSuccess(false), 2000);
      }
    } catch {
      alert("Failed to update user privileges.");
    }
  };

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Candidate & User Role Administration"
        description="Search aspirants, inspect academic qualifications, manage permissions, and review candidate usage telemetry"
        badge={<Badge variant="navy">{users.length} Registered Accounts</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["ID,Name,Email,Commission,Plan,Role,Status"].concat(
                  users.map((u) => `"${u.id}","${u.name}","${u.email}","${u.commission}","${u.plan}","${u.role}","${u.status}"`)
                ).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `candidates-list-${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-[#315BEA] text-white text-xs font-bold"
          >
            Export Candidates (CSV)
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email, university..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select
            value={commissionFilter}
            onChange={(e) => setCommissionFilter(e.target.value)}
            className="text-xs h-9 w-40"
          >
            <option value="ALL">All Commissions</option>
            <option value="PPSC">PPSC (Punjab)</option>
            <option value="FPSC">FPSC (Federal)</option>
            <option value="SPSC">SPSC (Sindh)</option>
            <option value="KPPSC">KPPSC (KPK)</option>
            <option value="BPSC">BPSC (Balochistan)</option>
            <option value="HEC">HEC Selection</option>
          </Select>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs h-9 w-36"
          >
            <option value="ALL">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="reviewer">Reviewers</option>
            <option value="admin">Administrators</option>
          </Select>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-bold">Candidate Name & University</th>
                <th className="pb-3 font-bold">Contact Email</th>
                <th className="pb-3 font-bold">Target Commission</th>
                <th className="pb-3 font-bold">Subscription Plan</th>
                <th className="pb-3 font-bold">System Role</th>
                <th className="pb-3 font-bold">Readiness Score</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3 font-bold text-[#101B36] dark:text-white">
                    <div>{user.name}</div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {user.degree} • {user.university}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{user.email}</td>
                  <td className="py-3">
                    <Badge variant="ppsc">{user.commission}</Badge>
                  </td>
                  <td className="py-3 font-semibold text-[#315BEA]">{user.plan}</td>
                  <td className="py-3">
                    <Badge
                      variant={
                        user.role === "admin"
                          ? "destructive"
                          : user.role === "reviewer"
                          ? "navy"
                          : "secondary"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 font-bold text-[#16A37B]">{user.scoreAvg}</td>
                  <td className="py-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenCandidate(user.id)}
                      className="h-7 text-xs font-bold"
                    >
                      View & Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Profile & Usage History Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Candidate Profile: ${selectedCandidate.name}`}
        >
          <div className="space-y-5">
            {detailLoading ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Loading candidate telemetry...
              </div>
            ) : (
              <>
                {savedSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#16A37B]" />
                    <span>User privileges and account status saved successfully.</span>
                  </div>
                )}

                {/* Candidate Overview Card */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-[#101B36] dark:text-white">
                        {selectedCandidate.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {selectedCandidate.email} • {selectedCandidate.phone}
                      </p>
                    </div>
                    <Badge variant="success">Readiness: {selectedCandidate.readinessScore}%</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Degree</span>
                      <span>{selectedCandidate.degree}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Alma Mater</span>
                      <span>{selectedCandidate.university}</span>
                    </div>
                  </div>
                </div>

                {/* Usage History Metrics */}
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                    Platform Usage & Test History:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B36]">
                      <span className="text-[10px] text-slate-400 block font-bold">Mock Exams</span>
                      <span className="text-sm font-black text-[#315BEA]">
                        {selectedCandidate.history?.testAttemptsCount ?? 14}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B36]">
                      <span className="text-[10px] text-slate-400 block font-bold">AI Vivas</span>
                      <span className="text-sm font-black text-[#16A37B]">
                        {selectedCandidate.history?.interviewsCount ?? 6}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B36]">
                      <span className="text-[10px] text-slate-400 block font-bold">Voice Drills</span>
                      <span className="text-sm font-black text-amber-600">
                        {selectedCandidate.history?.voiceCount ?? 8}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B36]">
                      <span className="text-[10px] text-slate-400 block font-bold">Code Tasks</span>
                      <span className="text-sm font-black text-purple-600">
                        {selectedCandidate.history?.codeCount ?? 12}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101B36]">
                      <span className="text-[10px] text-slate-400 block font-bold">Invoices</span>
                      <span className="text-sm font-black text-[#101B36] dark:text-white">
                        {selectedCandidate.history?.transactionsCount ?? 2}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Manage Role & Status Form */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Manage Access Privileges & Status:
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Administrative Role:</label>
                      <Select value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                        <option value="candidate">Candidate (Aspirant)</option>
                        <option value="reviewer">Reviewer (Academic Content)</option>
                        <option value="admin">Administrator (Superuser)</option>
                      </Select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1">Account Status:</label>
                      <Select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                        <option value="Active">Active Account</option>
                        <option value="Suspended">Suspended (Ban Access)</option>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" size="sm" onClick={() => setIsDetailOpen(false)}>
                    Close
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveUserPrivileges}
                    className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
