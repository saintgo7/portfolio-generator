'use client';

import { useState } from 'react';
import { ProjectInput, DOCUMENT_TYPES, Language } from '@/types/documents';
import { exportAllAsZip, downloadFile, exportAllToMarkdown } from '@/lib/documentExporter';
import { generateAllDocuments } from '@/lib/documentGenerator';

interface Props {
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'healthcare', name: '헬스케어', nameEn: 'Healthcare' },
  { id: 'finance', name: '금융', nameEn: 'Finance' },
  { id: 'education', name: '교육', nameEn: 'Education' },
  { id: 'ecommerce', name: '이커머스', nameEn: 'E-commerce' },
  { id: 'social', name: '소셜', nameEn: 'Social' },
  { id: 'productivity', name: '생산성', nameEn: 'Productivity' },
  { id: 'entertainment', name: '엔터테인먼트', nameEn: 'Entertainment' },
  { id: 'iot', name: 'IoT', nameEn: 'IoT' },
  { id: 'ai', name: 'AI/ML', nameEn: 'AI/ML' },
  { id: 'blockchain', name: '블록체인', nameEn: 'Blockchain' },
];

const PLATFORMS = [
  { id: 'web', name: 'Web' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'desktop', name: 'Desktop' },
];

export default function DocumentGenerator({ onClose }: Props) {
  const [step, setStep] = useState<'input' | 'preview' | 'export'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [project, setProject] = useState<ProjectInput>({
    name: '',
    description: '',
    category: '',
    platform: '',
    targetUsers: '',
    mainFeatures: [],
    techPreferences: '',
  });
  const [featureInput, setFeatureInput] = useState('');
  const [selectedLangs, setSelectedLangs] = useState<{ ko: boolean; en: boolean }>({
    ko: true,
    en: true,
  });

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setProject(prev => ({
        ...prev,
        mainFeatures: [...(prev.mainFeatures || []), featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setProject(prev => ({
      ...prev,
      mainFeatures: prev.mainFeatures?.filter((_, i) => i !== index),
    }));
  };

  const handleGenerateAndDownload = async () => {
    if (!project.name || !project.description || !project.category || !project.platform) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsGenerating(true);

    try {
      const zipBlob = await exportAllAsZip(project, selectedLangs.ko, selectedLangs.en);
      downloadFile(`${project.name.replace(/\s+/g, '_')}_Documents.zip`, zipBlob);
      setStep('export');
    } catch (error) {
      console.error('문서 생성 오류:', error);
      alert('문서 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {step === 'input' && '📝 프로젝트 정보 입력'}
            {step === 'preview' && '📋 문서 미리보기'}
            {step === 'export' && '✅ 문서 생성 완료'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'input' && (
            <div className="space-y-6">
              {/* 프로젝트명 */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  프로젝트명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={e => setProject(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: HealthTracker Pro"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 설명 */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  프로젝트 설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={project.description}
                  onChange={e => setProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="프로젝트에 대한 상세한 설명을 입력하세요..."
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* 카테고리 & 플랫폼 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    카테고리 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={project.category}
                    onChange={e => setProject(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    플랫폼 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={project.platform}
                    onChange={e => setProject(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">선택하세요</option>
                    {PLATFORMS.map(plat => (
                      <option key={plat.id} value={plat.name}>
                        {plat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 대상 사용자 */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  대상 사용자
                </label>
                <input
                  type="text"
                  value={project.targetUsers}
                  onChange={e => setProject(prev => ({ ...prev, targetUsers: e.target.value }))}
                  placeholder="예: 건강 관리에 관심 있는 20-40대 직장인"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* 주요 기능 */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  주요 기능
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddFeature()}
                    placeholder="기능을 입력하고 Enter"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.mainFeatures?.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        onClick={() => handleRemoveFeature(index)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 언어 선택 */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  문서 언어
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLangs.ko}
                      onChange={e => setSelectedLangs(prev => ({ ...prev, ko: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white">한글 (Korean)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLangs.en}
                      onChange={e => setSelectedLangs(prev => ({ ...prev, en: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-white">English</span>
                  </label>
                </div>
              </div>

              {/* 생성될 문서 목록 */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  생성될 문서 (12종)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DOCUMENT_TYPES.map(doc => (
                    <div
                      key={doc.type}
                      className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded text-sm"
                    >
                      <span>{doc.icon}</span>
                      <span className="text-zinc-300">{doc.nameKo.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'export' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                문서 생성 완료!
              </h3>
              <p className="text-zinc-400 mb-6">
                {selectedLangs.ko && selectedLangs.en ? '한글 및 영문' : selectedLangs.ko ? '한글' : '영문'} 문서가 다운로드되었습니다.
              </p>
              <div className="bg-zinc-800 rounded-lg p-4 inline-block text-left">
                <p className="text-zinc-300 text-sm mb-2">📦 포함된 파일:</p>
                <ul className="text-zinc-400 text-sm space-y-1">
                  <li>• 12종 문서 × {(selectedLangs.ko ? 1 : 0) + (selectedLangs.en ? 1 : 0)} 언어</li>
                  <li>• MD (Markdown) + DOCX (Word) 형식</li>
                  <li>• 총 {12 * 2 * ((selectedLangs.ko ? 1 : 0) + (selectedLangs.en ? 1 : 0))}개 파일</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
          {step === 'input' && (
            <>
              <button
                onClick={onClose}
                className="px-6 py-2 text-zinc-400 hover:text-white"
              >
                취소
              </button>
              <button
                onClick={handleGenerateAndDownload}
                disabled={isGenerating || !project.name || !project.description}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    생성 중...
                  </>
                ) : (
                  <>
                    📥 문서 생성 및 다운로드
                  </>
                )}
              </button>
            </>
          )}
          {step === 'export' && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
