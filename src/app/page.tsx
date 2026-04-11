import Link from "next/link";
import { posts } from "../data/posts";

export default function Home() {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-10">
      {/* 标题区 */}
      <section className="text-center py-8 mb-12">
        {/* 顶部小窗花 */}
        <div className="text-center mb-4" style={{ color: 'var(--gothic-gold)', opacity: 0.4 }}>✧</div>
        
        <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: 'var(--text-light)' }}>
          Personal Notes
        </p>
        <h1 className="text-3xl font-serif font-medium tracking-tight" style={{ color: 'var(--text)' }}>
          Eirian's Thoughts
        </h1>
        
        {/* 底部菱形 */}
        <div className="gothic-divider mt-6">
          <div style={{ width: 6, height: 6, background: 'var(--border)', transform: 'rotate(45deg)', opacity: 0.6 }}></div>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="space-y-6">
        {sortedPosts.map((post) => (
          <article 
            key={post.id} 
            className="gothic-card p-6 church-rose-small"
          >
            <div className="flex items-center gap-3 mb-3">
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