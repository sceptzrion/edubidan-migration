"use client";

import { useParams } from "next/navigation";

import { LecturerLessonPreviewSidebar } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonPreviewSidebar";
import { LecturerLessonSummaryCard } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonSummaryCard";
import { LecturerLessonVideoPreview } from "@/components/dashboard/lecturer/modules/preview/LecturerLessonVideoPreview";
import { LecturerPreviewBackButton } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewBackButton";
import { LecturerPreviewModeBadge } from "@/components/dashboard/lecturer/modules/preview/LecturerPreviewModeBadge";
import {
  getLecturerLessonPreviewDetail,
  getLecturerPreviewPlaylist,
} from "@/data/learning/lecturer/lecturer-content-preview";

export default function LecturerLessonPreviewPage() {
  const params = useParams<{ id: string; lessonId: string }>();

  const lesson = getLecturerLessonPreviewDetail();
  const playlist = getLecturerPreviewPlaylist();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12 max-w-350 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <LecturerPreviewBackButton moduleId={params.id} />

        <LecturerPreviewModeBadge label="Mode Pratinjau Dosen" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <LecturerLessonVideoPreview lesson={lesson} />
          <LecturerLessonSummaryCard lesson={lesson} />
        </div>

        <LecturerLessonPreviewSidebar lesson={lesson} playlist={playlist} />
      </div>
    </div>
  );
}