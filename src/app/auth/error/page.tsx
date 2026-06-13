'use client';

import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-white mb-2">
          로그인 실패
        </h1>
        <p className="text-zinc-400 mb-6">
          인증 과정에서 문제가 발생했습니다.<br />
          다시 시도해주세요.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
