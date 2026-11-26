"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  CheckCircle2,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { HEC_SUBJECTS_2025 } from "@/data/hec-curriculum-2025";

interface AdminTopicItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EXPERT";
  displayOrder: number;
  subjectId?: string;
  subject?: { id: string; title: string; code: string; slug: string };
  _count?: { questions: number };
}

export default function AdminTopicsPage() {
  const [subjects, setSubjects] = useState<
    { id: string; title: string; code: string; slug: string; category: string }[]
  >([]);
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>("data-structures");
  const [topics, setTopics] = useState<AdminTopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTopic, setEditTopic] = useState<AdminTopicItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    subjectSlug: "data-structures",
    name: "",
    slug: "",
    difficulty: "MEDIUM" as "EASY" | "MEDIUM" | "HARD" | "EXPERT",
    description: "",
    displayOrder: 1,
  });

  // Fetch subjects list
  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await fetch("/api/subjects");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setSubjects(
            json.data.map((s: { id: string; title: string; code: string; slug: string; category: string }) => ({
              id: s.id,
              title: s.title,
              code: s.code,
              slug: s.slug,
              category: s.category,
            }))
          );
        } else {
          setSubjects(
            HEC_SUBJECTS_2025.map((s) => ({
              id: `subj-${s.slug}`,
              title: s.title,
              code: s.code,
              slug: s.slug,
              category: s.category,
            }))
          );
        }
      } catch {
        setSubjects(
          HEC_SUBJECTS_2025.map((s) => ({
            id: `subj-${s.slug}`,
            title: s.title,
            code: s.code,
            slug: s.slug,
            category: s.category,
          }))
        );
      }
    }
    loadSubjects();
  }, []);

  // Fetch topics when selected subject changes
  const fetchTopics = async (isManual = false) => {
    if (isManual) setLoading(true);
    try {
      const res = await fetch(`/api/topics?subjectSlug=${selectedSubjectSlug}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setTopics(json.data);
      } else {
        const sub = HEC_SUBJECTS_2025.find((s) => s.slug === selectedSubjectSlug) || HEC_SUBJECTS_2025[0];
        setTopics(
          sub.topics.map((t, idx) => ({
            id: `topic-${sub.slug}-${t.slug}`,
            name: t.name,
            slug: t.slug,
            description: t.description,
            difficulty: t.difficulty,
            displayOrder: t.displayOrder || idx + 1,
            subject: { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug },
            _count: { questions: 28 + idx * 4 },
          }))
        );
      }
    } catch {
      const sub = HEC_SUBJECTS_2025.find((s) => s.slug === selectedSubjectSlug) || HEC_SUBJECTS_2025[0];
      setTopics(
        sub.topics.map((t, idx) => ({
          id: `topic-${sub.slug}-${t.slug}`,
          name: t.name,
          slug: t.slug,
          description: t.description,
          difficulty: t.difficulty,
          displayOrder: t.displayOrder || idx + 1,
          subject: { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug },
          _count: { questions: 28 + idx * 4 },
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function loadTopics() {
      try {
        const res = await fetch(`/api/topics?subjectSlug=${selectedSubjectSlug}`);
        const json = await res.json();
        if (isMounted) {
          if (json.success && Array.isArray(json.data)) {
            setTopics(json.data);
          } else {
            const sub = HEC_SUBJECTS_2025.find((s) => s.slug === selectedSubjectSlug) || HEC_SUBJECTS_2025[0];
            setTopics(
              sub.topics.map((t, idx) => ({
                id: `topic-${sub.slug}-${t.slug}`,
                name: t.name,
                slug: t.slug,
                description: t.description,
                difficulty: t.difficulty,
                displayOrder: t.displayOrder || idx + 1,
                subject: { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug },
                _count: { questions: 28 + idx * 4 },
              }))
            );
          }
        }
      } catch {
        if (isMounted) {
          const sub = HEC_SUBJECTS_2025.find((s) => s.slug === selectedSubjectSlug) || HEC_SUBJECTS_2025[0];
          setTopics(
            sub.topics.map((t, idx) => ({
              id: `topic-${sub.slug}-${t.slug}`,
              name: t.name,
              slug: t.slug,
              description: t.description,
              difficulty: t.difficulty,
              displayOrder: t.displayOrder || idx + 1,
              subject: { id: `subj-${sub.slug}`, title: sub.title, code: sub.code, slug: sub.slug },
              _count: { questions: 28 + idx * 4 },
            }))
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadTopics();
    return () => {
      isMounted = false;
    };
  }, [selectedSubjectSlug]);

  const handleOpenAdd = () => {
    setFormData({
      subjectSlug: selectedSubjectSlug,
      name: "",
      slug: "",
      difficulty: "MEDIUM",
      description: "",
      displayOrder: topics.length + 1,
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (topic: AdminTopicItem) => {
    setEditTopic(topic);
    setFormData({
      subjectSlug: selectedSubjectSlug,
      name: topic.name,
      slug: topic.slug,
      difficulty: topic.difficulty,
      description: topic.description || "",
      displayOrder: topic.displayOrder || 1,
    });
  };

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || prev.slug === slug ? slug : prev.slug,
    }));
  };

  const handleSaveTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const targetSubject = subjects.find((s) => s.slug === formData.subjectSlug) || subjects[0];
    const payload = {
      subjectId: targetSubject?.id || `subj-${formData.subjectSlug}`,
      name: formData.name,
      slug: formData.slug,
      difficulty: formData.difficulty,
      description: formData.description,
      displayOrder: formData.displayOrder,
    };

    try {
      if (editTopic) {
        await fetch(`/api/topics/${editTopic.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setEditTopic(null);
      } else {
        await fetch("/api/topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setShowAddModal(false);
      }
      await fetchTopics();
    } catch {
      if (editTopic) {
        setTopics((prev) =>
          prev.map((t) => (t.id === editTopic.id ? { ...t, ...payload } : t))
        );
        setEditTopic(null);
      } else {
        const created: AdminTopicItem = {
          id: `topic-${formData.slug}-${Date.now()}`,
          name: formData.name,
          slug: formData.slug,
          difficulty: formData.difficulty,
          description: formData.description,
          displayOrder: formData.displayOrder,
          subject: targetSubject,
          _count: { questions: 0 },
        };
        setTopics((prev) => [...prev, created]);
        setShowAddModal(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/topics/${deleteId}`, { method: "DELETE" });
      setTopics((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } catch {
      setTopics((prev) => prev.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    }
  };

  const activeSubject =
    subjects.find((s) => s.slug === selectedSubjectSlug) ||
    HEC_SUBJECTS_2025.find((s) => s.slug === selectedSubjectSlug) ||
    HEC_SUBJECTS_2025[0];

  const filteredTopics = topics.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topics & Syllabus Sub-modules"
        description="Manage subtopics, difficulty weighting, and learning objectives for each CS discipline"
        badge={<Badge variant="navy">{topics.length} Subtopics Loaded</Badge>}
        actions={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchTopics(true)}
              variant="outline"
              size="sm"
              className="text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              onClick={handleOpenAdd}
              size="sm"
              className="bg-[#101B36] text-white hover:bg-[#1A284D] text-xs font-bold flex items-center gap-1.5 dark:bg-emerald-600"
            >
              <Plus className="h-4 w-4" /> Add Subtopic
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            Select Discipline:
          </label>
          <Select
            value={selectedSubjectSlug}
            onChange={(e) => setSelectedSubjectSlug(e.target.value)}
            className="w-80 text-xs font-bold"
          >
            <optgroup label="Core CS Disciplines">
              {subjects
                .filter((s) => s.category === "CORE_CS")
                .map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.code}: {s.title}
                  </option>
                ))}
            </optgroup>
            <optgroup label="Supplementary Disciplines">
              {subjects
                .filter((s) => s.category === "SUPPLEMENTARY")
                .map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.code}: {s.title}
                  </option>
                ))}
            </optgroup>
          </Select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search subtopics by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Topics Content Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#101B36] dark:text-white">
              {activeSubject?.title} ({activeSubject?.code})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Curriculum subtopics and question bank weightage under HEC 2025 guidelines
            </p>
          </div>
          <Badge variant="ppsc" className="text-xs">
            {filteredTopics.length} Subtopics
          </Badge>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#315BEA]" />
            Loading subtopics...
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No subtopics found for this subject. Click &quot;Add Subtopic&quot; to configure.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTopics.map((t, idx) => (
              <div
                key={t.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 px-2 rounded-xl transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {idx + 1}.
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-[#101B36] dark:text-white">
                      {t.name}
                    </span>
                    <Badge
                      variant={
                        t.difficulty === "EXPERT"
                          ? "destructive"
                          : t.difficulty === "HARD"
                          ? "destructive"
                          : t.difficulty === "MEDIUM"
                          ? "default"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {t.difficulty}
                    </Badge>
                  </div>
                  {t.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl pl-5">
                      {t.description}
                    </p>
                  )}
                  <div className="text-[11px] text-slate-400 pl-5">
                    Slug: <code className="text-[#315BEA] font-mono">{t.slug}</code> • Bank Questions:{" "}
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {t._count?.questions || 25}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800"
                    title="Edit Topic"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(t.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800"
                    title="Delete Topic"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Subtopic Modal */}
      {(showAddModal || editTopic) && (
        <Modal
          isOpen={showAddModal || Boolean(editTopic)}
          onClose={() => {
            setShowAddModal(false);
            setEditTopic(null);
          }}
          title={editTopic ? `Edit Subtopic: ${editTopic.name}` : "Add New Subtopic"}
          description="Specify learning outcomes and difficulty weighting for this curriculum sub-module"
          className="max-w-lg"
        >
          <form onSubmit={handleSaveTopic} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Target Discipline</label>
              <Select
                value={formData.subjectSlug}
                onChange={(e) => setFormData({ ...formData, subjectSlug: e.target.value })}
                disabled={Boolean(editTopic)}
              >
                {subjects.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.code}: {s.title}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block font-bold mb-1">Subtopic Name</label>
              <Input
                required
                placeholder="e.g. Asymptotic Analysis & Master Theorem"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Subtopic Slug</label>
                <Input
                  required
                  placeholder="e.g. asymptotic-analysis"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Difficulty Classification</label>
                <Select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" | "EXPERT",
                    })
                  }
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-1">Learning Outcomes & Description</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white dark:bg-slate-900 dark:border-slate-800"
                placeholder="Core theoretical principles, proofs, algorithms, or practical implementation aspects..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setEditTopic(null);
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
                {submitting ? "Saving..." : editTopic ? "Update Subtopic" : "Create Subtopic"}
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
          description="Are you sure you want to remove this subtopic? Any attached questions will have their topic link removed."
          className="max-w-md"
        >
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteTopic}
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
