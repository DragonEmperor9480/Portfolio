'use client';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';
import { themes } from '../../src/themes/themes';
import GlobalStyles from '../../src/styles/GlobalStyles';
import AmrutLab from '../../src/components/AmrutLab';

function ThemedLab() {
  const { currentTheme } = useTheme();
  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      <GlobalStyles />
      <AmrutLab />
    </StyledThemeProvider>
  );
}

export default function AmrutLabPage() {
  return (
    <ThemeProvider>
      <ThemedLab />
    </ThemeProvider>
  );
}
