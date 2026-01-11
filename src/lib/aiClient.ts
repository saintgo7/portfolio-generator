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

// 프로젝트 정보 포맷팅 헬퍼
function formatProjectInfo(request: AIDocumentRequest): string {
  const featuresText = request.mainFeatures?.length
    ? `\n- 주요 기능: ${request.mainFeatures.join(', ')}`
    : '';
  const techText = request.techPreferences
    ? `\n- 기술 선호: ${request.techPreferences}`
    : '';
  const targetText = request.targetUsers
    ? `\n- 대상 사용자: ${request.targetUsers}`
    : '';

  return `- 프로젝트명: ${request.projectName}
- 설명: ${request.projectDescription}
- 카테고리: ${request.category}
- 플랫폼: ${request.platform}${targetText}${featuresText}${techText}`;
}

// OpenAI GPT 최적화 프롬프트 - 구조화된 지시, 명확한 형식
function createOpenAIPrompt(request: AIDocumentRequest): string {
  const docInfo = DOCUMENT_TYPES.find(d => d.type === request.documentType);
  const docName = request.language === 'ko' ? docInfo?.nameKo : docInfo?.nameEn;
  const isKorean = request.language === 'ko';

  return `You are a senior software documentation specialist with 10+ years of experience.

# TASK
Create a professional "${docName}" document for the following project.

# PROJECT INFORMATION
${formatProjectInfo(request)}

# OUTPUT REQUIREMENTS
1. Language: ${isKorean ? 'Korean (한국어)' : 'English'}
2. Format: Markdown with proper headings (##, ###)
3. Document Type: ${request.documentType.toUpperCase()}

# STRUCTURE GUIDELINES
${getDocumentStructure(request.documentType, isKorean)}

# QUALITY CRITERIA
- Production-ready content that can be used immediately
- Include specific examples, metrics, and actionable items
- Use tables for comparisons and specifications
- Add code snippets where applicable
- Ensure logical flow between sections

Generate the complete document now.`;
}

// Claude 최적화 프롬프트 - 심층 분석, 맥락 활용
function createClaudePrompt(request: AIDocumentRequest): string {
  const docInfo = DOCUMENT_TYPES.find(d => d.type === request.documentType);
  const docName = request.language === 'ko' ? docInfo?.nameKo : docInfo?.nameEn;
  const isKorean = request.language === 'ko';

  return `당신은 ${request.category} 분야에서 10년 이상의 경험을 가진 시니어 소프트웨어 아키텍트이자 기술 문서 전문가입니다.

## 배경
${request.projectName}은(는) ${request.platform} 플랫폼을 위한 ${request.category} 솔루션입니다. ${request.projectDescription}

## 프로젝트 컨텍스트
${formatProjectInfo(request)}

## 요청
"${docName}" 문서를 작성해주세요.

## 작성 지침
1. **언어**: ${isKorean ? '한국어로 작성' : 'Write in English'}
2. **형식**: Markdown (##, ### 헤딩 사용)
3. **깊이**: 실무에서 즉시 활용 가능한 수준의 상세함

## 문서 구조
${getDocumentStructure(request.documentType, isKorean)}

## 품질 요구사항
- 각 섹션에 구체적인 예시와 근거 포함
- 기술적 결정에 대한 이유 설명
- 잠재적 위험과 대응 방안 제시
- 현실적이고 측정 가능한 지표 사용
- 업계 베스트 프랙티스 반영

문서를 생성해주세요.`;
}

// Gemini 최적화 프롬프트 - 간결하고 핵심적인 요청
function createGeminiPrompt(request: AIDocumentRequest): string {
  const docInfo = DOCUMENT_TYPES.find(d => d.type === request.documentType);
  const docName = request.language === 'ko' ? docInfo?.nameKo : docInfo?.nameEn;
  const isKorean = request.language === 'ko';

  return `역할: 소프트웨어 문서 전문가

프로젝트: ${request.projectName}
설명: ${request.projectDescription}
분야: ${request.category} | 플랫폼: ${request.platform}
${request.targetUsers ? `사용자: ${request.targetUsers}` : ''}
${request.mainFeatures?.length ? `기능: ${request.mainFeatures.join(', ')}` : ''}
${request.techPreferences ? `기술: ${request.techPreferences}` : ''}

작성할 문서: ${docName} (${request.documentType.toUpperCase()})
언어: ${isKorean ? '한국어' : 'English'}
형식: Markdown

구조:
${getDocumentStructure(request.documentType, isKorean)}

요구사항:
• 실무 활용 가능한 상세 내용
• 구체적 예시와 수치 포함
• 표와 코드 스니펫 활용
• 명확하고 간결한 문장

지금 문서를 생성하세요.`;
}

// 문서 타입별 구조 가이드라인
function getDocumentStructure(docType: string, isKorean: boolean): string {
  const structures: Record<string, { ko: string; en: string }> = {
    prd: {
      ko: `1. 개요 (제품명, 목적, 대상)
2. 배경 및 문제 정의
3. 기능 요구사항 (핵심/부가 기능, 우선순위)
4. 비기능 요구사항 (성능, 보안, 확장성)
5. 성공 지표 및 KPI
6. 릴리스 계획`,
      en: `1. Overview (Product, Purpose, Target)
2. Background & Problem Statement
3. Functional Requirements (Core/Secondary, Priority)
4. Non-Functional Requirements (Performance, Security, Scalability)
5. Success Metrics & KPIs
6. Release Plan`
    },
    trd: {
      ko: `1. 기술 개요 및 스택
2. 성능 요구사항 (응답시간, 처리량)
3. 보안 요구사항 (인증, 암호화)
4. 확장성 및 가용성
5. 모니터링 및 로깅
6. 기술적 제약사항`,
      en: `1. Technical Overview & Stack
2. Performance Requirements (Response Time, Throughput)
3. Security Requirements (Auth, Encryption)
4. Scalability & Availability
5. Monitoring & Logging
6. Technical Constraints`
    },
    mvp: {
      ko: `1. MVP 범위 정의
2. 핵심 기능 목록 (In/Out Scope)
3. 사용자 스토리
4. 기술적 결정사항
5. 성공 기준
6. 타임라인`,
      en: `1. MVP Scope Definition
2. Core Features (In/Out Scope)
3. User Stories
4. Technical Decisions
5. Success Criteria
6. Timeline`
    },
    tdd: {
      ko: `1. 시스템 아키텍처 개요
2. 컴포넌트 설계
3. 데이터 모델
4. API 인터페이스
5. 보안 설계
6. 에러 처리 전략`,
      en: `1. System Architecture Overview
2. Component Design
3. Data Model
4. API Interface
5. Security Design
6. Error Handling Strategy`
    },
    uix: {
      ko: `1. 디자인 원칙 및 가이드라인
2. 정보 구조 (IA)
3. 와이어프레임 설명
4. UI 컴포넌트 명세
5. 인터랙션 패턴
6. 접근성 고려사항`,
      en: `1. Design Principles & Guidelines
2. Information Architecture
3. Wireframe Description
4. UI Component Specs
5. Interaction Patterns
6. Accessibility Considerations`
    },
    api: {
      ko: `1. API 개요 및 Base URL
2. 인증 방식
3. 엔드포인트 목록 (CRUD)
4. 요청/응답 스키마
5. 에러 코드
6. 사용 예제`,
      en: `1. API Overview & Base URL
2. Authentication
3. Endpoints (CRUD)
4. Request/Response Schema
5. Error Codes
6. Usage Examples`
    },
    database: {
      ko: `1. 데이터베이스 개요
2. ERD 설명
3. 테이블 스키마
4. 인덱스 전략
5. 관계 정의
6. 마이그레이션 계획`,
      en: `1. Database Overview
2. ERD Description
3. Table Schema
4. Index Strategy
5. Relationships
6. Migration Plan`
    },
    architecture: {
      ko: `1. 시스템 개요
2. 아키텍처 다이어그램
3. 컴포넌트 설명
4. 통신 흐름
5. 기술 스택 상세
6. 확장 전략`,
      en: `1. System Overview
2. Architecture Diagram
3. Component Description
4. Communication Flow
5. Tech Stack Details
6. Scaling Strategy`
    },
    deployment: {
      ko: `1. 배포 환경 (Dev/Staging/Prod)
2. 인프라 구성
3. CI/CD 파이프라인
4. 환경 변수 관리
5. 롤백 절차
6. 모니터링 설정`,
      en: `1. Deployment Environments
2. Infrastructure Setup
3. CI/CD Pipeline
4. Environment Variables
5. Rollback Procedures
6. Monitoring Setup`
    },
    userManual: {
      ko: `1. 시작하기
2. 주요 기능 사용법
3. 설정 및 환경
4. FAQ
5. 문제 해결
6. 고객 지원`,
      en: `1. Getting Started
2. Feature Guide
3. Settings & Configuration
4. FAQ
5. Troubleshooting
6. Support`
    },
    codingConvention: {
      ko: `1. 코딩 스타일 가이드
2. 네이밍 규칙
3. 파일/폴더 구조
4. 주석 규칙
5. Git 커밋 컨벤션
6. 코드 리뷰 가이드`,
      en: `1. Coding Style Guide
2. Naming Conventions
3. File/Folder Structure
4. Comment Rules
5. Git Commit Convention
6. Code Review Guide`
    },
    projectPlan: {
      ko: `1. 프로젝트 개요
2. 마일스톤
3. 스프린트 계획
4. 리소스 할당
5. 리스크 관리
6. 커뮤니케이션 계획`,
      en: `1. Project Overview
2. Milestones
3. Sprint Planning
4. Resource Allocation
5. Risk Management
6. Communication Plan`
    }
  };

  const structure = structures[docType] || structures.prd;
  return isKorean ? structure.ko : structure.en;
}

// 통합 프롬프트 생성 함수 - 모델별 최적화
function createDocumentPrompt(request: AIDocumentRequest, provider: AIProvider): string {
  switch (provider) {
    case 'openai':
      return createOpenAIPrompt(request);
    case 'claude':
      return createClaudePrompt(request);
    case 'gemini':
      return createGeminiPrompt(request);
    default:
      return createOpenAIPrompt(request); // 기본값
  }
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
  // 모델별 최적화된 프롬프트 생성
  const prompt = createDocumentPrompt(request, config.provider);
  const providerInfo = AI_PROVIDERS.find(p => p.id === config.provider);
  const model = config.model || providerInfo?.defaultModel || '';

  console.log(`[AI] Using ${config.provider} optimized prompt for ${request.documentType}`);

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
