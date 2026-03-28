"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export default function Logo({ className = "", size = "md", href = "/" }: LogoProps) {
  const sizes = {
    sm: "text-lg gap-1.5",
    md: "text-xl gap-2",
    lg: "text-3xl gap-3",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 32,
  };

  const Content = (
    <div className={`flex items-center font-heading font-black tracking-tighter ${sizes[size]} ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-primary/20 blur-md rounded-full" />
        <div className="relative h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-glow shadow-premium border border-white/20">
          <Zap size={iconSizes[size]} className="text-white fill-white" />
        </div>
      </div>
      <span className="text-foreground">
        Care<span className="text-brand-primary">Pay</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {Content}
      </Link>
    );
  }

  return Content;
}
