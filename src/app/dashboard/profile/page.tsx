"use client";

import React, { useState } from "react";
import { MapPin, GraduationCap, Award, FileText, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { useAuth, UserProfile } from "@/lib/auth/auth-context";
import { CURRENT_CANDIDATE } from "@/data/mock-data";

export default function CandidateProfilePage() {
  const { profile: authProfile, updateProfile } = useAuth();

  return (
    <CandidateProfileForm
      key={authProfile?.id || "initial"}
      initialProfile={authProfile}
      onUpdate={updateProfile}
    />
  );
}

function CandidateProfileForm({
  initialProfile,
  onUpdate,
}: {
  initialProfile: UserProfile | null;
  onUpdate: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}) {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: initialProfile?.fullName || CURRENT_CANDIDATE.name,
    email: initialProfile?.email || "hamza.farooq@example.com",
    phone: initialProfile?.phone || "+92 301 4567890",
    city: initialProfile?.city || "Lahore, Punjab",
    cnic: "35201-XXXXXXX-X",
    targetCommission: initialProfile?.targetCommission || "PPSC",
    highestDegree: initialProfile?.highestDegree || "MS Computer Science",
    university: initialProfile?.university || "National University of Computer & Emerging Sciences (FAST-NUCES)",
    graduationYear: initialProfile?.graduationYear || 2023,
    cgpa: initialProfile?.cgpa ? String(initialProfile.cgpa) : "3.72",
    thesisTopic: initialProfile?.thesisTopic || "Distributed Consensus in Partitioned Microservice Architectures",
    teachingExperienceYears: initialProfile?.experienceYears || "2 Years (Visiting Lecturer)",
    bio: initialProfile?.bio || "Passionate computer scientist aiming for BPS-17 Lecturer in Punjab Higher Education Department.",
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({
      fullName: profile.name,
      phone: profile.phone,
      city: profile.city,
      targetCommission: profile.targetCommission,
      highestDegree: profile.highestDegree,
      university: profile.university,
      thesisTopic: profile.thesisTopic,
      bio: profile.bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Profile & Credentials"
        description="Your academic portfolio and commission verification details"
        badge={<Badge variant="ppsc">PPSC Aspirant</Badge>}
        breadcrumbs={[{ label: "Profile & Credentials" }]}
        actions={
          <Button
            onClick={handleSave}
            className="bg-[#315BEA] hover:bg-[#2348C9] text-white flex items-center gap-1.5 text-xs font-bold"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile</span>
          </Button>
        }
      />

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Profile changes saved successfully. Updated in Commission Viva Dossier.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#101B36] text-white text-2xl font-black shadow-lg dark:bg-[#315BEA]">
              {profile.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#101B36] dark:text-white">
              {profile.name}
            </h2>
            <p className="text-xs text-slate-500">{profile.email}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="success">Verified Candidate</Badge>
              <Badge variant="navy">BPS-17 Ready</Badge>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Domicile:
                </span>
                <span className="font-bold text-[#101B36] dark:text-white">Punjab</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> Degree:
                </span>
                <span className="font-bold text-[#101B36] dark:text-white">{profile.highestDegree}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" /> CGPA:
                </span>
                <span className="font-bold text-[#16A37B]">{profile.cgpa} / 4.0</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36]">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Academic CV & Viva Dossier
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Upload your CV so the AI Selection Board can ask customized questions on your MPhil thesis and research publications.
            </p>
            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 text-center hover:border-[#315BEA] transition-colors cursor-pointer bg-slate-50 dark:bg-[#0B1120]">
              <FileText className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-2 text-xs font-bold text-[#315BEA]">Upload Updated CV (PDF)</p>
              <p className="text-[10px] text-slate-400 mt-1">Current: Hamza_Farooq_CV_2026.pdf</p>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Editable Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
            <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CNIC Number (Verification)
                </label>
                <Input
                  value={profile.cnic}
                  onChange={(e) => setProfile({ ...profile, cnic: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Contact Number
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#101B36] space-y-4">
            <h3 className="text-sm font-bold text-[#101B36] dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Academic Background & Research Thesis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Degree Specialization
                </label>
                <Input
                  value={profile.highestDegree}
                  onChange={(e) => setProfile({ ...profile, highestDegree: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Degree Awarding University (HEC Recognized)
                </label>
                <Input
                  value={profile.university}
                  onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CGPA / Percentage
                </label>
                <Input
                  value={profile.cgpa}
                  onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Passing / Graduation Year
                </label>
                <Input
                  value={profile.graduationYear}
                  onChange={(e) => setProfile({ ...profile, graduationYear: Number(e.target.value) || 2023 })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                MS / MPhil Research Thesis Title
              </label>
              <Input
                value={profile.thesisTopic}
                onChange={(e) => setProfile({ ...profile, thesisTopic: e.target.value })}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                The AI panelist will conduct cross-examination on your methodology and research contributions based on this topic.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prior Teaching / Industry Experience
              </label>
              <Input
                value={profile.teachingExperienceYears}
                onChange={(e) => setProfile({ ...profile, teachingExperienceYears: e.target.value })}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
