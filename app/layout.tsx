import type { Metadata } from "next";
import { Suspense } from "react";
import { LegacyRuntime } from "@/components/legacy-runtime";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://woodfabrik.sk"),
  title: {
    default: "Woodfabrik",
    template: "%s",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <body className="bg-white font-sans text-[#333333]">
        <Suspense fallback={null}>
          <LegacyRuntime />
        </Suspense>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
