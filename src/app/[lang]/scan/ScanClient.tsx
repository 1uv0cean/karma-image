"use client";

import { AdUnit } from "@/components/AdUnit";

import { Header } from "@/components/ui/Header";
import { motion } from "framer-motion";
import { Camera, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Dictionary = {
  scan: {
    title: string;
    subtitle: string;
    upload_text: string;
    cta_disabled: string;
    cta_enabled: string;
    disclaimer: string;
  };
};

export default function ScanClient({ dictionary, lang }: { dictionary: Dictionary; lang: string }) {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-navigation after scanning
  useEffect(() => {
    if (image && isScanning) {
      const timer = setTimeout(() => {
        handleNext();
      }, 2500); // 2.5 seconds scanning animation
      return () => clearTimeout(timer);
    }
  }, [image, isScanning]);

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8)); // Compress to JPEG 80%
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const resizedImage = await resizeImage(file);
        setImage(resizedImage);
        setIsScanning(true);
      } catch (error) {
        console.error("Image processing error:", error);
        alert("이미지 처리 중 오류가 발생했습니다. 다른 사진을 시도해주세요.");
      }
    }
    // Reset input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    if (image) {
      try {
        localStorage.setItem("userImage", image);
        router.push(`/${lang}/analysis`);
      } catch (error) {
        console.error("Storage error:", error);
        alert("저장 공간이 부족합니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header
        left={
          <Link href={`/${lang}`}>
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </Link>
        }
        center="K-Face Reading"
      />

      <main className="flex flex-1 flex-col items-center px-6 pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl font-bold text-white-900">
            {dictionary.scan.title}
          </h1>
          <p className="mt-2 text-gray-500">
            {dictionary.scan.subtitle}
          </p>
        </motion.div>

        {/* Scan Area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl bg-gray-100 shadow-inner border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => !isScanning && fileInputRef.current?.click()}
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
                {dictionary.scan.upload_text}
              </span>
            </div>
          )}
          
          {/* Scanning Effect Overlay */}
          {isScanning && (
            <motion.div
              initial={{ top: "-10%" }}
              animate={{ top: "110%" }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
              className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)] z-10 opacity-80"
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
          {isScanning && (
             <p className="text-center text-lg font-bold text-blue-600 animate-pulse">
               {dictionary.scan.cta_enabled}...
             </p>
          )}
          
          <p className="text-center text-xs text-gray-400">
            {dictionary.scan.disclaimer}
          </p>

          {/* Ad Unit */}
          <div className="pt-4">
            <AdUnit />
          </div>
        </div>
      </main>
    </div>
  );
}
