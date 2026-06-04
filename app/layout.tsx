import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const chillax = localFont({
  src: [
    {
      path: "../public/fonts/chillax/Chillax-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/chillax/Chillax-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-chillax",
});

const poppins = localFont({
  src: "../public/fonts/poppins/Poppins-Regular.ttf",
  variable: "--font-poppins",
});

const vcr = localFont({
  src: "../public/fonts/vcr/VCR_OSD_MONO_1.001.ttf",
  variable: "--font-vcr",
});

export const metadata: Metadata = {
  title: "AccessX",
  description: "Access Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${chillax.variable} ${poppins.variable} ${vcr.variable}`}
    >
      <body className="flex flex-col min-h-screen bg-[color:var(--bg-primary)] text-[color:var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}