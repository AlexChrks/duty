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
      businesses: {
        Row: {
          id: string;
          name: string;
          vertical: string;
          phone: string | null;
          timezone: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          vertical?: string;
          phone?: string | null;
          timezone?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          vertical?: string;
          phone?: string | null;
          timezone?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          business_id: string;
          full_name: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_id: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      agent_configs: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          system_prompt: string;
          greeting_message: string;
          voice_id: string;
          language: string;
          is_active: boolean;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name?: string;
          system_prompt: string;
          greeting_message?: string;
          voice_id?: string;
          language?: string;
          is_active?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          system_prompt?: string;
          greeting_message?: string;
          voice_id?: string;
          language?: string;
          is_active?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      calls: {
        Row: {
          id: string;
          business_id: string;
          agent_config_id: string | null;
          external_id: string | null;
          caller_phone: string | null;
          status: CallStatus;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          summary: string | null;
          recording_url: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          agent_config_id?: string | null;
          external_id?: string | null;
          caller_phone?: string | null;
          status?: CallStatus;
          started_at?: string;
          ended_at?: string | null;
          duration_seconds?: number | null;
          summary?: string | null;
          recording_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          agent_config_id?: string | null;
          external_id?: string | null;
          caller_phone?: string | null;
          status?: CallStatus;
          started_at?: string;
          ended_at?: string | null;
          duration_seconds?: number | null;
          summary?: string | null;
          recording_url?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      call_events: {
        Row: {
          id: string;
          call_id: string;
          business_id: string;
          event_type: CallEventType;
          speaker: string | null;
          content: string | null;
          payload: Json;
          occurred_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          call_id: string;
          business_id: string;
          event_type: CallEventType;
          speaker?: string | null;
          content?: string | null;
          payload?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          call_id?: string;
          business_id?: string;
          event_type?: CallEventType;
          speaker?: string | null;
          content?: string | null;
          payload?: Json;
          occurred_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          business_id: string;
          call_id: string | null;
          status: LeadStatus;
          customer_name: string | null;
          customer_phone: string | null;
          summary: string | null;
          source: string;
          extra_data: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          call_id?: string | null;
          status?: LeadStatus;
          customer_name?: string | null;
          customer_phone?: string | null;
          summary?: string | null;
          source?: string;
          extra_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          call_id?: string | null;
          status?: LeadStatus;
          customer_name?: string | null;
          customer_phone?: string | null;
          summary?: string | null;
          source?: string;
          extra_data?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      integrations: {
        Row: {
          id: string;
          business_id: string;
          type: string;
          is_active: boolean;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          type: string;
          is_active?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          type?: string;
          is_active?: boolean;
          config?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_business_id: {
        Args: Record<string, never>;
        Returns: string;
      };
    };
    Enums: {
      call_status: CallStatus;
      call_event_type: CallEventType;
      lead_status: LeadStatus;
    };
  };
}

export type CallStatus = "ringing" | "in_progress" | "completed" | "failed" | "missed";
export type CallEventType = "transcript" | "status_change" | "action" | "error";
export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
