"use client";

import { useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 简单密码保护 - 你可以改成自己的密码
    if (password === "eirian123") {
      setIsLoggedIn(true);
    } else {
      alert("密码错误");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("请填写标题和内容");
      return;
    }

    const newPost = {
      id: title.toLowerCase().replace(/\s+/g, "-").replace(/[^\u4e00-\u9fa5a-z0-9-]/g, ""),
      title,
      excerpt: excerpt || content.slice(0, 100) + "...",
      date,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      content,
    };

    // 生成下载的文件内容
    const fileContent = `{
  id: "${newPost.id}",
  title: "${newPost.title}",
  excerpt: "${newPost.excerpt}",
  date: "${newPost.date}",
  tags: ${JSON.stringify(newPost.tags)},
  content: \`${newPost.content}\`,
},`;

    // 下载文件
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${newPost.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setStatus("success");
    setTimeout(() => {
      setTitle("");
      setExcerpt("");
      setContent("");
      setTags("");
      setStatus("idle");
    }, 2000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-stone-500 mb-2">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题"
              className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-2">日期</label>
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
            placeholder="简短描述（可选）"
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
          <label className="block text-sm text-stone-500 mb-2">文章内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里撰写你的文章内容...

支持换行分段。"
            rows={15}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-amber-400 focus:outline-none font-mono text-sm leading-relaxed resize-y"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {status === "success" ? "✓ 已生成！" : "生成文章代码"}
          </button>
          {status === "success" && (
            <span className="text-green-600 text-sm">
              文件已下载，请把内容添加到 posts.ts 文件中
            </span>
          )}
        </div>
      </form>

      <div className="mt-12 p-6 bg-stone-100 rounded-xl">
        <h3 className="font-medium text-stone-700 mb-2">📝 使用说明</h3>
        <ol className="text-sm text-stone-500 space-y-1 list-decimal list-inside">
          <li>在上面的编辑器中撰写文章</li>
          <li>点击"生成文章代码"按钮</li>
          <li>下载生成的文件，把内容复制到 <code>src/data/posts.ts</code> 文件中</li>
          <li>保存后网站会自动更新</li>
        </ol>
      </div>
    </div>
  );
}