import { useEffect, useMemo, useState } from "react";

import type { QuizQuestion } from "@/types/learning";

interface UseQuizSessionParams {
  questions: QuizQuestion[];
  passingGrade?: number;
}

export function useQuizSession({
  questions,
  passingGrade = 70,
}: UseQuizSessionParams) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showGridMobile, setShowGridMobile] = useState(false);

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
    setFlagged(Array(questions.length).fill(false));
    setCurrentQ(0);
    setIsStarted(false);
    setShowResult(false);
    setIsReviewMode(false);
    setShowGridMobile(false);
  }, [questions.length]);

  const currentQuestion = questions[currentQ];

  const correctAnswers = useMemo(
    () => questions.map((question) => question.correct),
    [questions]
  );

  const score = useMemo(() => {
    return answers.filter((answer, index) => answer === questions[index]?.correct)
      .length;
  }, [answers, questions]);

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const passed = percentage >= passingGrade;
  const isSubmitDisabled = answers.includes(null);

  const startQuiz = () => {
    setIsStarted(true);
  };

  const selectOption = (optionIndex: number) => {
    setAnswers((currentAnswers) => {
      const newAnswers = [...currentAnswers];
      newAnswers[currentQ] = optionIndex;
      return newAnswers;
    });
  };

  const toggleFlag = () => {
    setFlagged((currentFlagged) => {
      const newFlagged = [...currentFlagged];
      newFlagged[currentQ] = !newFlagged[currentQ];
      return newFlagged;
    });
  };

  const goToQuestion = (index: number) => {
    setCurrentQ(Math.min(Math.max(index, 0), questions.length - 1));
  };

  const goNext = () => {
    setCurrentQ((current) => Math.min(questions.length - 1, current + 1));
  };

  const goPrev = () => {
    setCurrentQ((current) => Math.max(0, current - 1));
  };

  const submitQuiz = () => {
    setShowResult(true);
    setIsReviewMode(false);
    setShowGridMobile(false);
  };

  const enterReviewMode = () => {
    setIsReviewMode(true);
    setShowResult(false);
    setCurrentQ(0);
  };

  const exitReviewMode = () => {
    setIsReviewMode(false);
    setShowResult(true);
    setShowGridMobile(false);
  };

  return {
    isStarted,
    currentQ,
    answers,
    flagged,
    showResult,
    isReviewMode,
    showGridMobile,
    currentQuestion,
    correctAnswers,
    score,
    percentage,
    passed,
    isSubmitDisabled,

    startQuiz,
    selectOption,
    toggleFlag,
    goToQuestion,
    goNext,
    goPrev,
    submitQuiz,
    enterReviewMode,
    exitReviewMode,
    setShowGridMobile,
  };
}