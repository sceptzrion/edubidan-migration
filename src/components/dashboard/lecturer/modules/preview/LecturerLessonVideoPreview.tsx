import { Play, Video } from "lucide-react";

import type { LecturerLessonPreviewDetail } from "@/data/learning/lecturer/lecturer-content-preview";

interface LecturerLessonVideoPreviewProps {
  lesson: LecturerLessonPreviewDetail;
}

export function LecturerLessonVideoPreview({
  lesson,
}: LecturerLessonVideoPreviewProps) {
  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-border/50 group shrink-0">
      {lesson.videoSource === "upload" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <Video size={48} className="mb-4 opacity-50" />
          <p className="text-sm font-bold">Pratinjau Video</p>
        </div>
      ) : (
        <img
          src={lesson.thumbnailUrl}
          alt={`Thumbnail ${lesson.title}`}
          className="w-full h-full object-cover opacity-70"
        />
      )}

      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <button
          type="button"
          className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform backdrop-blur-sm"
          aria-label="Putar pratinjau video"
        >
          <Play size={32} className="ml-1.5 sm:ml-2" />
        </button>
      </div>
    </div>
  );
}