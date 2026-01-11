import { Language, ProjectInput } from '@/types/documents';

// 7. 데이터베이스 스키마
export function generateDatabase(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 데이터베이스 스키마: ${p.name}

## 1. 개요
### 1.1 데이터베이스 선택
- **RDBMS**: PostgreSQL 15+
- **캐시**: Redis 7+
- **검색**: Elasticsearch (선택)

## 2. ERD
\`\`\`
┌──────────────┐       ┌──────────────┐
│    users     │       │   profiles   │
├──────────────┤       ├──────────────┤
│ id (PK)      │──────▶│ user_id (FK) │
│ email        │       │ avatar       │
│ password     │       │ bio          │
│ created_at   │       │ settings     │
└──────────────┘       └──────────────┘
        │
        │ 1:N
        ▼
┌──────────────┐
│   resources  │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ title        │
│ data (JSONB) │
│ status       │
│ created_at   │
└──────────────┘
\`\`\`

## 3. 테이블 정의
### 3.1 users
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
\`\`\`

### 3.2 profiles
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 3.3 resources
\`\`\`sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_user ON resources(user_id);
CREATE INDEX idx_resources_status ON resources(status);
\`\`\`

## 4. 인덱스 전략
| 테이블 | 컬럼 | 타입 | 목적 |
|--------|------|------|------|
| users | email | UNIQUE | 로그인 조회 |
| resources | user_id | B-Tree | 사용자별 조회 |
| resources | status | B-Tree | 상태별 필터 |

## 5. 마이그레이션
\`\`\`bash
# 마이그레이션 실행
npm run db:migrate

# 롤백
npm run db:rollback
\`\`\`

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# Database Schema: ${p.name}

## 1. Overview
### 1.1 Database Selection
- **RDBMS**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search**: Elasticsearch (optional)

## 2. ERD
\`\`\`
┌──────────────┐       ┌──────────────┐
│    users     │       │   profiles   │
├──────────────┤       ├──────────────┤
│ id (PK)      │──────▶│ user_id (FK) │
│ email        │       │ avatar       │
│ password     │       │ bio          │
│ created_at   │       │ settings     │
└──────────────┘       └──────────────┘
        │
        │ 1:N
        ▼
┌──────────────┐
│   resources  │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ title        │
│ data (JSONB) │
│ status       │
│ created_at   │
└──────────────┘
\`\`\`

## 3. Table Definitions
### 3.1 users
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
\`\`\`

### 3.2 profiles
\`\`\`sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  avatar_url TEXT,
  bio TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### 3.3 resources
\`\`\`sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_user ON resources(user_id);
CREATE INDEX idx_resources_status ON resources(status);
\`\`\`

## 4. Index Strategy
| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| users | email | UNIQUE | Login lookup |
| resources | user_id | B-Tree | User queries |
| resources | status | B-Tree | Status filter |

## 5. Migrations
\`\`\`bash
# Run migrations
npm run db:migrate

# Rollback
npm run db:rollback
\`\`\`

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 8. 시스템 아키텍처
export function generateArchitecture(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 시스템 아키텍처: ${p.name}

## 1. 아키텍처 개요
### 1.1 아키텍처 스타일
- **패턴**: Clean Architecture / Layered Architecture
- **통신**: REST API + WebSocket (실시간)
- **배포**: Container-based (Docker + Kubernetes)

## 2. 시스템 다이어그램
\`\`\`
                    ┌─────────────────┐
                    │   CloudFlare    │
                    │     (CDN)       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    │    (Nginx)      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│   API Server    │ │   API Server    │ │   API Server    │
│   (Node.js)     │ │   (Node.js)     │ │   (Node.js)     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────┐  ┌──────▼──────┐  ┌───▼────┐
     │ PostgreSQL  │  │    Redis    │  │   S3   │
     │  (Primary)  │  │   (Cache)   │  │(Files) │
     └─────────────┘  └─────────────┘  └────────┘
\`\`\`

## 3. 컴포넌트 설명
### 3.1 프론트엔드
- **기술**: React/Next.js
- **상태관리**: Zustand
- **스타일링**: Tailwind CSS

### 3.2 백엔드
- **기술**: Node.js + Express/NestJS
- **인증**: JWT + Refresh Token
- **캐싱**: Redis

### 3.3 데이터 저장소
- **메인 DB**: PostgreSQL
- **캐시**: Redis
- **파일**: AWS S3

## 4. 보안 아키텍처
\`\`\`
[Client] ──HTTPS──▶ [WAF] ──▶ [API Gateway] ──▶ [Services]
                               │
                               ├── Rate Limiting
                               ├── JWT Validation
                               └── Request Logging
\`\`\`

## 5. 확장 전략
### 5.1 수평적 확장
- Auto-scaling 그룹
- Stateless 서버 설계

### 5.2 데이터베이스 확장
- Read Replica
- Connection Pooling

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# System Architecture: ${p.name}

## 1. Architecture Overview
### 1.1 Architecture Style
- **Pattern**: Clean Architecture / Layered Architecture
- **Communication**: REST API + WebSocket (realtime)
- **Deployment**: Container-based (Docker + Kubernetes)

## 2. System Diagram
\`\`\`
                    ┌─────────────────┐
                    │   CloudFlare    │
                    │     (CDN)       │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Load Balancer  │
                    │    (Nginx)      │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│   API Server    │ │   API Server    │ │   API Server    │
│   (Node.js)     │ │   (Node.js)     │ │   (Node.js)     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼────┐  ┌──────▼──────┐  ┌───▼────┐
     │ PostgreSQL  │  │    Redis    │  │   S3   │
     │  (Primary)  │  │   (Cache)   │  │(Files) │
     └─────────────┘  └─────────────┘  └────────┘
\`\`\`

## 3. Component Description
### 3.1 Frontend
- **Tech**: React/Next.js
- **State**: Zustand
- **Styling**: Tailwind CSS

### 3.2 Backend
- **Tech**: Node.js + Express/NestJS
- **Auth**: JWT + Refresh Token
- **Cache**: Redis

### 3.3 Data Storage
- **Main DB**: PostgreSQL
- **Cache**: Redis
- **Files**: AWS S3

## 4. Security Architecture
\`\`\`
[Client] ──HTTPS──▶ [WAF] ──▶ [API Gateway] ──▶ [Services]
                               │
                               ├── Rate Limiting
                               ├── JWT Validation
                               └── Request Logging
\`\`\`

## 5. Scaling Strategy
### 5.1 Horizontal Scaling
- Auto-scaling groups
- Stateless server design

### 5.2 Database Scaling
- Read Replicas
- Connection Pooling

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 9. 배포 가이드
export function generateDeployment(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 배포 가이드: ${p.name}

## 1. 환경 구성
### 1.1 필수 요구사항
- Node.js 18+
- Docker 24+
- kubectl (K8s 배포 시)

### 1.2 환경 변수
\`\`\`env
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
\`\`\`

## 2. 로컬 개발
\`\`\`bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
\`\`\`

## 3. Docker 배포
### 3.1 Dockerfile
\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 3.2 빌드 및 실행
\`\`\`bash
# 이미지 빌드
docker build -t ${p.name.toLowerCase().replace(/\s/g, '-')}:latest .

# 컨테이너 실행
docker run -p 3000:3000 ${p.name.toLowerCase().replace(/\s/g, '-')}:latest
\`\`\`

## 4. CI/CD 파이프라인
### 4.1 GitHub Actions
\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
\`\`\`

## 5. 모니터링
### 5.1 헬스 체크
\`\`\`bash
curl https://api.example.com/health
\`\`\`

### 5.2 로그 확인
\`\`\`bash
docker logs -f container_name
\`\`\`

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# Deployment Guide: ${p.name}

## 1. Environment Setup
### 1.1 Requirements
- Node.js 18+
- Docker 24+
- kubectl (for K8s)

### 1.2 Environment Variables
\`\`\`env
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
\`\`\`

## 2. Local Development
\`\`\`bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
\`\`\`

## 3. Docker Deployment
### 3.1 Dockerfile
\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### 3.2 Build & Run
\`\`\`bash
# Build image
docker build -t ${p.name.toLowerCase().replace(/\s/g, '-')}:latest .

# Run container
docker run -p 3000:3000 ${p.name.toLowerCase().replace(/\s/g, '-')}:latest
\`\`\`

## 4. CI/CD Pipeline
### 4.1 GitHub Actions
\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
\`\`\`

## 5. Monitoring
### 5.1 Health Check
\`\`\`bash
curl https://api.example.com/health
\`\`\`

### 5.2 Logs
\`\`\`bash
docker logs -f container_name
\`\`\`

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 10. 사용자 매뉴얼
export function generateUserManual(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 사용자 매뉴얼: ${p.name}

## 1. 시작하기
### 1.1 회원가입
1. 앱을 실행합니다
2. "회원가입" 버튼을 클릭합니다
3. 이메일과 비밀번호를 입력합니다
4. 이메일 인증을 완료합니다

### 1.2 로그인
1. 이메일과 비밀번호를 입력합니다
2. "로그인" 버튼을 클릭합니다

## 2. 주요 기능
### 2.1 대시보드
대시보드에서 주요 정보를 한눈에 확인할 수 있습니다.
- 오늘의 요약
- 최근 활동
- 빠른 작업 버튼

### 2.2 ${p.category} 기능
1. 새로 만들기: "+" 버튼 클릭
2. 수정: 항목 선택 후 편집
3. 삭제: 항목 선택 후 삭제 버튼

## 3. 설정
### 3.1 프로필 설정
- 이름 변경
- 프로필 사진 업로드
- 비밀번호 변경

### 3.2 알림 설정
- 이메일 알림 켜기/끄기
- 푸시 알림 설정

## 4. 자주 묻는 질문
### Q: 비밀번호를 잊어버렸어요
A: 로그인 화면에서 "비밀번호 찾기"를 클릭하세요.

### Q: 계정을 삭제하고 싶어요
A: 설정 > 계정 > 계정 삭제에서 진행하세요.

## 5. 문의
- 이메일: support@${p.name.toLowerCase().replace(/\s/g, '')}.com
- 고객센터: 1588-0000

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# User Manual: ${p.name}

## 1. Getting Started
### 1.1 Sign Up
1. Launch the app
2. Click "Sign Up" button
3. Enter email and password
4. Complete email verification

### 1.2 Login
1. Enter email and password
2. Click "Login" button

## 2. Main Features
### 2.1 Dashboard
View key information at a glance.
- Today's summary
- Recent activity
- Quick action buttons

### 2.2 ${p.category} Features
1. Create new: Click "+" button
2. Edit: Select item and edit
3. Delete: Select item and delete

## 3. Settings
### 3.1 Profile Settings
- Change name
- Upload profile photo
- Change password

### 3.2 Notification Settings
- Toggle email notifications
- Configure push notifications

## 4. FAQ
### Q: I forgot my password
A: Click "Forgot Password" on login screen.

### Q: I want to delete my account
A: Go to Settings > Account > Delete Account.

## 5. Contact
- Email: support@${p.name.toLowerCase().replace(/\s/g, '')}.com
- Support: 1-800-000-0000

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 11. 코딩 컨벤션
export function generateCodingConvention(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 코딩 컨벤션: ${p.name}

## 1. 일반 원칙
- 가독성 우선
- 일관성 유지
- 자기 문서화 코드

## 2. 네이밍 규칙
### 2.1 변수/함수
\`\`\`typescript
// camelCase 사용
const userName = 'John';
function getUserData() {}

// 불리언은 is/has/can 접두사
const isActive = true;
const hasPermission = false;
\`\`\`

### 2.2 상수
\`\`\`typescript
// UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
\`\`\`

### 2.3 컴포넌트/클래스
\`\`\`typescript
// PascalCase
class UserService {}
function UserProfile() {}
\`\`\`

## 3. 파일 구조
\`\`\`
src/
├── components/     # React 컴포넌트
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── index.ts
├── hooks/          # 커스텀 훅
├── utils/          # 유틸리티 함수
├── types/          # TypeScript 타입
└── services/       # API 서비스
\`\`\`

## 4. TypeScript
### 4.1 타입 정의
\`\`\`typescript
// interface 선호 (확장 가능)
interface User {
  id: string;
  name: string;
}

// type은 유니온/인터섹션에 사용
type Status = 'active' | 'inactive';
\`\`\`

## 5. 주석
\`\`\`typescript
// 한 줄 주석

/**
 * 함수 설명
 * @param id - 사용자 ID
 * @returns 사용자 정보
 */
function getUser(id: string): User {}
\`\`\`

## 6. Git 커밋
\`\`\`
feat: 새 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
\`\`\`

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# Coding Convention: ${p.name}

## 1. General Principles
- Readability first
- Maintain consistency
- Self-documenting code

## 2. Naming Rules
### 2.1 Variables/Functions
\`\`\`typescript
// Use camelCase
const userName = 'John';
function getUserData() {}

// Boolean with is/has/can prefix
const isActive = true;
const hasPermission = false;
\`\`\`

### 2.2 Constants
\`\`\`typescript
// UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
\`\`\`

### 2.3 Components/Classes
\`\`\`typescript
// PascalCase
class UserService {}
function UserProfile() {}
\`\`\`

## 3. File Structure
\`\`\`
src/
├── components/     # React components
│   └── Button/
│       ├── Button.tsx
│       ├── Button.test.tsx
│       └── index.ts
├── hooks/          # Custom hooks
├── utils/          # Utility functions
├── types/          # TypeScript types
└── services/       # API services
\`\`\`

## 4. TypeScript
### 4.1 Type Definitions
\`\`\`typescript
// Prefer interface (extensible)
interface User {
  id: string;
  name: string;
}

// Use type for union/intersection
type Status = 'active' | 'inactive';
\`\`\`

## 5. Comments
\`\`\`typescript
// Single line comment

/**
 * Function description
 * @param id - User ID
 * @returns User info
 */
function getUser(id: string): User {}
\`\`\`

## 6. Git Commits
\`\`\`
feat: Add new feature
fix: Bug fix
docs: Documentation
style: Code formatting
refactor: Refactoring
test: Add tests
chore: Build/config changes
\`\`\`

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}

// 12. 프로젝트 일정표
export function generateProjectPlan(lang: Language, p: ProjectInput): string {
  if (lang === 'ko') {
    return `# 프로젝트 일정표: ${p.name}

## 1. 프로젝트 개요
- **프로젝트명**: ${p.name}
- **기간**: 12주 (3개월)
- **팀 규모**: 4-6명

## 2. 마일스톤
| 마일스톤 | 기간 | 목표 |
|----------|------|------|
| M1: 기획 | 1-2주 | 요구사항 확정 |
| M2: 설계 | 3-4주 | 아키텍처 설계 |
| M3: MVP | 5-8주 | 핵심 기능 개발 |
| M4: 베타 | 9-10주 | 테스트 및 QA |
| M5: 출시 | 11-12주 | 프로덕션 배포 |

## 3. 상세 일정
### Phase 1: 기획 (Week 1-2)
- [ ] 요구사항 분석
- [ ] 사용자 리서치
- [ ] PRD 작성
- [ ] 기술 스택 결정

### Phase 2: 설계 (Week 3-4)
- [ ] 시스템 아키텍처 설계
- [ ] DB 스키마 설계
- [ ] API 설계
- [ ] UI/UX 디자인

### Phase 3: 개발 (Week 5-8)
- [ ] 환경 구축
- [ ] 인증 시스템
- [ ] 핵심 기능 개발
- [ ] API 개발

### Phase 4: 테스트 (Week 9-10)
- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] 성능 테스트
- [ ] 버그 수정

### Phase 5: 출시 (Week 11-12)
- [ ] 프로덕션 배포
- [ ] 모니터링 설정
- [ ] 문서화 완료
- [ ] 런칭

## 4. 리소스 계획
| 역할 | 인원 | 주요 업무 |
|------|------|----------|
| PM | 1 | 프로젝트 관리 |
| Frontend | 2 | UI 개발 |
| Backend | 2 | API 개발 |
| Designer | 1 | UI/UX 디자인 |

## 5. 리스크 관리
| 리스크 | 영향 | 대응 |
|--------|------|------|
| 일정 지연 | 높음 | 버퍼 기간 확보 |
| 기술 이슈 | 중간 | 기술 검증 선행 |
| 인력 부족 | 중간 | 외부 리소스 확보 |

---
*생성일: ${new Date().toLocaleDateString('ko-KR')}*
`;
  } else {
    return `# Project Plan: ${p.name}

## 1. Project Overview
- **Project**: ${p.name}
- **Duration**: 12 weeks (3 months)
- **Team Size**: 4-6 members

## 2. Milestones
| Milestone | Period | Goal |
|-----------|--------|------|
| M1: Planning | Week 1-2 | Requirements finalized |
| M2: Design | Week 3-4 | Architecture design |
| M3: MVP | Week 5-8 | Core development |
| M4: Beta | Week 9-10 | Testing & QA |
| M5: Launch | Week 11-12 | Production deploy |

## 3. Detailed Schedule
### Phase 1: Planning (Week 1-2)
- [ ] Requirements analysis
- [ ] User research
- [ ] Write PRD
- [ ] Tech stack decision

### Phase 2: Design (Week 3-4)
- [ ] System architecture
- [ ] DB schema design
- [ ] API design
- [ ] UI/UX design

### Phase 3: Development (Week 5-8)
- [ ] Environment setup
- [ ] Auth system
- [ ] Core features
- [ ] API development

### Phase 4: Testing (Week 9-10)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance tests
- [ ] Bug fixes

### Phase 5: Launch (Week 11-12)
- [ ] Production deploy
- [ ] Monitoring setup
- [ ] Documentation
- [ ] Launch

## 4. Resource Plan
| Role | Count | Main Tasks |
|------|-------|------------|
| PM | 1 | Project management |
| Frontend | 2 | UI development |
| Backend | 2 | API development |
| Designer | 1 | UI/UX design |

## 5. Risk Management
| Risk | Impact | Mitigation |
|------|--------|------------|
| Schedule delay | High | Buffer periods |
| Technical issues | Medium | Technical validation |
| Resource shortage | Medium | External resources |

---
*Generated: ${new Date().toLocaleDateString('en-US')}*
`;
  }
}
