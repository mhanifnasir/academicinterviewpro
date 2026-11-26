"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  Edit,
  Trash2,
  RefreshCw,
  Sliders,
  AlertCircle,
  HelpCircle,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { STANDARD_EXAM_TEMPLATES, ExamTemplateConfig } from "@/data/mock-templates";
import { HEC_SUBJECTS_2025 } from "@/data/hec-curriculum-2025";

export default function AdminMockTestsPage() {
  const [templates, setTemplates] = useState<ExamTemplateConfig[]>(STANDARD_EXAM_TEMPLATES);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTemplate, setEditTemplate] = useState<ExamTemplateConfig | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    commission: "PPSC" as "PPSC" | "FPSC" | "SPSC" | "KPPSC" | "BPSC" | "CUSTOM",
    questionCount: 100,
    durationMinutes: 90,
    totalMarks: 100,
    negativeMarkingRate: 0.25,
    description: "",
    subjectDistribution: {} as Record<string, number>,
    easyPercent: 20,
    mediumPercent: 55,
    hardPercent: 20,
    expertPercent: 5,
  });

  const fetchTemplates = async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      const res = await fetch("/api/mock-tests/templates");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setTemplates(json.data);
      } else {
        setTemplates(STANDARD_EXAM_TEMPLATES);
      }
    } catch {
      setTemplates(STANDARD_EXAM_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const res = await fetch("/api/mock-tests/templates");
        const json = await res.json();
        if (isMounted) {
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setTemplates(json.data);
          } else {
            setTemplates(STANDARD_EXAM_TEMPLATES);
          }
        }
      } catch {
        if (isMounted) setTemplates(STANDARD_EXAM_TEMPLATES);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    const defaultDist: Record<string, number> = {};
    HEC_SUBJECTS_2025.slice(0, 10).forEach((s) => {
      defaultDist[s.slug] = 10;
    });

    setFormData({
      title: "",
      slug: "",
      commission: "PPSC",
      questionCount: 100,
      durationMinutes: 90,
      totalMarks: 100,
      negativeMarkingRate: 0.25,
      description: "",
      subjectDistribution: defaultDist,
      easyPercent: 20,
      mediumPercent: 55,
      hardPercent: 20,
      expertPercent: 5,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (tmpl: ExamTemplateConfig) => {
    setEditTemplate(tmpl);
    setFormData({
      title: tmpl.title,
      slug: tmpl.slug,
      commission: tmpl.commission,
      questionCount: tmpl.questionCount,
      durationMinutes: tmpl.durationMinutes,
      totalMarks: tmpl.totalMarks,
      negativeMarkingRate: tmpl.negativeMarkingRate,
      description: tmpl.description || "",
      subjectDistribution: tmpl.subjectRatio || {},
      easyPercent: tmpl.difficultyRatio?.EASY || 20,
      mediumPercent: tmpl.difficultyRatio?.MEDIUM || 50,
      hardPercent: tmpl.difficultyRatio?.HARD || 25,
      expertPercent: tmpl.difficultyRatio?.EXPERT || 5,
    });
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === slug ? slug : prev.slug,
    }));
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      commission: formData.commission,
      type: "MOCK" as const,
      questionCount: Number(formData.questionCount),
      durationMinutes: Number(formData.durationMinutes),
      totalMarks: Number(formData.totalMarks),
      negativeMarkingRate: Number(formData.negativeMarkingRate),
      description: formData.description,
      subjectRatioJson: formData.subjectDistribution,
      difficultyRatioJson: {
        EASY: formData.easyPercent,
        MEDIUM: formData.mediumPercent,
        HARD: formData.hardPercent,
        EXPERT: formData.expertPercent,
      },
      isActive: true,
    };

    try {
      if (editTemplate) {
        await fetch(`/api/mock-tests/templates/${editTemplate.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEditTemplate(null);
      } else {
        await fetch("/api/mock-tests/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setShowAddModal(false);
      }
      await fetchTemplates(true);
    } catch {
      // Local fallback
      if (editTemplate) {
        setTemplates((prev) =>
          prev.map((t) => (t.id === editTemplate.id ? { ...t, ...payload, subjectRatio: payload.subjectRatioJson, difficultyRatio: payload.difficultyRatioJson } : t))
        );
        setEditTemplate(null);
      } else {
        const created: ExamTemplateConfig = {
          id: `tmpl-${formData.slug}`,
          ...payload,
          subjectRatio: payload.subjectRatioJson,
          difficultyRatio: payload.difficultyRatioJson,
          instructions: ["Standard Examination Rules Apply."],
        };
        setTemplates((prev) => [created, ...prev]);
        setShowAddModal(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTemplate = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/mock-tests/templates/${deleteId}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch {
      setTemplates((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mock Tests & Examination Templates"
        description="Configure blueprints, duration, negative deductions, and syllabus distributions for 30Q, 50Q, 100Q, and custom tests"
        badge={<Badge variant="navy">{templates.length} Templates Configured</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchTemplates(true)}
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="bg-[#101B36] hover:bg-[#1A284D] text-white text-xs font-bold flex items-center gap-1.5 dark:bg-emerald-600"
            >
              <Plus className="h-4 w-4" /> Create New Examination Template
            </Button>
          </div>
        }
      />

      {/* Grid of Configured Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((t) => {
          const negVal = Number(t.negativeMarkingRate || 0);
          return (
            <div
              key={t.id || t.slug}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={t.commission === "PPSC" ? "ppsc" : t.commission === "FPSC" ? "fpsc" : "navy"}>
                    {t.commission} Standard
                  </Badge>
                  <span className="text-xs font-mono font-bold text-[#315BEA]">
                    {t.questionCount} Questions
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#101B36] dark:text-white leading-snug">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {t.description}
                </p>

                {/* Specs Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-bold text-[#101B36] dark:text-white flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#315BEA]" /> {t.durationMinutes} Minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Marks:</span>
                    <span className="font-bold text-[#101B36] dark:text-white">{t.totalMarks} Marks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Negative Penalty:</span>
                    <span
                      className={`font-bold ${
                        negVal > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {negVal > 0 ? `-${negVal.toFixed(2)} / wrong` : "No Negative Marking"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Difficulty Curve:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {t.difficultyRatio?.MEDIUM || 50}% Med • {t.difficultyRatio?.HARD || 25}% Hard
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="text-xs font-bold text-[#315BEA] hover:underline flex items-center gap-1"
                >
                  <Edit className="h-3.5 w-3.5" /> Edit Configuration
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800"
                  title="Delete Template"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Examination Template Modal */}
      {(showAddModal || editTemplate) && (
        <Modal
          isOpen={showAddModal || Boolean(editTemplate)}
          onClose={() => {
            setShowAddModal(false);
            setEditTemplate(null);
          }}
          title={editTemplate ? `Configure Template: ${editTemplate.title}` : "Create Examination Template"}
          description="Define test duration, question quota, negative marking penalties, and subject breakdown"
          className="max-w-2xl"
        >
          <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Examination Title</label>
                <Input
                  required
                  placeholder="e.g. PPSC CS Lecturer 100-Mark Official Mock"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Template Slug</label>
                <Input
                  required
                  placeholder="e.g. ppsc-cs-100-standard"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block font-bold mb-1">Commission Scheme</label>
                <Select
                  value={formData.commission}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commission: e.target.value as "PPSC" | "FPSC" | "SPSC" | "KPPSC" | "CUSTOM",
                    })
                  }
                >
                  <option value="PPSC">PPSC (Punjab)</option>
                  <option value="FPSC">FPSC (Federal)</option>
                  <option value="SPSC">SPSC (Sindh)</option>
                  <option value="KPPSC">KPPSC (KPK)</option>
                  <option value="CUSTOM">Custom Sprint</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Questions</label>
                <Select
                  value={String(formData.questionCount)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      questionCount: Number(e.target.value),
                      totalMarks: Number(e.target.value),
                    })
                  }
                >
                  <option value="30">30 Questions</option>
                  <option value="50">50 Questions</option>
                  <option value="100">100 Questions</option>
                  <option value="120">120 Questions</option>
                </Select>
              </div>

              <div>
                <label className="block font-bold mb-1">Duration (Mins)</label>
                <Input
                  type="number"
                  required
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Negative Penalty</label>
                <Select
                  value={String(formData.negativeMarkingRate)}
                  onChange={(e) => setFormData({ ...formData, negativeMarkingRate: Number(e.target.value) })}
                >
                  <option value="0.25">-0.25 (PPSC/SPSC)</option>
                  <option value="0.0">0.00 (FPSC - None)</option>
                  <option value="0.33">-0.33 (One-third)</option>
                  <option value="0.5">-0.50 (Half mark)</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Description & Target Aspirants</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="Target candidates, syllabus alignment, and test strategy..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Subject Distribution Allocator */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-[#315BEA]" /> Subject Quota Distribution (Questions per Subject)
                </span>
                <span className="text-[11px] text-[#315BEA]">
                  Sum: {Object.values(formData.subjectDistribution).reduce((a, b) => a + Number(b || 0), 0)} / {formData.questionCount}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {HEC_SUBJECTS_2025.slice(0, 12).map((sub) => (
                  <div key={sub.slug} className="flex items-center justify-between p-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700">
                    <span className="truncate pr-1">{sub.code}: {sub.title}</span>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      className="w-12 text-center p-1 font-bold border rounded bg-slate-50 dark:bg-slate-900"
                      value={formData.subjectDistribution[sub.slug] ?? 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subjectDistribution: {
                            ...formData.subjectDistribution,
                            [sub.slug]: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty Curve Allocator */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="font-bold flex items-center justify-between">
                <span>Difficulty Ratio Percentage:</span>
                <span className="text-[11px] text-slate-500">
                  Total: {formData.easyPercent + formData.mediumPercent + formData.hardPercent + formData.expertPercent}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Easy (%)</label>
                  <Input
                    type="number"
                    value={formData.easyPercent}
                    onChange={(e) => setFormData({ ...formData, easyPercent: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Medium (%)</label>
                  <Input
                    type="number"
                    value={formData.mediumPercent}
                    onChange={(e) => setFormData({ ...formData, mediumPercent: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Hard (%)</label>
                  <Input
                    type="number"
                    value={formData.hardPercent}
                    onChange={(e) => setFormData({ ...formData, hardPercent: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Expert (%)</label>
                  <Input
                    type="number"
                    value={formData.expertPercent}
                    onChange={(e) => setFormData({ ...formData, expertPercent: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setEditTemplate(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={submitting}
                className="bg-[#101B36] text-white hover:bg-[#1A284D] dark:bg-emerald-600 font-bold"
              >
                {submitting ? "Saving..." : editTemplate ? "Update Template" : "Save Examination Template"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          title="Confirm Deletion"
          description="Are you sure you want to remove this examination template?"
          className="max-w-md"
        >
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteTemplate}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Confirm Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
