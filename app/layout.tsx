import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

const NAV_LINKS = [
  { href: "/", label: "home" },
  { href: "/essays/", label: "essays" },
  { href: "/tags/", label: "tags" },
  { href: "/portfolio/", label: "portfolio" },
  { href: "/dsa/", label: "dsa" },
];

export const metadata: Metadata = {
  title: "amiosamu - blog about cs stuff",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme-preference"
        >
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-2xl">
                <nav className="text-sm" aria-label="Main">
                  {NAV_LINKS.map(({ href, label }, index) => (
                    <Fragment key={href}>
                      {index > 0 && " / "}
                      <Link href={href} className="hover:underline">
                        {label}
                      </Link>
                    </Fragment>
                  ))}
                </nav>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

