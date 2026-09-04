import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { PortalDataProvider } from "@/components/PortalDataProvider";
import { portalConfig } from "@/config/portal.config";

export const metadata: Metadata = {
  title: portalConfig.app.name,
  description: portalConfig.app.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PortalDataProvider>
          <AppShell>{children}</AppShell>
        </PortalDataProvider>
      </body>
    </html>
  );
}
