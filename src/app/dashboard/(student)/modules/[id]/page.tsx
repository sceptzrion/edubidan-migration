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
  const learningModule = getLearningModule(moduleId);

  const [tab, setTab] = useState<DetailTab>("pembelajaran");
  const [searchQuery, setSearchQuery] = useState("");

  const keyword = searchQuery.trim().toLowerCase();

  const filteredLearningItems = useMemo(() => {
    if (!learningModule) return [];

    if (!keyword) return learningModule.items;

    return learningModule.items.filter((item) =>
      item.title.toLowerCase().includes(keyword)
    );
  }, [keyword, learningModule]);

  const filteredQuizItems = useMemo(() => {
    if (!learningModule) return [];

    return learningModule.items.filter((item) => {
      const isQuiz = item.kind === "kuis";
      const matchKeyword = keyword
        ? item.title.toLowerCase().includes(keyword)
        : true;

      return isQuiz && matchKeyword;
    });
  }, [keyword, learningModule]);

  const filteredParticipants = useMemo(() => {
    if (!learningModule) return [];

    if (!keyword) return learningModule.participants;

    return learningModule.participants.filter((participant) => {
      return (
        participant.name.toLowerCase().includes(keyword) ||
        participant.email.toLowerCase().includes(keyword)
      );
    });
  }, [keyword, learningModule]);

  if (!learningModule) {
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
          banner: learningModule.banner,
          title: learningModule.title,
          progress: learningModule.progress,
          description: learningModule.description,
          estimatedTime: learningModule.estimatedTime,
          contentSummary: getModuleContentSummary(learningModule.items),
          objectives: learningModule.objectives,
          instructor: learningModule.instructor,
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
          moduleId={learningModule.id}
          items={filteredLearningItems}
        />
      )}

      {tab === "evaluasi" && (
        <ModuleEvaluationTab
          moduleId={learningModule.id}
          items={filteredQuizItems}
        />
      )}

      {tab === "peserta" && (
        <ModuleParticipantsTab
          instructor={learningModule.instructor}
          participants={filteredParticipants}
        />
      )}
    </div>
  );
}