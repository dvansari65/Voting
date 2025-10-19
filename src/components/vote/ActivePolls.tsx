import { TrendingUp } from "lucide-react";

interface ActivePollsProps {
  activePolls: number;
  className?: string;
}

function ActivePolls({ activePolls, className = '' }: ActivePollsProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-start items-center gap-4 transition-all hover:shadow-md ${className}`}
      role="status"
      aria-label={`${activePolls} active polls`}
    >
      <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-lg flex-shrink-0">
        <TrendingUp className="w-6 h-6 text-white" aria-hidden="true" />
      </div>
      <div className="flex flex-col justify-center items-start gap-1">
        <span className="text-sm font-medium text-gray-100  uppercase tracking-wide">
          Active Polls
        </span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {activePolls || 10}
        </span>
      </div>
    </div>
  );
}

export default ActivePolls