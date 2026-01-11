'use client';

import { Portfolio } from '@/types/portfolio';
import { usePortfolioStore } from '@/store/usePortfolioStore';

interface SidebarProps {
  onNewPortfolio: () => void;
}

export default function Sidebar({ onNewPortfolio }: SidebarProps) {
  const { portfolios, currentPortfolio, setCurrentPortfolio } = usePortfolioStore();

  return (
    <div className="w-80 h-screen bg-black/50 backdrop-blur-mac border-r border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white mb-1">Portfolio Generator</h1>
        <p className="text-sm text-gray-400">100개 프로그램 개발 포트폴리오</p>
      </div>

      {/* Portfolio List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {portfolios.map((portfolio) => (
            <button
              key={portfolio.id}
              onClick={() => setCurrentPortfolio(portfolio)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentPortfolio?.id === portfolio.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900/50 text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{portfolio.category.icon}</span>
                <span className="font-medium text-sm truncate">{portfolio.name}</span>
              </div>
              <div className="text-xs opacity-70">
                #{portfolio.number} {portfolio.platform.toUpperCase()}
              </div>
            </button>
          ))}

          {portfolios.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">아직 포트폴리오가 없습니다</p>
              <p className="text-xs mt-1">새 포트폴리오를 만들어보세요</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onNewPortfolio}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          새 포트폴리오
        </button>
      </div>
    </div>
  );
}
