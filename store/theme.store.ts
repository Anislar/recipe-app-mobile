import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { getItem, setItem, deleteItemAsync } from "expo-secure-store";

export const colorPicker = {
  coffee: {
    primary: "#A9746E",
    primaryDark: "#95605A",
  },
  forest: {
    primary: "#00C26F",
    primaryDark: "#009b58",
  },
  purple: {
    primary: "#8A2BE2",
    primaryDark: "#7416CC",
  },
  ocean: {
    primary: "#1CA9C9",
    primaryDark: "#0895B5",
  },
  sunset: {
    primary: "#FF5E5B",
    primaryDark: "#E54946",
  },
  mint: {
    primary: "#98FF98",
    primaryDark: "#82E982",
  },
  midnight: {
    primary: "#191970",
    primaryDark: "#05055C",
  },
  roseGold: {
    primary: "#B76E79",
    primaryDark: "#A15863",
  },
};

export type ThemeColors = typeof colorPicker;
export type ThemeKey = keyof typeof colorPicker;

interface ThemeState {
  selected: ThemeKey;
  setTheme: (key: ThemeKey) => void;
}

type ThemePersist = Pick<ThemeState, "selected">;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selected: "forest",
      setTheme: (key) => set({ selected: key }),
    }),
    {
      name: "theme-store",
      partialize: (state) => ({ selected: state.selected }),
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
    } as PersistOptions<ThemeState, ThemePersist>
  )
);

export const useSelectedColors = () => {
  const selected = useThemeStore((s) => s.selected);
  return colorPicker[selected];
};
