"use client";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Lock, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Dictionary = {
  result: {
    header: string;
    analyzing: string;
    calculating_score: string;
    wealth_level: string;
    social_level: string;
    locked_title: string;
    locked_desc: string;
    personality: string;
    wealth: string;
    love: string;
    advice: string;
    advice_original: string;
    default_content: string;
    mission_title: string;
    mission_required: string;
    mission_desc: string;
    current_achievement: string;
    people: string;
    copy_link: string;
    copy_link_toast: string;
    share_note: string;
    share_button: string;
    retry_button: string;
  };
};

export default function ResultClient({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [shareCount, setShareCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) {
      setUserImage(storedImage);
    }

    const storedAnalysis = localStorage.getItem("analysisResult");
    if (storedAnalysis) {
      setAnalysis(JSON.parse(storedAnalysis));
    }
    
    // Load share count from local storage to persist across reloads
    const storedShareCount = localStorage.getItem("shareCount");
    if (storedShareCount) {
      const count = parseInt(storedShareCount);
      setShareCount(count);
      if (count >= 3) setIsUnlocked(true);
    }
  }, []);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Initialize User ID for referral
    let id = localStorage.getItem("userId");
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("userId", id);
    }
    setUserId(id);

    // Poll for referral status
    const checkReferrals = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/referral?refId=${id}`);
        const data = await res.json();
        if (data.count !== undefined) {
          setShareCount(data.count);
          if (data.count >= 3) {
            setIsUnlocked(true);
            // Stop polling if unlocked? Maybe not, to show over-achievement
          }
        }
      } catch (err) {
        console.error("Poll error:", err);
      }
    };

    // Check immediately
    checkReferrals();

    // Poll every 3 seconds
    const interval = setInterval(checkReferrals, 3000);
    return () => clearInterval(interval);
  }, []);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?ref=${userId}`;
    const shareData = {
      title: 'K-Face Reading | AI 팩트 관상',
      text: '내 관상의 잔혹한 진실을 확인해보세요. #KFaceReading #K관상 #팩트관상',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        showToastMsg(dictionary.result.copy_link_toast);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleReanalyze = () => {
    localStorage.removeItem("analysisResult");
    window.location.href = `/${lang}/analysis`;
  };

  // Check for language mismatch
  const isLangMismatch = analysis && analysis.lang && analysis.lang !== lang;

  return (
    <div className="flex min-h-screen flex-col bg-background relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded-full bg-gray-900/90 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <Header
        left={
          <Link href="/">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
        }
        center={dictionary.result.header}
      />

      <main className="flex flex-1 flex-col items-center px-6 pb-10 pt-4">
        {/* Language Mismatch Warning */}
        {isLangMismatch && (
          <div className="mb-6 w-full max-w-sm rounded-xl bg-yellow-50 p-4 border border-yellow-200 text-center">
            <p className="text-sm text-yellow-800 mb-2">
              The analysis result is in a different language.
            </p>
            <Button 
              size="small" 
              onClick={handleReanalyze}
              className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs"
            >
              Re-analyze in {lang === 'ko' ? 'Korean' : lang === 'en' ? 'English' : lang === 'ja' ? 'Japanese' : 'Thai'}
            </Button>
          </div>
        )}
        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          {/* Hero Section: User Image + Score */}
          <div className="relative aspect-[4/3] w-full bg-gray-900">
            {userImage && (
              <img 
                src={userImage} 
                alt="User Face" 
                className="h-full w-full object-cover opacity-60"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                  {analysis?.class || dictionary.result.analyzing}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-1">
                {analysis?.era ? analysis.era.split('/')[0] : dictionary.result.calculating_score}
              </h1>
              <p className="text-sm text-gray-300">
                {analysis?.era ? analysis.era.split('/')[1] : ""}
              </p>
            </div>
          </div>

          {/* Analysis Content */}
          <div className="p-6 space-y-6">

            {/* Tiers (Always Visible) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-4 text-center border border-gray-100">
                <span className="block text-xs text-gray-500 mb-1">{dictionary.result.wealth_level}</span>
                <span className="font-bold text-gray-900 text-lg">{analysis?.wealth_tier || "..."}</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center border border-gray-100">
                <span className="block text-xs text-gray-500 mb-1">{dictionary.result.social_level}</span>
                <span className="font-bold text-gray-900 text-lg">{analysis?.social_tier || "..."}</span>
              </div>
            </div>

            {/* Detailed Analysis (Locked/Unlocked) */}
            <div className="relative">
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-white/60 via-white/95 to-white">
                  <div className="flex flex-col items-center p-6 text-center">
                    <Lock className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-bold text-gray-600">{dictionary.result.locked_title}</p>
                    <p className="text-xs text-gray-400 mt-1">{dictionary.result.locked_desc}</p>
                  </div>
                </div>
              )}
              
              <div className={`space-y-4 ${!isUnlocked ? 'select-none' : ''}`}>
                {/* User Question Answer (Priority) - Now Locked */}
                <div className="rounded-2xl bg-blue-50 p-6 border border-blue-100 shadow-sm">
                  <h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center gap-2">
                    <span>🔮</span> {dictionary.result.advice}
                  </h3>
                  <p className="text-base text-blue-900 leading-relaxed font-medium">
                    {/* Show full text if unlocked, otherwise show teaser (first 2 sentences) */}
                    {isUnlocked 
                      ? (analysis?.user_question_answer || analysis?.description || dictionary.result.default_content)
                      : (analysis?.user_question_answer || analysis?.description || dictionary.result.default_content).slice(0, 60) + "..."
                    }
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span>🧠</span> {dictionary.result.personality}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis?.personality || dictionary.result.default_content}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span>💰</span> {dictionary.result.wealth}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis?.wealth || dictionary.result.default_content}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span>💘</span> {dictionary.result.love}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis?.love || dictionary.result.default_content}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                    <span>💡</span> {dictionary.result.advice_original}
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed font-medium">
                    {analysis?.advice || dictionary.result.default_content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="mt-8 w-full max-w-sm space-y-3">
          {!isUnlocked ? (
            <>
              <div className="rounded-xl bg-gray-900 p-4 text-white mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">{dictionary.result.mission_title}</span>
                  <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full">{dictionary.result.mission_required}</span>
                </div>
                <p className="text-xs text-gray-300 mb-3" dangerouslySetInnerHTML={{ __html: dictionary.result.mission_desc }} />
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(shareCount / 3) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{dictionary.result.current_achievement}</span>
                  <span>{shareCount}/3 {dictionary.result.people}</span>
                </div>
              </div>

              <Button
                size="big"
                fullWidth
                className="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg shadow-red-500/30 border-0 animate-pulse"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {dictionary.result.copy_link}
              </Button>
              
              <p className="text-center text-xs text-gray-400 mt-2">
                {dictionary.result.share_note}
              </p>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="secondary"
                  size="big"
                  className="bg-white text-gray-900 shadow-sm border border-gray-200"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary.result.share_button}
                </Button>
              </div>
              <Button
                size="big"
                fullWidth
                className="bg-primary shadow-lg shadow-blue-500/30"
                onClick={() => {
                  localStorage.removeItem("userImage");
                  localStorage.removeItem("quizResults");
                  localStorage.removeItem("analysisResult");
                  localStorage.removeItem("userDesire");
                  localStorage.removeItem("shareCount");
                  window.location.href = "/";
                }}
              >
                {dictionary.result.retry_button}
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
