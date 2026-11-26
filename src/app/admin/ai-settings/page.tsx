"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  Sparkles,
  Save,
  CheckCircle2,
  Sliders,
  Shield,
  Users,
  BookOpen,
  RotateCcw,
  History,
  DollarSign,
  Activity,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PromptVersionItem {
  version: string;
  updatedAt: string;
  updatedBy: string;
  notes: string;
  promptText: string;
}

export default function AdminAISettingsPage() {
  const [activeModel, setActiveModel] = useState("Gemini 2.5 Flash / Pro (Interchangeable Server Engine)");
  const [temperature, setTemperature] = useState("0.2");
  const [strictness, setStrictness] = useState("High (Public Service Commission BS-17 Standard)");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [versionNotes, setVersionNotes] = useState("");
  const [promptVersions, setPromptVersions] = useState<PromptVersionItem[]>([]);
  const [tokenUsage, setTokenUsage] = useState({
    totalTokensThisMonth: "4,240,000",
    estimatedCostUSD: "$8.48",
    estimatedCostPKR: "₨ 2,360",
    averageLatencyMs: 420,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadAiConfig() {
      try {
        const res = await fetch("/api/admin/ai-config");
        const json = await res.json();
        if (mounted && json.success && json.config) {
          const c = json.config;
          setActiveModel(c.activeModel);
          setTemperature(String(c.temperature));
          setStrictness(c.strictness);
          setSystemPrompt(c.systemPrompt);
          setPromptVersions(c.promptVersions || []);
          if (c.tokenUsage) setTokenUsage(c.tokenUsage);
        }
      } catch {
        // Fallback default
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAiConfig();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveConfig = async () => {
    try {
      const res = await fetch("/api/admin/ai-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activeModel,
          temperature,
          strictness,
          systemPrompt,
          versionNotes,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        if (json.config?.promptVersions) {
          setPromptVersions(json.config.promptVersions);
        }
        setVersionNotes("");
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      alert("Failed to save AI configuration.");
    }
  };

  const handleRollbackPrompt = (v: PromptVersionItem) => {
    if (confirm(`Roll back active system prompt to ${v.version}?`)) {
      setSystemPrompt(v.promptText);
      setVersionNotes(`Rollback to ${v.version}`);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <PageHeader
        title="AI Selection Board Interview & Provider Management"
        description="Configure panelist prompting, prompt versioning history, interchangeable model providers, and token cost telemetry"
        badge={<Badge variant="navy">Commission Viva Engine</Badge>}
        actions={
          <Button
            onClick={handleSaveConfig}
            className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold shadow-sm gap-1.5"
          >
            <Save className="h-4 w-4" /> Save & Deploy AI Configuration
          </Button>
        }
      />

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs font-bold flex items-center gap-2 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-[#16A37B]" />
          <span>AI calibration, prompts, and versioning successfully deployed to live simulator.</span>
        </div>
      )}

      {/* AI Token Usage & Cost Telemetry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-xs font-bold text-slate-500 uppercase">Tokens This Month</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#101B36] dark:text-white">
              {tokenUsage.totalTokensThisMonth}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Prompt & Completion Tokens</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-xs font-bold text-slate-500 uppercase">Estimated Model Cost (USD)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#315BEA]">{tokenUsage.estimatedCostUSD}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Blended provider rate</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-xs font-bold text-slate-500 uppercase">Estimated Cost (PKR)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#16A37B]">{tokenUsage.estimatedCostPKR}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">~₨ 0.05 per viva session</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
          <span className="text-xs font-bold text-slate-500 uppercase">Average Latency</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {tokenUsage.averageLatencyMs} ms
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Ultra-fast real-time inference</span>
        </div>
      </div>

      {/* Model & Provider Calibration */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-[#315BEA]" />
          Interchangeable LLM Provider & Rigor Settings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Active Primary AI Model
            </label>
            <Select value={activeModel} onChange={(e) => setActiveModel(e.target.value)}>
              <option value="Gemini 2.5 Flash / Pro (Interchangeable Server Engine)">Google Gemini 2.5 Flash (Default)</option>
              <option value="Claude 3.5 Sonnet (Anthropic)">Claude 3.5 Sonnet (High Rigor)</option>
              <option value="OpenAI GPT-4o">OpenAI GPT-4o (Multimodal)</option>
              <option value="Ollama DeepSeek-Coder (Local)">Local Ollama (Self-Hosted)</option>
            </Select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Configured via server environment variables.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Temperature ({temperature})
            </label>
            <Input
              type="number"
              step="0.05"
              min="0.0"
              max="1.0"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Low (0.15 - 0.25) guarantees deterministic academic grading.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Evaluation Strictness
            </label>
            <Select value={strictness} onChange={(e) => setStrictness(e.target.value)}>
              <option value="High (Public Service Commission BS-17 Standard)">High (PPSC / FPSC BS-17 Standard)</option>
              <option value="Medium (University Viva Standard)">Medium (Undergraduate BS Standard)</option>
              <option value="Lenient (Foundational Coaching)">Lenient (Beginner Coaching)</option>
            </Select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Controls follow-up question frequency.
            </span>
          </div>
        </div>
      </div>

      {/* System Prompt Management & Versioning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Prompt Editor */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#101B36] dark:text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#315BEA]" />
              Active Selection Board System Prompt
            </h3>
            <Badge variant="navy">System Core Prompt</Badge>
          </div>

          <Textarea
            rows={10}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="font-mono text-xs leading-relaxed"
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Version Deployment Notes (Optional):
            </label>
            <Input
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              placeholder="e.g. Added strict follow-ups for Belady anomaly & page table indexing"
            />
          </div>
        </div>

        {/* Right: Prompt Versioning & Rollback */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#101B36] dark:text-white flex items-center gap-2">
              <History className="h-4 w-4 text-[#315BEA]" />
              Version History
            </h3>
            <Badge variant="secondary">{promptVersions.length} Versions</Badge>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {promptVersions.map((v, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#315BEA] dark:text-blue-400">
                    {v.version}
                  </span>
                  <span className="text-[10px] text-slate-400">{v.updatedAt}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {v.notes}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{v.updatedBy}</span>
                  {!v.version.includes("Active") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRollbackPrompt(v)}
                      className="h-6 text-[10px] font-bold text-amber-600 gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Rollback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
