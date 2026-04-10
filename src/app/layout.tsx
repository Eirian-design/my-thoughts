import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eirian's Thoughts",
  description: "我的想法",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-stone-50 text-stone-800 antialiased">
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="text-xl font-light tracking-wide hover:text-stone-600 transition-colors">
              我的想法
            </a>
            <nav className="text-sm text-stone-500">
              <a href="/" className="hover:text-stone-800 transition-colors">首页</a>
            </nav>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-stone-200 mt-20">
          <div className="max-w-2xl mx-auto px-6 py-8 text-center text-sm text-stone-400">
            © {new Date().getFullYear()} Eirian
          </div>
        </footer>
      </body>
    </html>
  );
}