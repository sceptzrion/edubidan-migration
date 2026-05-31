"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { LecturerPreviewBackButton } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewBackButton";
import { LecturerPreviewModeBadge } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewModeBadge";
import { LecturerQuizAnalysisTab } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizAnalysisTab";
import { LecturerQuizOverviewTab } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizOverviewTab";
import { LecturerQuizPreviewHeader } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizPreviewHeader";
import { LecturerQuizPreviewTabs } from "@/components/dashboard/lecturer/modules/quiz-preview/LecturerQuizPreviewTabs";
import {
  getLecturerQuizPreviewData,
  type LecturerQuizPreviewTab,
} from "@/data/learning/lecturer/lecturer-quiz-preview";

export default function LecturerQuizPreviewPage() {
  const params = useParams<{ id: string; quizId: string }>();

  const [activeTab, setActiveTab] =
    useState<LecturerQuizPreviewTab>("overview");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const { quizInfo, generalStats, leaderboard, questionStats } =
    getLecturerQuizPreviewData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12 max-w-350 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <LecturerPreviewBackButton moduleId={params.id} />

        <LecturerPreviewModeBadge label="Mode Analisis & Pratinjau Kuis" />
      </div>

      <LecturerQuizPreviewHeader quizInfo={quizInfo} />

      <LecturerQuizPreviewTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <LecturerQuizOverviewTab
          stats={generalStats}
          leaderboard={leaderboard}
        />
      )}

      {activeTab === "analysis" && (
        <LecturerQuizAnalysisTab
          questions={questionStats}
          activeQuestionIndex={activeQuestionIndex}
          onQuestionChange={setActiveQuestionIndex}
        />
      )}
    </div>
  );
}