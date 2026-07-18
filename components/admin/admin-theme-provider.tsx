"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeColors = {
  sidebarBg: string;
  sidebarText: string;
  sidebarActiveBg: string;
  sidebarActiveText: string;
  primary: string;
};

export const PRESET_THEMES: Record<string, ThemeColors> = {
  purple: {
    sidebarBg: "#4c3c92",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#4c3c92",
  },
  ocean: {
    sidebarBg: "#1e3a8a",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#1e3a8a",
  },
  forest: {
    sidebarBg: "#064e3b",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#064e3b",
  },
  slate: {
    sidebarBg: "#0f172a",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#0f172a",
  },
  sunset: {
    sidebarBg: "linear-gradient(135deg, #f97316 0%, #e11d48 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.2)",
    sidebarActiveText: "#ffffff",
    primary: "#e11d48",
  },
  midnight: {
    sidebarBg: "linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#312e81",
  },
  aurora: {
    sidebarBg: "linear-gradient(135deg, #0f766e 0%, #064e3b 50%, #4c1d95 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.2)",
    sidebarActiveText: "#ffffff",
    primary: "#0f766e",
  },
  dusk: {
    sidebarBg: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.2)",
    sidebarActiveText: "#ffffff",
    primary: "#ff7e5f",
  },
  nebula: {
    sidebarBg: "radial-gradient(circle at center, #6d28d9 0%, #1e1b4b 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#6d28d9",
  },
  "neon-mesh": {
    sidebarBg: "radial-gradient(at 0% 100%, #f43f5e 0%, transparent 60%), radial-gradient(at 90% 0%, #8b5cf6 0%, transparent 60%), #1e1b4b",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#f43f5e",
  },
  "eco-sphere": {
    sidebarBg: "radial-gradient(circle at 100% 0%, #fde047 0%, transparent 50%), radial-gradient(circle at 30% 50%, #10b981 0%, transparent 70%), #064e3b",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#10b981",
  },
  "cyber-grid": {
    sidebarBg: "linear-gradient(135deg, #09090b 0%, #18181b 40%, #7e22ce 80%, #3b82f6 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#7e22ce",
  },
  "glass-ocean": {
    sidebarBg: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), radial-gradient(circle at 20% 30%, #0284c7 0%, #082f49 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.2)",
    sidebarActiveText: "#ffffff",
    primary: "#0284c7",
  },
  "cosmic-dust": {
    sidebarBg: "conic-gradient(from 180deg at 50% 50%, #4c1d95 -45deg, #be185d 90deg, #4c1d95 225deg, #be185d 450deg)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(0, 0, 0, 0.3)",
    sidebarActiveText: "#ffffff",
    primary: "#be185d",
  },
  "velvet-ruby": {
    sidebarBg: "radial-gradient(ellipse at bottom, #be123c 0%, #4c0519 60%, #000000 100%)",
    sidebarText: "#ffffff",
    sidebarActiveBg: "rgba(255, 255, 255, 0.15)",
    sidebarActiveText: "#ffffff",
    primary: "#be123c",
  }
};

type ThemeContextType = {
  theme: string;
  setTheme: (name: string) => void;
  customColors: ThemeColors | null;
  setCustomColors: (colors: ThemeColors) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState("purple");
  const [customColors, setCustomColorsState] = useState<ThemeColors | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme-preset");
    if (savedTheme && PRESET_THEMES[savedTheme]) {
      setThemeState(savedTheme);
    }
    const savedCustom = localStorage.getItem("admin-theme-custom");
    if (savedCustom) {
      try {
        setCustomColorsState(JSON.parse(savedCustom));
        if (savedTheme === "custom") {
            setThemeState("custom");
        }
      } catch (e) {}
    }
  }, []);

  const setTheme = (name: string) => {
    setThemeState(name);
    localStorage.setItem("admin-theme-preset", name);
    if (name !== "custom") {
      localStorage.removeItem("admin-theme-custom");
      setCustomColorsState(null);
    }
  };

  const setCustomColors = (colors: ThemeColors) => {
    setCustomColorsState(colors);
    setThemeState("custom");
    localStorage.setItem("admin-theme-preset", "custom");
    localStorage.setItem("admin-theme-custom", JSON.stringify(colors));
  };

  useEffect(() => {
    const activeColors = theme === "custom" && customColors ? customColors : PRESET_THEMES[theme] || PRESET_THEMES.purple;
    
    const root = document.documentElement;
    root.style.setProperty("--admin-sidebar-bg", activeColors.sidebarBg);
    root.style.setProperty("--admin-sidebar-text", activeColors.sidebarText);
    root.style.setProperty("--admin-sidebar-active-bg", activeColors.sidebarActiveBg);
    root.style.setProperty("--admin-sidebar-active-text", activeColors.sidebarActiveText);
    root.style.setProperty("--admin-primary", activeColors.primary);
  }, [theme, customColors]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, customColors, setCustomColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}

export function AdminThemeInit() {
  const scriptStr = `
    (function() {
      try {
        var PRESET_THEMES = ${JSON.stringify(PRESET_THEMES)};
        var savedPreset = localStorage.getItem("admin-theme-preset");
        var savedCustom = localStorage.getItem("admin-theme-custom");
        var theme = savedPreset || "purple";
        var activeColors = PRESET_THEMES.purple;

        if (theme === "custom" && savedCustom) {
          try {
            activeColors = JSON.parse(savedCustom);
          } catch(e) {}
        } else if (PRESET_THEMES[theme]) {
          activeColors = PRESET_THEMES[theme];
        }

        var root = document.documentElement;
        root.style.setProperty("--admin-sidebar-bg", activeColors.sidebarBg);
        root.style.setProperty("--admin-sidebar-text", activeColors.sidebarText);
        root.style.setProperty("--admin-sidebar-active-bg", activeColors.sidebarActiveBg);
        root.style.setProperty("--admin-sidebar-active-text", activeColors.sidebarActiveText);
        root.style.setProperty("--admin-primary", activeColors.primary);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: scriptStr }} />;
}
