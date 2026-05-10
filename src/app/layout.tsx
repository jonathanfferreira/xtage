import type { Metadata } from "next";
import { Poppins, Oswald, Outfit } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-heading",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  weight: ["600", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wing | Gestão de Festivais de Dança",
  description: "Plataforma SaaS B2B2C para festivais e escolas de dança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} ${oswald.variable} ${outfit.variable} font-sans antialiased text-gray-100 bg-black min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
