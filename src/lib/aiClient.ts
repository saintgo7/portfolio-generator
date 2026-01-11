// AI API 클라이언트

import {
  AIProvider,
  AIConfig,
  AIDocumentRequest,
  AIDocumentResponse,
  AI_PROVIDERS,
  SavedAISettings
} from '@/types/ai';
import { DocumentType, DOCUMENT_TYPES } from '@/types/documents';

const STORAGE_KEY = 'portfolio_ai_settings';

// API 설정 저장
export function saveAISettings(settings: SavedAISettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}

// API 설정 로드
export function loadAISettings(): SavedAISettings | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
  }
  return null;
}

// API 키 유효성 검사
export function validateApiKey(provider: AIProvider, apiKey: string): boolean {
  const providerInfo = AI_PROVIDERS.find(p => p.id === provider);
  if (!providerInfo) return false;

  // 기본적인 형식 검사 (실제 유효성은 API 호출로 확인)
  return apiKey.length > 20;
}

// 문서 생성 프롬프트 생성
function createDocumentPrompt(request: AIDocumentRequest): string {
  const docInfo = DOCUMENT_TYPES.find(d => d.type === request.documentType);
  const docName = request.language === 'ko' ? docInfo?.nameKo : docInfo?.nameEn;

  const langInstruction = request.language === 'ko'
    ? '한국어로 작성해주세요.'
    : 'Please write in English.';

  const featuresText = request.mainFeatures?.length
    ? `\n주요 기능: ${request.mainFeatures.join(', ')}`
    : '';

  const techText = request.techPreferences
    ? `\n기술 선호: ${request.techPreferences}`
    : '';

  const targetText = request.targetUsers
    ? `\n대상 사용자: ${request.targetUsers}`
    : '';

  return `당신은 전문적인 소프트웨어 문서 작성 전문가입니다.

다음 프로젝트에 대한 "${docName}" 문서를 작성해주세요.

## 프로젝트 정보
- 프로젝트명: ${request.projectName}
- 설명: ${request.projectDescription}
- 카테고리: ${request.category}
- 플랫폼: ${request.platform}${targetText}${featuresText}${techText}

## 문서 요구사항
- 문서 유형: ${docName} (${request.documentType.toUpperCase()})
- ${langInstruction}
- Markdown 형식으로 작성
- 실무에서 바로 사용할 수 있는 수준의 상세한 내용
- 섹션별로 구체적인 예시와 설명 포함

전문적이고 체계적인 문서를 작성해주세요.`;
}

// OpenAI API 호출
async function callOpenAI(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional software documentation specialist.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// Claude API 호출
async function callClaude(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

// Gemini API 호출
async function callGemini(
  apiKey: string,
  model: string,
  prompt: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// 통합 AI 문서 생성 함수
export async function generateDocumentWithAI(
  config: AIConfig,
  request: AIDocumentRequest
): Promise<AIDocumentResponse> {
  const prompt = createDocumentPrompt(request);
  const providerInfo = AI_PROVIDERS.find(p => p.id === config.provider);
  const model = config.model || providerInfo?.defaultModel || '';

  let content: string;

  switch (config.provider) {
    case 'openai':
      content = await callOpenAI(config.apiKey, model, prompt);
      break;
    case 'claude':
      content = await callClaude(config.apiKey, model, prompt);
      break;
    case 'gemini':
      content = await callGemini(config.apiKey, model, prompt);
      break;
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }

  return {
    content,
    provider: config.provider,
    model,
  };
}

// 모든 문서 AI로 생성
export async function generateAllDocumentsWithAI(
  config: AIConfig,
  project: {
    name: string;
    description: string;
    category: string;
    platform: string;
    targetUsers?: string;
    mainFeatures?: string[];
    techPreferences?: string;
  },
  language: 'ko' | 'en',
  onProgress?: (current: number, total: number, docType: string) => void
): Promise<{ type: DocumentType; content: string }[]> {
  const results: { type: DocumentType; content: string }[] = [];
  const docTypes = DOCUMENT_TYPES.map(d => d.type);

  for (let i = 0; i < docTypes.length; i++) {
    const docType = docTypes[i];

    if (onProgress) {
      onProgress(i + 1, docTypes.length, docType);
    }

    try {
      const response = await generateDocumentWithAI(config, {
        projectName: project.name,
        projectDescription: project.description,
        category: project.category,
        platform: project.platform,
        targetUsers: project.targetUsers,
        mainFeatures: project.mainFeatures,
        techPreferences: project.techPreferences,
        documentType: docType,
        language,
      });

      results.push({
        type: docType as DocumentType,
        content: response.content,
      });
    } catch (error) {
      console.error(`Failed to generate ${docType}:`, error);
      // 실패 시 기본 템플릿으로 대체
      results.push({
        type: docType as DocumentType,
        content: `# ${docType.toUpperCase()}\n\n> AI 생성 실패. 기본 템플릿을 사용해주세요.\n\n${error}`,
      });
    }

    // API 레이트 리밋 방지를 위한 딜레이
    if (i < docTypes.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// API 키 테스트
export async function testAPIKey(
  provider: AIProvider,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; message: string }> {
  const testPrompt = 'Say "API connection successful" in one sentence.';
  const providerInfo = AI_PROVIDERS.find(p => p.id === provider);
  const useModel = model || providerInfo?.defaultModel || '';

  try {
    let response: string;

    switch (provider) {
      case 'openai':
        response = await callOpenAI(apiKey, useModel, testPrompt);
        break;
      case 'claude':
        response = await callClaude(apiKey, useModel, testPrompt);
        break;
      case 'gemini':
        response = await callGemini(apiKey, useModel, testPrompt);
        break;
      default:
        throw new Error('Unknown provider');
    }

    return {
      success: true,
      message: `✅ ${providerInfo?.name} API 연결 성공!`
    };
  } catch (error) {
    return {
      success: false,
      message: `❌ 연결 실패: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
