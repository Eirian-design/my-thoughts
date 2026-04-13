import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eirian's Thoughts",
  description: "记录思考、灵感与学习",
};

// 引入字体
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
      </head>
      <body>
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
          
          {/* 顶部导航 */}
          <header className="nav-header">
            <div className="max-w-[720px] mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <a href="/" className="text-lg font-serif hover:opacity-70 transition-opacity" style={{ color: '#e5e5e5' }}>
                  Eirian's Thoughts
                </a>
                <nav className="flex gap-6 text-sm" style={{ color: '#888' }}>
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
          <footer className="nav-footer py-8">
            <div className="max-w-[720px] mx-auto px-6">
              <div className="cross-divider text-center mb-4"></div>
              <p className="text-center text-sm" style={{ color: '#666' }}>
                © {new Date().getFullYear()} Eirian · Soli Deo Gloria
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}