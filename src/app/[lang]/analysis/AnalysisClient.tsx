"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Dictionary = {
  analysis: {
    messages: string[];
    error: string;
    no_face_error: string;
  };
};

export default function AnalysisClient({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = dictionary.analysis.messages;
  const hasAnalyzed = useRef(false);

  useEffect(() => {
    const analyze = async () => {
      if (hasAnalyzed.current) return;
      hasAnalyzed.current = true;

      try {
        const image = localStorage.getItem("userImage");
        // Quiz removed, passing empty array
        const quizResults: string[] = []; 
        const userDesire = localStorage.getItem("userDesire") || "";

        if (!image) {
          router.push(`/${lang}/scan`);
          return;
        }

        // Start API call immediately
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image, quizResults, userDesire, lang }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 422 && errorData.error === "no_face") {
            alert(dictionary.analysis.no_face_error);
            router.push(`/${lang}/scan`);
            return;
          }
          throw new Error("Analysis failed");
        }

        const data = await response.json();
        const resultWithLang = { ...data, lang };
        localStorage.setItem("analysisResult", JSON.stringify(resultWithLang));
        
        // Ensure we show messages for at least a few seconds for effect
        setTimeout(() => {
          router.push(`/${lang}/result`);
        }, 5000); // Minimum 5s wait
      } catch (error) {
        console.error(error);
        alert(dictionary.analysis.error);
        router.push(`/${lang}`);
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
    </div>
  );
}
