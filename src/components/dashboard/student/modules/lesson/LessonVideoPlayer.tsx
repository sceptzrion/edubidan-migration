"use client";

import { useState } from "react";
import { Maximize2, Pause, Play, SkipForward, Volume2 } from "lucide-react";

interface LessonVideoPlayerProps {
  title: string;
  thumbnailUrl: string;
  duration: string;
}

export function LessonVideoPlayer({
  title,
  thumbnailUrl,
  duration,
}: LessonVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const togglePlaying = () => {
    setPlaying((current) => !current);
  };

  return (
    <div className="relative bg-slate-900 rounded-2xl sm:rounded-3xl overflow-hidden aspect-video shadow-lg border border-border/50 group shrink-0">
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-full object-cover opacity-70"
      />

      <div className="absolute inset-0 flex items-center justify-center z-10">
        <button
          type="button"
          onClick={togglePlaying}
          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center transition-all shadow-lg hover:scale-105 backdrop-blur-sm"
          aria-label={playing ? "Jeda video" : "Putar video"}
        >
          {playing ? (
            <Pause size={24} className="text-white sm:w-8 sm:h-8" />
          ) : (
            <Play
              size={24}
              className="text-white ml-1 sm:ml-1.5 sm:w-8 sm:h-8"
            />
          )}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-3 sm:p-6 z-10 transition-opacity duration-300">
        <div className="w-full h-1 sm:h-1.5 bg-white/30 rounded-full mb-3 sm:mb-4 cursor-pointer relative group/bar">
          <div className="h-full bg-primary rounded-full w-[35%] relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-sm scale-0 group-hover/bar:scale-100 transition-transform" />
          </div>
        </div>

        <div className="flex items-center justify-between text-white text-[10px] sm:text-sm font-semibold">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={togglePlaying}
              className="hover:text-primary transition-colors"
              aria-label={playing ? "Jeda video" : "Putar video"}
            >
              {playing ? (
                <Pause size={14} className="sm:w-4.5 sm:h-4.5" />
              ) : (
                <Play size={14} className="sm:w-4.5 sm:h-4.5" />
              )}
            </button>

            <button
              type="button"
              className="hover:text-primary transition-colors"
              aria-label="Lewati video"
            >
              <SkipForward size={14} className="sm:w-4.5 sm:h-4.5" />
            </button>

            <button
              type="button"
              className="hover:text-primary transition-colors hidden sm:block"
              aria-label="Atur volume"
            >
              <Volume2 size={14} className="sm:w-4.5 sm:h-4.5" />
            </button>

            <span>06:23 / {duration}</span>
          </div>

          <button
            type="button"
            className="hover:text-primary transition-colors"
            aria-label="Mode layar penuh"
          >
            <Maximize2 size={14} className="sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}