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
          {/* 顶部导航 - 哥特式线条装饰 */}
          <header className="border-b" style={{ borderColor: 'var(--border)', borderBottomWidth: '3px' }}>
            <div className="max-w-[720px] mx-auto px-6 py-5">
              <div className="flex justify-between items-center">
                {/* 左侧：十字装饰 + 标题 */}
                <div className="flex items-center gap-4">
                  <span className="text-xl" style={{ color: 'var(--border)' }}>✝</span>
                  <a href="/" className="text-xl font-serif font-medium tracking-wide hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
                    Eirian's Thoughts
                  </a>
                </div>
                <nav className="flex gap-8 text-sm" style={{ color: 'var(--text-light)' }}>
                  <a href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--text-light)' }}>首页</a>
                  <a href="/admin" className="hover:opacity-70 transition-opacity" style={{ color: 'var(--text-light)' }}>写文章</a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <div className="max-w-[720px] mx-auto px-6 py-12">
              {children}
            </div>
          </main>

          {/* 底部装饰 */}
          <footer className="border-t py-10" style={{ borderColor: 'var(--border)', borderTopWidth: '1px' }}>
            <div className="max-w-[720px] mx-auto px-6">
              {/* 哥特式分隔线 */}
              <div className="gothic-divider mb-6">
                <div className="gothic-divider-center" />
              </div>
              <p className="text-center text-sm" style={{ color: 'var(--text-light)' }}>
                © {new Date().getFullYear()} Eirian · Soli Deo Gloria
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}