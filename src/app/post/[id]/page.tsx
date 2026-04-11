import Link from "next/link";
import { posts } from "../../../data/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--text-light)] mb-4">文章不存在</p>
        <Link href="/" className="text-[var(--accent)] hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[720px] mx-auto">
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-flex items-center text-sm mb-10 hover:text-[var(--accent)] transition-colors"
        style={{ color: 'var(--text-light)' }}
      >
        ← 返回首页
      </Link>

      {/* 文章头部 */}
      <header className="mb-10">
        {/* 顶部哥特式玫瑰窗花 */}
        <div className="gothic-rose mb-6"></div>
        
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm" style={{ color: 'var(--text-light)' }}>{post.date}</time>
          {post.tags.length > 0 && (
            <>
              <span style={{ color: 'var(--border)' }}>·</span>
              <span className="text-sm" style={{ color: 'var(--text-light)' }}>
                {post.tags.join(", ")}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight" style={{ color: 'var(--text)' }}>
          {post.title}
        </h1>
        
        {/* 底部装饰 */}
        <div className="gothic-divider mt-6">
          <div className="gothic-divider-center" />
        </div>
      </header>

      {/* 文章内容 - 纯白反光背景 + 黑色字体 */}
      <div 
        className="prose article-content p-10 relative"
        style={{ position: 'relative' }}
      >
        {/* 侧边装饰线 */}
        <div className="side-decoration-left absolute left-0 top-0 bottom-0 w-3"></div>
        
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        
        {/* 底部窗花装饰 */}
        <div className="gothic-rose mt-12 pt-6" style={{ borderTop: '1px solid #e0e0e0' }}></div>
      </div>

      {/* 底部导航 */}
      <nav className="mt-10 pt-6">
        <div className="cross-decoration mb-6"></div>
        <Link
          href="/"
          className="block text-center text-[var(--accent)] hover:underline"
        >
          ← 返回首页
        </Link>
      </nav>
    </article>
  );
}