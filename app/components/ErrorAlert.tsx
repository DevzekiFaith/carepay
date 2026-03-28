"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, RefreshCcw } from "lucide-react";

interface ErrorAlertProps {
  error: string | null;
  onClear?: () => void;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorAlert({ error, onClear, onRetry, className = "" }: ErrorAlertProps) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className={`relative group overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 p-4 backdrop-blur-xl ${className}`}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-500 shadow-sm">
                <AlertCircle size={18} />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-1">
                System Alert
              </h3>
              <p className="text-sm font-medium text-zinc-300 leading-relaxed">
                {error}
              </p>
              
              {(onRetry || onClear) && (
                <div className="mt-3 flex items-center gap-3">
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
                    >
                      <RefreshCcw size={12} /> Try Again
                    </button>
                  )}
                  {onClear && (
                    <button
                      onClick={onClear}
                      className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-400 transition-colors"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              )}
            </div>

            {onClear && (
              <button
                onClick={onClear}
                className="flex-shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
