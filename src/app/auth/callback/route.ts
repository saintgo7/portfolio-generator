// OAuth 콜백 처리
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// Tauri 빌드 (static export) 시에는 이 라우트가 사용되지 않음
// 빈 응답 반환하여 static export 가능하게 함
const isTauriBuild = process.env.TAURI_ENV_PLATFORM !== undefined;

export async function GET(request: Request) {
  // Tauri 빌드에서는 더미 응답 (실제로 호출되지 않음)
  if (isTauriBuild) {
    return NextResponse.json({ message: 'Not available in desktop app' });
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  // Supabase에서 오는 에러 파라미터 확인
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    // OAuth 에러가 있으면 에러 페이지로 리다이렉트
    const errorParams = new URLSearchParams({
      error,
      ...(errorDescription && { error_description: errorDescription }),
    });
    return NextResponse.redirect(`${origin}/auth/error?${errorParams}`);
  }

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    // 코드 교환 에러
    const errorParams = new URLSearchParams({
      error: 'exchange_error',
      error_description: exchangeError.message,
    });
    return NextResponse.redirect(`${origin}/auth/error?${errorParams}`);
  }

  // 코드가 없는 경우
  return NextResponse.redirect(`${origin}/auth/error?error=no_code`);
}

// Static export를 위한 generateStaticParams (빈 배열)
export function generateStaticParams() {
  return [];
}
