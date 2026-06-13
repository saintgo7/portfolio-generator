/** @type {import('next').NextConfig} */

// Tauri 빌드 시에만 static export 사용 (개발 환경에서는 서버사이드 기능 필요)
const isTauriBuild = process.env.TAURI_ENV_PLATFORM !== undefined;

const nextConfig = {
  // Tauri 빌드 시에만 static export 및 distDir 설정
  ...(isTauriBuild && {
    output: 'export',
    distDir: 'out',
    // API 라우트 무시 (Tauri는 클라이언트 앱이므로 서버 API 불필요)
    experimental: {
      // Route Handler를 static export에서 제외
    }
  }),
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Tauri 빌드 시 API 라우트 제외
  ...(isTauriBuild && {
    excludeDefaultMomentLocales: true,
  })
};

export default nextConfig;
