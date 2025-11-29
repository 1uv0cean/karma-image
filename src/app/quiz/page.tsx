"use client";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    value: string;
    icon?: string; // Made icon optional to accommodate new questions
    id?: string; // Added id for new questions
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "중요한 결정을 내릴 때 당신의 방식은?",
    options: [
      { id: "a", text: "철저한 분석과 데이터에 의존한다", value: "logical" },
      { id: "b", text: "직관과 느낌을 믿고 따른다", value: "intuitive" },
      { id: "c", text: "주변 사람들의 조언을 구한다", value: "social" },
      { id: "d", text: "일단 저지르고 수습한다", value: "impulsive" },
    ],
  },
// ... (rest of questions are fine, just fixing the declaration line)

  {
    id: 2,
    question: "당신이 가장 중요하게 생각하는 가치는?",
    options: [
      { id: "a", text: "경제적 자유와 부", value: "wealth" },
      { id: "b", text: "사회적 지위와 명예", value: "honor" },
      { id: "c", text: "가족과 연인의 행복", value: "love" },
      { id: "d", text: "나만의 시간과 자아실현", value: "self" },
    ],
  },
  {
    id: 3,
    question: "스트레스를 받을 때 당신의 반응은?",
    options: [
      { id: "a", text: "혼자만의 시간을 가지며 삭힌다", value: "introvert" },
      { id: "b", text: "친구들을 만나 수다로 푼다", value: "extrovert" },
      { id: "c", text: "운동이나 활동으로 해소한다", value: "active" },
      { id: "d", text: "쇼핑이나 맛있는 것으로 푼다", value: "consumer" },
    ],
  },
  {
    id: 4,
    question: "낯선 사람을 만났을 때 당신은?",
    options: [
      { id: "a", text: "먼저 다가가 말을 건다", value: "outgoing" },
      { id: "b", text: "상대가 말을 걸 때까지 기다린다", value: "passive" },
      { id: "c", text: "경계하며 관찰한다", value: "cautious" },
      { id: "d", text: "분위기에 맞춰 적당히 어울린다", value: "adaptable" },
    ],
  },
  {
    id: 5,
    question: "당신의 소비 습관은?",
    options: [
      { id: "a", text: "미래를 위해 철저히 저축한다", value: "saver" },
      { id: "b", text: "현재의 즐거움을 위해 쓴다", value: "spender" },
      { id: "c", text: "가성비를 꼼꼼히 따진다", value: "pragmatic" },
      { id: "d", text: "기분파라 충동구매가 잦다", value: "emotional" },
    ],
  },
  {
    id: 6,
    question: "갈등 상황에서 당신의 태도는?",
    options: [
      { id: "a", text: "논리적으로 따져서 해결한다", value: "confrontational" },
      { id: "b", text: "일단 피하고 본다", value: "avoidant" },
      { id: "c", text: "상대방의 기분을 맞춰준다", value: "accommodating" },
      { id: "d", text: "제3자의 중재를 요청한다", value: "mediator" },
    ],
  },
  {
    id: 7,
    question: "당신이 꿈꾸는 이상적인 미래는?",
    options: [
      { id: "a", text: "누구에게도 간섭받지 않는 자유로운 삶", value: "freedom" },
      { id: "b", text: "많은 사람들에게 존경받는 삶", value: "respect" },
      { id: "c", text: "사랑하는 사람들과 함께하는 평온한 삶", value: "peace" },
      { id: "d", text: "세상을 바꾸는 영향력 있는 삶", value: "impact" },
    ],
  },
  {
    id: 8,
    question: "일을 할 때 당신의 스타일은?",
    options: [
      { id: "a", text: "계획대로 꼼꼼하게 처리한다", value: "planner" },
      { id: "b", text: "그때그때 유연하게 대처한다", value: "flexible" },
      { id: "c", text: "리더가 되어 팀을 이끈다", value: "leader" },
      { id: "d", text: "묵묵히 내 할 일만 한다", value: "follower" },
    ],
  },
  {
    id: 9,
    question: "당신이 가장 두려워하는 것은?",
    options: [
      { id: "a", text: "실패하여 가진 것을 잃는 것", value: "loss" },
      { id: "b", text: "사람들에게 비난받는 것", value: "criticism" },
      { id: "c", text: "혼자가 되는 것", value: "isolation" },
      { id: "d", text: "변화 없이 정체되는 것", value: "stagnation" },
    ],
  },
  {
    id: 10,
    question: "이 테스트를 통해 알고 싶은 것은?",
    options: [
      { id: "a", text: "나의 타고난 운명과 재물운", value: "fate" },
      { id: "b", text: "나의 성격적 장단점과 보완점", value: "personality" },
      { id: "c", text: "나의 연애 성향과 잘 맞는 사람", value: "compatibility" },
      { id: "d", text: "앞으로 조심해야 할 점", value: "advice" },
    ],
  },
];

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

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
      router.push("/analysis");
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
        center="관상 테스트"
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
      </main>
    </div>
  );
}
