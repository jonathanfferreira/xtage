import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfileMode = 'bailarino' | 'diretor' | 'organizador';

interface ProfileState {
  activeProfile: UserProfileMode;
  setActiveProfile: (profile: UserProfileMode) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfile: 'bailarino', // Default mode
      setActiveProfile: (profile) => set({ activeProfile: profile }),
    }),
    {
      name: 'xtage-profile-storage',
    }
  )
);
