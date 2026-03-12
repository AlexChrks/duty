"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendLeadNotifications } from "@/lib/notifications";
import type { Lead, LeadInsert, LeadUpdate } from "@/types";

export async function createLead(data: LeadInsert) {
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("leads")
    .insert(data)
    .select()
    .single();

  if (error || !row) throw new Error(error?.message ?? "Failed to create lead");

  const lead = row as unknown as Lead;

  // Best-effort notification — never blocks or crashes lead creation
  sendLeadNotifications(lead).catch((err) =>
    console.error("Unexpected notification error:", err),
  );

  revalidatePath("/leads");
  return lead;
}

export async function updateLeadStatus(id: string, updates: LeadUpdate) {
  const supabase = await createClient();

  const { error } = await supabase.from("leads").update(updates).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/leads");
}

export async function getLeads(businessId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
