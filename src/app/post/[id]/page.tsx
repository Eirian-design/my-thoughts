"use client";

import Link from "next/link";
import { posts } from "../../../data/posts";
import WalineComments from "./Waline";

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
          {imageMatch[1] && <figcaption className="text-sm mt-2 text-center" style={{ color: '#666' }}>{imageMatch[1]}</figcaption>}
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

// 分享组件
function ShareButtons({ title, url }: { title: string; url: string }) {
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `分享一篇文章: ${title}`,
          url: url,
        });
      } catch (err) {
        console.log('分享取消');
      }
    } else {
      // 不支持则复制链接
      navigator.clipboard.writeText(url);
      alert('链接已复制到剪贴板');
    }
  };

  const shareToWechat = () => {
    const wechatUrl = `https://api.addthis.com/pubapi/1.0/?redirect=%2F%2Fwww.addthis.com%2Ftoolbar%2F%3Fpu%3D${encodeURIComponent(url)}`;
    window.open(wechatUrl, '_blank');
  };

  const shareToWeibo = () => {
    const wbUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(wbUrl, '_blank');
  };

  const shareToTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twUrl, '_blank');
  };

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div className="flex items-center justify-center gap-4">
        <span style={{ color: '#666' }}>分享:</span>
        
        <button
          onClick={share}
          style={{
            padding: '6px 12px',
            background: '#07c160',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          title="系统分享"
        >
          微信/分享
        </button>
        
        <button
          onClick={shareToWeibo}
          style={{
            padding: '6px 12px',
            background: '#e6162d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          title="分享到微博"
        >
          微博
        </button>
        
        <button
          onClick={shareToTwitter}
          style={{
            padding: '6px 12px',
            background: '#1da1f2',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          title="分享到 Twitter"
        >
          X/Twitter
        </button>
      </div>
    </div>
  );
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = posts.find((p) => p.id === id);
  const pageUrl = `https://www.eirian.top/post/${id}`;

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="mb-4" style={{ color: '#888' }}>文章不存在</p>
        <Link href="/" style={{ color: '#8b7355', textDecoration: 'underline' }}>
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
        style={{ color: '#888' }}
      >
        ← 返回首页
      </Link>

      {/* 文章头部 - 黑色背景上 */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4 text-sm" style={{ color: '#888' }}>
          <time>{post.date}</time>
          {post.tags.length > 0 && (
            <>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>{post.tags.join(", ")}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-normal leading-tight" style={{ color: '#e5e5e5' }}>
          {post.title}
        </h1>
      </header>

      {/* 文章内容 - 白色光泽卡片 */}
      <div className="article-card p-8 md:p-10 card-ornament-bottom">
        <div className="content rich-content">
          {renderContent(post.content)}
        </div>
        
        {/* 底部装饰 */}
        <div className="cross-divider mt-10 pt-6"></div>
      </div>

      {/* 分享按钮 */}
      <ShareButtons title={post.title} url={pageUrl} />

      {/* 评论区 */}
      <WalineComments />

      {/* 底部导航 */}
      <nav className="mt-10 text-center">
        <Link
          href="/"
          style={{ color: '#888', textDecoration: 'underline' }}
        >
          ← 返回首页
        </Link>
      </nav>
    </article>
  );
}