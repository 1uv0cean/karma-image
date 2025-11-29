"use client";

import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Dictionary = {
  home: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    question_wealth: string;
    question_personality: string;
    feature_desc_1: string;
    feature_desc_2: string;
    scientific_note: string;
    participants_count: string;
    modal_title: string;
    input_label: string;
    input_placeholder: string;
    input_hint: string;
    start_button: string;
  };
};

function LandingContent({ dictionary }: { dictionary: Dictionary }) {
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
              {dictionary.home.title}
              <span className="block text-2xl mt-2 text-white-800">{dictionary.home.subtitle}</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              {dictionary.home.description}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-6 text-sm text-gray-600 shadow-inner">
            <p className="mb-2">
              {dictionary.home.question_wealth}
              <br />
              {dictionary.home.question_personality}
            </p>
            <p className="font-bold text-gray-900">
              {dictionary.home.feature_desc_1}
              <br />
              {dictionary.home.feature_desc_2}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {dictionary.home.scientific_note}
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
          {dictionary.home.cta}
        </Button>
        <p className="mt-4 text-center text-xs text-gray-400">
          {dictionary.home.participants_count}
        </p>
      </footer>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={dictionary.home.modal_title}
      >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full space-y-4"
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400">
                  {dictionary.home.input_label}
                </label>
                <div className="relative">
                  <textarea
                    value={desire}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        setDesire(e.target.value);
                      }
                    }}
                    placeholder={dictionary.home.input_placeholder}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[120px] resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                    {desire.length}/300
                  </div>
                </div>
                <p className="text-xs text-gray-500 ml-1">
                  {dictionary.home.input_hint}
                </p>
              </div>

              <Button
                size="big"
                fullWidth
                disabled={desire.length < 10}
                onClick={handleStart}
                className="shadow-lg shadow-blue-500/30"
              >
                {dictionary.home.start_button}
              </Button>
            </motion.div>
      </BottomSheet>
    </div>
  );
}

export default function LandingClient({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white">Loading...</div>}>
      <LandingContent dictionary={dictionary} />
    </Suspense>
  );
}
