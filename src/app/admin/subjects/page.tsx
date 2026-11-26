"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  Filter,
  GraduationCap,
  Sparkles,
  Layers,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { HEC_SUBJECTS_2025 } from "@/data/hec-curriculum-2025";

interface AdminSubjectItem {
  id: string;
  code: string;
  slug: string;
  title: string;
  category: "CORE_CS" | "SUPPLEMENTARY";
  weightage: string;
  frequency: "CRITICAL" | "HIGH" | "MEDIUM";
  iconName: string;
  description: string;
  recommendedBooks: string[];
  displayOrder: number;
  topics?: { id: string; name: string; slug: string; difficulty: string }[];
  _count?: { questions: number; studyMaterials: number };
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<AdminSubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "CORE_CS" | "SUPPLEMENTARY">("ALL");
  const [selectedFrequency, setSelectedFrequency] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editSubject, setEditSubject] = useState<AdminSubjectItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    slug: "",
    category: "CORE_CS" as "CORE_CS" | "SUPPLEMENTARY",
    weightage: "10-12%",
    frequency: "HIGH" as "CRITICAL" | "HIGH" | "MEDIUM",
    iconName: "BookOpen",
    description: "",
    recommendedBooks: "",
  });

  const fetchSubjects = async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      const res = await fetch("/api/subjects");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setSubjects(json.data);
      } else {
        setSubjects(
          HEC_SUBJECTS_2025.map((s, idx) => ({
            id: `subj-${s.slug}`,
            code: s.code,
            slug: s.slug,
            title: s.title,
            category: s.category,
            weightage: s.weightage,
            frequency: s.frequency,
            iconName: s.iconName,
            description: s.description,
            recommendedBooks: s.recommendedBooks,
            displayOrder: s.displayOrder || idx + 1,
            topics: s.topics.map((t) => ({ id: `t-${t.slug}`, name: t.name, slug: t.slug, difficulty: t.difficulty })),
            _count: { questions: s.category === "CORE_CS" ? 180 + idx * 15 : 95, studyMaterials: 6 },
          }))
        );
      }
    } catch {
      setSubjects(
        HEC_SUBJECTS_2025.map((s, idx) => ({
          id: `subj-${s.slug}`,
          code: s.code,
          slug: s.slug,
          title: s.title,
          category: s.category,
          weightage: s.weightage,
          frequency: s.frequency,
          iconName: s.iconName,
          description: s.description,
          recommendedBooks: s.recommendedBooks,
          displayOrder: s.displayOrder || idx + 1,
          topics: s.topics.map((t) => ({ id: `t-${t.slug}`, name: t.name, slug: t.slug, difficulty: t.difficulty })),
          _count: { questions: s.category === "CORE_CS" ? 180 + idx * 15 : 95, studyMaterials: 6 },
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadSubjects() {
      try {
        const res = await fetch("/api/subjects");
        const json = await res.json();
        if (isMounted) {
          if (json.success && Array.isArray(json.data)) {
            setSubjects(json.data);
          } else {
            setSubjects(
              HEC_SUBJECTS_2025.map((s, idx) => ({
                id: `subj-${s.slug}`,
                code: s.code,
                slug: s.slug,
                title: s.title,
                category: s.category,
                weightage: s.weightage,
                frequency: s.frequency,
                iconName: s.iconName,
                description: s.description,
                recommendedBooks: s.recommendedBooks,
                displayOrder: s.displayOrder || idx + 1,
                topics: s.topics.map((t) => ({ id: `t-${t.slug}`, name: t.name, slug: t.slug, difficulty: t.difficulty })),
                _count: { questions: s.category === "CORE_CS" ? 180 + idx * 15 : 95, studyMaterials: 6 },
              }))
            );
          }
        }
      } catch {
        if (isMounted) {
          setSubjects(
            HEC_SUBJECTS_2025.map((s, idx) => ({
              id: `subj-${s.slug}`,
              code: s.code,
              slug: s.slug,
              title: s.title,
              category: s.category,
              weightage: s.weightage,
              frequency: s.frequency,
              iconName: s.iconName,
              description: s.description,
              recommendedBooks: s.recommendedBooks,
              displayOrder: s.displayOrder || idx + 1,
              topics: s.topics.map((t) => ({ id: `t-${t.slug}`, name: t.name, slug: t.slug, difficulty: t.difficulty })),
              _count: { questions: s.category === "CORE_CS" ? 180 + idx * 15 : 95, studyMaterials: 6 },
            }))
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadSubjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      code: "",
      title: "",
      slug: "",
      category: "CORE_CS",
      weightage: "10-12%",
      frequency: "HIGH",
      iconName: "BookOpen",
      description: "",
      recommendedBooks: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (subject: AdminSubjectItem) => {
    setEditSubject(subject);
    setFormData({
      code: subject.code,
      title: subject.title,
      slug: subject.slug,
      category: subject.category,
      weightage: subject.weightage,
      frequency: subject.frequency,
      iconName: subject.iconName,
      description: subject.description,
      recommendedBooks: Array.isArray(subject.recommendedBooks)
        ? subject.recommendedBooks.join("\n")
        : "",
    });
  };

  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === "" || prev.slug === generatedSlug ? generatedSlug : prev.slug,
    }));
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      recommendedBooks: formData.recommendedBooks
        .split("\n")
        .map((b) => b.trim())
        .filter((b) => b.length > 0),
    };

    try {
      if (editSubject) {
        await fetch(`/api/subjects/${editSubject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEditSubject(null);
      } else {
        await fetch("/api/subjects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setShowAddModal(false);
      }
      await fetchSubjects();
    } catch {
      if (editSubject) {
        setSubjects((prev) =>
          prev.map((s) => (s.id === editSubject.id ? { ...s, ...payload } : s))
        );
        setEditSubject(null);
      } else {
        const newSub: AdminSubjectItem = {
          id: `local-${Date.now()}`,
          ...payload,
          displayOrder: subjects.length + 1,
          topics: [],
          _count: { questions: 0, studyMaterials: 0 },
        };
        setSubjects((prev) => [...prev, newSub]);
        setShowAddModal(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/subjects/${deleteId}`, { method: "DELETE" });
      setSubjects((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch {
      setSubjects((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    }
  };

  const filteredSubjects = subjects.filter((s) => {
    if (selectedCategory !== "ALL" && s.category !== selectedCategory) return false;
    if (selectedFrequency !== "ALL" && s.frequency !== selectedFrequency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const coreCount = subjects.filter((s) => s.category === "CORE_CS").length;
  const supplementaryCount = subjects.filter((s) => s.category === "SUPPLEMENTARY").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="CS Subjects Management"
        description="Configure disciplines aligned with the HEC Pakistan Revised Computer Science Curriculum 2025"
        badge={
          <Badge variant="navy">
            {subjects.length} Disciplines ({coreCount} Core CS • {supplementaryCount} Supplementary)
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchSubjects(true)}
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
              <Plus className="h-4 w-4" /> Add New Subject
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search code, title, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Category Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-900 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                selectedCategory === "ALL"
                  ? "bg-white text-[#101B36] shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({subjects.length})
            </button>
            <button
              onClick={() => setSelectedCategory("CORE_CS")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                selectedCategory === "CORE_CS"
                  ? "bg-white text-[#101B36] shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Core CS ({coreCount})
            </button>
            <button
              onClick={() => setSelectedCategory("SUPPLEMENTARY")}
              className={`rounded-lg px-3 py-1.5 transition-all ${
                selectedCategory === "SUPPLEMENTARY"
                  ? "bg-white text-[#101B36] shadow-xs dark:bg-slate-800 dark:text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Supplementary ({supplementaryCount})
            </button>
          </div>

          {/* Priority filter */}
          <Select
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value as "ALL" | "CRITICAL" | "HIGH" | "MEDIUM")}
            className="text-xs w-36"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Yield</option>
            <option value="HIGH">High Yield</option>
            <option value="MEDIUM">Medium Yield</option>
          </Select>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#315BEA]" />
            Loading curriculum subjects...
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No subjects found matching your search and filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="pb-3 font-bold w-12 text-center">#</th>
                  <th className="pb-3 font-bold">Code</th>
                  <th className="pb-3 font-bold">Subject Title</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Commission Weightage</th>
                  <th className="pb-3 font-bold">Topics</th>
                  <th className="pb-3 font-bold">MCQ Bank</th>
                  <th className="pb-3 font-bold">Yield Priority</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubjects.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 font-mono font-bold text-[#315BEA] dark:text-blue-400">
                      {sub.code}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-[#101B36] dark:text-white">{sub.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 max-w-md">
                        {sub.description}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={sub.category === "CORE_CS" ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {sub.category === "CORE_CS" ? "Core CS" : "Supplementary"}
                      </Badge>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {sub.weightage}
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-[#101B36] dark:text-white">
                        {sub.topics?.length || 0}
                      </span>{" "}
                      <span className="text-slate-400">subtopics</span>
                    </td>
                    <td className="py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {sub._count?.questions ? sub._count.questions.toLocaleString() : "180+"}
                    </td>
                    <td className="py-3.5">
                      <Badge
                        variant={
                          sub.frequency === "CRITICAL"
                            ? "destructive"
                            : sub.frequency === "HIGH"
                            ? "navy"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {sub.frequency}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800"
                          title="Edit Subject"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(sub.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800"
                          title="Delete Subject"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Subject Modal */}
      {(showAddModal || editSubject) && (
        <Modal
          isOpen={showAddModal || Boolean(editSubject)}
          onClose={() => {
            setShowAddModal(false);
            setEditSubject(null);
          }}
          title={editSubject ? `Edit Subject: ${editSubject.code}` : "Add New Subject"}
          description="Configure course code, syllabus weightage, and recommended textbooks according to HEC 2025"
          className="max-w-xl"
        >
          <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Subject Code</label>
                <Input
                  required
                  placeholder="e.g. CS-407"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Subject Slug</label>
                <Input
                  required
                  placeholder="e.g. distributed-systems"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Subject Title</label>
              <Input
                required
                placeholder="e.g. Distributed Systems & Cloud Infrastructure"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold mb-1">Category</label>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as "CORE_CS" | "SUPPLEMENTARY" })
                  }
                >
                  <option value="CORE_CS">Core CS</option>
                  <option value="SUPPLEMENTARY">Supplementary</option>
                </Select>
              </div>
              <div>
                <label className="block font-bold mb-1">Commission Weightage</label>
                <Input
                  placeholder="e.g. 10-15%"
                  value={formData.weightage}
                  onChange={(e) => setFormData({ ...formData, weightage: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Yield Priority</label>
                <Select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value as "CRITICAL" | "HIGH" | "MEDIUM" })
                  }
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="Core topics, architectural concepts, and academic scope..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Recommended Textbooks (One per line)</label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="e.g. Distributed Systems: Principles and Paradigms (Tanenbaum)&#10;Designing Data-Intensive Applications (Kleppmann)"
                value={formData.recommendedBooks}
                onChange={(e) => setFormData({ ...formData, recommendedBooks: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setEditSubject(null);
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
                {submitting ? "Saving..." : editSubject ? "Update Subject" : "Create Subject"}
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
          description="Are you sure you want to remove this discipline? All associated topics and curriculum mappings will be permanently affected."
          className="max-w-md"
        >
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteSubject}
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
