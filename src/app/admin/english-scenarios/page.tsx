"use client";

import React, { useState } from "react";
import {
  Volume2,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Sliders,
  Radio,
  Globe,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import {
  ENGLISH_PRACTICE_SCENARIOS,
  EnglishScenario,
  EnglishScenarioKey,
} from "@/data/english-scenarios";

export default function AdminEnglishScenariosPage() {
  const [scenarios, setScenarios] = useState<EnglishScenario[]>(
    Object.values(ENGLISH_PRACTICE_SCENARIOS)
  );
  const [selectedScenario, setSelectedScenario] = useState<EnglishScenario | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    cefrTarget: "C1" as "B2" | "C1" | "C2",
    minWPM: 120,
    maxWPM: 145,
    initialQuestion: "",
    vocabulary: "",
  });

  const handleOpenEdit = (sc: EnglishScenario) => {
    setSelectedScenario(sc);
    setFormData({
      title: sc.title,
      subtitle: sc.subtitle,
      description: sc.description,
      cefrTarget: sc.cefrTarget,
      minWPM: sc.targetWPM.min,
      maxWPM: sc.targetWPM.max,
      initialQuestion: sc.initialExaminerQuestion,
      vocabulary: sc.recommendedVocabulary.join(", "),
    });
    setShowEditModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScenario) return;

    setScenarios((prev) =>
      prev.map((s) =>
        s.key === selectedScenario.key
          ? {
              ...s,
              title: formData.title,
              subtitle: formData.subtitle,
              description: formData.description,
              cefrTarget: formData.cefrTarget,
              targetWPM: { min: Number(formData.minWPM), max: Number(formData.maxWPM) },
              initialExaminerQuestion: formData.initialQuestion,
              recommendedVocabulary: formData.vocabulary
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean),
            }
          : s
      )
    );

    setShowEditModal(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <PageHeader
        title="English Lab Scenarios & Speech Rubrics"
        description="Configure oral micro-teaching scenarios, CEFR fluency benchmarks, speech cadence ranges, and required academic vocabulary"
        badge={<Badge variant="navy">Speech Engine Admin</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setSelectedScenario(scenarios[0]);
              handleOpenEdit(scenarios[0]);
            }}
            className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Custom Scenario
          </Button>
        }
      />

      {savedAlert && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 text-xs font-bold flex items-center gap-2 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-[#16A37B]" />
          <span>English scenario parameters updated successfully.</span>
        </div>
      )}

      {/* Scenarios List */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-[#101B36] dark:text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#315BEA]" />
            Active Practice Scenarios ({scenarios.length})
          </h3>
          <span className="text-xs text-slate-500">Supports Turn-Based & WebRTC Realtime</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {scenarios.map((sc) => (
            <div key={sc.key} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-[#101B36] dark:text-white">
                    {sc.title}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    CEFR {sc.cefrTarget}
                  </Badge>
                  <Badge variant="navy" className="text-[10px]">
                    {sc.targetWPM.min}-{sc.targetWPM.max} WPM
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{sc.description}</p>
                <div className="text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">Target Vocabulary:</span>{" "}
                  {sc.recommendedVocabulary.join(", ")}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(sc)}
                  className="text-xs font-bold"
                >
                  <Edit className="h-3.5 w-3.5 mr-1" /> Edit Parameters
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Scenario Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Configure Scenario: ${selectedScenario?.title}`}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Scenario Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                CEFR Target Level
              </label>
              <Select
                value={formData.cefrTarget}
                onChange={(e) =>
                  setFormData({ ...formData, cefrTarget: e.target.value as "B2" | "C1" | "C2" })
                }
              >
                <option value="B2">B2 (Vantage Professional)</option>
                <option value="C1">C1 (Effective Operational Academic)</option>
                <option value="C2">C2 (Mastery Academic)</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Cadence (WPM Range)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={formData.minWPM}
                  onChange={(e) => setFormData({ ...formData, minWPM: Number(e.target.value) })}
                  className="w-20"
                />
                <span className="text-xs text-slate-400">to</span>
                <Input
                  type="number"
                  value={formData.maxWPM}
                  onChange={(e) => setFormData({ ...formData, maxWPM: Number(e.target.value) })}
                  className="w-20"
                />
                <span className="text-xs text-slate-400">WPM</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Initial AI Question / Prompt
            </label>
            <Textarea
              value={formData.initialQuestion}
              onChange={(e) => setFormData({ ...formData, initialQuestion: e.target.value })}
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Recommended Academic Vocabulary (Comma-separated)
            </label>
            <Input
              value={formData.vocabulary}
              onChange={(e) => setFormData({ ...formData, vocabulary: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              type="submit"
              className="bg-[#315BEA] hover:bg-[#2348C9] text-white font-bold"
            >
              Save Parameters
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
