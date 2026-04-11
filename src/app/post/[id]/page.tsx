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
        className="inline-flex items-center text-sm mb-8 hover:text-[var(--accent)] transition-colors"
        style={{ color: 'var(--text-light)' }}
      >
        ← 返回首页
      </Link>

      {/* 文章头部 */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm" style={{ color: 'var(--text-light)' }}>{post.date}</time>
          {post.tags.length > 0 && (
            <>
              <span style={{ color: 'var(--border)', opacity: 0.5 }}>·</span>
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
          <div style={{ width: 6, height: 6, background: 'var(--border)', transform: 'rotate(45deg)', opacity: 0.6 }}></div>
        </div>
      </header>

      {/* 文章内容 - 强光泽白底 + 纯黑字 */}
      <div 
        className="prose article-content p-10 relative"
      >
        {/* 左侧装饰线 */}
        <div className="side-line"></div>
        
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
        
        {/* 底部窗花 */}
        <div className="text-center mt-12 pt-6" style={{ color: 'var(--gothic-gold)', opacity: 0.3 }}>❋</div>
      </div>

      {/* 底部导航 */}
      <nav className="mt-10 pt-6 text-center">
        <div className="cross-decoration justify-center mb-6"></div>
        <Link
          href="/"
          className="text-[var(--accent)] hover:underline"
        >
          ← 返回首页
        </Link>
      </nav>
    </article>
  );
}