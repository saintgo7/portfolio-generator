# Graph Report - .  (2026-06-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 506 nodes · 732 edges · 28 communities (26 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `369097f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 22|Community 22]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 21 edges
2. `String` - 14 edges
3. `useAuth()` - 11 edges
4. `Portfolio Generator - Tauri + Next.js 14` - 11 edges
5. `scripts` - 10 edges
6. `definitions` - 10 edges
7. `definitions` - 10 edges
8. `POST()` - 10 edges
9. `Portfolio` - 9 edges
10. `generatePortfolio()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `createServiceRoleClient()` --calls--> `createClient()`  [INFERRED]
  src/lib/supabase/server.ts → src/lib/supabase/client.ts
- `GET()` --calls--> `createServerSupabaseClient()`  [EXTRACTED]
  src/app/auth/callback/route.ts → src/lib/supabase/server.ts
- `HomePage()` --calls--> `useAuth()`  [EXTRACTED]
  src/app/page.tsx → src/contexts/AuthContext.tsx
- `LoginModal()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/auth/LoginModal.tsx → src/contexts/AuthContext.tsx
- `UserMenu()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/auth/UserMenu.tsx → src/contexts/AuthContext.tsx

## Import Cycles
- 1-file cycle: `src-tauri/src/commands.rs -> src-tauri/src/commands.rs`

## Communities (28 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (46): HomePage(), ProgressBar(), ProgressBarProps, Sidebar(), SidebarProps, CATEGORIES, DESCRIPTIONS, DESIGN_THEMES (+38 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (49): description, properties, required, type, description, properties, required, type (+41 more)

### Community 2 - "Community 2"
Cohesion: 0.04
Nodes (47): description, properties, required, type, description, properties, required, type (+39 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (28): CATEGORIES, GenerationMode, PLATFORMS, Props, callClaude(), callGemini(), callOpenAI(), createClaudePrompt() (+20 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (23): downloadFile(), exportAllAsZip(), exportAllToDocx(), exportAllToMarkdown(), exportToDocx(), generateAllDocuments(), generateArchitecture(), generateCodingConvention() (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (22): metadata, LoginModal(), Props, UserMenu(), AuthContext, AuthContextType, AuthProvider(), useAuth() (+14 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): description, devDependencies, autoprefixer, @playwright/test, postcss, tailwindcss, @tauri-apps/cli, @types/file-saver (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (25): anyOf, definitions, Identifier, Number, PermissionEntry, ShellScopeEntryAllowedArg, ShellScopeEntryAllowedArgs, Target (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (24): AppInfo, Category, DesignTheme, HashMap, Option, PathBuf, Result, AppInfo (+16 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (24): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+16 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (19): GET(), createClaudePrompt(), createGeminiPrompt(), createOpenAIPrompt(), decryptKey(), GenerateRequest, generateWithClaude(), generateWithGemini() (+11 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (23): 1. 사전 요구사항, 2. 의존성 설치, 3. 개발 모드 실행, 4. 프로덕션 빌드, IPC 통신, Next.js 14 App Router, Portfolio Generator - Tauri + Next.js 14, Tauri vs Electron (+15 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (23): anyOf, definitions, Number, PermissionEntry, ShellScopeEntryAllowedArg, ShellScopeEntryAllowedArgs, Target, Value (+15 more)

### Community 13 - "Community 13"
Cohesion: 0.09
Nodes (22): app, macOSPrivateApi, security, windows, build, beforeBuildCommand, beforeDevCommand, devUrl (+14 more)

### Community 14 - "Community 14"
Cohesion: 0.12
Nodes (17): dependencies, @anthropic-ai/sdk, docx, file-saver, @google/generative-ai, jszip, next, openai (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): 1. 프로젝트 목적, 2. 현재 상태 (트리아지: dirty_wip, 사전 변경 25파일), 3. 작동하는 것 vs 작동하지 않는 것 (검증 근거 포함), 4. 끝내기 위한 구체적 잔여 작업, 5. 안전 메모, 6. 책/논문 가능성 (Book / Paper outline), English summary (TL;DR), STATUS — Portfolio Generator (Tauri + Next.js) (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.33
Nodes (4): apiRoutes, backupDir, __dirname, srcDir

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (4): apiRoutes, backupDir, __dirname, srcDir

## Knowledge Gaps
- **230 isolated node(s):** `nextConfig`, `name`, `version`, `description`, `type` (+225 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `definitions` connect `Community 7` to `Community 2`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `definitions` connect `Community 12` to `Community 1`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _230 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06836158192090395 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04251700680272109 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.04440333024976873 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.1265597147950089 - nodes in this community are weakly interconnected._