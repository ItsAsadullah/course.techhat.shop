"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SiteSettings {
  siteLogo: string;
  siteFavicon: string;
  siteOgImage: string;
  orgName: string;
  orgShortName: string;
}

const SiteSettingsContext = createContext<SiteSettings | undefined>(undefined);

export function SiteSettingsProvider({ 
  children, 
  settings 
}: { 
  children: ReactNode; 
  settings: SiteSettings;
}) {
  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
