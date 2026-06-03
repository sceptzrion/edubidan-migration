import { Play, Video } from "lucide-react";

import type { LecturerLessonPreviewDetail } from "@/data/learning/lecturer/lecturer-content-preview";

interface LecturerLessonVideoPreviewProps {
  lesson: LecturerLessonPreviewDetail;
}

function getYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.replace("www.", "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = parsedUrl.searchParams.get("v");

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtu.be") {
      const videoId = parsedUrl.pathname.replace("/", "");

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "youtube.com" && parsedUrl.pathname.startsWith("/embed/")) {
      return url;
    }

    return url;
  } catch {
    return null;
  }
}

export function LecturerLessonVideoPreview({
  lesson,
}: LecturerLessonVideoPreviewProps) {
  const embedUrl =
    lesson.videoSource === "embed" ? getYouTubeEmbedUrl(lesson.videoUrl) : null;

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-border/50 group shrink-0">
      {lesson.videoSource === "upload" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
          <Video size={48} className="mb-4 opacity-50" />
          <p className="text-sm font-bold">Pratinjau Video Upload</p>
          <p className="text-xs font-medium mt-1">
            Upload video lokal masuk backlog media upload.
          </p>
        </div>
      ) : embedUrl ? (
        <iframe
          src={embedUrl}
          title={lesson.title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={lesson.thumbnailUrl}
            alt={`Thumbnail ${lesson.title}`}
            className="w-full h-full object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm">
              <Play size={32} className="ml-1.5 sm:ml-2" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}