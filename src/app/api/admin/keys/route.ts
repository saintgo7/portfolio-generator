// 관리자 API 키 관리 엔드포인트
import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// 키 암호화 (간단한 base64 - 실제로는 더 강력한 암호화 사용 권장)
function encryptKey(key: string): string {
  return Buffer.from(key, 'utf-8').toString('base64');
}

// 관리자 권한 확인
async function checkAdminAuth() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '인증이 필요합니다.', status: 401 };
  }

  // 프로필에서 관리자 권한 확인 - any 타입 사용하여 타입 에러 우회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single() as { data: { role: string } | null; error: unknown };

  if (profileError || !profile || profile.role !== 'admin') {
    return { error: '관리자 권한이 필요합니다.', status: 403 };
  }

  return { user };
}

// GET: 관리자 키 상태 조회
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const serviceClient = createServiceRoleClient();
    const { data: keys, error } = await serviceClient
      .from('admin_api_keys')
      .select('provider, model, is_active, daily_limit') as {
        data: Array<{ provider: string; model: string; is_active: boolean; daily_limit: number }> | null;
        error: unknown;
      };

    if (error) {
      console.error('Failed to fetch admin keys:', error);
      return NextResponse.json({ error: '키 조회 실패' }, { status: 500 });
    }

    // 키 존재 여부만 반환 (실제 키 값은 반환하지 않음)
    const keyStatus = ['openai', 'claude', 'gemini'].map(provider => {
      const existing = keys?.find(k => k.provider === provider);
      return {
        provider,
        hasKey: !!existing,
        model: existing?.model || '',
        isActive: existing?.is_active || false,
        dailyLimit: existing?.daily_limit || 100,
      };
    });

    return NextResponse.json({ keys: keyStatus });
  } catch (error) {
    console.error('GET admin keys error:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// POST: 관리자 키 저장/업데이트
export async function POST(request: Request) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { provider, apiKey, model, dailyLimit } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'provider와 apiKey가 필요합니다.' },
        { status: 400 }
      );
    }

    const validProviders = ['openai', 'claude', 'gemini'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: '유효하지 않은 provider입니다.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();

    // 기존 키 삭제 후 새로 삽입 (upsert)
    const { error } = await (serviceClient
      .from('admin_api_keys') as any)
      .upsert({
        provider,
        encrypted_key: encryptKey(apiKey),
        model: model || getDefaultModel(provider),
        is_active: true,
        daily_limit: dailyLimit || 100,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'provider',
      });

    if (error) {
      console.error('Failed to save admin key:', error);
      return NextResponse.json({ error: '키 저장 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST admin keys error:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

// DELETE: 관리자 키 삭제
export async function DELETE(request: Request) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { provider } = await request.json();

    if (!provider) {
      return NextResponse.json(
        { error: 'provider가 필요합니다.' },
        { status: 400 }
      );
    }

    const serviceClient = createServiceRoleClient();
    const { error } = await (serviceClient
      .from('admin_api_keys') as any)
      .delete()
      .eq('provider', provider);

    if (error) {
      console.error('Failed to delete admin key:', error);
      return NextResponse.json({ error: '키 삭제 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE admin keys error:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

function getDefaultModel(provider: string): string {
  const models: Record<string, string> = {
    openai: 'gpt-4o-mini',
    claude: 'claude-3-5-sonnet-20241022',
    gemini: 'gemini-1.5-flash',
  };
  return models[provider] || models.openai;
}
