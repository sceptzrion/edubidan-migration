"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ModuleDetailBackButton } from "@/components/dashboard/student/modules/detail/ModuleDetailBackButton";
import { ModuleDetailToolbar } from "@/components/dashboard/student/modules/detail/ModuleDetailToolbar";
import { ModuleEvaluationTab } from "@/components/dashboard/student/modules/detail/ModuleEvaluationTab";
import { ModuleLearningTab } from "@/components/dashboard/student/modules/detail/ModuleLearningTab";
import { ModuleParticipantsTab } from "@/components/dashboard/student/modules/detail/ModuleParticipantsTab";
import { ModuleDetailHeader } from "@/components/dashboard/student/modules/ModuleDetailHeader";
import type { DetailTab } from "@/components/dashboard/student/modules/detail/ModuleDetailTabs";
import {
  getLearningModule,
  getModuleContentSummary,
} from "@/data/learning/shared/learning-modules";

export default function StudentModuleDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const moduleId = Number(params.id);
  const module = getLearningModule(moduleId);

  const [tab, setTab] = useState<DetailTab>("pembelajaran");
  const [searchQuery, setSearchQuery] = useState("");

  const keyword = searchQuery.trim().toLowerCase();

  const filteredLearningItems = useMemo(() => {
    if (!module) return [];

    if (!keyword) return module.items;

    return module.items.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
  }, [keyword, module]);

  const filteredQuizItems = useMemo(() => {
    if (!module) return [];

    return module.items.filter((item) => {
      const isQuiz = item.kind === "kuis";
      const matchKeyword = keyword
        ? item.title.toLowerCase().includes(keyword)
        : true;

      return isQuiz && matchKeyword;
    });
  }, [keyword, module]);

  const filteredParticipants = useMemo(() => {
    if (!module) return [];

    if (!keyword) return module.participants;

    return module.participants.filter((participant) => {
      return (
        participant.name.toLowerCase().includes(keyword) ||
        participant.email.toLowerCase().includes(keyword)
      );
    });
  }, [keyword, module]);

  if (!module) {
    return (
      <div className="bg-card rounded-3xl border border-border p-8 text-center">
        <h1 className="text-xl font-extrabold text-foreground mb-2">
          Modul tidak ditemukan
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Modul yang Anda buka tidak tersedia atau belum terdaftar.
        </p>

        <button
          type="button"
          onClick={() => router.push("/dashboard/modules")}
          className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-extrabold"
        >
          Kembali ke Daftar Modul
        </button>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <ModuleDetailBackButton />

      <ModuleDetailHeader
        info={{
          banner: module.banner,
          title: module.title,
          progress: module.progress,
          description: module.description,
          estimatedTime: module.estimatedTime,
          contentSummary: getModuleContentSummary(module.items),
          objectives: module.objectives,
          instructor: module.instructor,
        }}
      />

      <ModuleDetailToolbar
        activeTab={tab}
        searchQuery={searchQuery}
        onTabChange={setTab}
        onSearchChange={setSearchQuery}
      />

      {tab === "pembelajaran" && (
        <ModuleLearningTab
          moduleId={module.id}
          items={filteredLearningItems}
        />
      )}

      {tab === "evaluasi" && (
        <ModuleEvaluationTab moduleId={module.id} items={filteredQuizItems} />
      )}

      {tab === "peserta" && (
        <ModuleParticipantsTab
          instructor={module.instructor}
          participants={filteredParticipants}
        />
      )}
    </div>
  );
}