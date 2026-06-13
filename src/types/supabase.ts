// Supabase 데이터베이스 타입 정의

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          provider: 'openai' | 'claude' | 'gemini';
          encrypted_key: string;
          model: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: 'openai' | 'claude' | 'gemini';
          encrypted_key: string;
          model: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: 'openai' | 'claude' | 'gemini';
          encrypted_key?: string;
          model?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          provider: 'openai' | 'claude' | 'gemini';
          document_type: string;
          tokens_used: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: 'openai' | 'claude' | 'gemini';
          document_type: string;
          tokens_used: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          provider?: 'openai' | 'claude' | 'gemini';
          document_type?: string;
          tokens_used?: number;
          created_at?: string;
        };
      };
      admin_api_keys: {
        Row: {
          id: string;
          provider: 'openai' | 'claude' | 'gemini';
          encrypted_key: string;
          model: string;
          is_active: boolean;
          daily_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          provider: 'openai' | 'claude' | 'gemini';
          encrypted_key: string;
          model: string;
          is_active?: boolean;
          daily_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          provider?: 'openai' | 'claude' | 'gemini';
          encrypted_key?: string;
          model?: string;
          is_active?: boolean;
          daily_limit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// 편의 타입
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ApiKey = Database['public']['Tables']['api_keys']['Row'];
export type UsageLog = Database['public']['Tables']['usage_logs']['Row'];
export type AdminApiKey = Database['public']['Tables']['admin_api_keys']['Row'];
