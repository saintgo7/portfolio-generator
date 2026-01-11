'use client';

import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { CATEGORIES, PLATFORMS } from '@/data/constants';
import { Category, Platform } from '@/types/portfolio';
import { generatePortfolio, generateMarkdown, generateDocxContent, generatePlainText } from '@/lib/generator';
import { exportMarkdown } from '@/lib/tauri-fallback';
import * as clipboard from '@tauri-apps/plugin-clipboard-manager';
import { saveAs } from 'file-saver';
import Sidebar from '@/components/common/Sidebar';
import ProgressBar from '@/components/common/ProgressBar';

export default function HomePage() {
  const { portfolios, nextNumber, currentPortfolio, loadData, savePortfolio, deletePortfolio, setCurrentPortfolio, getProgress } = usePortfolioStore();

  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPlatform, setPlatform] = useState<Platform>('web');
  const [programName, setProgramName] = useState('');
  const [programDesc, setProgramDesc] = useState('');

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (currentPortfolio) {
      setView('detail');
    } else {
      setView('list');
    }
  }, [currentPortfolio]);

  const handleNewPortfolio = () => {
    setCurrentPortfolio(null);
    setSelectedCategory(null);
    setPlatform('web');
    setProgramName('');
    setProgramDesc('');
    setView('form');
  };

  const handleGenerate = async () => {
    console.log('handleGenerate called', {
      selectedCategory,
      programName,
      selectedPlatform,
      nextNumber
    });

    if (!selectedCategory || !programName.trim()) {
      alert('분야와 프로그램 이름을 입력해주세요');
      return;
    }

    try {
      const newPortfolio = generatePortfolio(
        nextNumber,
        programName.trim(),
        selectedCategory,
        selectedPlatform,
        programDesc.trim()
      );

      console.log('Generated portfolio:', newPortfolio);

      await savePortfolio(newPortfolio);
      console.log('Portfolio saved');

      setCurrentPortfolio(newPortfolio);
      console.log('Current portfolio set');
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      alert('생성 실패: ' + error);
    }
  };

  const handleDelete = async () => {
    if (!currentPortfolio) return;
    if (confirm('정말 삭제하시겠습니까?')) {
      await deletePortfolio(currentPortfolio.id);
      setCurrentPortfolio(null);
    }
  };

  const handleExport = async () => {
    if (!currentPortfolio) return;

    const markdown = generateMarkdown(currentPortfolio);
    try {
      const result = await exportMarkdown({
        portfolio: currentPortfolio,
        content: markdown
      });

      if (result.success) {
        alert('Markdown 파일이 저장되었습니다!');
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('내보내기 실패');
    }
  };

  const handleExportDocx = async () => {
    if (!currentPortfolio) return;

    try {
      const doc = await generateDocxContent(currentPortfolio);
      const blob = await doc.save();
      saveAs(blob, `${currentPortfolio.name.replace(/\s+/g, '_')}.docx`);
      alert('DOCX 파일이 저장되었습니다!');
    } catch (error) {
      console.error('DOCX export failed:', error);
      alert('DOCX 내보내기 실패');
    }
  };

  const handleCopy = async () => {
    if (!currentPortfolio) return;

    try {
      const plainText = generatePlainText(currentPortfolio);
      await clipboard.writeText(plainText);
      alert('클립보드에 복사되었습니다!');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('복사 실패');
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <Sidebar onNewPortfolio={handleNewPortfolio} />

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-black/30 backdrop-blur-mac">
          <ProgressBar current={getProgress()} />
          <div className="flex gap-2">
            {view === 'detail' && (
              <>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  Markdown
                </button>
                <button
                  onClick={handleExportDocx}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  DOCX
                </button>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  복사
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
                >
                  삭제
                </button>
              </>
            )}
            <button
              onClick={handleNewPortfolio}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
            >
              새 포트폴리오
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {view === 'form' && (
            <div className="max-w-4xl mx-auto p-8">
              <h2 className="text-2xl font-bold mb-6">새 포트폴리오 생성</h2>

              {/* Category Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">분야 선택</label>
                <div className="grid grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCategory?.id === cat.id
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-xs">{cat.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-3">플랫폼</label>
                <div className="flex gap-3">
                  {PLATFORMS.map((plat) => (
                    <button
                      key={plat.id}
                      onClick={() => setPlatform(plat.id as Platform)}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        selectedPlatform === plat.id
                          ? 'border-purple-500 bg-purple-600/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">{plat.icon}</div>
                      <div className="text-sm">{plat.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Program Name */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">프로그램 이름</label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  placeholder="예: HealthTracker Pro"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Description (Optional) */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">설명 (선택사항)</label>
                <textarea
                  value={programDesc}
                  onChange={(e) => setProgramDesc(e.target.value)}
                  placeholder="프로그램에 대한 추가 설명을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={!selectedCategory || !programName.trim()}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg font-medium transition-colors"
                >
                  생성하기
                </button>
                <button
                  onClick={() => setView('list')}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}

          {view === 'detail' && currentPortfolio && (
            <div className="max-w-5xl mx-auto p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{currentPortfolio.category.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold">{currentPortfolio.name}</h2>
                    <div className="flex gap-3 mt-1 text-sm text-gray-400">
                      <span>#{currentPortfolio.number}</span>
                      <span>{currentPortfolio.category.name}</span>
                      <span>{currentPortfolio.platform.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
                <h3 className="text-lg font-semibold mb-3">프로젝트 설명</h3>
                <p className="text-gray-300">{currentPortfolio.description}</p>
              </div>

              {/* Design Theme */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">디자인 테마</h3>
                <div className="p-4 rounded-lg border-2" style={{ backgroundColor: currentPortfolio.designTheme.bg, borderColor: currentPortfolio.designTheme.border }}>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg"
                      style={{ backgroundColor: currentPortfolio.designTheme.accent }}
                    />
                    <div>
                      <div className="font-medium" style={{ color: currentPortfolio.designTheme.text }}>
                        {currentPortfolio.designTheme.name}
                      </div>
                      <div className="text-xs mt-1" style={{ color: currentPortfolio.designTheme.text }}>
                        BG: {currentPortfolio.designTheme.bg} | Text: {currentPortfolio.designTheme.text} | Accent: {currentPortfolio.designTheme.accent}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">핵심 기능</h3>
                <div className="grid grid-cols-2 gap-3">
                  {currentPortfolio.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-gray-900/30 rounded-lg">
                      <span className="text-blue-400 mt-0.5">◆</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">기술 스택</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentPortfolio.techStack).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-3 bg-gray-900/30 rounded-lg">
                      <span className="text-gray-400 capitalize">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Screens */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">화면 구성</h3>
                <div className="grid grid-cols-3 gap-3">
                  {currentPortfolio.screens.map((screen, idx) => (
                    <div key={idx} className="p-3 bg-gray-900/30 rounded-lg text-center text-sm">
                      ◈ {screen}
                    </div>
                  ))}
                </div>
              </div>

              {/* Usage Steps */}
              <div>
                <h3 className="text-lg font-semibold mb-3">사용 방법</h3>
                <div className="space-y-2">
                  {currentPortfolio.usageSteps.map((step, idx) => (
                    <div key={idx} className="p-3 bg-gray-900/30 rounded-lg text-sm">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === 'list' && !currentPortfolio && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">◇</div>
                <h2 className="text-2xl font-bold mb-2">포트폴리오를 선택하거나</h2>
                <p className="text-gray-400 mb-6">새 포트폴리오를 생성하세요</p>
                <button
                  onClick={handleNewPortfolio}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  새 포트폴리오 만들기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
