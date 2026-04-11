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
          
          {/* 顶部导航 - 黑色装饰区域 */}
          <header className="dark-decoration">
            <div className="max-w-[720px] mx-auto px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* 哥特窗花 */}
                  <span style={{ color: 'var(--gothic-gold)', opacity: 0.7 }}>❋</span>
                  <a href="/" className="text-lg font-serif font-medium tracking-wide hover:opacity-70 transition-opacity">
                    Eirian's Thoughts
                  </a>
                </div>
                <nav className="flex gap-8 text-sm" style={{ opacity: 0.8 }}>
                  <a href="/" className="hover:opacity-70 transition-opacity">首页</a>
                  <a href="/admin" className="hover:opacity-70 transition-opacity">写文章</a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-[720px] mx-auto px-6 py-12">
              {children}
            </div>
          </main>

          {/* 底部装饰 - 黑色 */}
          <footer className="dark-decoration py-8">
            <div className="max-w-[720px] mx-auto px-6">
              {/* 玫瑰窗花 */}
              <div className="text-center mb-4" style={{ color: 'var(--gothic-gold)', opacity: 0.5 }}>❋ ✝ ❋</div>
              <p className="text-center text-sm" style={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} Eirian · Soli Deo Gloria
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}