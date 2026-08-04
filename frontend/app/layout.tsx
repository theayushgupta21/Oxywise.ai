import type { Metadata } from "next";
import { Poppins, Gelasio } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const gelasio = Gelasio({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gelasio",
});

export const metadata: Metadata = {
  title: "Oxywise.AI",
  description: "AI Powered Plant Intelligence",
  icons: {
    icon: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${gelasio.variable}`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}