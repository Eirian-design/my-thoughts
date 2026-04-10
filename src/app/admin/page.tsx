"use client";

import { useState } from "react";

const GITHUB_REPO = "Eirian-design/my-thoughts";
const POSTS_FILE = "src/data/posts.ts";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "eirian123") {
      setIsLoggedIn(true);
    } else {
      alert("密码错误");
    }
  };

  const getFileSha = async (path: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
        headers: { Authorization: `token ${githubToken}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.sha;
    } catch {
      return null;
    }
  };

  const updateFile = async (path: string, content: string, sha?: string) => {
    const body: Record<string, unknown> = {
      message: `feat: 添加文章 "${title}"`,
      content: btoa(unescape(encodeURIComponent(content))),
    };
    if (sha) body.sha = sha;

    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return res.ok;
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("请填写标题和内容");
      return;
    }
    if (!githubToken) {
      alert("请先填写 GitHub Token");
      return;
    }

    setIsPublishing(true);
    setMessage(null);

    try {
      const sha = await getFileSha(POSTS_FILE);
      if (!sha) {
        setMessage({ type: "error", text: "无法获取文件信息，请检查 Token 权限" });
        setIsPublishing(false);
        return;
      }

      const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_FILE}`, {
        headers: { Authorization: `token ${githubToken}` },
      });
      const data = await res.json();
      const currentContent = decodeURIComponent(escape(atob(data.content)));

      const postId = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\u4e00-\u9fa5a-z0-9-]/g, "");
      const tagsArray = tags ? tags.split(",").map((t) => t.trim()) : [];
      
      const newPost = `
  {
    id: "${postId}",
    title: "${title}",
    excerpt: "${excerpt || content.slice(0, 100) + "..."}",
    date: "${date}",
    tags: ${JSON.stringify(tagsArray)},
    content: \`${content}\`,
  },`;

      const insertPosition = currentContent.lastIndexOf("];");
      if (insertPosition === -1) {
        setMessage({ type: "error", text: "文件格式错误" });
        setIsPublishing(false);
        return;
      }

      const newContent = currentContent.slice(0, insertPosition) + newPost + "\n" + currentContent.slice(insertPosition);

      const success = await updateFile(POSTS_FILE, newContent, sha);
      if (success) {
        setMessage({ type: "success", text: "文章发布成功！网站将自动更新。" });
        setTimeout(() => {
          setTitle("");
          setExcerpt("");
          setContent("");
          setTags("");
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: "error", text: "发布失败，请重试" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "发生错误，请重试" });
    }

    setIsPublishing(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 w-full max-w-md"
        >
          <h1 className="text-2xl font-light text-stone-800 mb-6 text-center">
            管理后台
          </h1>
          <input
            type="password"
            placeholder="请输入管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none mb-4"
          />
          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-3 rounded-lg hover:bg-stone-700 transition-colors"
          >
            登录
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-light text-stone-800">撰写新文章</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-sm text-stone-400 hover:text-stone-600"
        >
          退出登录
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <label className="block text-sm text-amber-800 mb-2">🔑 GitHub Token（用于自动发布）</label>
        <input
          type="password"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
          placeholder="粘贴你的 GitHub Token"
          className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:border-amber-500 focus:outline-none"
        />
        <p className="text-xs text-amber-600 mt-1">
          Token 需要 repo 权限。首次填写后会保存在浏览器本地。
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-stone-500 mb-2">标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-2">发布日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-stone-500 mb-2">摘要</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="简短描述（可选，默认取内容前100字）"
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-stone-500 mb-2">标签（用逗号分隔）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="如：随笔, 思考, 写作"
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-stone-500 mb-2">文章内容 *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里撰写你的文章内容...

支持直接换行分段。"
            rows={15}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none font-mono text-sm leading-relaxed resize-y"
          />
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPublishing}
          className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {isPublishing ? "发布中..." : "🚀 发布文章"}
        </button>
      </form>
    </div>
  );
}