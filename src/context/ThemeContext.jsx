import { createContext, useContext, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext();

// Dark-only — light mode disabled site-wide per design direction.
const FORCED_THEME = "dark";

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(FORCED_THEME);
    try {
      localStorage.setItem("theme", FORCED_THEME);
    } catch {
      /* private mode / storage disabled — ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ theme: FORCED_THEME, toggle: () => {} }),
    []
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
