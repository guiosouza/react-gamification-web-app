import type { Metadata } from "next";
import "./globals.css";
import ThemeProviders from "../providers/ThemeProviders";
import ResponsiveAppBar from "@/components/app-bar";

export const metadata: Metadata = {
  title: "Mother Base",
  description: "Criado por guiosouza",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProviders>
          <ResponsiveAppBar />
          {children}
        </ThemeProviders>
      </body>
    </html>
  );
}
