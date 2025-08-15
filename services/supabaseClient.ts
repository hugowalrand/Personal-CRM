
import { createClient } from '@supabase/supabase-js';
import type { Contact, ContactInsert, ContactUpdate, ContactHistory, ContactHistoryInsert, ContactHistoryUpdate } from '../types';

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
        Insert: ContactInsert;
        Update: ContactUpdate;
        Relationships: [];
      };
      contact_history: {
        Row: ContactHistory;
        Insert: ContactHistoryInsert;
        Update: ContactHistoryUpdate;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
};

const supabaseUrl = 'https://bvnqysduorbfbsrnkqam.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2bnF5c2R1b3JiZmJzcm5rcWFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTI1NjU5MSwiZXhwIjoyMDcwODMyNTkxfQ.x6EKavD0uYvbspC2hNeGMm98tZuX187ZxAgaA4lVHWM';


function createSupabaseClient() {
    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase URL and Key are not configured correctly in services/supabaseClient.ts");
        return null;
    }
    return createClient<Database>(supabaseUrl, supabaseKey);
}

export const supabase = createSupabaseClient();