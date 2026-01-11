'use client';

interface ProgressBarProps {
  current: number;
  total?: number;
}

export default function ProgressBar({ current, total = 100 }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm text-gray-400">
        <span className="text-white font-medium">{current}</span>
        <span className="mx-1">/</span>
        {total}
      </div>
      <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{percentage.toFixed(0)}%</span>
    </div>
  );
}
