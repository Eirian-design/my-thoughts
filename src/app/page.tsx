// 示例文章数据（后续可以从 CMS 或 Markdown 文件读取）
const posts = [
  {
    id: "hello-world",
    title: "你好，世界",
    excerpt: "这是我的第一个想法站点。很高兴在这里与你相遇。",
    date: "2026-04-10",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="py-8">
        <h1 className="text-3xl font-light text-stone-800 mb-4">欢迎来到我的想法空间</h1>
        <p className="text-stone-500 leading-relaxed">
          这里记录着我的一些思考和想法。希望能带给你一些启发。
        </p>
      </section>

      <section>
        <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider mb-8">文章</h2>
        <div className="space-y-12">
          {posts.map((post) => (
            <article key={post.id} className="group">
              <a href={`/post/${post.id}`} className="block">
                <h3 className="text-xl font-normal text-stone-800 group-hover:text-stone-600 transition-colors mb-2">
                  {post.title}
                </h3>
                <p className="text-stone-500 leading-relaxed mb-3">{post.excerpt}</p>
                <time className="text-sm text-stone-400">{post.date}</time>
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}