import { DocumentType, Language, GeneratedDocument, ProjectInput } from '@/types/documents';

// 문서 생성 메인 함수
export function generateDocument(
  type: DocumentType,
  lang: Language,
  project: ProjectInput
): GeneratedDocument {
  const generators: Record<DocumentType, (lang: Language, p: ProjectInput) => string> = {
    prd: generatePRD,
    trd: generateTRD,
    mvp: generateMVP,
    tdd: generateTDD,
    uix: generateUIX,
    api: generateAPI,
    database: generateDatabase,
    architecture: generateArchitecture,
    deployment: generateDeployment,
    userManual: generateUserManual,
    codingConvention: generateCodingConvention,
    projectPlan: generateProjectPlan,
  };

  const content = generators[type](lang, project);
  const titles: Record<DocumentType, { ko: string; en: string }> = {
    prd: { ko: 'PRD (제품 요구사항 문서)', en: 'PRD (Product Requirements Document)' },
    trd: { ko: 'TRD (기술 요구사항 문서)', en: 'TRD (Technical Requirements Document)' },
    mvp: { ko: 'MVP 정의서', en: 'MVP Definition' },
    tdd: { ko: 'TDD (기술 설계 문서)', en: 'TDD (Technical Design Document)' },
    uix: { ko: 'UI/UX 설계서', en: 'UI/UX Design Specification' },
    api: { ko: 'API 명세서', en: 'API Specification' },
    database: { ko: '데이터베이스 스키마', en: 'Database Schema' },
    architecture: { ko: '시스템 아키텍처', en: 'System Architecture' },
    deployment: { ko: '배포 가이드', en: 'Deployment Guide' },
    userManual: { ko: '사용자 매뉴얼', en: 'User Manual' },
    codingConvention: { ko: '코딩 컨벤션', en: 'Coding Convention' },
    projectPlan: { ko: '프로젝트 일정표', en: 'Project Plan' },
  };

  return {
    type,
    language: lang,
    title: titles[type][lang],
    content,
    generatedAt: new Date().toISOString(),
  };
}

// 모든 문서 한번에 생성
export function generateAllDocuments(
  lang: Language,
  project: ProjectInput
): GeneratedDocument[] {
  const types: DocumentType[] = [
    'prd', 'trd', 'mvp', 'tdd', 'uix', 'api',
    'database', 'architecture', 'deployment',
    'userManual', 'codingConvention', 'projectPlan'
  ];
  return types.map(type => generateDocument(type, lang, project));
}

// 1. PRD 생성
function generatePRD(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# PRD: ${p.name}

## 1. 개요
### 1.1 제품명
${p.name}

### 1.2 제품 설명
${p.description}

### 1.3 목표 사용자
${p.targetUsers || '일반 사용자, 비즈니스 전문가'}

### 1.4 카테고리
${p.category}

### 1.5 플랫폼
${p.platform}

## 2. 배경 및 목적
### 2.1 문제 정의
현재 시장에서 ${p.category} 분야의 사용자들은 효율적인 솔루션의 부재로 어려움을 겪고 있습니다.

### 2.2 솔루션
${p.name}은(는) 이러한 문제를 해결하기 위해 설계된 ${p.platform} 기반 애플리케이션입니다.

### 2.3 성공 지표
- 월간 활성 사용자(MAU): 10,000명
- 사용자 만족도: 4.5/5.0 이상
- 핵심 기능 완료율: 80% 이상

## 3. 기능 요구사항
### 3.1 핵심 기능
${(p.mainFeatures || ['사용자 인증', '대시보드', '데이터 관리', '알림 시스템']).map((f, i) => `${i + 1}. ${f}`).join('\n')}

### 3.2 우선순위
| 우선순위 | 기능 | 설명 |
|---------|------|------|
| P0 | 사용자 인증 | 로그인/회원가입 |
| P0 | 핵심 기능 | 주요 비즈니스 로직 |
| P1 | 대시보드 | 데이터 시각화 |
| P2 | 알림 | 푸시/이메일 알림 |

## 4. 비기능 요구사항
### 4.1 성능
- 페이지 로딩: 3초 이내
- API 응답: 500ms 이내

### 4.2 보안
- HTTPS 필수
- 데이터 암호화
- OWASP Top 10 대응

### 4.3 확장성
- 수평적 확장 가능한 아키텍처
- 마이크로서비스 지향

## 5. 릴리스 계획
### 5.1 Phase 1 (MVP)
- 핵심 기능 구현
- 기본 UI/UX

### 5.2 Phase 2
- 고급 기능 추가
- 성능 최적화

### 5.3 Phase 3
- 확장 기능
- 외부 서비스 연동

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# PRD: ${p.name}

## 1. Overview
### 1.1 Product Name
${p.name}

### 1.2 Product Description
${p.description}

### 1.3 Target Users
${p.targetUsers || 'General users, Business professionals'}

### 1.4 Category
${p.category}

### 1.5 Platform
${p.platform}

## 2. Background & Purpose
### 2.1 Problem Statement
Users in the ${p.category} sector currently face challenges due to lack of efficient solutions.

### 2.2 Solution
${p.name} is a ${p.platform}-based application designed to solve these problems.

### 2.3 Success Metrics
- Monthly Active Users (MAU): 10,000
- User Satisfaction: 4.5/5.0 or higher
- Core Feature Completion Rate: 80% or higher

## 3. Functional Requirements
### 3.1 Core Features
${(p.mainFeatures || ['User Authentication', 'Dashboard', 'Data Management', 'Notification System']).map((f, i) => `${i + 1}. ${f}`).join('\n')}

### 3.2 Priority
| Priority | Feature | Description |
|----------|---------|-------------|
| P0 | Authentication | Login/Signup |
| P0 | Core Feature | Main business logic |
| P1 | Dashboard | Data visualization |
| P2 | Notifications | Push/Email alerts |

## 4. Non-Functional Requirements
### 4.1 Performance
- Page Load: Under 3 seconds
- API Response: Under 500ms

### 4.2 Security
- HTTPS Required
- Data Encryption
- OWASP Top 10 Compliance

### 4.3 Scalability
- Horizontally scalable architecture
- Microservices oriented

## 5. Release Plan
### 5.1 Phase 1 (MVP)
- Core feature implementation
- Basic UI/UX

### 5.2 Phase 2
- Advanced features
- Performance optimization

### 5.3 Phase 3
- Extended features
- External service integration

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 2. TRD 생성
function generateTRD(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# TRD: ${p.name}

## 1. 기술 개요
### 1.1 시스템 요약
${p.name}의 기술적 요구사항과 제약조건을 정의합니다.

### 1.2 기술 스택
| 영역 | 기술 |
|------|------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express/NestJS |
| Database | PostgreSQL, Redis |
| Cloud | AWS/GCP |
| CI/CD | GitHub Actions |

## 2. 성능 요구사항
### 2.1 응답 시간
- API 응답: < 500ms (P95)
- 페이지 로드: < 3초 (초기), < 1초 (SPA 전환)
- 데이터베이스 쿼리: < 100ms

### 2.2 처리량
- 동시 사용자: 1,000명
- 초당 요청: 500 RPS
- 일일 트랜잭션: 100만 건

### 2.3 가용성
- 목표 가용성: 99.9%
- 계획된 다운타임: 월 4시간 이내
- RTO: 1시간, RPO: 15분

## 3. 보안 요구사항
### 3.1 인증/인가
- JWT 기반 인증
- Role-Based Access Control (RBAC)
- OAuth 2.0 소셜 로그인

### 3.2 데이터 보안
- 전송 중 암호화: TLS 1.3
- 저장 시 암호화: AES-256
- 개인정보 마스킹

### 3.3 취약점 대응
- OWASP Top 10 대응
- SQL Injection 방지
- XSS/CSRF 방지

## 4. 확장성 요구사항
### 4.1 수평적 확장
- Stateless 서버 설계
- 로드 밸런싱
- Auto-scaling 지원

### 4.2 데이터 확장
- 샤딩 전략
- Read Replica
- 캐싱 레이어

## 5. 모니터링 요구사항
### 5.1 로깅
- 구조화된 로그 (JSON)
- 중앙 집중식 로그 수집
- 로그 보존: 90일

### 5.2 메트릭
- APM (Application Performance Monitoring)
- 인프라 메트릭
- 비즈니스 메트릭

### 5.3 알림
- 임계치 기반 알림
- PagerDuty/Slack 연동

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# TRD: ${p.name}

## 1. Technical Overview
### 1.1 System Summary
Defines technical requirements and constraints for ${p.name}.

### 1.2 Technology Stack
| Area | Technology |
|------|------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express/NestJS |
| Database | PostgreSQL, Redis |
| Cloud | AWS/GCP |
| CI/CD | GitHub Actions |

## 2. Performance Requirements
### 2.1 Response Time
- API Response: < 500ms (P95)
- Page Load: < 3s (initial), < 1s (SPA transition)
- Database Query: < 100ms

### 2.2 Throughput
- Concurrent Users: 1,000
- Requests per Second: 500 RPS
- Daily Transactions: 1 million

### 2.3 Availability
- Target Availability: 99.9%
- Planned Downtime: < 4 hours/month
- RTO: 1 hour, RPO: 15 minutes

## 3. Security Requirements
### 3.1 Authentication/Authorization
- JWT-based Authentication
- Role-Based Access Control (RBAC)
- OAuth 2.0 Social Login

### 3.2 Data Security
- In-transit Encryption: TLS 1.3
- At-rest Encryption: AES-256
- PII Masking

### 3.3 Vulnerability Management
- OWASP Top 10 Compliance
- SQL Injection Prevention
- XSS/CSRF Prevention

## 4. Scalability Requirements
### 4.1 Horizontal Scaling
- Stateless Server Design
- Load Balancing
- Auto-scaling Support

### 4.2 Data Scaling
- Sharding Strategy
- Read Replicas
- Caching Layer

## 5. Monitoring Requirements
### 5.1 Logging
- Structured Logs (JSON)
- Centralized Log Collection
- Log Retention: 90 days

### 5.2 Metrics
- APM (Application Performance Monitoring)
- Infrastructure Metrics
- Business Metrics

### 5.3 Alerting
- Threshold-based Alerts
- PagerDuty/Slack Integration

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 나머지 문서 생성 함수들은 documentTemplates.ts에서 import
import {
  generateMVP,
  generateTDD,
  generateUIX,
  generateAPI,
  generateDatabase,
  generateArchitecture,
  generateDeployment,
  generateUserManual,
  generateCodingConvention,
  generateProjectPlan
} from './documentTemplates';

export { generateMVP, generateTDD, generateUIX, generateAPI };
