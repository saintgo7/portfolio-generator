<!-- 프로젝트 현재 상태·검증 근거·잔여 작업을 정리한 스윕 산출물 -->
# STATUS — Portfolio Generator (Tauri + Next.js)

> 생성: 2026-06-14 / 브랜치 `claude/sweep-2026-06-13` / 자동 포트폴리오 스윕 산출물.
> 본 문서는 **검증된 사실만** 기록한다. 미검증 항목은 "미검증"으로 표시한다.

## English summary (TL;DR)

A Tauri 2 + Next.js 14 desktop app that auto-generates software-development portfolios and
12 types of technical documents (PRD, TRD, architecture, etc.) using three LLM providers
(OpenAI, Anthropic Claude, Google Gemini). The repo grew well beyond its original README:
it now has Supabase auth (Google/GitHub OAuth), server-side API routes for admin/personal
API-key management, a per-user usage-logging schema, and a dual build pipeline that strips
Next.js API routes for the static Tauri build and restores them afterward.

- **Verified working:** `npm install` succeeds (exit 0); `tsc --noEmit` passes with **zero**
  type errors across all source (auth, API routes, AI client, generator). The codebase is
  internally type-consistent.
- **Not run (time-boxed):** Playwright E2E suite (`npm run test:e2e`) — needs a live dev
  server and browser; the Tauri release build — needs the Rust toolchain. Neither was
  executed in this sweep.
- **Top remaining issue:** the server-side Claude integration hardcodes the **retired**
  model `claude-3-5-sonnet-20241022` (retired 2025-10-28), inconsistent with the Claude 4
  models advertised in `src/types/ai.ts`. Documented below, not changed (multi-file +
  behavior change).

This sweep made **no source-code changes** — it only added this STATUS.md and checkpointed
pre-existing WIP. The triage tag "has tests: false" is inaccurate: an untracked Playwright
E2E suite exists.

---

## 1. 프로젝트 목적

100개 프로그램 개발 포트폴리오를 자동 생성하는 macOS 데스크톱 앱이다. 분야(10개 카테고리)·플랫폼(Web/Mobile/Desktop)·이름을 입력하면 디자인 테마·기능·기술 스택을 조합해 포트폴리오 항목을 만든다. 여기에 더해 프로젝트 정보를 바탕으로 12종 기술 문서(PRD·TRD·아키텍처·DB 설계·API 스펙 등)를 AI로 생성하고 Markdown/DOCX/클립보드로 내보낸다.

기술 스택은 Next.js 14(App Router) + React 18 + TypeScript 프론트엔드, Tauri 2(Rust) 셸, Tailwind CSS, Zustand 상태관리, Supabase(인증·키 저장·사용량 로그)다.

## 2. 현재 상태 (트리아지: dirty_wip, 사전 변경 25파일)

이 저장소는 README가 설명하는 범위를 크게 넘어 진화했다. README는 "로컬 JSON 저장 + 데스크톱 단독 앱"을 전제하지만, 실제 코드에는 다음 WIP가 추가되어 있다(대부분 untracked).

- **Supabase 인증**: `src/contexts/AuthContext.tsx`, `src/components/auth/{LoginModal,UserMenu}.tsx`, `src/lib/supabase/{client,server}.ts`, OAuth 콜백 라우트 `src/app/auth/callback/route.ts`.
- **서버사이드 API 라우트**: `src/app/api/ai/generate/route.ts`(인증→키 조회→프로바이더별 프롬프트→AI 호출→사용량 로깅), `src/app/api/admin/keys/route.ts`(관리자 키 CRUD).
- **DB 스키마**: `supabase/migrations/001_initial_schema.sql` — `profiles`·`api_keys`·`admin_api_keys`·`usage_logs` 4개 테이블, RLS 정책, 신규 가입 시 프로필 자동 생성 트리거 포함.
- **이중 빌드 파이프라인**: `next.config.js`가 `TAURI_ENV_PLATFORM` 존재 여부로 static export 여부를 분기한다. Tauri 빌드는 서버 API 라우트를 지원하지 않으므로 `scripts/prepare-tauri-build.js`가 빌드 전 API/auth 라우트를 `.api-backup/`으로 옮기고 `scripts/restore-api-routes.js`가 빌드 후 되돌린다.
- **E2E 테스트**: `e2e/portfolio.spec.ts`(Playwright), `playwright.config.ts`. 트리아지의 "has tests: false"는 사실과 다르다. 단위 테스트는 없다.

작업 트리에는 modified 11개 + untracked 14개 항목이 있었고, 이는 이번 스윕 커밋에 그대로 체크포인트되었다(소스 수정 없음).

## 3. 작동하는 것 vs 작동하지 않는 것 (검증 근거 포함)

### 작동 확인됨 (이번 스윕에서 실행)

- **의존성 설치**: `npm install` 종료코드 0. node_modules 정상 생성.
- **타입 체크**: `node_modules/.bin/tsc --noEmit` 종료코드 0, 오류 0줄. auth·API 라우트·AI 클라이언트·generator 등 전체 소스가 타입 정합성을 만족한다. `tsconfig.json`은 `strict`, `noUnusedLocals`, `noUnusedParameters`가 켜져 있어 이 통과는 의미가 크다.
- **AI 클라이언트 구조**: `src/lib/aiClient.ts`는 OpenAI/Claude/Gemini 각각에 최적화된 프롬프트 생성기와 raw `fetch` 기반 호출, 12종 문서 구조 가이드라인(한/영), 레이트리밋 딜레이, 실패 시 기본 템플릿 폴백을 갖추고 있다. 정적 분석 기준 일관적이다.

### 실행하지 못함 (시간 제한으로 건너뜀, 미검증)

- **Playwright E2E** (`npm run test:e2e`): 라이브 dev 서버(`localhost:3000`)와 브라우저가 필요해 120초 예산 안에서 실행하지 않았다. 통과 여부 미검증.
- **Next.js 프로덕션 빌드** (`npm run build`): 미실행. 다만 tsc 통과로 타입 오류는 없을 가능성이 높다(미검증).
- **Tauri 릴리스 빌드** (`npm run tauri:build`): Rust 툴체인 필요. 미실행, 미검증.
- **런타임 AI 생성·인증 플로우**: 실제 Supabase 프로젝트와 API 키가 있어야 동작. 미검증.

## 4. 끝내기 위한 구체적 잔여 작업

우선순위 순.

1. **Claude 모델 ID 불일치 수정 (정확성 이슈)**: 서버사이드 통합 3곳이 **2025-10-28 폐기된** `claude-3-5-sonnet-20241022`를 하드코딩한다 — `src/app/api/ai/generate/route.ts:196`, `src/app/api/admin/keys/route.ts:164`, `src/components/settings/AdminSettings.tsx:22`. 반면 `src/types/ai.ts`는 Claude 4 계열(`claude-sonnet-4-20250514` 등)을 광고한다. 폐기 모델 ID로 호출하면 Anthropic API가 오류를 반환한다. 현행 모델로 통일해야 한다(예: `claude-opus-4-8` 또는 `claude-sonnet-4-6`). 이 스윕에서는 다중 파일 + AI 동작 변경이라 의도적으로 손대지 않고 문서화만 했다.
2. **README와 실제 아키텍처 동기화**: README는 로컬 JSON 단독 앱만 설명한다. Supabase 인증·서버 API·이중 빌드·AI 문서생성·12종 문서를 README에 반영해야 신규 개발자가 길을 잃지 않는다.
3. **환경 설정 문서화 검증**: `.env.example`은 Supabase URL/anon/service-role 키와 OAuth 안내를 담고 있다. `.env.local`이 작업 트리에 존재하나 `.gitignore`로 추적 제외되어 이번 커밋에 포함되지 않았다(시크릿 노출 없음, 확인됨).
4. **E2E 테스트 실제 실행 및 안정화**: dev 서버를 띄워 `npm run test:e2e`를 돌려 통과 여부 확인. `webServer`가 `npm run dev`를 자동 기동하도록 설정되어 있다.
5. **이중 빌드 검증**: `scripts/prepare-tauri-build.js`→`next build`→`scripts/restore-api-routes.js` 순서가 실제 Tauri 빌드에서 의도대로 동작하는지 확인. 백업 디렉토리 정리까지 포함.
6. **키 암호화 강화 (보안)**: `route.ts`의 `encryptKey`/`decryptKey`는 base64 인코딩일 뿐 암호화가 아니다(코드 주석도 인정). 운영 전에 실제 암호화(예: KMS·libsodium)로 교체해야 한다. 보안 변경이라 스윕 범위 밖으로 문서화만 한다.
7. **타입 우회 정리**: API 라우트가 Supabase 쿼리에 `as any` 캐스팅을 다수 사용한다. `src/types/supabase.ts`의 생성 타입과 정합하도록 점진적으로 제거 권장.

## 5. 안전 메모

- 이번 스윕은 **소스 코드를 수정하지 않았다.** STATUS.md 추가와 사전 WIP 체크포인트만 수행했다.
- 추적되는 시크릿 파일 없음(확인됨). `.env.local`은 `.gitignore`로 제외되어 커밋되지 않았다.
- 모든 커밋은 `claude/sweep-2026-06-13` 브랜치에서만 이뤄졌다. `main`은 건드리지 않았다.

---

## 6. 책/논문 가능성 (Book / Paper outline)

이 프로젝트는 "**LLM 기반 기술 문서 자동 생성기를 데스크톱 앱으로 출하하기**"라는 실무 사례 연구로 글이 된다. 코드가 완성되지 않아도 아래 섹션 대부분은 현존 자료만으로 집필 가능하다.

가제: **"From Desktop Shell to AI Document Pipeline: Building a Multi-Provider Portfolio Generator with Tauri, Next.js, and Supabase"** (한/영 동시 산출 권장, §11.10).

| # | 섹션 | 다룰 내용 | 현존 자료 |
|---|------|-----------|-----------|
| 1 | 서론·문제정의 | 포트폴리오/기술문서 작성 반복 노동, 자동화 동기 | README, 본 STATUS §1 |
| 2 | 아키텍처 개요 | Tauri 셸 + Next.js 정적 export + 서버 API의 하이브리드 구조 | `next.config.js`, `src-tauri/tauri.conf.json`, 빌드 스크립트 |
| 3 | 이중 빌드 패턴 | "static export에는 API 라우트가 없다"는 제약을 백업/복원 스크립트로 우회한 설계 | `scripts/prepare-tauri-build.js`, `restore-api-routes.js` (완전 구현됨) |
| 4 | 멀티 프로바이더 LLM 추상화 | OpenAI/Claude/Gemini별 프롬프트 최적화·통합 호출 인터페이스·폴백 | `src/lib/aiClient.ts`, `src/types/ai.ts` (완전 구현됨) |
| 5 | 프롬프트 엔지니어링 | 12종 문서 타입별 구조 가이드라인, 모델별 프롬프트 스타일 차이(OpenAI 구조화/Claude 맥락/Gemini 간결) | `aiClient.ts`의 `createOpenAIPrompt`/`createClaudePrompt`/`createGeminiPrompt` |
| 6 | 인증·키 관리·보안 | Supabase OAuth, RLS 정책, 관리자/개인 키 분리, 사용량 로깅 | `supabase/migrations/001_initial_schema.sql`, `src/app/api/**` (구현됨) |
| 7 | 보안 사후평가(레슨) | base64 ≠ 암호화 문제, 운영 전 교체 필요성 | 본 STATUS §4-6 (잔여 작업) |
| 8 | 모델 수명주기 관리 | 폐기된 모델 ID 하드코딩 사례로 본 "모델 ID 드리프트" 문제와 단일 출처 원칙 | 본 STATUS §4-1 (실측 불일치) |
| 9 | 평가·검증 | 타입 안정성(통과 확인)·E2E(미실행)·빌드 파이프라인 검증 방법론 | 본 STATUS §3 (tsc 통과는 검증됨, 나머지 미검증으로 명시) |
| 10 | 결론·향후 과제 | README-코드 동기화, 암호화, 모델 ID 일원화 | 본 STATUS §4 |

집필 시 정직성 원칙(§11): "E2E 통과"·"앱 출하 완료" 같은 미검증 주장 금지. 현 시점 검증된 사실은 "타입 체크 통과"와 "설치 성공"뿐이며, 런타임 동작은 미검증임을 명시할 것.
