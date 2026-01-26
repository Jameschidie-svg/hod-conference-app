import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EventDto } from "@/types/api";

interface EventState {
  currentEvent: EventDto | null;
  setCurrentEvent: (event: EventDto | null) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      currentEvent: null,
      setCurrentEvent: (event) => set({ currentEvent: event }),
    }),
    {
      name: "event-storage",
    }
  )
);

