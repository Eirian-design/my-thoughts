import Link from "next/link";
import { posts } from "../../../data/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
}

// 渲染富文本内容
function renderContent(content: string) {
  const lines = content.split("\n\n");
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    // 二级标题
    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={index}>{trimmed.slice(3)}</h2>);
      return;
    }
    
    // 三级标题
    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={index}>{trimmed.slice(4)}</h3>);
      return;
    }
    
    // 分割线
    if (trimmed === "---") {
      elements.push(<hr key={index} />);
      return;
    }
    
    // 图片 ![alt](url)
    const imageMatch = trimmed.match(/^!\[(.*)\]\((.+)\)$/);
    if (imageMatch) {
      elements.push(
        <figure key={index} className="my-8">
          <img src={imageMatch[2]} alt={imageMatch[1]} className="max-w-full h-auto" />
          {imageMatch[1] && <figcaption className="text-sm mt-2 text-center" style={{ color: 'var(--text-light)' }}>{imageMatch[1]}</figcaption>}
        </figure>
      );
      return;
    }
    
    // 视频 <video src="..."></video>
    if (trimmed.startsWith("<video ")) {
      const srcMatch = trimmed.match(/src="([^"]+)"/);
      if (srcMatch) {
        elements.push(<video key={index} src={srcMatch[1]} controls className="max-w-full h-auto my-6" />);
      }
      return;
    }
    
    // 音频 <audio src="..."></audio>
    if (trimmed.startsWith("<audio ")) {
      const srcMatch = trimmed.match(/src="([^"]+)"/);
      if (srcMatch) {
        elements.push(<audio key={index} src={srcMatch[1]} controls className="w-full my-4" />);
      }
      return;
    }
    
    // 引用 > text
    if (trimmed.startsWith("> ")) {
      elements.push(<blockquote key={index}>{trimmed.slice(2)}</blockquote>);
      return;
    }
    
    // 普通段落
    elements.push(<p key={index}>{trimmed}</p>);
  });
  
  return elements;
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="mb-4" style={{ color: 'var(--text-light)' }}>文章不存在</p>
        <Link href="/" style={{ color: 'var(--text)', textDecoration: 'underline' }}>
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[720px] mx-auto pb-16">
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-block text-sm mb-8 hover:opacity-70"
        style={{ color: 'var(--text-light)' }}
      >
        ← 返回首页
      </Link>

      {/* 文章头部 */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 text-sm" style={{ color: 'var(--text-light)' }}>
          <time>{post.date}</time>
          {post.tags.length > 0 && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{post.tags.join(", ")}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-normal leading-tight" style={{ color: 'var(--text)' }}>
          {post.title}
        </h1>
      </header>

      {/* 文章内容 */}
      <div className="rich-content article-content p-8 md:p-10">
        {renderContent(post.content)}
      </div>

      {/* 评论区 - Giscus */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
        <script
          src="https://giscus.app/client.js"
          data-repo="Eirian-design/my-thoughts"
          data-repo-id="R_kgDOR-3s6g"
          data-category="Announcements"
          data-category-id="DIC_kwDOR-3s6s4C6mNC"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"
          data-lang="zh-CN"
          crossOrigin="anonymous"
          async
        />
      </div>

      {/* 底部导航 */}
      <nav className="mt-10 text-center">
        <Link
          href="/"
          style={{ color: 'var(--text)', textDecoration: 'underline' }}
        >
          ← 返回首页
        </Link>
      </nav>
    </article>
  );
}