import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider } from './context/ThemeContext';
import { themes } from './themes/themes';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DevBackground from './components/DevBackground';
import GlobalStyles from './styles/GlobalStyles';
import { useTheme } from './context/ThemeContext';
import WorkInProgress from './components/WorkInProgress';

function ThemedApp() {
  const { currentTheme } = useTheme();

  return (
    <StyledThemeProvider theme={themes[currentTheme]}>
      <Router>
        <GlobalStyles />
        <DevBackground />
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/work-in-progress" element={<WorkInProgress />} />
        </Routes>
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
