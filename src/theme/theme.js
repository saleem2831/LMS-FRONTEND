// Skillstek Brand Colors
export const COLORS = {
  // Primary Colors
  primary: {
    dark: "#1E3A8A",      // Dark Blue
    base: "#3B82F6",      // Main Blue
    light: "#DBEAFE",     // Light Blue
  },
  accent: {
    purple: "#7C3AED",    // Purple
    cyan: "#06B6D4",      // Cyan
  },
  // Neutral Colors
  neutral: {
    dark: "#111827",      // Dark Navy
    gray900: "#1F2937",
    gray800: "#374151",
    gray700: "#4B5563",
    gray600: "#6B7280",
    gray500: "#9CA3AF",
    gray400: "#D1D5DB",
    gray300: "#E5E7EB",
    gray200: "#F3F4F6",
    gray100: "#F9FAFB",
    white: "#FFFFFF",
    black: "#000000",
  },
  // Status Colors
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: "'Poppins', sans-serif",
  sizes: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Spacing
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
};

// Border Radius
export const BORDER_RADIUS = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
};

// Shadows
export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
};

// Breakpoints
export const BREAKPOINTS = {
  mobile: "640px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1280px",
};

// Complete Theme Object
export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
  breakpoints: BREAKPOINTS,
};

export default THEME;
