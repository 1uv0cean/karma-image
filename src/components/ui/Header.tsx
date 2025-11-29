import { cn } from "@/lib/utils";
import * as React from "react";

interface HeaderProps {
  className?: string;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export function Header({ className, left, center, right }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center justify-between bg-background/80 px-4 backdrop-blur-md",
        className
      )}
    >
      <div className="flex w-10 items-center justify-start">{left}</div>
      <div className="flex-1 text-center font-bold text-lg">{center}</div>
      <div className="flex w-10 items-center justify-end">{right}</div>
    </header>
  );
}
