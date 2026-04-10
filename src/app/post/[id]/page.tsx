"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { posts } from "../../../data/posts";

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<(typeof posts)[0] | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      const found = posts.find((post) => post.id === p.id);
      setPost(found || null);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      // 动态加载 Waline 评论
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

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@waline/client/dist/waline.css";
      document.head.appendChild(link);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-400 mb-4">文章不存在</p>
        <Link href="/" className="text-amber-600 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>
        <div className="flex items-center gap-3">
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
        <h1 className="text-4xl font-light text-stone-800">{post.title}</h1>
      </header>

      <div className="prose prose-stone prose-lg max-w-none py-8 border-t border-b border-stone-100">
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