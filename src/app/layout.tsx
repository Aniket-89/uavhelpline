import type { Metadata } from "next";
import { Playfair_Display, Archivo, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import Header from "@/components/content/header";
import Footer from "@/components/content/footer";




const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "UAV helpline",
  description: "UAV helpline",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${archivo.variable} ${libreCaslonText.variable} antialiased`}
      >
        <QueryProvider>
        {children}
        </QueryProvider>
      </body>
    </html>
  );
}
