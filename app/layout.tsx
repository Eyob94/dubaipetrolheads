import type { Metadata } from "next";
import "dirham/css";

import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Dubai Petrol Heads",
    description: "Intuitive search experience for dubai petrol heads",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased dark",
                geistSans.variable,
                geistMono.variable,
                "font-sans",
                inter.variable,
            )}
        >
            <body className="min-h-full flex flex-col items-center p-8">
                <div className="lg:max-w-5xl max-w-xl w-full">{children}</div>
            </body>
        </html>
    );
}
