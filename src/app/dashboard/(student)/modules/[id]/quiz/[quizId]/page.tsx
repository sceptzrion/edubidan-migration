"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { QuizExitModal } from "@/components/dashboard/student/modules/lesson/QuizExitModal";
import { QuizFullscreenHeader } from "@/components/dashboard/student/modules/quiz/QuizFullscreenHeader";
import { QuizNavigator } from "@/components/dashboard/student/modules/quiz/QuizNavigator";
import { QuizNotFoundState } from "@/components/dashboard/student/modules/quiz/QuizNotFoundState";
import { QuizQuestionCard } from "@/components/dashboard/student/modules/quiz/QuizQuestionCard";
import { QuizResultScreen } from "@/components/dashboard/student/modules/quiz/QuizResultScreen";
import { QuizStartScreen } from "@/components/dashboard/student/modules/quiz/QuizStartScreen";
import { getLearningItem } from "@/data/learning/shared/learning-modules";
import { useFullscreenLock } from "@/hooks/useFullscreenLock";
import { useQuizSession } from "@/hooks/useQuizSession";

export default function FullscreenQuizPage() {
  const router = useRouter();
  const params = useParams<{ id: string; quizId: string }>();

  const moduleId = Number(params.id);
  const quizId = Number(params.quizId);

  const learningData = getLearningItem(moduleId, quizId);
  const quiz = learningData?.item.kind === "kuis" ? learningData.item : null;
  const questions = useMemo(() => quiz?.questions ?? [], [quiz]);

  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  useFullscreenLock();

  const quizSession = useQuizSession({ questions });

  if (!learningData || !quiz || questions.length === 0) {
    return <QuizNotFoundState moduleId={moduleId} />;
  }

  const timeLimit = `${quiz.timeLimitMinutes ?? quiz.estimatedMinutes} Menit`;
  const timerLabel = `${quiz.timeLimitMinutes ?? quiz.estimatedMinutes}:00`;

  const handleTopLeftClick = () => {
    if (quizSession.isReviewMode) {
      quizSession.exitReviewMode();
      return;
    }

    if (!quizSession.isStarted || quizSession.showResult) {
      router.back();
      return;
    }

    setIsExitModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-100 bg-background flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <QuizExitModal
        isOpen={isExitModalOpen}
        onClose={() => setIsExitModalOpen(false)}
        onConfirm={() => {
          setIsExitModalOpen(false);
          quizSession.submitQuiz();
        }}
      />

      <QuizFullscreenHeader
        title={quiz.title}
        timerLabel={timerLabel}
        isStarted={quizSession.isStarted}
        showResult={quizSession.showResult}
        isReviewMode={quizSession.isReviewMode}
        onTopLeftClick={handleTopLeftClick}
        onOpenMobileNavigator={() => quizSession.setShowGridMobile(true)}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 flex flex-col items-center justify-center relative z-10">
          {!quizSession.isStarted ? (
            <QuizStartScreen
              totalQuestions={questions.length}
              timeLimit={timeLimit}
              onStart={quizSession.startQuiz}
            />
          ) : quizSession.showResult ? (
            <QuizResultScreen
              passed={quizSession.passed}
              percentage={quizSession.percentage}
              score={quizSession.score}
              totalQuestions={questions.length}
              onReview={quizSession.enterReviewMode}
              onExit={() => router.back()}
            />
          ) : (
            <QuizQuestionCard
              currentQ={quizSession.currentQ}
              totalQuestions={questions.length}
              question={quizSession.currentQuestion.question}
              options={quizSession.currentQuestion.options}
              selectedAnswer={quizSession.answers[quizSession.currentQ]}
              isFlagged={quizSession.flagged[quizSession.currentQ]}
              isSubmitDisabled={quizSession.isSubmitDisabled}
              isReviewMode={quizSession.isReviewMode}
              correctAnswer={quizSession.currentQuestion.correct}
              onSelectOption={quizSession.selectOption}
              onFlag={quizSession.toggleFlag}
              onPrev={quizSession.goPrev}
              onNext={quizSession.goNext}
              onSubmit={quizSession.submitQuiz}
              onExitReview={quizSession.exitReviewMode}
            />
          )}
        </div>

        {((quizSession.isStarted && !quizSession.showResult) ||
          quizSession.isReviewMode) && (
          <QuizNavigator
            totalQuestions={questions.length}
            answers={quizSession.answers}
            flagged={quizSession.flagged}
            currentQ={quizSession.currentQ}
            showMobile={quizSession.showGridMobile}
            isReviewMode={quizSession.isReviewMode}
            correctAnswers={quizSession.correctAnswers}
            onCloseMobile={() => quizSession.setShowGridMobile(false)}
            onNavigate={quizSession.goToQuestion}
            onPrev={quizSession.goPrev}
            onNext={quizSession.goNext}
            onSubmit={quizSession.submitQuiz}
            onExitReview={quizSession.exitReviewMode}
          />
        )}
      </main>
    </div>
  );
}