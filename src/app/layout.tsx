import type { Metadata } from "next";
 
import "./globals.css";

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
      <body >
        {children}
      </body>
    </html>
  );
}
