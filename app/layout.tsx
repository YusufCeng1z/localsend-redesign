import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalSend, redesign concept",
  description: "An unofficial redesign concept of the LocalSend homepage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${instrumentSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col"><SmoothScroll />
        {children}
      </body>
    </html>
  );
}
