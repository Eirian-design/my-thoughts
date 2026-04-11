import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eirian's Thoughts",
  description: "记录思考、灵感与学习",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen flex flex-col">
          {/* 顶部导航 - 简洁风格 */}
          <header className="border-b border-[var(--border)] py-4">
            <div className="max-w-[680px] mx-auto px-6 flex justify-between items-center">
              <a href="/" className="text-lg font-bold tracking-tight hover:opacity-70 transition-opacity">
                Eirian's Thoughts
              </a>
              <nav className="flex gap-6 text-sm text-[var(--text-light)]">
                <a href="/" className="hover:text-[var(--text)] transition-colors">首页</a>
                <a href="/admin" className="hover:text-[var(--text)] transition-colors">写文章</a>
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-[680px] mx-auto px-6 py-12">
              {children}
            </div>
          </main>

          <footer className="border-t border-[var(--border)] py-8 text-center">
            <p className="text-sm text-[var(--text-light)]">
              © {new Date().getFullYear()} Eirian. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}