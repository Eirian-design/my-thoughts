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
      <body className="min-h-screen bg-stone-50 text-stone-800 antialiased">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <header className="flex justify-between items-center mb-16">
            <a href="/" className="text-lg font-medium text-stone-800 hover:text-amber-600 transition-colors">
              Eirian
            </a>
            <nav className="flex gap-6 text-sm text-stone-500">
              <a href="/" className="hover:text-stone-800 transition-colors">首页</a>
              <a href="/admin" className="hover:text-stone-800 transition-colors">写文章</a>
              <a href="https://github.com/Eirian-design" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 transition-colors">GitHub</a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-20 pt-8 border-t border-stone-200 text-center">
            <p className="text-sm text-stone-400">© {new Date().getFullYear()} Eirian. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}