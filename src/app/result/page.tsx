"use client";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Lock, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResultPage() {
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
        showToastMsg('초대 링크가 복사되었습니다!');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

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
        center="K-Face Reading 결과"
      />

      <main className="flex flex-1 flex-col items-center px-6 pb-10 pt-4">
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
                  {analysis?.class || "분석 중..."}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-1">
                {analysis?.era ? analysis.era.split('/')[0] : "점수 계산 중..."}
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
                <span className="block text-xs text-gray-500 mb-1">재물 레벨</span>
                <span className="font-bold text-gray-900 text-lg">{analysis?.wealth_tier || "..."}</span>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center border border-gray-100">
                <span className="block text-xs text-gray-500 mb-1">사회성 레벨</span>
                <span className="font-bold text-gray-900 text-lg">{analysis?.social_tier || "..."}</span>
              </div>
            </div>

            {/* Detailed Analysis (Locked/Unlocked) */}
            <div className="relative">
              {!isUnlocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200">
                  <Lock className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-bold text-gray-600">상세 분석 내용이 봉인되었습니다</p>
                  <p className="text-xs text-gray-400 mt-1">친구 3명을 초대하여 확인하세요</p>
                </div>
              )}
              
              <div className={`space-y-4 ${!isUnlocked ? 'blur-sm select-none' : ''}`}>
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span>🧠</span> 성격과 기질
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis?.personality || "분석 내용이 여기에 표시됩니다."}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span>💰</span> 재물운 분석
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis?.wealth || "분석 내용이 여기에 표시됩니다."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span>💘</span> 연애와 애정
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {analysis?.love || "분석 내용이 여기에 표시됩니다."}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
                  <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                    <span>💡</span> 개운 조언
                  </h4>
                  <p className="text-sm text-blue-800 leading-relaxed font-medium">
                    {analysis?.advice || "분석 내용이 여기에 표시됩니다."}
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
                  <span className="text-sm font-bold">친구 초대 미션</span>
                  <span className="text-xs bg-red-600 px-2 py-0.5 rounded-full">필수</span>
                </div>
                <p className="text-xs text-gray-300 mb-3">
                  친구 3명이 내 공유 링크를 통해 들어오면<br/>
                  <span className="text-red-400 font-bold">모든 결과가 즉시 해제</span>됩니다.
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(shareCount / 3) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>현재 달성</span>
                  <span>{shareCount}/3 명</span>
                </div>
              </div>

              <Button
                size="big"
                fullWidth
                className="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg shadow-red-500/30 border-0 animate-pulse"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                친구 초대 링크 복사하기
              </Button>
              
              <p className="text-center text-xs text-gray-400 mt-2">
                *친구가 링크를 클릭하면 자동으로 카운트됩니다.
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
                  공유하기
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
                다시 하기
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
