import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/latin-300.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "./globals.css";
import "./visual-refresh.css";
export const metadata: Metadata = {
  title: "MASSI — The art of becoming",
  description:
    "An independent cinematic design concept for Salon Massi, Hamburg. Original 3D interior; local demonstration only.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
