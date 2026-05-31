import { LecturerGradebookHeader } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookHeader";
import { LecturerGradebookModuleGrid } from "@/components/dashboard/lecturer/gradebook/LecturerGradebookModuleGrid";
import { lecturerGradebookModules } from "@/data/learning/lecturer/lecturer-gradebook";

export default function LecturerGradebookPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 sm:pb-12">
      <LecturerGradebookHeader totalModules={lecturerGradebookModules.length} />

      <LecturerGradebookModuleGrid modules={lecturerGradebookModules} />
    </div>
  );
}