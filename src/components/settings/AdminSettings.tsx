'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Provider = 'openai' | 'claude' | 'gemini';

interface AdminKey {
  provider: Provider;
  hasKey: boolean;
  model: string;
  isActive: boolean;
  dailyLimit: number;
}

interface Props {
  onClose: () => void;
}

const PROVIDER_INFO: Record<Provider, { name: string; icon: string; defaultModel: string }> = {
  openai: { name: 'OpenAI', icon: '🤖', defaultModel: 'gpt-4o-mini' },
  claude: { name: 'Claude', icon: '🧠', defaultModel: 'claude-sonnet-4-20250514' },
  gemini: { name: 'Gemini', icon: '💎', defaultModel: 'gemini-1.5-flash' },
};

export default function AdminSettings({ onClose }: Props) {
  const { profile } = useAuth();
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Provider | null>(null);

  // 키 입력 상태
  const [newKeys, setNewKeys] = useState<Record<Provider, string>>({
    openai: '',
    claude: '',
    gemini: '',
  });

  // 관리자 권한 확인
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      loadAdminKeys();
    }
  }, [isAdmin]);

  const loadAdminKeys = async () => {
    try {
      // 관리자 키 상태 확인 (API 통해)
      const response = await fetch('/api/admin/keys');
      if (response.ok) {
        const data = await response.json();
        setKeys(data.keys);
      }
    } catch (error) {
      console.error('Failed to load admin keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = async (provider: Provider) => {
    const key = newKeys[provider];
    if (!key.trim()) return;

    setSaving(provider);
    try {
      const response = await fetch('/api/admin/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: key,
          model: PROVIDER_INFO[provider].defaultModel,
        }),
      });

      if (response.ok) {
        setNewKeys(prev => ({ ...prev, [provider]: '' }));
        await loadAdminKeys();
        alert(`${PROVIDER_INFO[provider].name} API 키가 저장되었습니다.`);
      } else {
        const error = await response.json();
        alert(error.error || '저장 실패');
      }
    } catch (error) {
      console.error('Save key error:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteKey = async (provider: Provider) => {
    if (!confirm(`${PROVIDER_INFO[provider].name} API 키를 삭제하시겠습니까?`)) return;

    try {
      const response = await fetch('/api/admin/keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        await loadAdminKeys();
        alert('키가 삭제되었습니다.');
      }
    } catch (error) {
      console.error('Delete key error:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-white mb-2">접근 권한 없음</h2>
          <p className="text-zinc-400 mb-6">관리자만 접근할 수 있습니다.</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">관리자 API 설정</h2>
            <p className="text-zinc-400 text-sm mt-1">모든 사용자가 공용으로 사용할 API 키를 관리합니다</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin text-4xl mb-4">⏳</div>
              <p className="text-zinc-400">로딩 중...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {(Object.keys(PROVIDER_INFO) as Provider[]).map((provider) => {
                const info = PROVIDER_INFO[provider];
                const existingKey = keys.find(k => k.provider === provider);

                return (
                  <div key={provider} className="p-4 bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <h3 className="font-medium text-white">{info.name}</h3>
                          <p className="text-xs text-zinc-400">{info.defaultModel}</p>
                        </div>
                      </div>
                      {existingKey?.hasKey && (
                        <span className={`px-2 py-1 text-xs rounded ${
                          existingKey.isActive
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}>
                          {existingKey.isActive ? '활성' : '비활성'}
                        </span>
                      )}
                    </div>

                    {existingKey?.hasKey ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 bg-zinc-700 rounded text-sm text-zinc-400">
                          ••••••••••••••••
                        </div>
                        <button
                          onClick={() => handleDeleteKey(provider)}
                          className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded text-sm transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={newKeys[provider]}
                          onChange={(e) => setNewKeys(prev => ({ ...prev, [provider]: e.target.value }))}
                          placeholder="API 키 입력"
                          className="flex-1 px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleSaveKey(provider)}
                          disabled={!newKeys[provider].trim() || saving === provider}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500 rounded text-sm transition-colors"
                        >
                          {saving === provider ? '저장 중...' : '저장'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 안내 */}
              <div className="p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                <h4 className="font-medium text-blue-400 mb-2">💡 안내</h4>
                <ul className="text-sm text-zinc-400 space-y-1">
                  <li>• 여기서 설정한 API 키는 모든 사용자가 공용으로 사용합니다.</li>
                  <li>• 키는 암호화되어 안전하게 저장됩니다.</li>
                  <li>• 사용량은 usage_logs 테이블에서 추적됩니다.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
