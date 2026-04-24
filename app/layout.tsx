import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
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
      <body>
        {children}
        <footer className="border-t border-white/5 bg-slate-950 px-6 py-8 text-xs text-slate-500 md:px-10">
          <div className="mx-auto max-w-7xl text-center md:text-left">
            <p>
              This site is a fan project and is not affiliated with, endorsed
              by, or sponsored by the University of Connecticut, UConn
              Athletics, the Big East Conference, or the NCAA. All team names,
              logos, and trademarks are the property of their respective
              owners. Season and game statistics sourced from{" "}
              <a
                href="https://www.sports-reference.com/cbb/schools/connecticut/men/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-slate-600 underline-offset-2 transition hover:text-slate-300 hover:decoration-slate-400"
              >
                Basketball-Reference
              </a>
              . Highlight videos are embedded from publicly available YouTube
              channels and remain the property of their original publishers.
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
