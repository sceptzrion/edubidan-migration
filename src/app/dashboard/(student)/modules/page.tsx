"use client";

import { useMemo, useState } from "react";

import { JoinModuleModal } from "@/components/dashboard/student/modules/JoinModuleModal";
import { StudentModulesHeader } from "@/components/dashboard/student/modules/list/StudentModulesHeader";
import { StudentModulesList } from "@/components/dashboard/student/modules/list/StudentModulesList";
import {
  StudentModulesToolbar,
  type StudentModulesLayout,
} from "@/components/dashboard/student/modules/list/StudentModulesToolbar";
import { getStudentModuleCards } from "@/data/learning/shared/learning-modules";

export default function StudentModulesPage() {
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState<StudentModulesLayout>("grid");
  const [joinOpen, setJoinOpen] = useState(false);

  const modules = useMemo(() => getStudentModuleCards(), []);

  const filteredModules = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return modules;

    return modules.filter((module) => {
      return (
        module.title.toLowerCase().includes(keyword) ||
        module.desc.toLowerCase().includes(keyword) ||
        module.instructor.toLowerCase().includes(keyword)
      );
    });
  }, [modules, search]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StudentModulesHeader totalModules={modules.length} />

        <StudentModulesToolbar
          search={search}
          layout={layout}
          onSearchChange={setSearch}
          onLayoutChange={setLayout}
          onJoinModule={() => setJoinOpen(true)}
        />
      </div>

      <StudentModulesList
        modules={filteredModules}
        layout={layout}
        search={search}
      />

      <JoinModuleModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  );
}