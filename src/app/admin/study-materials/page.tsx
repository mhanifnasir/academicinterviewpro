"use client";

import React, { useState, useEffect } from "react";
import {
  FolderDown,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  FileText,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";

interface StudyMaterialItem {
  id: string;
  title: string;
  category: "PAST_PAPER" | "CURRICULUM" | "FORMULA_SHEET" | "VIVA_HANDBOOK";
  commission: string;
  year: string;
  subjectTitle?: string;
  fileUrl: string;
  fileSize: string;
  format: string;
  downloads?: number;
}

export default function AdminStudyMaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterialItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [commissionFilter, setCommissionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // New Material Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<StudyMaterialItem["category"]>("PAST_PAPER");
  const [newCommission, setNewCommission] = useState("PPSC");
  const [newYear, setNewYear] = useState("2026");
  const [newFileUrl, setNewFileUrl] = useState("/downloads/sample.pdf");
  const [newFileSize, setNewFileSize] = useState("3.4 MB");

  useEffect(() => {
    let mounted = true;
    async function loadMaterials() {
      try {
        const res = await fetch("/api/admin/study-materials");
        const json = await res.json();
        if (mounted && json.success && Array.isArray(json.materials)) {
          setMaterials(json.materials);
        }
      } catch {
        // Fallback
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMaterials();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/admin/study-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          commission: newCommission,
          year: newYear,
          fileUrl: newFileUrl,
          fileSize: newFileSize,
        }),
      });

      const json = await res.json();
      if (json.success && json.material) {
        setMaterials((prev) => [json.material, ...prev]);
        setIsModalOpen(false);
        setNewTitle("");
      }
    } catch {
      alert("Failed to create study material.");
    }
  };

  const filtered = materials.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || m.category === categoryFilter;
    const matchComm = commissionFilter === "ALL" || m.commission === commissionFilter || m.commission === "ALL";
    return matchSearch && matchCat && matchComm;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Study Materials & Past Papers Repository"
        description="Publish solved past papers (2015-2025), HEC curriculum guides, and technical viva handbooks"
        badge={<Badge variant="navy">{materials.length} Active Documents</Badge>}
        actions={
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#315BEA] hover:bg-[#2348C9] text-white text-xs font-bold gap-1.5"
          >
            <Plus className="h-4 w-4" /> Publish Material
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search papers, handbooks, guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs h-9 w-44"
          >
            <option value="ALL">All Categories</option>
            <option value="PAST_PAPER">Past Papers</option>
            <option value="CURRICULUM">Curriculum Guides</option>
            <option value="VIVA_HANDBOOK">Viva Handbooks</option>
            <option value="FORMULA_SHEET">Formula Sheets</option>
          </Select>

          <Select
            value={commissionFilter}
            onChange={(e) => setCommissionFilter(e.target.value)}
            className="text-xs h-9 w-36"
          >
            <option value="ALL">All Boards</option>
            <option value="PPSC">PPSC</option>
            <option value="FPSC">FPSC</option>
            <option value="SPSC">SPSC</option>
            <option value="KPPSC">KPPSC</option>
            <option value="BPSC">BPSC</option>
          </Select>
        </div>
      </div>

      {/* Materials Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-bold">Document Title</th>
                <th className="pb-3 font-bold">Category</th>
                <th className="pb-3 font-bold">Commission</th>
                <th className="pb-3 font-bold">Recruitment Year</th>
                <th className="pb-3 font-bold">Size & Format</th>
                <th className="pb-3 font-bold">Downloads</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3 font-bold text-slate-900 dark:text-slate-100 max-w-sm">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-[#315BEA] shrink-0 mt-0.5" />
                      <span>{mat.title}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant="secondary">{mat.category.replace("_", " ")}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="ppsc">{mat.commission}</Badge>
                  </td>
                  <td className="py-3 text-slate-500 font-semibold">{mat.year || "2026"}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">
                    {mat.fileSize} ({mat.format})
                  </td>
                  <td className="py-3 font-black text-slate-700 dark:text-slate-300">
                    {(mat.downloads || 1240).toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <a
                      href={mat.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#315BEA] hover:underline font-bold"
                    >
                      <span>Preview</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish New Academic Study Resource"
      >
        <form onSubmit={handleCreateMaterial} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Document Title:
            </label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. SPSC CS Lecturer 2024 Solved Screening Paper"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Category:
              </label>
              <Select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as StudyMaterialItem["category"])}
              >
                <option value="PAST_PAPER">Past Paper</option>
                <option value="CURRICULUM">Curriculum</option>
                <option value="VIVA_HANDBOOK">Viva Handbook</option>
                <option value="FORMULA_SHEET">Formula Sheet</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Target Commission:
              </label>
              <Select
                value={newCommission}
                onChange={(e) => setNewCommission(e.target.value)}
              >
                <option value="ALL">All Commissions</option>
                <option value="PPSC">PPSC (Punjab)</option>
                <option value="FPSC">FPSC (Federal)</option>
                <option value="SPSC">SPSC (Sindh)</option>
                <option value="KPPSC">KPPSC (KPK)</option>
                <option value="BPSC">BPSC (Balochistan)</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Year:
              </label>
              <Input
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                placeholder="2026"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Estimated File Size:
              </label>
              <Input
                value={newFileSize}
                onChange={(e) => setNewFileSize(e.target.value)}
                placeholder="4.2 MB"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              File Storage Path / URL:
            </label>
            <Input
              value={newFileUrl}
              onChange={(e) => setNewFileUrl(e.target.value)}
              placeholder="/downloads/curriculum-spec.pdf"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" className="bg-[#315BEA] text-white text-xs font-bold">
              Publish Material
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
