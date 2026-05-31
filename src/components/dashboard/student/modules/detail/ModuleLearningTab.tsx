"use client";

import { useRouter } from "next/navigation";

import { PlaylistItem } from "@/components/dashboard/student/modules/PlaylistItem";
import { ModuleDetailEmptyState } from "@/components/dashboard/student/modules/detail/ModuleDetailEmptyState";
import { toModulePlaylistItem } from "@/data/learning/shared/learning-modules";
import type { LearningItem } from "@/types/learning";

interface ModuleLearningTabProps {
  moduleId: number;
  items: LearningItem[];
}

export function ModuleLearningTab({ moduleId, items }: ModuleLearningTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {items.length > 0 ? (
        items.map((item) => (
          <PlaylistItem
            key={item.id}
            item={toModulePlaylistItem(item)}
            onClick={() =>
              router.push(`/dashboard/modules/${moduleId}/lesson/${item.id}`)
            }
          />
        ))
      ) : (
        <ModuleDetailEmptyState message="Pencarian tidak ditemukan." />
      )}
    </div>
  );
}