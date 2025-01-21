import { create } from 'zustand';
import { Client } from '../types/client';

interface ClientState {
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
}

export const useClientStore = create<ClientState>((set) => ({
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client }),
}));

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));