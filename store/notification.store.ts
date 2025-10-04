import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

interface NotificationState {
  notificationNumber: number;
  setNotificationNumber: (n: number | ((prev: number) => number)) => void;
}

type NotificationPersist = NotificationState;

export const useNotification = create<NotificationState>()(
  persist(
    (set) => ({
      notificationNumber: 0,
      setNotificationNumber: (value: number | ((prev: number) => number)) =>
        set((state) => ({
          notificationNumber:
            typeof value === "function"
              ? value(state.notificationNumber)
              : value,
        })),
    }),
    {
      name: "theme-store",
      partialize: (state) => ({ notificationNumber: state.notificationNumber }),
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
    } as PersistOptions<NotificationState, NotificationPersist>
  )
);
