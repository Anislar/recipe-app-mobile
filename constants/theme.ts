const colorPicker = {
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

export const COLORS = {
  ...colorPicker.forest,
  dark: "#3E3E3E",
  darkLight: "#E1E1E1",
  gray: "#e3e3e3",

  text: "#494949",
  textLight: "#7C7C7C",
  textDark: "#1D1D1D",

  rose: "#ef4444",
  roseLight: "#f8717171",
};

export const THEME = {
  colors: COLORS,
  fonts: {
    medium: "500",
    semibold: "600",
    bold: "700",
    extraBold: "800",
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
  },
} as const;
