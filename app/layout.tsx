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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
