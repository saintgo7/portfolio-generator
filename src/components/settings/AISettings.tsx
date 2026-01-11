'use client';

import { useState, useEffect } from 'react';
import {
  AIProvider,
  AIConfig,
  AI_PROVIDERS,
  SavedAISettings
} from '@/types/ai';
import { saveAISettings, loadAISettings, testAPIKey } from '@/lib/aiClient';

interface Props {
  onClose: () => void;
  onSave?: (settings: SavedAISettings) => void;
}

export default function AISettings({ onClose, onSave }: Props) {
  const [configs, setConfigs] = useState<AIConfig[]>([]);
  const [preferredProvider, setPreferredProvider] = useState<AIProvider>('openai');
  const [testingProvider, setTestingProvider] = useState<AIProvider | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = loadAISettings();
    if (saved) {
      setConfigs(saved.configs);
      setPreferredProvider(saved.preferredProvider);
    } else {
      // 기본 설정
      setConfigs(
        AI_PROVIDERS.map(p => ({
          provider: p.id,
          apiKey: '',
          model: p.defaultModel,
          enabled: false,
        }))
      );
    }
  }, []);

  const handleApiKeyChange = (provider: AIProvider, apiKey: string) => {
    setConfigs(prev =>
      prev.map(c =>
        c.provider === provider ? { ...c, apiKey, enabled: apiKey.length > 0 } : c
      )
    );
    // 테스트 결과 초기화
    setTestResults(prev => ({ ...prev, [provider]: undefined as any }));
  };

  const handleModelChange = (provider: AIProvider, model: string) => {
    setConfigs(prev =>
      prev.map(c => (c.provider === provider ? { ...c, model } : c))
    );
  };

  const handleTest = async (provider: AIProvider) => {
    const config = configs.find(c => c.provider === provider);
    if (!config?.apiKey) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { success: false, message: '❌ API 키를 입력해주세요.' },
      }));
      return;
    }

    setTestingProvider(provider);
    const result = await testAPIKey(provider, config.apiKey, config.model);
    setTestResults(prev => ({ ...prev, [provider]: result }));
    setTestingProvider(null);
  };

  const handleSave = () => {
    const settings: SavedAISettings = {
      configs,
      preferredProvider,
      lastUpdated: new Date().toISOString(),
    };
    saveAISettings(settings);
    onSave?.(settings);
    onClose();
  };

  const getProviderConfig = (provider: AIProvider) =>
    configs.find(c => c.provider === provider);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">⚙️ AI API 설정</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 기본 제공자 선택 */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              기본 AI 제공자
            </label>
            <div className="flex gap-2">
              {AI_PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPreferredProvider(p.id)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    preferredProvider === p.id
                      ? 'border-blue-500 bg-blue-600/20'
                      : 'border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <div className="text-2xl mb-1">{p.icon}</div>
                  <div className="text-sm text-white">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 각 제공자별 설정 */}
          {AI_PROVIDERS.map(provider => {
            const config = getProviderConfig(provider.id);
            const testResult = testResults[provider.id];

            return (
              <div
                key={provider.id}
                className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{provider.icon}</span>
                    <span className="font-medium text-white">{provider.name}</span>
                    {config?.enabled && config?.apiKey && (
                      <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">
                        설정됨
                      </span>
                    )}
                  </div>
                  <a
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    API 키 발급 →
                  </a>
                </div>

                {/* API Key Input */}
                <div className="mb-3">
                  <label className="block text-xs text-zinc-500 mb-1">API Key</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type={showKeys[provider.id] ? 'text' : 'password'}
                        value={config?.apiKey || ''}
                        onChange={e => handleApiKeyChange(provider.id, e.target.value)}
                        placeholder={provider.apiKeyPlaceholder}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-blue-500 pr-10"
                      />
                      <button
                        onClick={() =>
                          setShowKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                      >
                        {showKeys[provider.id] ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <button
                      onClick={() => handleTest(provider.id)}
                      disabled={!config?.apiKey || testingProvider === provider.id}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {testingProvider === provider.id ? '테스트 중...' : '테스트'}
                    </button>
                  </div>
                  {testResult && (
                    <div
                      className={`mt-2 text-sm ${
                        testResult.success ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {testResult.message}
                    </div>
                  )}
                </div>

                {/* Model Selection */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">모델</label>
                  <select
                    value={config?.model || provider.defaultModel}
                    onChange={e => handleModelChange(provider.id, e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    {provider.models.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}

          {/* 안내 */}
          <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <div className="text-yellow-400 text-sm">
              ⚠️ <strong>보안 안내</strong>
            </div>
            <p className="text-zinc-400 text-sm mt-1">
              API 키는 로컬 브라우저에만 저장됩니다. 외부로 전송되지 않으며, 각 AI
              제공자 API에 직접 요청할 때만 사용됩니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-zinc-400 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
