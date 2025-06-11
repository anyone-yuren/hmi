import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface Notification {
  id: string;
  title: string;
  message: string;
  content?: string;
  source: number;
  status: number;
  type: number;
  method: number;
  creationTime: string;
}
interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  countUnread: number; //是否更新
  setCountUnread: (count: number) => void;
  resetNotification: () => void;
}
export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (notification: any) =>
        set((state) => ({
          notifications: notification,
        })),
      removeNotification: (id: string) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== id
          ),
        })),
      resetNotification: () =>
        set((state) => ({
          notifications: [],
        })),
      countUnread: 0,
      setCountUnread: (count: number) =>
        set((state) => ({
          countUnread: count,
        })),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
