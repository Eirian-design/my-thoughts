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
    </article>
  );
}