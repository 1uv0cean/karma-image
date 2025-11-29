"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [desire, setDesire] = useState("");

  useEffect(() => {
    // 1. Generate/Get Visitor ID
    let visitorId = localStorage.getItem("userId");
    if (!visitorId) {
      visitorId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userId", visitorId);
    }

    // 2. Check for Referral
    const refId = searchParams.get("ref");
    if (refId && refId !== visitorId) {
      // Call API to record visit
      fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refId, visitorId }),
      }).catch(err => console.error("Referral track error:", err));
    }
  }, [searchParams]);

  const handleStart = () => {
    if (!desire.trim()) return;
    localStorage.setItem("userDesire", desire);
    router.push("/scan");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center relative">
      {/* Background Elements - Fixed to avoid scrollbars but allow content to scroll if needed */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl filter" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-200/30 blur-3xl filter" />
      </div>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="relative mx-auto h-32 w-32">
            <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/20 blur-xl" />
            <div className="relative flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-gray-900 to-black shadow-2xl border-2 border-red-500/30">
              <span className="text-5xl">🔥</span>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-blue-600">
              K-Face Reading
              <span className="block text-2xl mt-2 text-white-800">AI 팩트 관상</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              당신의 얼굴에 쓰여진
              <br />
              <span className="text-blue-600 font-bold">운명과 진실</span>을 분석합니다.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600 shadow-inner">
            <p className="mb-2">
              "나의 재물운은 어떨까?"
              <br />
              "나의 타고난 성향은 무엇일까?"
            </p>
            <p className="font-bold text-gray-900">
              AI가 관상학과 심리학을 기반으로
              <br />
              객관적인 팩트만 전달합니다.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              *과학적인 분석을 지향합니다.
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="p-6 pb-10 z-10 w-full max-w-md">
        <Button 
          size="big" 
          fullWidth 
          className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30"
          onClick={() => setIsOpen(true)}
        >
          진실 확인하기 (무료)
        </Button>
        <p className="mt-4 text-center text-xs text-gray-400">
          이미 32,402명이 팩폭을 당했습니다.
        </p>
      </footer>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="무엇을 알고 싶으신가요?"
      >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">
                  당신의 고민이나 욕망을 10자 이상 구체적으로 적어주세요
                </label>
                <div className="relative">
                  <textarea
                    value={desire}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        setDesire(e.target.value);
                      }
                    }}
                    placeholder="예: 저는 30대 초반 직장인인데, 언제쯤 경제적 자유를 얻을 수 있을까요? 그리고 제 인연은 언제 나타날까요? 구체적으로 알고 싶습니다."
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                    {desire.length}/300
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  *구체적으로 적을수록 AI가 더 정확하게 분석합니다.
                </p>
              </div>

              <Button
                size="big"
                fullWidth
                disabled={desire.length < 10}
                onClick={handleStart}
                className="shadow-lg shadow-blue-500/30"
              >
                무료로 관상 분석하기
              </Button>
            </motion.div>
      </BottomSheet>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white">Loading...</div>}>
      <LandingContent />
    </Suspense>
  );
}
