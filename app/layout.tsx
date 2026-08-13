import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Full Court Legacy — Basketball Career Simulator",
  description: "Build a basketball career season by season. Make the choices, face the unexpected, and leave your legacy.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Full Court Legacy",
    description: "Make the choices. Build the career.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Full Court Legacy" }],
  },
  twitter: { card: "summary_large_image", title: "Full Court Legacy", description: "Make the choices. Build the career.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
