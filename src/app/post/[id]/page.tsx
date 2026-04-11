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
    <article className="max-w-[680px] mx-auto">
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-flex items-center text-sm mb-10 hover:text-[var(--accent)] transition-colors"
        style={{ color: 'var(--text-light)' }}
      >
        ← 返回首页
      </Link>

      {/* 文章头部 - 哥特式装饰 */}
      <header className="mb-12 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
        {/* 顶部装饰 */}
        <div className="gothic-divider mb-6">
          <div className="gothic-divider-center" />
        </div>
        
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

      {/* 文章内容 - 白色背景黑色字体 */}
      <div 
        className="prose bg-white p-8 gothic-card"
        style={{ 
          background: 'var(--bg-card)',
          color: 'var(--text)'
        }}
      >
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* 底部导航 */}
      <nav className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="gothic-divider">
          <div className="gothic-divider-center" />
        </div>
        <Link
          href="/"
          className="block text-center mt-6 text-[var(--accent)] hover:underline"
        >
          ← 返回首页
        </Link>
      </nav>
    </article>
  );
}