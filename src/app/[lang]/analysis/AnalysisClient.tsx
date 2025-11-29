"use client";

import { motion } from "framer-motion";
import { Brain, Fingerprint, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Dictionary = {
  analysis: {
    messages: string[];
    error: string;
  };
};

export default function AnalysisClient({ dictionary }: { dictionary: Dictionary }) {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = dictionary.analysis.messages;

  useEffect(() => {
    const analyze = async () => {
      try {
        const image = localStorage.getItem("userImage");
        // Quiz removed, passing empty array
        const quizResults: string[] = []; 
        const userDesire = localStorage.getItem("userDesire") || "";

        if (!image) {
          router.push("/scan");
          return;
        }

        // Start API call immediately
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, quizResults, userDesire }),
        });

        if (!response.ok) throw new Error("Analysis failed");

        const data = await response.json();
        localStorage.setItem("analysisResult", JSON.stringify(data));
        
        // Ensure we show messages for at least a few seconds for effect
        setTimeout(() => {
          router.push("/result");
        }, 5000); // Minimum 5s wait
      } catch (error) {
        console.error(error);
        alert(dictionary.analysis.error);
        router.push("/");
      }
    };

    // Cycle messages
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    analyze();

    return () => clearInterval(interval);
  }, [router, messages, dictionary.analysis.error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative mb-12 flex h-32 w-32 items-center justify-center">
        {/* Ripple Effect */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.5, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-primary"
          />
        ))}
        
        {/* Center Icon */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
        </div>
      </div>

      <motion.h2
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-xl font-bold text-blue-900"
      >
        {messages[messageIndex]}
      </motion.h2>

      <div className="mt-8 flex gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Fingerprint className="h-4 w-4" />
          <span>Physiognomy</span>
        </div>
        <div className="h-4 w-px bg-gray-300" />
        <div className="flex items-center gap-1">
          <Brain className="h-4 w-4" />
          <span>Karma Data</span>
        </div>
      </div>
    </div>
  );
}
