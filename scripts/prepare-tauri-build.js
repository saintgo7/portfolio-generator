// Tauri 빌드 전 API 라우트를 임시로 백업
import { rename, mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'src', 'app');
const backupDir = join(__dirname, '..', '.api-backup');

const apiRoutes = [
  'api/admin/keys/route.ts',
  'api/ai/generate/route.ts',
  'auth/callback/route.ts'
];

async function main() {
  console.log('Preparing Tauri build: backing up API routes...');

  // 백업 디렉토리 생성
  await mkdir(backupDir, { recursive: true });
  await mkdir(join(backupDir, 'api/admin/keys'), { recursive: true });
  await mkdir(join(backupDir, 'api/ai/generate'), { recursive: true });
  await mkdir(join(backupDir, 'auth/callback'), { recursive: true });

  for (const route of apiRoutes) {
    const srcPath = join(srcDir, route);
    const backupPath = join(backupDir, route);

    try {
      await access(srcPath);
      await rename(srcPath, backupPath);
      console.log(`  Backed up: ${route}`);
    } catch (e) {
      console.log(`  Skipping (not found): ${route}`);
    }
  }

  console.log('API routes backed up successfully.');
}

main().catch(console.error);
