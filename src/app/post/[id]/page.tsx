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
    <article className="max-w-[640px] mx-auto">
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-[var(--text-light)] hover:text-[var(--text)] transition-colors mb-12"
      >
        ← 返回首页
      </Link>

      {/* 文章头部 */}
      <header className="mb-12 pb-8 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <time className="text-sm text-[var(--text-light)]">{post.date}</time>
          {post.tags.length > 0 && (
            <>
              <span className="text-[var(--border)]">·</span>
              <span className="text-sm text-[var(--text-light)]">
                {post.tags.join(", ")}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight">
          {post.title}
        </h1>
      </header>

      {/* 文章内容 */}
      <div className="prose">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {/* 底部导航 */}
      <nav className="mt-16 pt-8 border-t border-[var(--border)]">
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