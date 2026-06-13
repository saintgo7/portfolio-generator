// Tauri 빌드 후 API 라우트 복원
import { rename, rm, access } from 'fs/promises';
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
  console.log('Restoring API routes after Tauri build...');

  for (const route of apiRoutes) {
    const srcPath = join(srcDir, route);
    const backupPath = join(backupDir, route);

    try {
      await access(backupPath);
      await rename(backupPath, srcPath);
      console.log(`  Restored: ${route}`);
    } catch (e) {
      console.log(`  Skipping (not found): ${route}`);
    }
  }

  // 백업 디렉토리 정리
  try {
    await rm(backupDir, { recursive: true });
    console.log('Cleanup complete.');
  } catch (e) {
    console.log('Cleanup skipped.');
  }

  console.log('API routes restored successfully.');
}

main().catch(console.error);
