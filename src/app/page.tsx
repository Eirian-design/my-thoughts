import Link from "next/link";
import { posts } from "../data/posts";

export default function Home() {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-10">
      {/* 标题区 - 哥特式分隔 */}
      <section className="text-center py-8 mb-12">
        <div className="gothic-divider mb-6">
          <div className="gothic-divider-center" />
        </div>
        <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--text-light)' }}>
          Personal Notes
        </p>
        <h1 className="text-3xl font-serif font-medium tracking-tight" style={{ color: 'var(--text)' }}>
          Eirian's Thoughts
        </h1>
        <div className="gothic-divider mt-6">
          <div className="gothic-divider-center" />
        </div>
      </section>

      {/* 文章列表 - 哥特式卡片 */}
      <section className="space-y-6">
        {sortedPosts.map((post) => (
          <article 
            key={post.id} 
            className="gothic-card p-6 gothic-window"
          >
            <div className="flex items-center gap-3 mb-3">
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
            <Link href={`/post/${post.id}`} className="block group">
              <h2 className="text-xl font-serif font-medium mb-3 group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text)' }}>
                {post.title}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-light)' }}>
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}