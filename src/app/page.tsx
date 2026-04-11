import Link from "next/link";
import { posts } from "../data/posts";

export default function Home() {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-16">
      {/* 标题区 */}
      <section className="text-center py-8 border-b border-[var(--border)]">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-light)] mb-3">
          Personal Notes
        </p>
        <h1 className="text-3xl font-serif font-medium tracking-tight">
          Eirian's Thoughts
        </h1>
      </section>

      {/* 文章列表 - WSJ 风格 */}
      <section className="space-y-12">
        {sortedPosts.map((post) => (
          <article key={post.id} className="pb-12 border-b border-[var(--border)] last:border-0">
            <div className="flex items-center gap-3 mb-3">
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
            <Link href={`/post/${post.id}`} className="block group">
              <h2 className="text-2xl font-serif font-medium mb-3 group-hover:text-[var(--accent)] transition-colors">
                {post.title}
              </h2>
              <p className="text-[var(--text-light)] leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}