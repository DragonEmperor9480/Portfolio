import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import { themes } from './themes/themes';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/sections/About';
import DevBackground from './components/DevBackground';
import GlobalStyles from './styles/GlobalStyles';
import { useTheme } from './context/ThemeContext';

function ThemedApp() {
  const { currentTheme } = useTheme();

  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      <Router>
        <GlobalStyles />
        <DevBackground />
        <Navbar />
        <main>
          <Hero />
          <About />
        </main>
      </Router>
    </StyledThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
