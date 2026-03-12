import { create } from "zustand";
import type { Lead, Business } from "@/types";

interface AppState {
  leads: Lead[];
  currentBusiness: Business | null;
  isLoading: boolean;

  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  setCurrentBusiness: (business: Business | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  leads: [],
  currentBusiness: null,
  isLoading: false,

  setLeads: (leads) => set({ leads }),
  addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
  updateLead: (id, updates) =>
    set((s) => ({
      leads: s.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
  setCurrentBusiness: (business) => set({ currentBusiness: business }),
  setLoading: (isLoading) => set({ isLoading }),
}));
