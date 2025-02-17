# Amrutesh Naregal Portfolio

A sophisticated portfolio website showcasing skills, projects, and achievements with a modern, interactive design.

## Features
- 🎨 Multiple theme options (Dark, Light, Neon, Cyberpunk, etc.)
- 🖼️ 3D background using React Three Fiber
- ✨ Smooth animations with Framer Motion
- 📄 Section components for About, Achievements, and Certifications
- 🌓 Theme management using Context API
- ⏳ Loading skeleton animations

## Technologies Used
- React
- Vite
- Tailwind CSS
- Framer Motion
- React Three Fiber
- Styled Components
- React Router

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Usage
Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Components Overview
- **Navbar**: Navigation bar for the portfolio
- **Hero**: Introduction section
- **About**: Information about the individual
- **Achievements**: Displays achievements
- **Certifications**: Lists certifications
- **DevBackground**: 3D background component
- **SkeletonLoader**: Loading [Previous content remains the same until the "Important Code Sections" part]
animation component

## Theme Management
The portfolio features a theme management system with multiple options:
- Dark Theme
- Light Mode
- Neon Dreams
- Cyberpunk
- Matrix
- Synthwave

## Project Structure and Key Files

### Configuration Files
- **package.json**: Manages project dependencies and scripts
- **vite.config.js**: Vite build configuration
- **tailwind.config.js**: Tailwind CSS configuration
- **postcss.config.js**: PostCSS configuration
- **eslint.config.js**: ESLint configuration

### Main Application
- **src/App.jsx**: Main application component handling routing and theme management
- **src/main.jsx**: Entry point for the React application

### Context
- **src/context/ThemeContext.jsx**: Manages theme state and provides theme context to components

### Components
- **src/components/Navbar.jsx**: Navigation bar component
- **src/components/Hero.jsx**: Hero section component
- **src/components/DevBackground.jsx**: 3D background component using React Three Fiber
- **src/components/SkeletonLoader.jsx**: Loading animation component

### Sections
- **src/components/sections/About.jsx**: About section component
- **src/components/sections/Achievements.jsx**: Achievements section component
- **src/components/sections/Certifications.jsx**: Certifications section component

### Styles
- **src/styles/GlobalStyles.js**: Global styles using Styled Components
- **src/themes/themes.js**: Theme definitions and color schemes

### Assets
- **src/assets/**: Contains images and certificates
- **src/data/certificates.json**: JSON data for certifications

## Important Code Sections

### Theme Management
```jsx
// src/context/ThemeContext.jsx
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```
This code creates a theme context that stores the current theme and provides a function to change themes. Components can access and modify the theme using the useTheme hook.

### 3D Background
```jsx
// src/components/DevBackground.jsx
<Canvas>
  <Suspense fallback={null}>
    <Stars />
    <OrbitControls enableZoom={false} />
  </Suspense>
</Canvas>
```
This code sets up a 3D scene using React Three Fiber, featuring a star field background with interactive camera controls.

### Theme Switching
```jsx
// src/components/ThemeSwitcher.jsx
const { currentTheme, setCurrentTheme } = useTheme();

const handleThemeChange = (theme) => {
  setCurrentTheme(theme);
};
```
This code handles theme switching by updating the theme context state, which triggers re-renders of themed components.

### Page Transitions
```jsx
// src/App.jsx
<AnimatePresence>
  {isLoading ? (
    <SkeletonLoader />
  ) : (
    <>
      <DevBackground />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Achievements />
        <Certifications />
      </main>
    </>
  )}
</AnimatePresence>
```
This code manages page transitions using Framer Motion's AnimatePresence component, providing smooth animations between different states.

### Global Styles
```js
// src/styles/GlobalStyles.js
const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
`;
```
This code defines global styles that adapt to the current theme, ensuring consistent styling across the application.

### Certification Data Handling
```js
// src/components/sections/Certifications.jsx
{certificates.map((cert) => (
  <CertificationCard
    key={cert.id}
    title={cert.title}
    image={cert.image}
    description={cert.description}
  />
))}
```
This code maps through the certification data and renders individual certification cards with their respective details.

## License
MIT
