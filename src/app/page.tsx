import Link from "next/link";
import { posts } from "../data/posts";

export default function Home() {
  const sortedPosts = [...posts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-[720px] mx-auto">
      {/* 标题区 */}
      <header className="py-10 mb-8 border-b" style={{ borderColor: '#333' }}>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#666' }}>
          Personal Notes
        </p>
        <h1 className="text-2xl font-serif font-normal" style={{ color: '#e5e5e5' }}>
          Eirian's Thoughts
        </h1>
      </header>

      {/* 文章列表 - 白色光泽卡片 */}
      <section className="space-y-6">
        {sortedPosts.map((post) => (
          <article key={post.id} className="article-card p-6 card-ornament-bottom">
            <div className="flex items-center gap-3 mb-3 text-sm" style={{ color: '#666' }}>
              <time>{post.date}</time>
              {post.tags.length > 0 && (
                <>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{post.tags.join(", ")}</span>
                </>
              )}
            </div>
            <Link href={`/post/${post.id}`} className="block group">
              <h2 className="text-xl font-serif font-normal mb-2 group-hover:opacity-70 transition-opacity" style={{ color: '#1a1a1a' }}>
                {post.title}
              </h2>
              <p className="text-base leading-relaxed" style={{ color: '#555' }}>
                {post.excerpt}
              </p>
            </Link>
          </article>
        ))}
      </section>

      {/* 底部 */}
      <footer className="py-8 mt-8 text-center text-sm" style={{ color: '#666' }}>
        <p>© {new Date().getFullYear()} Eirian</p>
      </footer>
    </div>
  );
}