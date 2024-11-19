const baseTheme = {
  colors: {
    text: '#E6E6E6',
    textSecondary: '#B3B3B3',
    background: "#0a192f",
    primary: "#64ffda",
    glass: "rgba(10, 25, 47, 0.7)",
    border: "rgba(100, 255, 218, 0.1)"
  }
};

export const themes = {
  dark: {
    name: "Dark Theme",
    colors: {
      ...baseTheme.colors,
      text: '#FFFFFF',
      textSecondary: '#E6E6E6',
      background: "#0a192f",
      primary: "#64ffda",
      glass: "rgba(10, 25, 47, 0.7)",
      border: "rgba(100, 255, 218, 0.1)"
    }
  },
  black: {
    name: "Black Theme",
    colors: {
      ...baseTheme.colors,
      text: '#FFFFFF',
      textSecondary: '#E6E6E6',
      background: "#000000",
      primary: "#64ffda",
      glass: "rgba(0, 0, 0, 0.7)",
      border: "rgba(100, 255, 218, 0.1)"
    }
  },
  light: {
    name: "Light Mode",
    colors: {
      ...baseTheme.colors,
      text: '#000000',
      textSecondary: '#333333',
      background: "#f5f5f5",
      primary: "#0a192f",
      glass: "rgba(245, 245, 245, 0.7)",
      border: "rgba(10, 25, 47, 0.1)"
    }
  },
  neon: {
    name: "Neon Dreams",
    colors: {
      ...baseTheme.colors,
      text: '#FFFFFF',
      textSecondary: '#E6E6E6',
      background: "#2b213a",
      primary: "#01cdfe",
      glass: "rgba(43, 33, 58, 0.7)",
      border: "rgba(1, 205, 254, 0.1)"
    }
  },
  cyberpunk: {
    name: "Cyberpunk Theme",
    colors: {
      ...baseTheme.colors,
      text: '#FFFFFF',
      textSecondary: '#E6E6E6',
      background: "#1a0f24",
      primary: "#05ffa1",
      glass: "rgba(26, 15, 36, 0.7)",
      border: "rgba(5, 255, 161, 0.1)"
    }
  },
  matrix: {
    name: "Matrix Theme",
    colors: {
      ...baseTheme.colors,
      text: '#FFFFFF',
      textSecondary: '#E6E6E6',
      background: "#0d0208",
      primary: "#00ff41",
      glass: "rgba(13, 2, 8, 0.7)",
      border: "rgba(0, 255, 65, 0.1)"
    }
  },
  synthwave: {
    name: "Synthwave",
    colors: {
      ...baseTheme.colors,
      text: '#FFFFFF',
      textSecondary: '#E6E6E6',
      background: "#241b2f",
      primary: "#f97e72",
      glass: "rgba(36, 27, 47, 0.7)",
      border: "rgba(249, 126, 114, 0.1)"
    }
  }
};
