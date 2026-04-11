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
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
          
          {/* 顶部导航 */}
          <header style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
            <div className="max-w-[720px] mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <a href="/" className="text-lg font-serif hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
                  Eirian's Thoughts
                </a>
                <nav className="flex gap-6 text-sm" style={{ color: 'var(--text-light)' }}>
                  <a href="/" className="hover:opacity-70 transition-opacity">首页</a>
                  <a href="/admin" className="hover:opacity-70 transition-opacity">写文章</a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-[720px] mx-auto px-6 py-10">
              {children}
            </div>
          </main>

          {/* 底部 */}
          <footer className="py-8 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-light)' }}>
            <p>© {new Date().getFullYear()} Eirian</p>
          </footer>
        </div>
      </body>
    </html>
  );
}