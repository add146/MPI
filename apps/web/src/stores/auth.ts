import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface Outlet {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    outlets: Outlet[];
    currentOutletId: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (token: string, user: User, outlets: Outlet[]) => void;
    logout: () => void;
    setCurrentOutlet: (outletId: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            outlets: [],
            currentOutletId: null,
            isAuthenticated: false,

            login: (token, user, outlets) => set({
                token,
                user,
                outlets,
                currentOutletId: outlets[0]?.id || null,
                isAuthenticated: true,
            }),

            logout: () => set({
                token: null,
                user: null,
                outlets: [],
                currentOutletId: null,
                isAuthenticated: false,
            }),

            setCurrentOutlet: (outletId) => set({
                currentOutletId: outletId,
            }),
        }),
        {
            name: 'mpi-auth',
        }
    )
);
