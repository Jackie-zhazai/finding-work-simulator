import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finding Work · 求职人生模拟器",
  description: "换一个起点，走一段求职人生。随机体验与 MiMo 定制路线探索。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
