import type { Database } from "./database";

export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type BusinessInsert = Database["public"]["Tables"]["businesses"]["Insert"];
export type BusinessUpdate = Database["public"]["Tables"]["businesses"]["Update"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type AgentConfig = Database["public"]["Tables"]["agent_configs"]["Row"];
export type AgentConfigInsert = Database["public"]["Tables"]["agent_configs"]["Insert"];
export type AgentConfigUpdate = Database["public"]["Tables"]["agent_configs"]["Update"];

export type Call = Database["public"]["Tables"]["calls"]["Row"];
export type CallInsert = Database["public"]["Tables"]["calls"]["Insert"];
export type CallUpdate = Database["public"]["Tables"]["calls"]["Update"];

export type CallEvent = Database["public"]["Tables"]["call_events"]["Row"];
export type CallEventInsert = Database["public"]["Tables"]["call_events"]["Insert"];

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

export type Integration = Database["public"]["Tables"]["integrations"]["Row"];
export type IntegrationInsert = Database["public"]["Tables"]["integrations"]["Insert"];
export type IntegrationUpdate = Database["public"]["Tables"]["integrations"]["Update"];

export type NotificationLog = Database["public"]["Tables"]["notification_log"]["Row"];
export type NotificationLogInsert = Database["public"]["Tables"]["notification_log"]["Insert"];
