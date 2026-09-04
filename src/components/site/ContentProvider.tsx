import { createContext, useContext, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "@/data/content";

/**
 * Provides the effective site content (defaults merged with the admin's saved
 * edits) to the whole app. If a component ever renders outside the provider, or
 * the value is missing, it falls back to the shipped defaults — so content is
 * always present and the UI can never crash for lack of it.
 */
const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({
  value,
  children,
}: {
  value: SiteContent;
  children: ReactNode;
}) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(ContentContext) ?? defaultContent;
}
