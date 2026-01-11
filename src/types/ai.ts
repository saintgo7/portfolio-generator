// AI 서비스 타입 정의

export type AIProvider = 'openai' | 'claude' | 'gemini';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  enabled: boolean;
}

export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  icon: string;
  models: AIModel[];
  defaultModel: string;
  apiKeyPattern: RegExp;
  apiKeyPlaceholder: string;
  docsUrl: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
}

// AI 제공자 정보
export const AI_PROVIDERS: AIProviderInfo[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: '최신 멀티모달 모델', maxTokens: 128000 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: '빠르고 경제적', maxTokens: 128000 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: '고성능 모델', maxTokens: 128000 },
    ],
    defaultModel: 'gpt-4o-mini',
    apiKeyPattern: /^sk-[a-zA-Z0-9-_]{32,}$/,
    apiKeyPlaceholder: 'sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    icon: '🧠',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', description: '최신 균형 모델', maxTokens: 200000 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', description: '빠르고 경제적', maxTokens: 200000 },
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', description: '최고 성능', maxTokens: 200000 },
    ],
    defaultModel: 'claude-sonnet-4-20250514',
    apiKeyPattern: /^sk-ant-[a-zA-Z0-9-_]{32,}$/,
    apiKeyPlaceholder: 'sk-ant-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '💎',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: '최신 빠른 모델', maxTokens: 1000000 },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: '고성능 모델', maxTokens: 2000000 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: '경제적 모델', maxTokens: 1000000 },
    ],
    defaultModel: 'gemini-2.0-flash',
    apiKeyPattern: /^[a-zA-Z0-9-_]{39}$/,
    apiKeyPlaceholder: 'AIza...',
    docsUrl: 'https://aistudio.google.com/apikey',
  },
];

// 문서 생성 요청
export interface AIDocumentRequest {
  projectName: string;
  projectDescription: string;
  category: string;
  platform: string;
  targetUsers?: string;
  mainFeatures?: string[];
  techPreferences?: string;
  documentType: string;
  language: 'ko' | 'en';
}

// AI 응답
export interface AIDocumentResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
}

// 저장된 API 설정
export interface SavedAISettings {
  configs: AIConfig[];
  preferredProvider: AIProvider;
  lastUpdated: string;
}

// OAuth 설정 (향후 확장용)
export interface OAuthConfig {
  provider: 'google';
  clientId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}
