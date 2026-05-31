"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import { EditInfoModal } from "@/components/dashboard/lecturer/modules/detail/EditInfoModal";
import { LecturerModuleDetailHeader } from "@/components/dashboard/lecturer/modules/detail/LecturerModuleDetailHeader";
import { ParticipantsTab } from "@/components/dashboard/lecturer/modules/detail/ParticipantsTab";
import { PlaylistTab } from "@/components/dashboard/lecturer/modules/detail/PlaylistTab";
import { LecturerModuleBackButton } from "@/components/dashboard/lecturer/modules/detail/layout/LecturerModuleBackButton";
import {
  LecturerModuleDetailTabs,
  type LecturerModuleDetailTab,
} from "@/components/dashboard/lecturer/modules/detail/layout/LecturerModuleDetailTabs";
import { lecturerModuleDetailInfo } from "@/data/learning/lecturer/lecturer-module-detail";

export default function LecturerModuleEditorPage() {
  const params = useParams<{ id: string }>();
  const moduleId = params.id;

  const [tab, setTab] = useState<LecturerModuleDetailTab>("materi");
  const [info, setInfo] = useState(lecturerModuleDetailInfo);
  const [editInfoOpen, setEditInfoOpen] = useState(false);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <LecturerModuleBackButton />

      <LecturerModuleDetailHeader
        info={info}
        onEditClick={() => setEditInfoOpen(true)}
      />

      <LecturerModuleDetailTabs activeTab={tab} onTabChange={setTab} />

      {tab === "materi" && <PlaylistTab moduleId={moduleId} />}
      {tab === "peserta" && <ParticipantsTab />}

      {editInfoOpen && (
        <EditInfoModal
          info={info}
          onSave={(value) => {
            setInfo(value);
            setEditInfoOpen(false);
          }}
          onClose={() => setEditInfoOpen(false)}
        />
      )}
    </div>
  );
}