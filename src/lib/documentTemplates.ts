import { Language, ProjectInput } from '@/types/documents';

// 3. MVP 정의서
export function generateMVP(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# MVP 정의서: ${p.name}

## 1. MVP 개요
### 1.1 정의
${p.name}의 최소 기능 제품(MVP)은 핵심 가치를 검증하기 위한 최소한의 기능 세트입니다.

### 1.2 목표
- 핵심 가설 검증
- 초기 사용자 피드백 수집
- 시장 적합성 확인

## 2. 핵심 기능 (Must-Have)
| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 회원가입/로그인 | 이메일/소셜 인증 | P0 |
| 메인 대시보드 | 핵심 데이터 표시 | P0 |
| 핵심 비즈니스 로직 | ${p.category} 관련 주요 기능 | P0 |
| 기본 설정 | 사용자 프로필 관리 | P1 |

## 3. 제외 기능 (Nice-to-Have)
- 고급 분석 기능
- 외부 서비스 연동
- 다국어 지원
- 오프라인 모드

## 4. 성공 기준
### 4.1 정량적 지표
- 회원가입 전환율: 20% 이상
- 일일 활성 사용자: 100명
- 핵심 기능 사용률: 60% 이상

### 4.2 정성적 지표
- 사용자 만족도 조사
- 기능 개선 피드백

## 5. 타임라인
| 주차 | 목표 |
|------|------|
| 1-2주 | 설계 및 프로토타입 |
| 3-4주 | 핵심 기능 개발 |
| 5주 | 테스트 및 버그 수정 |
| 6주 | 베타 출시 |

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# MVP Definition: ${p.name}

## 1. MVP Overview
### 1.1 Definition
The MVP of ${p.name} is the minimum feature set required to validate core value proposition.

### 1.2 Goals
- Validate core hypotheses
- Collect early user feedback
- Confirm product-market fit

## 2. Core Features (Must-Have)
| Feature | Description | Priority |
|---------|-------------|----------|
| Sign up/Login | Email/Social auth | P0 |
| Main Dashboard | Core data display | P0 |
| Core Business Logic | ${p.category} related features | P0 |
| Basic Settings | User profile management | P1 |

## 3. Excluded Features (Nice-to-Have)
- Advanced analytics
- External integrations
- Multi-language support
- Offline mode

## 4. Success Criteria
### 4.1 Quantitative Metrics
- Signup conversion: 20%+
- Daily active users: 100
- Core feature usage: 60%+

### 4.2 Qualitative Metrics
- User satisfaction surveys
- Feature improvement feedback

## 5. Timeline
| Week | Goal |
|------|------|
| 1-2 | Design & Prototype |
| 3-4 | Core development |
| 5 | Testing & Bug fixes |
| 6 | Beta launch |

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 4. TDD (Technical Design Document)
export function generateTDD(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 기술 설계 문서: ${p.name}

## 1. 시스템 아키텍처
### 1.1 고수준 설계
\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API GW    │────▶│  Services   │
│  (${p.platform})   │     │  (Gateway)  │     │  (Backend)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  Database   │
                                        │ (PostgreSQL)│
                                        └─────────────┘
\`\`\`

### 1.2 컴포넌트 구조
- **Presentation Layer**: UI 컴포넌트
- **Business Layer**: 비즈니스 로직
- **Data Layer**: 데이터 접근 계층
- **Infrastructure**: 인프라 서비스

## 2. 데이터 모델
### 2.1 핵심 엔티티
\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface ${p.name.replace(/\s/g, '')}Data {
  id: string;
  userId: string;
  data: Record<string, any>;
  status: 'active' | 'inactive';
}
\`\`\`

## 3. API 설계
### 3.1 RESTful 엔드포인트
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/register | 회원가입 |
| GET | /api/data | 데이터 조회 |
| POST | /api/data | 데이터 생성 |

## 4. 보안 설계
### 4.1 인증 흐름
1. 사용자 로그인 요청
2. 자격 증명 검증
3. JWT 토큰 발급
4. 클라이언트 토큰 저장
5. API 요청 시 토큰 포함

## 5. 에러 처리
### 5.1 에러 코드
| 코드 | 설명 |
|------|------|
| 400 | 잘못된 요청 |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 500 | 서버 오류 |

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# Technical Design Document: ${p.name}

## 1. System Architecture
### 1.1 High-Level Design
\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API GW    │────▶│  Services   │
│  (${p.platform})   │     │  (Gateway)  │     │  (Backend)  │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │  Database   │
                                        │ (PostgreSQL)│
                                        └─────────────┘
\`\`\`

### 1.2 Component Structure
- **Presentation Layer**: UI Components
- **Business Layer**: Business Logic
- **Data Layer**: Data Access Layer
- **Infrastructure**: Infrastructure Services

## 2. Data Model
### 2.1 Core Entities
\`\`\`typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface ${p.name.replace(/\s/g, '')}Data {
  id: string;
  userId: string;
  data: Record<string, any>;
  status: 'active' | 'inactive';
}
\`\`\`

## 3. API Design
### 3.1 RESTful Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/register | Register |
| GET | /api/data | Get data |
| POST | /api/data | Create data |

## 4. Security Design
### 4.1 Auth Flow
1. User login request
2. Credential validation
3. JWT token issuance
4. Client token storage
5. Include token in API requests

## 5. Error Handling
### 5.1 Error Codes
| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 5. UI/UX 설계서
export function generateUIX(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# UI/UX 설계서: ${p.name}

## 1. 디자인 원칙
### 1.1 핵심 가치
- **단순함**: 직관적인 인터페이스
- **일관성**: 통일된 디자인 언어
- **접근성**: 모든 사용자 고려

### 1.2 디자인 시스템
- Typography: Inter, Pretendard
- Primary Color: #3B82F6
- Secondary Color: #6366F1
- Background: #FFFFFF / #0F172A (Dark)

## 2. 화면 구성
### 2.1 정보 구조
\`\`\`
홈
├── 대시보드
├── ${p.category} 기능
│   ├── 목록 보기
│   ├── 상세 보기
│   └── 생성/편집
├── 설정
│   ├── 프로필
│   ├── 알림
│   └── 보안
└── 도움말
\`\`\`

### 2.2 주요 화면
| 화면 | 설명 |
|------|------|
| 온보딩 | 신규 사용자 안내 |
| 대시보드 | 핵심 정보 요약 |
| 목록 | 데이터 리스트 |
| 상세 | 개별 항목 정보 |
| 설정 | 사용자 설정 |

## 3. 사용자 플로우
### 3.1 핵심 플로우
1. 앱 실행 → 로그인/회원가입
2. 대시보드 확인
3. 주요 기능 사용
4. 결과 확인/저장

## 4. 컴포넌트
### 4.1 기본 컴포넌트
- Button (Primary, Secondary, Ghost)
- Input (Text, Number, Date)
- Card (기본, 확장)
- Modal (확인, 폼)
- Toast (성공, 오류, 정보)

## 5. 반응형 설계
| 브레이크포인트 | 화면 |
|--------------|------|
| < 640px | Mobile |
| 640-1024px | Tablet |
| > 1024px | Desktop |

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# UI/UX Design Spec: ${p.name}

## 1. Design Principles
### 1.1 Core Values
- **Simplicity**: Intuitive interface
- **Consistency**: Unified design language
- **Accessibility**: Consider all users

### 1.2 Design System
- Typography: Inter, Pretendard
- Primary Color: #3B82F6
- Secondary Color: #6366F1
- Background: #FFFFFF / #0F172A (Dark)

## 2. Screen Structure
### 2.1 Information Architecture
\`\`\`
Home
├── Dashboard
├── ${p.category} Features
│   ├── List View
│   ├── Detail View
│   └── Create/Edit
├── Settings
│   ├── Profile
│   ├── Notifications
│   └── Security
└── Help
\`\`\`

### 2.2 Key Screens
| Screen | Description |
|--------|-------------|
| Onboarding | New user guide |
| Dashboard | Key info summary |
| List | Data listing |
| Detail | Individual item |
| Settings | User settings |

## 3. User Flows
### 3.1 Core Flow
1. App launch → Login/Signup
2. Check dashboard
3. Use main features
4. View/Save results

## 4. Components
### 4.1 Base Components
- Button (Primary, Secondary, Ghost)
- Input (Text, Number, Date)
- Card (Basic, Expanded)
- Modal (Confirm, Form)
- Toast (Success, Error, Info)

## 5. Responsive Design
| Breakpoint | Screen |
|------------|--------|
| < 640px | Mobile |
| 640-1024px | Tablet |
| > 1024px | Desktop |

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 6. API 명세서
export function generateAPI(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# API 명세서: ${p.name}

## 1. 개요
### 1.1 Base URL
\`\`\`
Production: https://api.${p.name.toLowerCase().replace(/\s/g, '')}.com/v1
Development: http://localhost:3000/api/v1
\`\`\`

### 1.2 인증
모든 API 요청에 Authorization 헤더 필요:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

## 2. 인증 API
### 2.1 회원가입
\`\`\`http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "홍길동"
}
\`\`\`

**응답 (201)**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "홍길동"
  }
}
\`\`\`

### 2.2 로그인
\`\`\`http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**응답 (200)**
\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
\`\`\`

## 3. 리소스 API
### 3.1 목록 조회
\`\`\`http
GET /resources?page=1&limit=10
Authorization: Bearer <token>
\`\`\`

### 3.2 단일 조회
\`\`\`http
GET /resources/:id
Authorization: Bearer <token>
\`\`\`

### 3.3 생성
\`\`\`http
POST /resources
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "새 리소스",
  "data": {}
}
\`\`\`

### 3.4 수정
\`\`\`http
PUT /resources/:id
Authorization: Bearer <token>
\`\`\`

### 3.5 삭제
\`\`\`http
DELETE /resources/:id
Authorization: Bearer <token>
\`\`\`

## 4. 에러 응답
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "요청이 올바르지 않습니다."
  }
}
\`\`\`

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# API Specification: ${p.name}

## 1. Overview
### 1.1 Base URL
\`\`\`
Production: https://api.${p.name.toLowerCase().replace(/\s/g, '')}.com/v1
Development: http://localhost:3000/api/v1
\`\`\`

### 1.2 Authentication
All API requests require Authorization header:
\`\`\`
Authorization: Bearer <access_token>
\`\`\`

## 2. Auth API
### 2.1 Register
\`\`\`http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
\`\`\`

**Response (201)**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
\`\`\`

### 2.2 Login
\`\`\`http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200)**
\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 3600
  }
}
\`\`\`

## 3. Resource API
### 3.1 List
\`\`\`http
GET /resources?page=1&limit=10
Authorization: Bearer <token>
\`\`\`

### 3.2 Get One
\`\`\`http
GET /resources/:id
Authorization: Bearer <token>
\`\`\`

### 3.3 Create
\`\`\`http
POST /resources
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Resource",
  "data": {}
}
\`\`\`

### 3.4 Update
\`\`\`http
PUT /resources/:id
Authorization: Bearer <token>
\`\`\`

### 3.5 Delete
\`\`\`http
DELETE /resources/:id
Authorization: Bearer <token>
\`\`\`

## 4. Error Response
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request."
  }
}
\`\`\`

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 7-12번 문서는 다음 파일에서 계속
export { generateDatabase, generateArchitecture, generateDeployment, generateUserManual, generateCodingConvention, generateProjectPlan } from './documentTemplates2';
