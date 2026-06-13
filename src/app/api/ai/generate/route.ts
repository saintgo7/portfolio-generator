// 서버사이드 AI 문서 생성 API
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60초 타임아웃

interface GenerateRequest {
  documentType: string;
  projectInfo: {
    title: string;
    description: string;
    techStack?: string[];
    features?: string[];
    targetAudience?: string;
  };
  provider?: 'openai' | 'claude' | 'gemini';
  useAdminKey?: boolean; // 관리자 키 사용 여부
}

// 문서 타입별 구조 가이드라인
function getDocumentStructure(documentType: string): string {
  const structures: Record<string, string> = {
    prd: `## 1. 개요 (Executive Summary)
## 2. 목표 및 성공 지표
## 3. 사용자 스토리
## 4. 기능 요구사항
## 5. 비기능 요구사항
## 6. 제약 조건 및 가정
## 7. 릴리스 계획`,
    trd: `## 1. 기술 개요
## 2. 시스템 아키텍처
## 3. 기술 스택 상세
## 4. 데이터베이스 설계
## 5. API 설계
## 6. 보안 요구사항
## 7. 성능 요구사항
## 8. 배포 전략`,
    'user-flow': `## 1. 사용자 여정 개요
## 2. 핵심 플로우 다이어그램
## 3. 상세 시나리오
## 4. 예외 처리 플로우
## 5. 접근성 고려사항`,
    'db-design': `## 1. 데이터베이스 개요
## 2. ERD (Entity Relationship Diagram)
## 3. 테이블 스키마 상세
## 4. 인덱스 전략
## 5. 데이터 마이그레이션 계획`,
    'design-system': `## 1. 디자인 원칙
## 2. 컬러 시스템
## 3. 타이포그래피
## 4. 컴포넌트 라이브러리
## 5. 아이콘 및 일러스트레이션
## 6. 레이아웃 그리드`,
    tasks: `## 1. 프로젝트 개요
## 2. 마일스톤 정의
## 3. 태스크 브레이크다운
## 4. 우선순위 및 의존성
## 5. 리소스 할당
## 6. 위험 요소 및 대응`,
    'coding-convention': `## 1. 코딩 스타일 가이드
## 2. 네이밍 컨벤션
## 3. 파일/폴더 구조
## 4. 주석 작성 규칙
## 5. Git 커밋 컨벤션
## 6. 코드 리뷰 체크리스트`,
    architecture: `## 1. 시스템 개요
## 2. 아키텍처 다이어그램
## 3. 컴포넌트 상세
## 4. 통신 프로토콜
## 5. 확장성 고려사항
## 6. 장애 대응 전략`,
    'api-spec': `## 1. API 개요
## 2. 인증/인가
## 3. 엔드포인트 목록
## 4. 요청/응답 스키마
## 5. 에러 코드 정의
## 6. Rate Limiting`,
    testing: `## 1. 테스트 전략 개요
## 2. 단위 테스트
## 3. 통합 테스트
## 4. E2E 테스트
## 5. 성능 테스트
## 6. 테스트 커버리지 목표`,
    security: `## 1. 보안 개요
## 2. 인증/인가 전략
## 3. 데이터 보호
## 4. 취약점 대응
## 5. 보안 감사 체크리스트
## 6. 인시던트 대응 계획`,
    deployment: `## 1. 배포 환경 개요
## 2. 인프라 구성
## 3. CI/CD 파이프라인
## 4. 환경별 설정
## 5. 롤백 전략
## 6. 모니터링 및 알림`,
  };

  return structures[documentType] || structures.prd;
}

// OpenAI용 프롬프트
function createOpenAIPrompt(documentType: string, projectInfo: GenerateRequest['projectInfo']): string {
  const structure = getDocumentStructure(documentType);

  return `당신은 소프트웨어 문서 전문가입니다. 아래 프로젝트 정보를 기반으로 ${documentType.toUpperCase()} 문서를 작성해주세요.

## 프로젝트 정보
- 제목: ${projectInfo.title}
- 설명: ${projectInfo.description}
${projectInfo.techStack?.length ? `- 기술 스택: ${projectInfo.techStack.join(', ')}` : ''}
${projectInfo.features?.length ? `- 주요 기능: ${projectInfo.features.join(', ')}` : ''}
${projectInfo.targetAudience ? `- 대상 사용자: ${projectInfo.targetAudience}` : ''}

## 문서 구조
다음 구조를 따라 작성해주세요:
${structure}

## 작성 규칙
1. 마크다운 형식으로 작성
2. 각 섹션에 구체적이고 실용적인 내용 포함
3. 기술적으로 정확하고 실행 가능한 내용
4. 한국어로 작성`;
}

// Claude용 프롬프트
function createClaudePrompt(documentType: string, projectInfo: GenerateRequest['projectInfo']): string {
  const structure = getDocumentStructure(documentType);

  return `<context>
당신은 시니어 소프트웨어 아키텍트이자 기술 문서 전문가입니다.
수년간 다양한 규모의 프로젝트에서 기술 문서를 작성해온 경험이 있습니다.
</context>

<project>
제목: ${projectInfo.title}
설명: ${projectInfo.description}
${projectInfo.techStack?.length ? `기술 스택: ${projectInfo.techStack.join(', ')}` : ''}
${projectInfo.features?.length ? `주요 기능:\n${projectInfo.features.map(f => `- ${f}`).join('\n')}` : ''}
${projectInfo.targetAudience ? `대상 사용자: ${projectInfo.targetAudience}` : ''}
</project>

<task>
위 프로젝트에 대한 ${documentType.toUpperCase()} 문서를 작성해주세요.

문서 구조:
${structure}
</task>

<requirements>
- 마크다운 형식 사용
- 실제 프로젝트에서 바로 사용 가능한 수준의 구체성
- 기술적 깊이와 실용성 균형
- 한국어로 작성
</requirements>`;
}

// Gemini용 프롬프트
function createGeminiPrompt(documentType: string, projectInfo: GenerateRequest['projectInfo']): string {
  const structure = getDocumentStructure(documentType);

  return `프로젝트 "${projectInfo.title}"의 ${documentType.toUpperCase()} 문서를 작성하세요.

프로젝트: ${projectInfo.description}
${projectInfo.techStack?.length ? `기술: ${projectInfo.techStack.join(', ')}` : ''}
${projectInfo.features?.length ? `기능: ${projectInfo.features.join(', ')}` : ''}

구조:
${structure}

마크다운 형식, 한국어로 작성하세요.`;
}

// OpenAI 생성
async function generateWithOpenAI(apiKey: string, prompt: string): Promise<string> {
  const openai = new OpenAI({ apiKey });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return response.choices[0]?.message?.content || '';
}

// Claude 생성
async function generateWithClaude(apiKey: string, prompt: string): Promise<string> {
  const anthropic = new Anthropic({ apiKey });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

// Gemini 생성
async function generateWithGemini(apiKey: string, prompt: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 암호화된 키 복호화 (간단한 base64 - 실제로는 더 강력한 암호화 권장)
function decryptKey(encryptedKey: string): string {
  try {
    return Buffer.from(encryptedKey, 'base64').toString('utf-8');
  } catch {
    return encryptedKey;
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const body: GenerateRequest = await request.json();
    const { documentType, projectInfo, provider = 'openai', useAdminKey = true } = body;

    if (!documentType || !projectInfo?.title || !projectInfo?.description) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    let apiKey: string | null = null;

    if (useAdminKey) {
      // 관리자 키 사용 (Service Role 필요)
      const serviceClient = createServiceRoleClient();
      const { data: adminKey, error: keyError } = await (serviceClient
        .from('admin_api_keys') as any)
        .select('encrypted_key')
        .eq('provider', provider)
        .eq('is_active', true)
        .single() as { data: { encrypted_key: string } | null; error: unknown };

      if (keyError || !adminKey) {
        return NextResponse.json(
          { error: `${provider} 관리자 API 키가 설정되지 않았습니다.` },
          { status: 404 }
        );
      }

      apiKey = decryptKey(adminKey.encrypted_key);
    } else {
      // 사용자 개인 키 사용
      const { data: userKey, error: keyError } = await (supabase
        .from('api_keys') as any)
        .select('encrypted_key')
        .eq('user_id', user.id)
        .eq('provider', provider)
        .eq('is_active', true)
        .single() as { data: { encrypted_key: string } | null; error: unknown };

      if (keyError || !userKey) {
        return NextResponse.json(
          { error: `${provider} 개인 API 키가 설정되지 않았습니다.` },
          { status: 404 }
        );
      }

      apiKey = decryptKey(userKey.encrypted_key);
    }

    // 프롬프트 생성 (프로바이더별 최적화)
    let prompt: string;
    switch (provider) {
      case 'claude':
        prompt = createClaudePrompt(documentType, projectInfo);
        break;
      case 'gemini':
        prompt = createGeminiPrompt(documentType, projectInfo);
        break;
      default:
        prompt = createOpenAIPrompt(documentType, projectInfo);
    }

    // AI 생성
    let content: string;
    const startTime = Date.now();

    switch (provider) {
      case 'claude':
        content = await generateWithClaude(apiKey, prompt);
        break;
      case 'gemini':
        content = await generateWithGemini(apiKey, prompt);
        break;
      default:
        content = await generateWithOpenAI(apiKey, prompt);
    }

    const duration = Date.now() - startTime;

    // 사용량 로깅 (Service Role 사용)
    const serviceClientForLog = createServiceRoleClient();
    await (serviceClientForLog.from('usage_logs') as any).insert({
      user_id: user.id,
      provider,
      document_type: documentType,
      tokens_used: Math.ceil(content.length / 4), // 대략적인 토큰 추정
    });

    return NextResponse.json({
      content,
      provider,
      documentType,
      duration,
    });

  } catch (error) {
    console.error('[AI Generate Error]', error);

    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

    // 특정 에러 처리
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    if (errorMessage.includes('invalid_api_key') || errorMessage.includes('401')) {
      return NextResponse.json(
        { error: 'API 키가 유효하지 않습니다.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: `문서 생성 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
