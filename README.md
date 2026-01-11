# Portfolio Generator - Tauri + Next.js 14

100개 프로그램 개발 포트폴리오를 자동으로 생성하는 macOS 데스크톱 애플리케이션입니다.

## 기술 스택

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **Backend**: Tauri 2.0 (Rust)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Storage**: JSON 파일 (홈 디렉토리)
- **DOCX Generation**: docx.js
- **Clipboard**: Tauri clipboard-manager plugin

## 기능

- 10개 분야 카테고리 선택 (헬스케어, 금융, 교육, 이커머스 등)
- 3개 플랫폼 지원 (Web, Mobile, Desktop)
- 24개 디자인 테마 자동 적용 (8개 × 3 플랫폼)
- 플랫폼별 맞춤 기능 및 기술 스택 생성
- 로컬 데이터 저장 (앱 종료 후에도 유지)
- **다양한 내보내기 형식**
  - Markdown 파일 (.md)
  - DOCX 파일 (.docx) - Microsoft Word 호환
  - 클립보드 복사 (평문 텍스트)
- 100개 목표 진행률 표시
- macOS 네이티브 UI 스타일
- 다크 테마 지원

## 설치 및 실행

### 1. 사전 요구사항

- Node.js 18 이상
- Rust (Tauri 빌드용)
- macOS 10.15 이상

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 모드 실행

```bash
npm run tauri:dev
```

이 명령은 다음을 수행합니다:
1. Next.js 개발 서버를 3000번 포트에서 실행
2. Tauri 윈도우를 띄워 Next.js 앱 로드
3. Hot reload 활성화

### 4. 프로덕션 빌드

```bash
npm run tauri:build
```

빌드된 앱: `src-tauri/target/release/bundle/macos/`

## 사용 방법

### 포트폴리오 생성

1. **새 포트폴리오 버튼 클릭** 또는 `Cmd + N`
2. **분야 선택**: 10개 카테고리 중 하나 선택 (헬스케어, 금융, 교육 등)
3. **플랫폼 선택**: Web, Mobile, Desktop 중 하나 선택
4. **프로그램 이름 입력**: 예) "HealthTracker Pro"
5. **설명 입력** (선택사항): 추가 정보 입력
6. **생성하기 버튼 클릭**: 자동으로 포트폴리오 생성

### 내보내기

포트폴리오 상세 보기에서 3가지 내보내기 방식 제공:

1. **Markdown 버튼**: `.md` 파일로 저장 (Downloads 폴더)
   - 마크다운 형식으로 깔끔하게 정리
   - GitHub, Notion 등에 바로 사용 가능

2. **DOCX 버튼**: `.docx` 파일로 저장 (Downloads 폴더)
   - Microsoft Word 호환
   - 서식 있는 문서로 활용 가능
   - 표, 제목, 번호매기기 등 포함

3. **복사 버튼**: 클립보드에 복사
   - 평문 텍스트로 복사
   - 이메일, 메신저 등에 바로 붙여넣기 가능
   - 포맷이 유지되어 깔끔하게 전달

## 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| Cmd + N | 새 포트폴리오 |
| Cmd + E | Markdown 내보내기 (상세 보기에서) |

## 프로젝트 구조

```
portfolio-generator/
├── src/                          # Next.js 프론트엔드
│   ├── app/
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 메인 대시보드
│   │   └── globals.css           # 전역 스타일
│   ├── components/
│   │   ├── common/
│   │   │   ├── Sidebar.tsx       # 포트폴리오 목록 사이드바
│   │   │   └── ProgressBar.tsx   # 진행률 표시
│   │   ├── generator/            # 생성 관련 컴포넌트
│   │   └── preview/              # 미리보기 컴포넌트
│   ├── lib/
│   │   ├── generator.ts          # 포트폴리오 생성 로직
│   │   └── tauri.ts              # Tauri API 래퍼
│   ├── store/
│   │   └── usePortfolioStore.ts  # Zustand 상태 관리
│   ├── types/
│   │   └── portfolio.ts          # TypeScript 타입 정의
│   └── data/
│       └── constants.ts          # 상수 데이터 (카테고리, 테마 등)
├── src-tauri/                    # Tauri 백엔드 (Rust)
│   ├── src/
│   │   ├── main.rs               # 엔트리 포인트
│   │   ├── lib.rs                # 라이브러리
│   │   └── commands.rs           # Tauri 커맨드 (IPC 핸들러)
│   ├── Cargo.toml                # Rust 의존성
│   ├── tauri.conf.json           # Tauri 설정
│   └── icons/                    # 앱 아이콘
├── package.json                  # Node.js 의존성
├── next.config.js                # Next.js 설정
├── tailwind.config.ts            # Tailwind 설정
└── tsconfig.json                 # TypeScript 설정
```

## 데이터 저장 위치

```
~/.portfolio-generator/portfolios.json
```

## 아키텍처

### IPC 통신

```
Frontend (React)
    ↓ invoke()
Tauri Bridge
    ↓
Rust Backend (commands.rs)
    ↓
File System (JSON)
```

### 상태 관리

Zustand store를 통해 전역 상태를 관리합니다:
- `portfolios`: 포트폴리오 배열
- `nextNumber`: 다음 포트폴리오 번호
- `currentPortfolio`: 현재 선택된 포트폴리오
- `isLoading`: 로딩 상태

### 포트폴리오 생성 과정

1. 사용자가 분야, 플랫폼, 이름 입력
2. `generator.ts`의 `generatePortfolio()` 함수 호출
3. 랜덤으로 디자인 테마, 기능, 기술 스택 선택
4. `savePortfolio()`로 Rust 백엔드에 저장 요청
5. Rust가 JSON 파일에 데이터 저장
6. Zustand store 업데이트
7. UI 자동 리렌더링

## 라이선스

MIT License

## 개발 참고사항

### Tauri vs Electron

- **Tauri**: Rust 백엔드 + 시스템 웹뷰 → 메모리 사용량 80% 감소
- **Electron**: Node.js 백엔드 + Chromium → 무겁지만 생태계 큼

### Next.js 14 App Router

- 모든 컴포넌트는 `'use client'` 지시어 필요 (Tauri는 정적 빌드)
- Server Components 미사용 (데스크톱 앱이므로)

### TypeScript 엄격 모드

`tsconfig.json`에서 엄격 모드 활성화되어 있어 타입 안전성 보장.
