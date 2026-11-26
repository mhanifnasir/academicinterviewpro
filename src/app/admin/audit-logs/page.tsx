"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  Activity,
  FileCode,
  Download,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadLogs() {
      try {
        const res = await fetch(`/api/admin/audit-logs?action=${actionFilter}`);
        const json = await res.json();
        if (mounted && json.success && Array.isArray(json.logs)) {
          setLogs(json.logs);
        }
      } catch {
        // Fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadLogs();
    return () => {
      mounted = false;
    };
  }, [actionFilter]);

  const filtered = logs.filter((l) => {
    const s = search.toLowerCase();
    return (
      l.actor.toLowerCase().includes(s) ||
      l.action.toLowerCase().includes(s) ||
      l.entityType.toLowerCase().includes(s) ||
      l.ipAddress.includes(s)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Administrative Security & Audit Log Stream"
        description="Immutable record of administrative operations, role modifications, plan calibrations, and system actions"
        badge={<Badge variant="navy">Security Audit Active</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csvContent =
                "data:text/csv;charset=utf-8," +
                ["Actor,Action,Entity,IP,Timestamp"].concat(
                  filtered.map((l) => `"${l.actor}","${l.action}","${l.entityType}","${l.ipAddress}","${l.createdAt}"`)
                ).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `audit-logs-${Date.now()}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="text-xs font-bold gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export Audit CSV
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by actor, action, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-xs h-9 w-52"
          >
            <option value="ALL">All Administrative Actions</option>
            <option value="AI_CONFIG_UPDATED">AI Config Updates</option>
            <option value="PLAN_LIMITS_UPDATED">Plan Limit Updates</option>
            <option value="USER_MANAGEMENT_UPDATE">User Role / Status Changes</option>
            <option value="STUDY_MATERIAL_CREATED">Study Material Published</option>
            <option value="SUBSCRIPTION_ACTIVATED">Subscription Activations</option>
          </Select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-bold">Action Event</th>
                <th className="pb-3 font-bold">Actor Identity</th>
                <th className="pb-3 font-bold">Entity Type</th>
                <th className="pb-3 font-bold">Entity Identifier</th>
                <th className="pb-3 font-bold">IP Address</th>
                <th className="pb-3 font-bold">Payload Metadata</th>
                <th className="pb-3 font-bold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3 font-mono font-bold text-[#315BEA]">
                    {log.action}
                  </td>
                  <td className="py-3 font-medium text-slate-900 dark:text-slate-200">
                    {log.actor}
                  </td>
                  <td className="py-3">
                    <Badge variant="secondary">{log.entityType}</Badge>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-500">
                    {log.entityId}
                  </td>
                  <td className="py-3 font-mono text-[11px] text-slate-500">
                    {log.ipAddress}
                  </td>
                  <td className="py-3 text-[11px] font-mono text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                  <td className="py-3 text-right text-slate-400 font-semibold">
                    {log.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
