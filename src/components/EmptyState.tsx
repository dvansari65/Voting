import React from 'react';
import { Inbox, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No Data Found",
  description = "There's nothing here yet. Start by creating your first item.",
  icon: Icon = Inbox,
  actionLabel = "Get Started",
  onAction,
  showAction = true
}) => {
  return (
    <div className="flex items-center justify-center min-h-[500px] p-8">
      <div className="text-center max-w-lg">
        {/* Glassmorphism Container with Icon */}
        <div className="relative inline-block mb-10">
          {/* Multi-layer Animated Background Blur */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/40 via-purple-500/40 to-pink-500/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/30 via-blue-500/30 to-violet-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
          
          {/* Glass Card */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 rounded-[32px] p-16 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
            {/* Enhanced Floating particles */}
            <div className="absolute top-6 right-8 w-2.5 h-2.5 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-500/50"></div>
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full animate-ping shadow-lg shadow-pink-500/50"></div>
            <div className="absolute top-12 left-6 w-1.5 h-1.5 bg-gradient-to-r from-violet-300 to-indigo-400 rounded-full animate-pulse shadow-lg shadow-violet-500/50"></div>
            <div className="absolute bottom-4 right-6 w-1 h-1 bg-gradient-to-r from-rose-300 to-orange-400 rounded-full animate-bounce shadow-lg shadow-rose-500/50" style={{ animationDelay: '150ms' }}></div>
            
            {/* Icon with enhanced gradient and glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 blur-xl opacity-50 rounded-full"></div>
              <Icon 
                className="relative w-24 h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                strokeWidth={1.5} 
              />
            </div>
          </div>
        </div>

        {/* Text Content with Enhanced Glass Effect */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 mb-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.25)]">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight">
            {title}
          </h2>
          
          <p className="text-gray-700 text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Button with Enhanced Glass Effect */}
        {showAction && onAction && (
          <button
            onClick={onAction}
            className="group relative inline-flex items-center gap-3 backdrop-blur-xl bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 hover:from-indigo-500/40 hover:via-purple-500/40 hover:to-pink-500/40 border border-white/40 text-gray-800 font-bold px-10 py-4 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] transition-all duration-300 hover:scale-105 hover:-translate-y-1"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 bg-clip-text text-transparent">
              {actionLabel}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;