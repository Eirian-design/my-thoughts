"use client";

import { useState, useRef, useEffect } from "react";

const GITHUB_REPO = "Eirian-design/my-thoughts";
const POSTS_FILE = "src/data/posts.ts";

type ContentBlock = 
  | { type: "paragraph"; content: string }
  | { type: "heading2"; content: string }
  | { type: "heading3"; content: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "video"; url: string }
  | { type: "audio"; url: string }
  | { type: "divider" }
  | { type: "quote"; content: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([{ type: "paragraph", content: "" }]);
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);

  // 加载保存的 token
  useEffect(() => {
    const saved = localStorage.getItem("github-token");
    if (saved) setGithubToken(saved);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "eirian123") {
      setIsLoggedIn(true);
    } else {
      alert("密码错误");
    }
  };

  const saveToken = () => {
    if (githubToken) {
      localStorage.setItem("github-token", githubToken);
      alert("Token 已保存到浏览器");
    }
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = 
      type === "divider" ? { type: "divider" } :
      type === "image" ? { type: "image", url: "", caption: "" } :
      type === "video" ? { type: "video", url: "" } :
      type === "audio" ? { type: "audio", url: "" } :
      { type: "paragraph", content: "" };
    
    const insertIndex = activeBlock !== null ? activeBlock + 1 : blocks.length;
    const newBlocks = [...blocks];
    newBlocks.splice(insertIndex, 0, newBlock);
    setBlocks(newBlocks);
    setActiveBlock(insertIndex);
  };

  const updateBlock = (index: number, block: Partial<ContentBlock> & { type: ContentBlock["type"] }) => {
    const newBlocks = [...blocks];
    newBlocks[index] = block as ContentBlock;
    setBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    if (blocks.length > 1) {
      const newBlocks = blocks.filter((_, i) => i !== index);
      setBlocks(newBlocks);
      setActiveBlock(null);
    }
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // 生成纯文本内容（保留给不支持富文本的地方）
  const generatePlainContent = () => {
    return blocks
      .map(block => {
        if (block.type === "divider") return "---";
        if (block.type === "image") return `[图片: ${block.caption || block.url}]`;
        if (block.type === "video") return `[视频: ${block.url}]`;
        if (block.type === "audio") return `[音频: ${block.url}]`;
        return block.content;
      })
      .join("\n\n");
  };

  // 生成 Markdown 内容
  const generateMarkdown = () => {
    return blocks
      .map(block => {
        if (block.type === "heading2") return `## ${block.content}`;
        if (block.type === "heading3") return `### ${block.content}`;
        if (block.type === "divider") return "---";
        if (block.type === "image") return `![${block.caption || ""}](${block.url})`;
        if (block.type === "video") return `<video src="${block.url}" controls></video>`;
        if (block.type === "audio") return `<audio src="${block.url}" controls></audio>`;
        if (block.type === "quote") return `> ${block.content}`;
        return block.content;
      })
      .join("\n\n");
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

  // 上传文件到 GitHub
  const uploadFile = async (file: File, folder: string = "uploads"): Promise<string | null> => {
    if (!githubToken) {
      alert("请先填写 GitHub Token");
      return null;
    }

    const ext = file.name.split(".").pop() || "";
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    const path = `public/${folder}/${fileName}`;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(",")[1];
          const sha = await getFileSha(path);
          
          const body: Record<string, unknown> = {
            message: `upload: ${fileName}`,
            content: base64,
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

          if (res.ok) {
            // 返回 CDN URL
            const url = `https://eirian.top/${folder}/${fileName}`;
            resolve(url);
          } else {
            console.error("Upload failed:", await res.text());
            resolve(null);
          }
        } catch (err) {
          console.error("Upload error:", err);
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理图片上传
  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentBlock = blocks[index] as { url?: string };
    updateBlock(index, { ...currentBlock, url: "上传中..." } as ContentBlock);
    const url = await uploadFile(file, "images");
    if (url) {
      updateBlock(index, { ...currentBlock, url } as ContentBlock);
    } else {
      updateBlock(index, { ...currentBlock, url: "" } as ContentBlock);
      alert("上传失败，请重试");
    }
  };

  // 处理视频/音频上传
  const handleMediaUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>, type: "video" | "audio") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const currentBlock = blocks[index] as { url?: string };
    const folder = type === "video" ? "videos" : "audio";
    updateBlock(index, { ...currentBlock, url: "上传中..." } as ContentBlock);
    const url = await uploadFile(file, folder);
    if (url) {
      updateBlock(index, { ...currentBlock, url } as ContentBlock);
    } else {
      updateBlock(index, { ...currentBlock, url: "" } as ContentBlock);
      alert("上传失败，请重试");
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
    if (!title) {
      alert("请填写标题");
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
      const content = generateMarkdown();
      const excerptText = excerpt || blocks
        .filter(b => b.type === "paragraph" && b.content)
        .slice(0, 1)
        .map(b => b.type === "paragraph" ? b.content.slice(0, 100) : "")
        .join("") + "...";
      
      const newPost = `
  {
    id: "${postId}",
    title: "${title}",
    excerpt: \`${excerptText}\`,
    date: "${date}",
    tags: ${JSON.stringify(tagsArray)},
    content: \`${content.replace(/`/g, "\\`")}\`,
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
          setBlocks([{ type: "paragraph", content: "" }]);
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <form
          onSubmit={handleLogin}
          className="card p-8 rounded-xl w-full max-w-md"
        >
          <h1 className="text-2xl font-serif text-center mb-6" style={{ color: '#e5e5e5' }}>
            管理后台
          </h1>
          <input
            type="password"
            placeholder="请输入管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border mb-4"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white transition-colors"
            style={{ background: 'var(--accent)' }}
          >
            登录
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-serif" style={{ color: '#e5e5e5' }}>撰写新文章</h1>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="text-sm hover:opacity-70"
          style={{ color: '#888888' }}
        >
          退出登录
        </button>
      </div>

      {/* GitHub Token 设置 */}
      <div className="card rounded-lg p-4 mb-6" style={{ borderLeft: '3px solid var(--accent)' }}>
        <label className="block text-sm mb-2" style={{ color: '#e5e5e5' }}>🔑 GitHub Token（自动发布用）</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="粘贴你的 GitHub Token"
            className="flex-1 px-4 py-2 rounded-lg border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
          />
          <button
            onClick={saveToken}
            className="px-4 py-2 rounded-lg text-white text-sm"
            style={{ background: 'var(--accent)' }}
          >
            保存
          </button>
        </div>
        <p className="text-xs mt-1" style={{ color: '#888888' }}>
          Token 需要 repo 权限。保存后会保存在浏览器本地。
        </p>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2" style={{ color: '#888888' }}>标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题"
              className="w-full px-4 py-3 rounded-lg border"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2" style={{ color: '#888888' }}>发布日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#888888' }}>摘要</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="简短描述（可选）"
            className="w-full px-4 py-3 rounded-lg border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
          />
        </div>

        <div>
          <label className="block text-sm mb-2" style={{ color: '#888888' }}>标签（用逗号分隔）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="如：随笔, 思考, 写作"
            className="w-full px-4 py-3 rounded-lg border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
          />
        </div>

        {/* 富文本工具栏 */}
        <div className="card rounded-lg p-3 flex flex-wrap gap-2" style={{ background: 'var(--bg-card)' }}>
          <span className="text-xs mr-2" style={{ color: '#888888' }}>插入:</span>
          <button
            type="button"
            onClick={() => addBlock("heading2")}
            className="px-3 py-1 rounded text-sm font-bold hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => addBlock("heading3")}
            className="px-3 py-1 rounded text-sm font-bold hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => addBlock("image")}
            className="px-3 py-1 rounded text-sm hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            🖼️ 图片
          </button>
          <button
            type="button"
            onClick={() => addBlock("video")}
            className="px-3 py-1 rounded text-sm hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            🎬 视频
          </button>
          <button
            type="button"
            onClick={() => addBlock("audio")}
            className="px-3 py-1 rounded text-sm hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            🎵 音频
          </button>
          <button
            type="button"
            onClick={() => addBlock("divider")}
            className="px-3 py-1 rounded text-sm hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            ➖ 分割线
          </button>
          <button
            type="button"
            onClick={() => addBlock("quote")}
            className="px-3 py-1 rounded text-sm hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            ❝ 引用
          </button>
          <button
            type="button"
            onClick={() => addBlock("paragraph")}
            className="px-3 py-1 rounded text-sm hover:opacity-70"
            style={{ background: 'var(--bg)', color: '#e5e5e5' }}
          >
            📝 文本
          </button>
        </div>

        {/* 内容块编辑 */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div 
              key={index} 
              className="card rounded-lg p-4 relative group"
              style={{ 
                borderLeft: activeBlock === index ? '3px solid var(--accent)' : '3px solid transparent' 
              }}
            >
              {/* 块操作按钮 */}
              <div className="absolute -left-12 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveBlock(index, "up")}
                  className="w-8 h-8 rounded hover:opacity-70 flex items-center justify-center"
                  style={{ background: 'var(--bg-card)', color: '#888888' }}
                  title="上移"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, "down")}
                  className="w-8 h-8 rounded hover:opacity-70 flex items-center justify-center"
                  style={{ background: 'var(--bg-card)', color: '#888888' }}
                  title="下移"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="w-8 h-8 rounded hover:opacity-70 flex items-center justify-center"
                  style={{ background: 'var(--bg-card)', color: 'var(--accent)' }}
                  title="删除"
                >
                  ×
                </button>
              </div>

              {/* 块类型标签 */}
              <div className="flex items-center gap-2 mb-2">
                <select
                  value={block.type}
                  onChange={(e) => {
                    const newType = e.target.value as ContentBlock["type"];
                    updateBlock(index, { ...block, type: newType });
                  }}
                  className="text-xs px-2 py-1 rounded border"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg)', color: '#888888' }}
                >
                  <option value="paragraph">文本段落</option>
                  <option value="heading2">二级标题</option>
                  <option value="heading3">三级标题</option>
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                  <option value="audio">音频</option>
                  <option value="divider">分割线</option>
                  <option value="quote">引用</option>
                </select>
                <span className="text-xs" style={{ color: '#888888' }}>#{index + 1}</span>
              </div>

              {/* 块内容编辑 */}
              {block.type === "paragraph" && (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
                  onFocus={() => setActiveBlock(index)}
                  placeholder="在这里输入文本..."
                  rows={3}
                  className="w-full px-3 py-2 rounded border resize-y"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
                />
              )}
              {block.type === "heading2" && (
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
                  onFocus={() => setActiveBlock(index)}
                  placeholder="二级标题..."
                  className="w-full px-3 py-2 rounded border text-lg font-bold"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
                />
              )}
              {block.type === "heading3" && (
                <input
                  type="text"
                  value={block.content}
                  onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
                  onFocus={() => setActiveBlock(index)}
                  placeholder="三级标题..."
                  className="w-full px-3 py-2 rounded border text-base font-bold"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
                />
              )}
              {block.type === "quote" && (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { ...block, content: e.target.value })}
                  onFocus={() => setActiveBlock(index)}
                  placeholder="引用内容..."
                  rows={2}
                  className="w-full px-3 py-2 rounded border italic"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#888888' }}
                />
              )}
              {block.type === "image" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={block.url}
                      onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                      onFocus={() => setActiveBlock(index)}
                      placeholder="图片 URL"
                      className="flex-1 px-3 py-2 rounded border"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
                    />
                    <label className="px-4 py-2 rounded cursor-pointer text-sm text-white" style={{ background: 'var(--accent)' }}>
                      📁 本地上传
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={block.caption || ""}
                    onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                    placeholder="图片说明（可选）"
                    className="w-full px-3 py-2 rounded border text-sm"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#888888' }}
                  />
                  {block.url && block.url !== "上传中..." && (
                    <img src={block.url} alt="" className="max-h-40 rounded border" style={{ borderColor: 'var(--border)' }} />
                  )}
                  {block.url === "上传中..." && (
                    <p className="text-sm" style={{ color: '#888888' }}>⏳ 上传中...</p>
                  )}
                </div>
              )}
              {block.type === "video" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={block.url}
                      onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                      onFocus={() => setActiveBlock(index)}
                      placeholder="视频 URL"
                      className="flex-1 px-3 py-2 rounded border"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
                    />
                    <label className="px-4 py-2 rounded cursor-pointer text-sm text-white" style={{ background: 'var(--accent)' }}>
                      📁 上传
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleMediaUpload(index, e, "video")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {block.url && block.url !== "上传中..." && (
                    <video src={block.url} controls className="max-h-48 rounded border" style={{ borderColor: 'var(--border)' }} />
                  )}
                  {block.url === "上传中..." && (
                    <p className="text-sm" style={{ color: '#888888' }}>⏳ 上传中...</p>
                  )}
                </div>
              )}
              {block.type === "audio" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={block.url}
                      onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                      onFocus={() => setActiveBlock(index)}
                      placeholder="音频 URL"
                      className="flex-1 px-3 py-2 rounded border"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: '#e5e5e5' }}
                    />
                    <label className="px-4 py-2 rounded cursor-pointer text-sm text-white" style={{ background: 'var(--accent)' }}>
                      📁 上传
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleMediaUpload(index, e, "audio")}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {block.url && block.url !== "上传中..." && (
                    <audio src={block.url} controls className="w-full" />
                  )}
                  {block.url === "上传中..." && (
                    <p className="text-sm" style={{ color: '#888888' }}>⏳ 上传中...</p>
                  )}
                </div>
              )}
              {block.type === "divider" && (
                <div className="py-4 text-center" style={{ color: '#888888' }}>
                  <hr style={{ border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, #ccc, transparent)' }} />
                  <span className="text-xs mt-2 block">— 分割线 —</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 添加块按钮 */}
        <button
          type="button"
          onClick={() => addBlock("paragraph")}
          className="w-full py-3 rounded-lg border-2 border-dashed"
          style={{ borderColor: 'var(--border)', color: '#888888' }}
        >
          + 添加内容块
        </button>

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
          className="px-8 py-3 text-white rounded-lg transition-colors disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {isPublishing ? "发布中..." : "🚀 发布文章"}
        </button>
      </form>
    </div>
  );
}