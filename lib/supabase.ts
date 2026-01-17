import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing environment variables. URL:', !!supabaseUrl, 'Key:', !!supabaseAnonKey);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export type Database = {
  public: {
    Tables: {
      sectors: {
        Row: {
          id: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          is_active: boolean;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['sectors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['sectors']['Insert']>;
      };
      operations: {
        Row: {
          id: string;
          sector_id: string;
          name: string;
          description: string;
          color: string;
          icon: string;
          is_active: boolean;
          created_at: string;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['operations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['operations']['Insert']>;
      };
      expenses: {
        Row: {
          id: string;
          operation_id: string;
          description: string;
          supplier: string;
          category: string;
          agreed_value: number;
          invoice_value: number | null;
          invoice_number: string | null;
          due_date: string;
          created_at: string;
          created_by: string;
          status: string;
          notes: string | null;
          payment_date: string | null;
          verified_by: string | null;
          verification_notes: string | null;
          user_id: string;
        };
        Insert: Omit<Database['public']['Tables']['expenses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['expenses']['Insert']>;
      };
    };
  };
};
