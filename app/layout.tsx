import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UConn Men’s Basketball Timeline",
  description:
    "Explore the Huskies’ championship runs through season timelines, moments, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
