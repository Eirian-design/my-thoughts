"use client";

import { useEffect, useState } from "react";

// 文章数据（后续可改为动态获取）
const postsData: Record<string, { title: string; content: string; date: string }> = {
  "hello-world": {
    title: "你好，世界",
    content: `这是我的第一个想法站点。

很高兴在这里与你相遇。

我在这里记录一些日常的思考、学习心得，以及偶尔的灵感闪现。

如果你有什么想法，欢迎在下方评论告诉我！`,
    date: "2026-04-10",
  },
};

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<{ title: string; content: string; date: string } | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      setPost(postsData[p.id] || null);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      // 动态加载 Waline
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@waline/client/dist/waline.js";
      script.onload = () => {
        (window as any).Waline.init({
          el: "#waline",
          serverURL: "https://eirian-top.vercel.app",
          path: id,
          dark: "auto",
        });
      };
      document.head.appendChild(script);

      // 加载样式
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@waline/client/dist/waline.css";
      document.head.appendChild(link);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="text-center py-20 text-stone-400">
        文章不存在
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-normal text-stone-800">{post.title}</h1>
        <time className="text-sm text-stone-400">{post.date}</time>
      </header>

      <div className="prose prose-stone prose-lg max-w-none">
        {post.content.split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-stone-600 leading-relaxed whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      <section className="mt-16 pt-8 border-t border-stone-200">
        <h3 className="text-lg font-normal text-stone-800 mb-6">评论</h3>
        <div id="waline" />
      </section>
    </article>
  );
}