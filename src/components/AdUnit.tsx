"use client";

import { useEffect, useRef } from "react";

type AdUnitProps = {
  className?: string;
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
};

export function AdUnit({ 
  className, 
  slotId = "7671521745", // Placeholder, replace with actual slot ID
  format = "auto",
  responsive = true
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Prevent double loading in strict mode
    if (isLoaded.current) return;
    
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      isLoaded.current = true;
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`w-full overflow-hidden ${className || ""}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1427543231397985"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
