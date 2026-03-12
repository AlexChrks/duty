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
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          caller_phone: string;
          caller_name: string | null;
          summary: string | null;
          status: "new" | "contacted" | "converted" | "archived";
          metadata: Json | null;
          source: "voice" | "manual" | "api";
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          business_id: string;
          caller_phone: string;
          caller_name?: string | null;
          summary?: string | null;
          status?: "new" | "contacted" | "converted" | "archived";
          metadata?: Json | null;
          source?: "voice" | "manual" | "api";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          business_id?: string;
          caller_phone?: string;
          caller_name?: string | null;
          summary?: string | null;
          status?: "new" | "contacted" | "converted" | "archived";
          metadata?: Json | null;
          source?: "voice" | "manual" | "api";
        };
        Relationships: [];
      };
      businesses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          owner_id: string;
          name: string;
          phone: string | null;
          vertical: "taxi" | "car_service" | "other";
          telegram_chat_id: string | null;
          settings: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          owner_id: string;
          name: string;
          phone?: string | null;
          vertical?: "taxi" | "car_service" | "other";
          telegram_chat_id?: string | null;
          settings?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          owner_id?: string;
          name?: string;
          phone?: string | null;
          vertical?: "taxi" | "car_service" | "other";
          telegram_chat_id?: string | null;
          settings?: Json | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: "new" | "contacted" | "converted" | "archived";
      lead_source: "voice" | "manual" | "api";
      business_vertical: "taxi" | "car_service" | "other";
    };
  };
}
