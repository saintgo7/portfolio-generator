'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function UserMenu() {
  const { user, profile, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0];

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-800 transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
            {displayName?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-50">
          {/* 사용자 정보 */}
          <div className="p-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {displayName?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{displayName}</p>
                <p className="text-zinc-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
            {profile?.role === 'admin' && (
              <span className="mt-2 inline-block px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded">
                관리자
              </span>
            )}
          </div>

          {/* 메뉴 항목 */}
          <div className="p-2">
            <button
              onClick={() => {
                // TODO: 프로필 설정 모달 열기
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg text-sm transition-colors"
            >
              ⚙️ 설정
            </button>

            {profile?.role === 'admin' && (
              <button
                onClick={() => {
                  // TODO: 관리자 패널 열기
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-zinc-300 hover:bg-zinc-800 rounded-lg text-sm transition-colors"
              >
                🔧 관리자 설정
              </button>
            )}

            <hr className="my-2 border-zinc-800" />

            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-red-400 hover:bg-zinc-800 rounded-lg text-sm transition-colors"
            >
              🚪 로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
