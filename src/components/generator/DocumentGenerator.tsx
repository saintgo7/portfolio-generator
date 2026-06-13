'use client';

import { useState, useEffect } from 'react';
import { ProjectInput, DOCUMENT_TYPES, Language } from '@/types/documents';
import { AIConfig, AI_PROVIDERS, SavedAISettings } from '@/types/ai';
import { exportAllAsZip, downloadFile } from '@/lib/documentExporter';
import { loadAISettings, generateAllDocumentsWithAI } from '@/lib/aiClient';
import AISettings from '@/components/settings/AISettings';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  onClose: () => void;
}

type GenerationMode = 'template' | 'ai';

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
  const { user, profile } = useAuth();
  const [step, setStep] = useState<'input' | 'generating' | 'export'>('input');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<GenerationMode>('template');
  const [showAISettings, setShowAISettings] = useState(false);
  const [aiSettings, setAISettings] = useState<SavedAISettings | null>(null);
  const [generationProgress, setGenerationProgress] = useState({ current: 0, total: 0, docType: '' });
  const [useServerAPI, setUseServerAPI] = useState(true); // 서버 API 사용 여부
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'claude' | 'gemini'>('claude');

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

  // AI 설정 로드
  useEffect(() => {
    const saved = loadAISettings();
    setAISettings(saved);
  }, []);

  const hasValidAIConfig = () => {
    if (!aiSettings) return false;
    return aiSettings.configs.some(c => c.enabled && c.apiKey);
  };

  const getActiveAIConfig = (): AIConfig | null => {
    if (!aiSettings) return null;
    // 우선: 선호 제공자
    const preferred = aiSettings.configs.find(
      c => c.provider === aiSettings.preferredProvider && c.enabled && c.apiKey
    );
    if (preferred) return preferred;
    // 대안: 활성화된 아무 제공자
    return aiSettings.configs.find(c => c.enabled && c.apiKey) || null;
  };

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

  const handleGenerateWithTemplate = async () => {
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

  // 서버 API로 문서 생성
  const generateWithServerAPI = async (
    documentType: string,
    lang: Language
  ): Promise<string> => {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentType,
        projectInfo: {
          title: project.name + (lang === 'en' ? ' (English)' : ''),
          description: project.description + (lang === 'en' ? ' - Please write in English.' : ''),
          techStack: project.techPreferences?.split(',').map(s => s.trim()).filter(Boolean),
          features: project.mainFeatures,
          targetAudience: project.targetUsers,
        },
        provider: selectedProvider,
        useAdminKey: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '서버 오류');
    }

    const data = await response.json();
    return data.content;
  };

  const handleGenerateWithAI = async () => {
    if (!project.name || !project.description || !project.category || !project.platform) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 서버 API 사용 시 로그인 필수
    if (useServerAPI && !user) {
      alert('AI 문서 생성을 위해 로그인이 필요합니다.');
      return;
    }

    // 로컬 모드일 때만 API 설정 확인
    if (!useServerAPI) {
      const config = getActiveAIConfig();
      if (!config) {
        alert('AI API 설정이 필요합니다.');
        setShowAISettings(true);
        return;
      }
    }

    setIsGenerating(true);
    setStep('generating');

    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      const projectFolder = project.name.replace(/\s+/g, '_');
      const documentTypes = DOCUMENT_TYPES.map(d => d.type);
      const totalDocs = documentTypes.length * ((selectedLangs.ko ? 1 : 0) + (selectedLangs.en ? 1 : 0));
      let currentDoc = 0;

      // 서버 API 모드
      if (useServerAPI) {
        // 한글 문서 생성
        if (selectedLangs.ko) {
          const koFolder = zip.folder(`${projectFolder}/한글`);
          for (const docType of documentTypes) {
            currentDoc++;
            setGenerationProgress({ current: currentDoc, total: totalDocs, docType });

            try {
              const content = await generateWithServerAPI(docType, 'ko');
              koFolder?.file(`${docType.toUpperCase()}_KO.md`, content);
              const docxBlob = await createDocx(content);
              koFolder?.file(`${docType.toUpperCase()}_KO.docx`, docxBlob);
            } catch (error) {
              console.error(`Error generating ${docType}:`, error);
              koFolder?.file(`${docType.toUpperCase()}_KO.md`, `# ${docType}\n\n생성 중 오류가 발생했습니다.`);
            }
          }
        }

        // 영문 문서 생성
        if (selectedLangs.en) {
          const enFolder = zip.folder(`${projectFolder}/English`);
          for (const docType of documentTypes) {
            currentDoc++;
            setGenerationProgress({ current: currentDoc, total: totalDocs, docType });

            try {
              const content = await generateWithServerAPI(docType, 'en');
              enFolder?.file(`${docType.toUpperCase()}_EN.md`, content);
              const docxBlob = await createDocx(content);
              enFolder?.file(`${docType.toUpperCase()}_EN.docx`, docxBlob);
            } catch (error) {
              console.error(`Error generating ${docType}:`, error);
              enFolder?.file(`${docType.toUpperCase()}_EN.md`, `# ${docType}\n\nError occurred during generation.`);
            }
          }
        }
      } else {
        // 로컬 API 모드 (기존 방식)
        const config = getActiveAIConfig()!;

        if (selectedLangs.ko) {
          const koFolder = zip.folder(`${projectFolder}/한글`);
          const koDocs = await generateAllDocumentsWithAI(
            config,
            project,
            'ko',
            (current, total, docType) => {
              setGenerationProgress({ current, total, docType });
            }
          );

          for (const doc of koDocs) {
            koFolder?.file(`${doc.type.toUpperCase()}_KO.md`, doc.content);
            const docxBlob = await createDocx(doc.content);
            koFolder?.file(`${doc.type.toUpperCase()}_KO.docx`, docxBlob);
          }
        }

        if (selectedLangs.en) {
          const enFolder = zip.folder(`${projectFolder}/English`);
          const enDocs = await generateAllDocumentsWithAI(
            config,
            project,
            'en',
            (current, total, docType) => {
              setGenerationProgress({
                current: (selectedLangs.ko ? 12 : 0) + current,
                total: (selectedLangs.ko ? 12 : 0) + total,
                docType
              });
            }
          );

          for (const doc of enDocs) {
            enFolder?.file(`${doc.type.toUpperCase()}_EN.md`, doc.content);
            const docxBlob = await createDocx(doc.content);
            enFolder?.file(`${doc.type.toUpperCase()}_EN.docx`, docxBlob);
          }
        }
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/zip'
      });
      downloadFile(`${project.name.replace(/\s+/g, '_')}_AI_Documents.zip`, zipBlob);
      setStep('export');
    } catch (error) {
      console.error('AI 문서 생성 오류:', error);
      alert('AI 문서 생성 중 오류가 발생했습니다: ' + error);
      setStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  // Markdown을 DOCX로 변환
  async function createDocx(content: string): Promise<Blob> {
    const { Document, Paragraph, TextRun, HeadingLevel, Packer } = await import('docx');

    const lines = content.split('\n');
    const children: any[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        children.push(new Paragraph({
          text: line.replace('# ', ''),
          heading: HeadingLevel.TITLE,
        }));
      } else if (line.startsWith('## ')) {
        children.push(new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }));
      } else if (line.startsWith('### ')) {
        children.push(new Paragraph({
          text: line.replace('### ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
        }));
      } else if (line.startsWith('- ')) {
        children.push(new Paragraph({
          bullet: { level: 0 },
          children: [new TextRun(line.replace('- ', ''))],
        }));
      } else if (line.match(/^\d+\. /)) {
        children.push(new Paragraph({
          children: [new TextRun(line)],
        }));
      } else if (line.startsWith('|')) {
        children.push(new Paragraph({
          children: [new TextRun({ text: line, font: 'Courier New', size: 20 })],
        }));
      } else if (line.startsWith('```')) {
        // 코드 블록 시작/끝 무시
      } else if (line.trim()) {
        children.push(new Paragraph({
          children: [new TextRun(line)],
        }));
      } else {
        children.push(new Paragraph({ text: '' }));
      }
    }

    const document = new Document({
      sections: [{ properties: {}, children }],
    });

    return await Packer.toBlob(document);
  }

  const handleGenerate = () => {
    if (generationMode === 'ai') {
      handleGenerateWithAI();
    } else {
      handleGenerateWithTemplate();
    }
  };

  const activeProvider = getActiveAIConfig();
  const providerInfo = activeProvider
    ? AI_PROVIDERS.find(p => p.id === activeProvider.provider)
    : null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {step === 'input' && '📝 프로젝트 정보 입력'}
              {step === 'generating' && '🤖 AI 문서 생성 중...'}
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
                {/* 생성 모드 선택 */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    문서 생성 방식
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setGenerationMode('template')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        generationMode === 'template'
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">📄</div>
                      <div className="font-medium text-white">템플릿 기반</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        미리 정의된 템플릿으로 빠른 생성
                      </div>
                    </button>
                    <button
                      onClick={() => setGenerationMode('ai')}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        generationMode === 'ai'
                          ? 'border-purple-500 bg-purple-600/20'
                          : 'border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-2xl mb-1">🤖</div>
                      <div className="font-medium text-white">AI 기반</div>
                      <div className="text-xs text-zinc-400 mt-1">
                        GPT / Claude / Gemini로 고품질 문서
                      </div>
                    </button>
                  </div>
                </div>

                {/* AI 설정 상태 */}
                {generationMode === 'ai' && (
                  <div className="space-y-3">
                    {/* 서버 API vs 로컬 API 선택 */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setUseServerAPI(true)}
                        className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
                          useServerAPI
                            ? 'border-green-500 bg-green-600/20'
                            : 'border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <div className="font-medium text-white text-sm">🌐 서버 API (권장)</div>
                        <div className="text-xs text-zinc-400 mt-1">
                          로그인 후 무료 사용
                        </div>
                      </button>
                      <button
                        onClick={() => setUseServerAPI(false)}
                        className={`flex-1 p-3 rounded-lg border-2 text-left transition-all ${
                          !useServerAPI
                            ? 'border-blue-500 bg-blue-600/20'
                            : 'border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        <div className="font-medium text-white text-sm">🔑 개인 API 키</div>
                        <div className="text-xs text-zinc-400 mt-1">
                          본인 API 키 사용
                        </div>
                      </button>
                    </div>

                    {/* 서버 API 모드 */}
                    {useServerAPI ? (
                      <div className={`p-4 rounded-lg border ${
                        user
                          ? 'bg-green-600/10 border-green-600/30'
                          : 'bg-yellow-600/10 border-yellow-600/30'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {user ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span className="text-green-400 font-medium">
                                  로그인됨: {profile?.full_name || user.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-yellow-400">
                                ⚠️ AI 문서 생성을 위해 로그인이 필요합니다
                              </span>
                            )}
                          </div>
                        </div>

                        {/* AI 제공자 선택 */}
                        <div>
                          <label className="block text-xs text-zinc-400 mb-2">AI 제공자 선택</label>
                          <div className="flex gap-2">
                            {[
                              { id: 'openai', name: 'GPT-4o', icon: '🤖' },
                              { id: 'claude', name: 'Claude', icon: '🧠' },
                              { id: 'gemini', name: 'Gemini', icon: '💎' },
                            ].map(p => (
                              <button
                                key={p.id}
                                onClick={() => setSelectedProvider(p.id as any)}
                                className={`flex-1 p-2 rounded-lg text-sm transition-all ${
                                  selectedProvider === p.id
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                }`}
                              >
                                {p.icon} {p.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* 로컬 API 모드 */
                      <div className={`p-4 rounded-lg border ${
                        hasValidAIConfig()
                          ? 'bg-green-600/10 border-green-600/30'
                          : 'bg-yellow-600/10 border-yellow-600/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            {hasValidAIConfig() ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-400">{providerInfo?.icon}</span>
                                <span className="text-green-400 font-medium">
                                  {providerInfo?.name} 연결됨
                                </span>
                                <span className="text-zinc-500 text-sm">
                                  ({activeProvider?.model})
                                </span>
                              </div>
                            ) : (
                              <span className="text-yellow-400">
                                ⚠️ AI API 설정이 필요합니다
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setShowAISettings(true)}
                            className="px-3 py-1 bg-zinc-800 text-zinc-300 text-sm rounded hover:bg-zinc-700"
                          >
                            ⚙️ API 설정
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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

                {/* 기술 선호도 (AI 모드에서만) */}
                {generationMode === 'ai' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">
                      기술 선호도 (선택)
                    </label>
                    <input
                      type="text"
                      value={project.techPreferences}
                      onChange={e => setProject(prev => ({ ...prev, techPreferences: e.target.value }))}
                      placeholder="예: React, TypeScript, PostgreSQL"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

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

            {step === 'generating' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-pulse">
                  {providerInfo?.icon || '🤖'}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  AI가 문서를 생성하고 있습니다...
                </h3>
                <p className="text-zinc-400 mb-6">
                  {providerInfo?.name}로 {generationProgress.total}개 중 {generationProgress.current}개 생성 중
                </p>
                <div className="w-full max-w-md mx-auto bg-zinc-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                    style={{
                      width: `${(generationProgress.current / (generationProgress.total || 1)) * 100}%`
                    }}
                  />
                </div>
                <p className="text-zinc-500 text-sm mt-3">
                  현재: {generationProgress.docType.toUpperCase()}
                </p>
              </div>
            )}

            {step === 'export' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  문서 생성 완료!
                </h3>
                <p className="text-zinc-400 mb-6">
                  {generationMode === 'ai' ? 'AI로 생성된 ' : ''}
                  {selectedLangs.ko && selectedLangs.en ? '한글 및 영문' : selectedLangs.ko ? '한글' : '영문'} 문서가 다운로드되었습니다.
                </p>
                <div className="bg-zinc-800 rounded-lg p-4 inline-block text-left">
                  <p className="text-zinc-300 text-sm mb-2">📦 포함된 파일:</p>
                  <ul className="text-zinc-400 text-sm space-y-1">
                    <li>• 12종 문서 × {(selectedLangs.ko ? 1 : 0) + (selectedLangs.en ? 1 : 0)} 언어</li>
                    <li>• MD (Markdown) + DOCX (Word) 형식</li>
                    <li>• 총 {12 * 2 * ((selectedLangs.ko ? 1 : 0) + (selectedLangs.en ? 1 : 0))}개 파일</li>
                    {generationMode === 'ai' && activeProvider && (
                      <li>• 생성 AI: {providerInfo?.name} ({activeProvider.model})</li>
                    )}
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
                  onClick={handleGenerate}
                  disabled={isGenerating || !project.name || !project.description || !project.category || !project.platform}
                  className={`px-6 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                    generationMode === 'ai'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      생성 중...
                    </>
                  ) : (
                    <>
                      {generationMode === 'ai' ? '🤖 AI로 생성' : '📥 템플릿으로 생성'}
                    </>
                  )}
                </button>
              </>
            )}
            {step === 'generating' && (
              <button
                onClick={() => setStep('input')}
                className="px-6 py-2 text-zinc-400 hover:text-white"
              >
                취소
              </button>
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

      {/* AI Settings Modal */}
      {showAISettings && (
        <AISettings
          onClose={() => setShowAISettings(false)}
          onSave={settings => setAISettings(settings)}
        />
      )}
    </>
  );
}
