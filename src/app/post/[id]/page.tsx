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
        <figure key={index}>
          <img src={imageMatch[2]} alt={imageMatch[1]} />
          {imageMatch[1] && <figcaption>{imageMatch[1]}</figcaption>}
        </figure>
      );
      return;
    }
    
    // 视频 <video src="..."></video>
    if (trimmed.startsWith("<video ")) {
      const srcMatch = trimmed.match(/src="([^"]+)"/);
      if (srcMatch) {
        elements.push(<video key={index} src={srcMatch[1]} controls />);
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
        <p className="text-[var(--text-light)] mb-4">文章不存在</p>
        <Link href="/" className="text-[var(--accent)] hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-[720px] mx-auto">
      {/* 返回链接 */}
      <Link
        href="/"
        className="inline-flex items-center text-sm mb-8 hover:text-[var(--accent)] transition-colors"
        style={{ color: 'var(--text-light)' }}
      >
        ← 返回首页
      </Link>

      {/* 文章头部 */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
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
        <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight" style={{ color: 'var(--text)' }}>
          {post.title}
        </h1>
        
        {/* 底部装饰 */}
        <div className="gothic-divider mt-6">
          <div style={{ width: 6, height: 6, background: 'var(--border)', transform: 'rotate(45deg)', opacity: 0.6 }}></div>
        </div>
      </header>

      {/* 文章内容 - 强光泽白底 + 纯黑字 */}
      <div className="rich-content article-content p-10 relative">
        {/* 左侧装饰线 */}
        <div className="side-line"></div>
        
        {renderContent(post.content)}
        
        {/* 底部窗花 */}
        <div className="text-center mt-12 pt-6" style={{ color: 'var(--gothic-gold)', opacity: 0.3 }}>❋</div>
      </div>

      {/* 底部导航 */}
      <nav className="mt-10 pt-6 text-center">
        <div className="cross-decoration justify-center mb-6"></div>
        <Link
          href="/"
          className="text-[var(--accent)] hover:underline"
        >
          ← 返回首页
        </Link>
      </nav>
    </article>
  );
}