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
          full_name: string | null;
          avatar_url: string | null;
          preferred_currency: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_currency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_currency?: string;
          created_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          institution: string;
          balance: number;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          institution?: string;
          balance?: number;
          color?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          institution?: string;
          balance?: number;
          color?: string;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          wallet_id: string | null;
          merchant: string;
          category: string;
          direction: string;
          amount: number;
          note: string | null;
          source: string;
          reference_id: string | null;
          occurred_at: string;
          from_email: boolean;
          email_subject: string | null;
          email_sender: string | null;
          raw_payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallet_id?: string | null;
          merchant: string;
          category: string;
          direction: string;
          amount: number;
          note?: string | null;
          source?: string;
          reference_id?: string | null;
          occurred_at?: string;
          from_email?: boolean;
          email_subject?: string | null;
          email_sender?: string | null;
          raw_payload?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallet_id?: string | null;
          merchant?: string;
          category?: string;
          direction?: string;
          amount?: number;
          note?: string | null;
          source?: string;
          reference_id?: string | null;
          occurred_at?: string;
          from_email?: boolean;
          email_subject?: string | null;
          email_sender?: string | null;
          raw_payload?: Json;
          created_at?: string;
        };
      };
      parsed_emails: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          sender: string;
          received_at: string;
          parse_status: string;
          merchant: string;
          category: string;
          direction: string;
          amount: number;
          confidence: number;
          preview: string;
          raw_body: string;
          linked_transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          subject: string;
          sender: string;
          received_at?: string;
          parse_status?: string;
          merchant: string;
          category: string;
          direction: string;
          amount: number;
          confidence?: number;
          preview?: string;
          raw_body: string;
          linked_transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          subject?: string;
          sender?: string;
          received_at?: string;
          parse_status?: string;
          merchant?: string;
          category?: string;
          direction?: string;
          amount?: number;
          confidence?: number;
          preview?: string;
          raw_body?: string;
          linked_transaction_id?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}