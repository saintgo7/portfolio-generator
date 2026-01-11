import { Category, DesignTheme, Platform } from '@/types/portfolio';

export const CATEGORIES: Category[] = [
  { id: 'healthcare', name: '헬스케어', icon: '\u25C8' },
  { id: 'finance', name: '금융', icon: '\u25C6' },
  { id: 'education', name: '교육', icon: '\u25C7' },
  { id: 'ecommerce', name: '이커머스', icon: '\u25A3' },
  { id: 'social', name: '소셜', icon: '\u25C9' },
  { id: 'productivity', name: '생산성', icon: '\u25A7' },
  { id: 'entertainment', name: '엔터테인먼트', icon: '\u25CE' },
  { id: 'iot', name: 'IoT', icon: '\u25A4' },
  { id: 'ai', name: 'AI/ML', icon: '\u25D0' },
  { id: 'blockchain', name: '블록체인', icon: '\u25D1' }
];

export const PLATFORMS = [
  { id: 'web', name: 'Web', icon: '\u25A0' },
  { id: 'mobile', name: 'Mobile', icon: '\u25B2' },
  { id: 'desktop', name: 'Desktop', icon: '\u25AC' }
];

export const DESIGN_THEMES: Record<Platform, DesignTheme[]> = {
  web: [
    { name: 'Minimal Light', bg: '#ffffff', text: '#1a1a1a', accent: '#3b82f6', border: '#e5e5e5' },
    { name: 'Dark Pro', bg: '#0a0a0a', text: '#ffffff', accent: '#22c55e', border: '#2a2a2a' },
    { name: 'Ocean Blue', bg: '#0f172a', text: '#e2e8f0', accent: '#0ea5e9', border: '#1e293b' },
    { name: 'Warm Sunset', bg: '#fef7ed', text: '#1c1917', accent: '#f97316', border: '#fed7aa' },
    { name: 'Forest Green', bg: '#f0fdf4', text: '#14532d', accent: '#16a34a', border: '#bbf7d0' },
    { name: 'Purple Haze', bg: '#faf5ff', text: '#3b0764', accent: '#a855f7', border: '#e9d5ff' },
    { name: 'Monochrome', bg: '#18181b', text: '#fafafa', accent: '#71717a', border: '#3f3f46' },
    { name: 'Coral Pink', bg: '#fff1f2', text: '#881337', accent: '#fb7185', border: '#fecdd3' }
  ],
  mobile: [
    { name: 'iOS Light', bg: '#f2f2f7', text: '#1c1c1e', accent: '#007aff', border: '#c6c6c8' },
    { name: 'iOS Dark', bg: '#1c1c1e', text: '#ffffff', accent: '#0a84ff', border: '#38383a' },
    { name: 'Material Light', bg: '#fafafa', text: '#212121', accent: '#6200ee', border: '#e0e0e0' },
    { name: 'Material Dark', bg: '#121212', text: '#ffffff', accent: '#bb86fc', border: '#2c2c2c' },
    { name: 'Vibrant', bg: '#ffffff', text: '#1a1a1a', accent: '#ff3b30', border: '#e5e5e5' },
    { name: 'Nature', bg: '#f5f5dc', text: '#2d2d2d', accent: '#228b22', border: '#dcdcdc' },
    { name: 'Night Mode', bg: '#0d1117', text: '#c9d1d9', accent: '#58a6ff', border: '#30363d' },
    { name: 'Pastel', bg: '#fdf6f0', text: '#4a4a4a', accent: '#ffb3ba', border: '#e8e8e8' }
  ],
  desktop: [
    { name: 'macOS Light', bg: '#f5f5f5', text: '#1d1d1f', accent: '#0071e3', border: '#d2d2d7' },
    { name: 'macOS Dark', bg: '#1e1e1e', text: '#f5f5f7', accent: '#2997ff', border: '#424245' },
    { name: 'Windows Fluent', bg: '#f3f3f3', text: '#1a1a1a', accent: '#0078d4', border: '#e1e1e1' },
    { name: 'Windows Dark', bg: '#202020', text: '#ffffff', accent: '#60cdff', border: '#3d3d3d' },
    { name: 'Linux GTK', bg: '#f6f5f4', text: '#2e3436', accent: '#3584e4', border: '#deddda' },
    { name: 'Linux Dark', bg: '#242424', text: '#ffffff', accent: '#78aeed', border: '#454545' },
    { name: 'Retro Terminal', bg: '#0c0c0c', text: '#00ff00', accent: '#00ff00', border: '#1a1a1a' },
    { name: 'Professional', bg: '#fafafa', text: '#333333', accent: '#4a90d9', border: '#dddddd' }
  ]
};

export const FEATURES = {
  web: [
    '반응형 디자인 (모바일/태블릿/데스크톱)',
    'SEO 최적화 및 메타 태그 관리',
    'Progressive Web App (PWA) 지원',
    'RESTful API 통합',
    'JWT 기반 인증/인가',
    'OAuth 2.0 소셜 로그인',
    '실시간 알림 (WebSocket)',
    '다크/라이트 테마 전환',
    '다국어 지원 (i18n)',
    '접근성 (WCAG 2.1) 준수',
    '무한 스크롤 및 페이지네이션',
    '검색 및 필터링 시스템',
    '대시보드 및 통계 차트',
    '파일 업로드 및 미디어 관리',
    'HTTPS 보안 통신'
  ],
  mobile: [
    '네이티브 UI/UX 컴포넌트',
    '푸시 알림 (FCM/APNs)',
    '생체 인증 (Face ID/지문)',
    '오프라인 모드 지원',
    '카메라 및 갤러리 연동',
    'GPS 위치 기반 서비스',
    'AR/VR 기능 통합',
    '인앱 결제 (IAP)',
    '소셜 공유 기능',
    '딥 링크 지원',
    '앱 위젯 (홈 화면)',
    '백그라운드 동기화',
    '제스처 기반 네비게이션',
    'Core ML/TensorFlow Lite',
    'HealthKit/Google Fit 연동'
  ],
  desktop: [
    '크로스 플랫폼 (macOS/Windows/Linux)',
    '시스템 트레이 통합',
    '멀티 윈도우 관리',
    '파일 시스템 접근',
    '드래그 앤 드롭 지원',
    '로컬 데이터베이스 (SQLite)',
    '키보드 단축키 커스터마이징',
    '자동 업데이트 기능',
    '플러그인/확장 시스템',
    '외부 디바이스 연동 (USB/Bluetooth)',
    '화면 캡처 및 녹화',
    '클립보드 관리',
    '시스템 알림 연동',
    '멀티 모니터 지원',
    '성능 모니터링 도구'
  ]
};

export const TECH_STACKS = {
  web: {
    frontend: ['React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js'],
    backend: ['Node.js', 'Django', 'FastAPI', 'Spring Boot', 'Ruby on Rails', 'Go'],
    database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Supabase', 'Firebase'],
    cloud: ['AWS', 'Google Cloud', 'Azure', 'Vercel', 'Netlify', 'Cloudflare']
  },
  mobile: {
    framework: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin', 'Ionic'],
    backend: ['Firebase', 'Supabase', 'AWS Amplify', 'Parse', 'Backendless'],
    state: ['Redux', 'MobX', 'Riverpod', 'Provider', 'GetX', 'Zustand'],
    testing: ['Jest', 'Detox', 'XCTest', 'Espresso', 'Appium', 'Maestro']
  },
  desktop: {
    framework: ['Electron', 'Tauri', 'Qt', 'GTK', 'SwiftUI', '.NET MAUI'],
    language: ['TypeScript', 'Rust', 'C++', 'Python', 'Swift', 'C#'],
    database: ['SQLite', 'LevelDB', 'Realm', 'IndexedDB', 'NeDB', 'PouchDB'],
    build: ['Webpack', 'Vite', 'esbuild', 'Rollup', 'Parcel', 'Turbopack']
  }
};

export const SCREENS = {
  web: [
    '랜딩 페이지',
    '대시보드',
    '사용자 프로필',
    '설정 페이지',
    '검색 결과',
    '상세 보기'
  ],
  mobile: [
    '온보딩 화면',
    '홈 탭',
    '프로필 화면',
    '알림 센터',
    '설정 화면',
    '검색 화면'
  ],
  desktop: [
    '메인 윈도우',
    '사이드바 패널',
    '설정 다이얼로그',
    '파일 브라우저',
    '상태 표시줄',
    '환경설정 창'
  ]
};

export const USAGE_STEPS = {
  web: [
    '1. 브라우저에서 URL 접속',
    '2. 회원가입 또는 로그인',
    '3. 대시보드에서 기능 탐색',
    '4. 원하는 작업 수행',
    '5. 데이터 저장 및 공유',
    '6. 설정에서 환경 커스터마이징'
  ],
  mobile: [
    '1. 앱스토어에서 다운로드',
    '2. 앱 실행 및 권한 허용',
    '3. 계정 생성 또는 로그인',
    '4. 온보딩 튜토리얼 완료',
    '5. 메인 기능 사용',
    '6. 알림 설정 및 개인화'
  ],
  desktop: [
    '1. 설치 파일 다운로드',
    '2. 설치 마법사 진행',
    '3. 애플리케이션 실행',
    '4. 초기 설정 완료',
    '5. 워크스페이스 구성',
    '6. 단축키 학습 및 활용'
  ]
};

export const DESCRIPTIONS: Record<string, string[]> = {
  healthcare: [
    '개인 건강 데이터를 체계적으로 관리하고 분석하여 맞춤형 건강 인사이트를 제공합니다.',
    '의료 서비스 접근성을 높이고 환자-의료진 간 원활한 커뮤니케이션을 지원합니다.',
    '운동, 식단, 수면 패턴을 추적하여 건강한 생활습관 형성을 돕습니다.'
  ],
  finance: [
    '개인 재무 관리를 자동화하고 지출 패턴 분석을 통해 스마트한 저축을 지원합니다.',
    '실시간 시장 데이터와 AI 기반 분석으로 투자 의사결정을 돕습니다.',
    '간편하고 안전한 결제 경험으로 디지털 금융 서비스를 혁신합니다.'
  ],
  education: [
    '개인화된 학습 경로와 인터랙티브 콘텐츠로 효과적인 교육을 제공합니다.',
    '학습자와 교육자를 연결하여 지식 공유 커뮤니티를 구축합니다.',
    '게이미피케이션 요소로 학습 동기를 부여하고 성취감을 높입니다.'
  ],
  ecommerce: [
    'AI 추천 엔진과 개인화된 쇼핑 경험으로 고객 만족도를 높입니다.',
    '원클릭 결제와 빠른 배송 시스템으로 편리한 구매를 지원합니다.',
    '판매자와 구매자를 효과적으로 연결하는 마켓플레이스를 제공합니다.'
  ],
  social: [
    '사용자 간 의미 있는 연결을 촉진하고 커뮤니티 형성을 지원합니다.',
    '콘텐츠 제작과 공유를 쉽게 만들어 창작자 경제를 활성화합니다.',
    '실시간 소통과 협업 기능으로 팀워크를 강화합니다.'
  ],
  productivity: [
    '업무 프로세스를 자동화하고 효율성을 극대화하는 도구를 제공합니다.',
    '프로젝트 관리와 팀 협업을 위한 통합 플랫폼을 구축합니다.',
    '시간 관리와 목표 달성을 돕는 스마트 계획 시스템을 제공합니다.'
  ],
  entertainment: [
    '몰입감 있는 미디어 경험과 개인화된 콘텐츠 추천을 제공합니다.',
    '창작자와 팬을 연결하여 새로운 엔터테인먼트 생태계를 만듭니다.',
    '소셜 기능과 결합된 인터랙티브 엔터테인먼트를 제공합니다.'
  ],
  iot: [
    '스마트 디바이스를 통합 관리하여 편리한 스마트홈 환경을 구축합니다.',
    '센서 데이터 분석을 통해 자동화된 제어 시스템을 제공합니다.',
    '에너지 효율 최적화로 지속가능한 생활을 지원합니다.'
  ],
  ai: [
    '머신러닝 모델을 쉽게 구축하고 배포할 수 있는 플랫폼을 제공합니다.',
    'AI 기반 자동화로 반복 작업을 줄이고 생산성을 높입니다.',
    '자연어 처리와 컴퓨터 비전 기술로 지능형 서비스를 구현합니다.'
  ],
  blockchain: [
    '분산 원장 기술로 투명하고 안전한 트랜잭션을 보장합니다.',
    '스마트 컨트랙트를 통해 자동화된 계약 실행을 지원합니다.',
    '디지털 자산 관리와 탈중앙화 금융(DeFi) 서비스를 제공합니다.'
  ]
};
