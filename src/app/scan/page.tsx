"use client";

import { Button } from "@/components/ui/Button";
import { Header } from "@/components/ui/Header";
import { motion } from "framer-motion";
import { Camera, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function ScanPage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (image) {
      // In a real app, we would upload the image here
      // For now, we just pass the image data via context or just move to next step
      // We'll use localStorage for simplicity in this demo
      localStorage.setItem("userImage", image);
      router.push("/analysis");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        left={
          <Link href="/">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
        }
        center="얼굴 스캔"
      />

      <main className="flex flex-1 flex-col items-center px-6 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-white-900">
            진실을 마주할 준비가 되셨나요?
          </h1>
          <p className="mt-2 text-gray-500">
            AI가 당신의 이목구비 속에 숨겨진
            <br />
            <span className="text-red-500 font-bold">욕망의 흔적</span>을 찾아냅니다.
          </p>
        </motion.div>

        {/* Scan Area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl bg-gray-100 shadow-inner border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <Image
              src={image}
              alt="Uploaded face"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <div className="rounded-full bg-white p-6 shadow-sm">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <span className="text-sm font-medium">
                터치하여 사진 업로드
              </span>
            </div>
          )}
          
          {/* Scanning Effect Overlay */}
          {image && (
            <motion.div
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
                repeatType: "reverse",
              }}
              className="absolute left-0 right-0 h-1 bg-primary/50 shadow-[0_0_20px_rgba(49,130,246,0.8)] z-10"
            />
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </motion.div>

        <div className="flex-1" />

        <div className="w-full space-y-3">
          <Button
            size="big"
            fullWidth
            disabled={!image}
            onClick={handleNext}
            className="shadow-lg shadow-blue-500/20"
          >
            {image ? "내 안의 또 다른 나 만나기" : "사진을 선택해주세요"}
          </Button>
          
          <p className="text-center text-xs text-gray-400">
            사진은 분석 후 즉시 영구 삭제됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
