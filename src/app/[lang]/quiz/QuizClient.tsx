"use client";

import { AdUnit } from "@/components/AdUnit";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Question = {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
  }[];
};

type Dictionary = {
  quiz: {
    header: string;
    questions: Question[];
  };
};

export default function QuizClient({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const questions = dictionary.quiz.questions;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // Finish quiz
      localStorage.setItem("quizResults", JSON.stringify(newAnswers));
      router.push(`/${lang}/analysis`);
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        left={
          <Button
            variant="ghost"
            size="small"
            className="p-0"
            onClick={() => {
              if (currentStep > 0) setCurrentStep(currentStep - 1);
              else router.back();
            }}
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Button>
        }
        center={dictionary.quiz.header}
      />

      <div className="px-6 pt-2 pb-6">
        <ProgressBar progress={progress} />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex w-full max-w-md flex-col items-center"
          >
            <h2 className="mb-12 text-center text-2xl font-bold leading-relaxed text-white-900">
              Q{currentQuestion.id}.
              <br />
              {currentQuestion.question}
            </h2>

            <div className="grid w-full grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.value)}
                  className="group flex h-24 w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 shadow-sm transition-all hover:border-primary hover:bg-blue-50 hover:shadow-md"
                >
                  <span className="text-lg font-semibold text-gray-800 group-hover:text-primary">
                    {option.text}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Ad Unit */}
        <div className="mt-8 w-full max-w-md">
          <AdUnit />
        </div>
      </main>
    </div>
  );
}
