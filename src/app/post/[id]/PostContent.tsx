"use client";

import Link from "next/link";
import WalineComments from "./Waline";

type Post = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
  author?: string;
};

function renderContent(content: string) {
  const lines = content.split("\n\n");
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={index}>{trimmed.slice(3)}</h2>);
      return;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={index}>{trimmed.slice(4)}</h3>);
      return;
    }
    if (trimmed === "---") {
      elements.push(<hr key={index} />);
      return;
    }
    
    const imageMatch = trimmed.match(/^!\[(.*)\]\((.+)\)$/);
    if (imageMatch) {
      elements.push(
        <figure key={index} className="my-8">
          <img src={imageMatch[2]} alt={imageMatch[1]} className="max-w-full h-auto" />
          {imageMatch[1] && <figcaption className="text-sm mt-2 text-center" style={{ color: '#666' }}>{imageMatch[1]}</figcaption>}
        </figure>
      );
      return;
    }
    
    if (trimmed.startsWith("<video ")) {
      const srcMatch = trimmed.match(/src="([^"]+)"/);
      if (srcMatch) elements.push(<video key={index} src={srcMatch[1]} controls className="max-w-full h-auto my-6" />);
      return;
    }
    if (trimmed.startsWith("<audio ")) {
      const srcMatch = trimmed.match(/src="([^"]+)"/);
      if (srcMatch) elements.push(<audio key={index} src={srcMatch[1]} controls className="w-full my-4" />);
      return;
    }
    if (trimmed.startsWith("> ")) {
      elements.push(<blockquote key={index}>{trimmed.slice(2)}</blockquote>);
      return;
    }
    
    elements.push(<p key={index}>{trimmed}</p>);
  });
  
  return elements;
}

function ShareButtons({ title, url }: { title: string; url: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: `分享: ${title}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('链接已复制');
    }
  };

  const shareWeibo = () => window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <span style={{ color: '#666' }}>分享:</span>
        <button onClick={handleShare} style={{ padding: '8px 16px', background: '#07c160', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>微信/分享</button>
        <button onClick={shareWeibo} style={{ padding: '8px 16px', background: '#e6162d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>微博</button>
        <button onClick={shareTwitter} style={{ padding: '8px 16px', background: '#1da1f2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X/Twitter</button>
      </div>
    </div>
  );
}

export default function PostContent({ post, pageUrl }: { post: Post; pageUrl: string }) {
  return (
    <article className="max-w-[720px] mx-auto pb-16">
      <Link href="/" className="inline-block text-sm mb-8 hover:opacity-70" style={{ color: '#888' }}>← 返回首页</Link>
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4 text-sm" style={{ color: '#888' }}>
          <time>{post.date}</time>
          <span>·</span>
          <span>作者: {post.author || 'Eirian'}</span>
          {post.tags.length > 0 && <><span>·</span><span>{post.tags.join(", ")}</span></>}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif" style={{ color: '#e5e5e5' }}>{post.title}</h1>
      </header>
      <div className="article-card p-8 md:p-10">
        <div className="rich-content">{renderContent(post.content)}</div>
        <div className="cross-divider mt-10 pt-6"></div>
      </div>
      <ShareButtons title={post.title} url={pageUrl} />
      <WalineComments />
      <nav className="mt-10 text-center">
        <Link href="/" style={{ color: '#888', textDecoration: 'underline' }}>← 返回首页</Link>
      </nav>
    </article>
  );
}