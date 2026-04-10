// 示例文章数据
const posts = [
  {
    id: "hello-world",
    title: "你好，世界",
    excerpt: "这是我的第一个想法站点。很高兴在这里与你相遇。",
    date: "2026-04-10",
    tags: ["随笔"],
  },
  {
    id: "second-post",
    title: "关于写作的一些思考",
    excerpt: "写作是一种自我对话的方式，也是与世界建立连接的桥梁。",
    date: "2026-04-11",
    tags: ["思考", "写作"],
  },
];

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero 部分 */}
      <section className="py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 mb-6">
          <span className="text-3xl">🌿</span>
        </div>
        <h1 className="text-4xl font-light text-stone-800 mb-4 tracking-tight">
          Eirian's Thoughts
        </h1>
        <p className="text-lg text-stone-500 max-w-md mx-auto leading-relaxed">
          这里记录着我的一些思考、学习心得，以及偶尔的灵感闪现。
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <a
            href="https://github.com/Eirian-design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="text-sm font-medium text-stone-400 uppercase tracking-widest mb-10 text-center">
          最近的文章
        </h2>
        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100"
            >
              <a href={`/post/${post.id}`} className="block">
                <div className="flex items-center gap-3 mb-4">
                  <time className="text-sm text-stone-400">{post.date}</time>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-2xl font-normal text-stone-800 group-hover:text-amber-600 transition-colors mb-3">
                  {post.title}
                </h3>
                <p className="text-stone-500 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center text-sm text-amber-600 group-hover:translate-x-1 transition-transform">
                  阅读全文
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* 底部留白 */}
      <div className="h-8" />
    </div>
  );
}