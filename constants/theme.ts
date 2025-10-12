export const COLORS = {
  dark: "#3E3E3E",
  darkLight: "#E1E1E1",
  gray: "#bbb",
  grayLight: "#f9f9f9",
  darkGray: "#777",
  grey2: "#6b7280",
  grey2Light: "#f3f4f6",
  text: "#494949",
  textLight: "#7C7C7C",
  textDark: "#1D1D1D",
  blue: "#3B82F6",
  white: "#fff",
  rose: "#ef4444",
  roseLight: "#fbd0d0",
  skyBlue: "#0895B5",
};

export const THEME = {
  colors: COLORS,
  fonts: {
    normal: "400",
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
