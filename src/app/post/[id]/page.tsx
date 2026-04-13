import Link from "next/link";
import { posts } from "../../../data/posts";
import PostContent from "./PostContent";

export function generateStaticParams() {
  return posts.map((post) => ({ id: post.id }));
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
    <PostContent post={post} pageUrl={pageUrl} />
  );
}