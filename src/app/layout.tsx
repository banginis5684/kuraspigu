import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { WelcomePopup } from "@/components/WelcomePopup";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KuraSpigu.lt — pigiausios degalų kainos Lietuvoje",
    template: "%s — KuraSpigu.lt",
  },
  description:
    "Palyginkite degalų kainas Vilniuje, Kaune, Klaipėdoje ir kituose Lietuvos miestuose ir raskite pigiausią degalinę šalia savęs.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="lt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <WelcomePopup />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
