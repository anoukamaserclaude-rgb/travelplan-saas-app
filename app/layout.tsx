import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  title: "TravelPlan | Organisez vos voyages",
  description: "Application SaaS pour organiser et partager ses voyages.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <SiteHeader />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
