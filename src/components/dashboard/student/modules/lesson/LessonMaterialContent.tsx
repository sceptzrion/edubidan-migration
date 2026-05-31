import { LessonVideoPlayer } from "@/components/dashboard/student/modules/lesson/LessonVideoPlayer";
import { Summary } from "@/components/dashboard/student/modules/lesson/Summary";
import type { LearningItem } from "@/types/learning";

interface LessonMaterialContentProps {
  item: LearningItem;
  moduleThumbnail: string;
  previousItem: LearningItem | null;
  nextItem: LearningItem | null;
  onPrev?: () => void;
  onNext: () => void;
}

function getNextLabel(nextItem: LearningItem | null) {
  if (!nextItem) return "Selesaikan Modul";
  return nextItem.kind === "materi" ? "Materi Selanjutnya" : "Kuis Selanjutnya";
}

export function LessonMaterialContent({
  item,
  moduleThumbnail,
  previousItem,
  nextItem,
  onPrev,
  onNext,
}: LessonMaterialContentProps) {
  return (
    <>
      <LessonVideoPlayer
        title={item.title}
        thumbnailUrl={item.thumbnailUrl ?? moduleThumbnail}
        duration={item.duration}
      />

      <Summary
        title={item.title}
        duration={item.duration}
        onPrev={previousItem ? onPrev : undefined}
        onNext={onNext}
        nextLabel={getNextLabel(nextItem)}
      />
    </>
  );
}