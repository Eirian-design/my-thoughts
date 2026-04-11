import Link from "next/link";
import { posts } from "../data/posts";

export default function Home() {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-[720px] mx-auto">
      {/* 标题区 */}
      <header className="py-10 mb-8 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--text-light)' }}>
          Personal Notes
        </p>
        <h1 className="text-2xl font-serif font-normal" style={{ color: 'var(--text)' }}>
          Eirian's Thoughts
        </h1>
      </header>

      {/* 文章列表 */}
      <section className="space-y-8">
        {sortedPosts.map((post) => (
          <article key={post.id} className="pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3 mb-2 text-sm" style={{ color: 'var(--text-light)' }}>
              <time>{post.date}</time>
              {post.tags.length > 0 && (
                <>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{post.tags.join(", ")}</span>
                </>
              )}
            </div>
            <Link href={`/post/${post.id}`} className="block group">
              <h2 className="text-xl font-serif font-normal mb-2 group-hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
                {post.title}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-light)' }}>
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </section>

      {/* 底部 */}
      <footer className="py-8 mt-8 text-center text-sm" style={{ color: 'var(--text-light)' }}>
        <p>© {new Date().getFullYear()} Eirian</p>
      </footer>
    </div>
  );
}