import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserSession {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
}

interface UserStore {
  userData: UserSession | null;
  setUser: (user: UserSession | null) => void;
  socketEnabled: boolean;
  setSocketEnabled: (enabled: boolean) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: null, // No necesitas el JSON.parse aquí, persist lo hace por ti
      socketEnabled: false,
      setUser: (userData) => set({ userData }),
      setSocketEnabled: (enabled) => set({ socketEnabled: enabled }),
    }),
    {
      name: 'user-storage', // Nombre de la llave en storage
      storage: createJSONStorage(() => sessionStorage), // Por defecto es localStorage, aquí cambiamos a sessionStorage
    }
  )
);

export default useUserStore;