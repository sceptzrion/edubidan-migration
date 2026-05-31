"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { LecturerGradebookBackButton } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookBackButton";
import { LecturerGradebookDetailHeader } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookDetailHeader";
import { LecturerGradebookTableCard } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookTableCard";
import {
  getLecturerGradebookDetail,
  getLecturerGradebookRows,
} from "@/data/learning/lecturer/lecturer-gradebook";

export default function LecturerGradebookDetailPage() {
  const params = useParams<{ id: string }>();
  const moduleId = params.id ?? "1";

  const [search, setSearch] = useState("");

  const data = getLecturerGradebookDetail(moduleId);

  const rows = useMemo(() => {
    return getLecturerGradebookRows(data.students, search);
  }, [data.students, search]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <LecturerGradebookBackButton />

      <LecturerGradebookDetailHeader data={data} />

      <LecturerGradebookTableCard
        search={search}
        quizzes={data.quizzes}
        rows={rows}
        onSearchChange={setSearch}
      />
    </div>
  );
}