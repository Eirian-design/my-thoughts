"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

const GITHUB_REPO = "Eirian-design/my-thoughts";
const POSTS_FILE = "src/data/posts.ts";

// 工具栏按钮组件
function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded hover:opacity-70 transition-opacity text-sm"
      style={{
        background: active ? "var(--accent)" : "var(--bg)",
        color: active ? "#fff" : "#e5e5e5",
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      className="w-px h-6 mx-1"
      style={{ background: "var(--border)" }}
    />
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [posts, setPosts] = useState<
    { id: string; title: string; date: string }[]
  >([]);
  const [showPostList, setShowPostList] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // TipTap 编辑器
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "在这里开始写作... 可以直接粘贴带格式的文字",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3",
        style:
          "color: #1a1a1a; font-family: 'Lora', 'Noto Serif SC', Georgia, serif; font-size: 17px; line-height: 1.85;",
      },
    },
    immediatelyRender: false,
  });

  // 加载保存的 token
  useEffect(() => {
    const saved = localStorage.getItem("github-token");
    if (saved) setGithubToken(saved);
  }, []);

  // 加载文章列表
  const fetchPosts = useCallback(async () => {
    if (!githubToken) return;
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_FILE}`,
        {
          headers: { Authorization: `token ${githubToken}` },
        }
      );
      const data = await res.json();
      const content = decodeURIComponent(escape(atob(data.content)));
      const postMatches = content.match(/\{\s*id:\s*"[^"]+"[^}]+\}/g);
      if (postMatches) {
        const parsed = postMatches
          .map((p) => {
            const idMatch = p.match(/id:\s*"([^"]+)"/);
            const titleMatch = p.match(/title:\s*"([^"]+)"/);
            const dateMatch = p.match(/date:\s*"([^"]+)"/);
            return {
              id: idMatch?.[1] || "",
              title: titleMatch?.[1] || "",
              date: dateMatch?.[1] || "",
            };
          })
          .filter((p) => p.id && p.title);
        setPosts(parsed);
      }
    } catch (e) {
      console.error("Failed to fetch posts", e);
    }
  }, [githubToken]);

  // 删除文章
  const handleDeletePost = async (postId: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    if (!githubToken) {
      alert("请先填写 GitHub Token");
      return;
    }
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_FILE}`,
        {
          headers: { Authorization: `token ${githubToken}` },
        }
      );
      const data = await res.json();
      let content = decodeURIComponent(escape(atob(data.content)));
      const startIdx = content.indexOf(`id: "${postId}"`);
      if (startIdx === -1) {
        alert("找不到文章");
        return;
      }
      let start = content.lastIndexOf("\n  {", startIdx);
      if (start === -1) start = content.indexOf("{", startIdx - 20);
      let end = content.indexOf("\n  },", startIdx);
      if (end === -1) end = content.indexOf("},", startIdx);
      if (end !== -1) end += 3;
      content =
        content.slice(0, start).trim() + content.slice(end).trim();
      const body = {
        message: `删除文章: ${postId}`,
        content: btoa(unescape(encodeURIComponent(content))),
        sha: data.sha,
      };
      const putRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_FILE}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${githubToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (putRes.ok) {
        alert("删除成功！");
        fetchPosts();
      } else {
        alert("删除失败: " + putRes.status);
      }
    } catch (e) {
      alert("删除失败: " + e);
    }
  };

  // 编辑文章：加载内容到编辑器
  const handleEditPost = async (postId: string) => {
    if (!githubToken) {
      alert("请先填写 GitHub Token");
      return;
    }
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_FILE}`,
        {
          headers: { Authorization: `token ${githubToken}` },
        }
      );
      const data = await res.json();
      const content = decodeURIComponent(escape(atob(data.content)));
      const postMatches = content.match(
        /\{[\s\S]*?id:\s*"` + postId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + `"[\s\S]*?\n  \},/g
      );
      if (!postMatches || postMatches.length === 0) {
        alert("找不到文章内容");
        return;
      }
      const postText = postMatches[0];
      const titleMatch = postText.match(/title:\s*"([^"]*)"/);
      const dateMatch = postText.match(/date:\s*"([^"]*)"/);
      const excerptMatch = postText.match(/excerpt:\s*`([^`]*)`/);
      const tagsMatch = postText.match(/tags:\s*(\[[^\]]*\])/);
      const authorMatch = postText.match(/author:\s*"([^"]*)"/);

      if (titleMatch) setTitle(titleMatch[1]);
      if (dateMatch) setDate(dateMatch[1]);
      if (excerptMatch) setExcerpt(excerptMatch[1]);
      if (authorMatch) setAuthor(authorMatch[1]);

      // 解析 tags
      if (tagsMatch) {
        try {
          const tagsArray = JSON.parse(tagsMatch[1]);
          setTags(tagsArray.join(", "));
        } catch {
          setTags("");
        }
      }

      // 提取 content 字段中的 HTML
      const contentMatch = postText.match(/content:\s*`([\s\S]*?)`/);
      if (contentMatch) {
        const htmlContent = contentMatch[1]
          .replace(/\\`/g, "`")
          .replace(/\\"/g, '"');
        editor?.commands.setContent(htmlContent);
      }

      setEditingPostId(postId);
      setShowPostList(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      alert("加载文章失败: " + e);
    }
  };

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

  // 插入图片
  const addImage = () => {
    const url = prompt("请输入图片 URL：");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  // 上传图片到 GitHub
  const uploadImage = async (
    file: File
  ): Promise<string | null> => {
    if (!githubToken) {
      alert("请先填写 GitHub Token");
      return null;
    }
    const sha = await getFileSha(
      `public/images/${file.name}`
    );
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(",")[1];
          const body: Record<string, unknown> = {
            message: `upload: ${file.name}`,
            content: base64,
          };
          if (sha) body.sha = sha;
          const res = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/contents/public/images/${file.name}`,
            {
              method: "PUT",
              headers: {
                Authorization: `token ${githubToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );
          if (res.ok) {
            resolve(`https://eirian.top/images/${file.name}`);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // 处理本地图片上传
  const handleLocalImageUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = await uploadImage(file);
      if (url) {
        editor?.chain().focus().setImage({ src: url }).run();
      } else {
        alert("上传失败");
      }
    };
    input.click();
  };

  const getFileSha = async (
    path: string
  ): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
        {
          headers: { Authorization: `token ${githubToken}` },
        }
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.sha;
    } catch {
      return null;
    }
  };

  const updateFile = async (
    path: string,
    content: string,
    sha?: string
  ) => {
    const body: Record<string, unknown> = {
      message: editingPostId
        ? `编辑文章: ${title}`
        : `feat: 添加文章 "${title}"`,
      content: btoa(unescape(encodeURIComponent(content))),
    };
    if (sha) body.sha = sha;
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
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
    if (!editor?.getText()) {
      alert("请输入文章内容");
      return;
    }

    setIsPublishing(true);
    setMessage(null);

    try {
      const sha = await getFileSha(POSTS_FILE);
      if (!sha) {
        setMessage({
          type: "error",
          text: "无法获取文件信息，请检查 Token 权限",
        });
        setIsPublishing(false);
        return;
      }

      const res = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_FILE}`,
        {
          headers: { Authorization: `token ${githubToken}` },
        }
      );
      const data = await res.json();
      let currentContent = decodeURIComponent(
        escape(atob(data.content))
      );

      const postId =
        editingPostId ||
        title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, "");
      const tagsArray = tags
        ? tags.split(",").map((t) => t.trim())
        : [];
      const htmlContent = editor.getHTML();
      const excerptText =
        excerpt ||
        editor.getText().slice(0, 100) + "...";

      // 如果是编辑模式，先删除旧文章
      if (editingPostId) {
        const startIdx = currentContent.indexOf(
          `id: "${editingPostId}"`
        );
        if (startIdx !== -1) {
          let start = currentContent.lastIndexOf(
            "\n  {",
            startIdx
          );
          if (start === -1)
            start = currentContent.indexOf(
              "{",
              startIdx - 20
            );
          let end = currentContent.indexOf(
            "\n  },",
            startIdx
          );
          if (end === -1) end = currentContent.indexOf("},", startIdx);
          if (end !== -1) end += 3;
          currentContent =
            currentContent.slice(0, start).trim() +
            currentContent.slice(end).trim();
        }
      }

      const newPost = `
  {
    id: "${postId}",
    title: "${title.replace(/"/g, '\\"')}",
    excerpt: \`${excerptText.replace(/`/g, "\\`")}\`,
    date: "${date}",
    tags: ${JSON.stringify(tagsArray)},
    author: "${author || "Eirian"}",
    content: \`${htmlContent.replace(/`/g, "\\`")}\`,
  },`;

      const insertPosition = currentContent.lastIndexOf("];");
      if (insertPosition === -1) {
        setMessage({ type: "error", text: "文件格式错误" });
        setIsPublishing(false);
        return;
      }

      const newContent =
        currentContent.slice(0, insertPosition) +
        newPost +
        "\n" +
        currentContent.slice(insertPosition);

      // 重新获取 sha（因为文件可能已被修改）
      const latestSha = await getFileSha(POSTS_FILE);
      const success = await updateFile(
        POSTS_FILE,
        newContent,
        latestSha || sha
      );
      if (success) {
        setMessage({
          type: "success",
          text: editingPostId
            ? "文章更新成功！网站将自动更新。"
            : "文章发布成功！网站将自动更新。",
        });
        setEditingPostId(null);
        setTimeout(() => {
          setTitle("");
          setExcerpt("");
          setTags("");
          setAuthor("");
          editor?.commands.clearContent();
          setMessage(null);
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: "发布失败，请重试",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "发生错误，请重试",
      });
    }

    setIsPublishing(false);
  };

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "var(--bg)" }}
      >
        <form onSubmit={handleLogin} className="card p-8 w-full max-w-md">
          <h1
            className="text-2xl font-serif text-center mb-6"
            style={{ color: "#e5e5e5" }}
          >
            管理后台
          </h1>
          <input
            type="password"
            placeholder="请输入管理密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 mb-4"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "#e5e5e5",
              borderRadius: 0,
            }}
          />
          <button
            type="submit"
            className="w-full py-3 text-white"
            style={{ background: "var(--accent)", borderRadius: 0 }}
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
        <h1
          className="text-2xl font-serif"
          style={{ color: "#e5e5e5" }}
        >
          {editingPostId ? "编辑文章" : "撰写新文章"}
        </h1>
        <div className="flex gap-3">
          {editingPostId && (
            <button
              onClick={() => {
                setEditingPostId(null);
                setTitle("");
                setExcerpt("");
                setTags("");
                setAuthor("");
                editor?.commands.clearContent();
              }}
              className="text-sm hover:opacity-70 px-3 py-1"
              style={{
                color: "#888",
                border: "1px solid var(--border)",
                borderRadius: 0,
              }}
            >
              取消编辑
            </button>
          )}
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-sm hover:opacity-70"
            style={{ color: "#888" }}
          >
            退出登录
          </button>
        </div>
      </div>

      {/* GitHub Token 设置 */}
      <div
        className="p-4 mb-6"
        style={{
          borderLeft: "3px solid var(--accent)",
          background: "var(--bg-card)",
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <label
            className="block text-sm"
            style={{ color: "#e5e5e5" }}
          >
            GitHub Token（发布用）
          </label>
          <button
            onClick={() => {
              fetchPosts();
              setShowPostList(!showPostList);
            }}
            className="px-3 py-1 text-sm text-white"
            style={{
              background: showPostList ? "#4CAF50" : "#666",
              borderRadius: 0,
            }}
          >
            {showPostList ? "已展开" : "文章列表"}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="password"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            placeholder="粘贴你的 GitHub Token"
            className="flex-1 px-4 py-2"
            style={{
              border: "1px solid var(--border)",
              background: "#fff",
              color: "#333",
              borderRadius: 0,
            }}
          />
          <button
            onClick={saveToken}
            className="px-4 py-2 text-white text-sm"
            style={{ background: "var(--accent)", borderRadius: 0 }}
          >
            保存
          </button>
        </div>
        <p className="text-xs mt-1" style={{ color: "#888" }}>
          Token 需要 repo 权限。保存后存在浏览器本地。
        </p>
      </div>

      {/* 文章列表 */}
      {showPostList && (
        <div
          className="p-4 mb-6"
          style={{ background: "var(--bg-card)" }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "#e5e5e5" }}
          >
            已有文章 ({posts.length})
          </h3>
          {posts.length === 0 ? (
            <p style={{ color: "#888" }}>暂无文章</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex justify-between items-center p-2"
                  style={{ background: "var(--bg)" }}
                >
                  <div>
                    <span style={{ color: "#e5e5e5" }}>
                      {post.title}
                    </span>
                    <span
                      className="ml-2 text-sm"
                      style={{ color: "#888" }}
                    >
                      {post.date}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="px-3 py-1 text-sm text-white"
                      style={{
                        background: "#4CAF50",
                        borderRadius: 0,
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1 text-sm text-white"
                      style={{
                        background: "#ff4444",
                        borderRadius: 0,
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-6">
        {/* 标题和日期 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: "#888" }}
            >
              标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题"
              className="w-full px-4 py-3"
              style={{
                border: "1px solid var(--border)",
                background: "#fff",
                color: "#333",
                borderRadius: 0,
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: "#888" }}
            >
              发布日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3"
              style={{
                border: "1px solid var(--border)",
                background: "#fff",
                color: "#333",
                borderRadius: 0,
              }}
            />
          </div>
        </div>

        {/* 摘要和标签 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: "#888" }}
            >
              摘要
            </label>
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="简短描述（可选）"
              className="w-full px-4 py-3"
              style={{
                border: "1px solid var(--border)",
                background: "#fff",
                color: "#333",
                borderRadius: 0,
              }}
            />
          </div>
          <div>
            <label
              className="block text-sm mb-2"
              style={{ color: "#888" }}
            >
              标签（逗号分隔）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="如：随笔, 思考"
              className="w-full px-4 py-3"
              style={{
                border: "1px solid var(--border)",
                background: "#fff",
                color: "#333",
                borderRadius: 0,
              }}
            />
          </div>
        </div>

        {/* 富文本编辑器工具栏 */}
        <div>
          <label
            className="block text-sm mb-2"
            style={{ color: "#888" }}
          >
            文章内容
          </label>
          <div
            className="flex flex-wrap items-center gap-1 p-2"
            style={{
              background: "#1a1a1a",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleBold().run()
              }
              active={editor?.isActive("bold")}
              title="加粗 (Ctrl+B)"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleItalic().run()
              }
              active={editor?.isActive("italic")}
              title="斜体 (Ctrl+I)"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleStrike().run()
              }
              active={editor?.isActive("strike")}
              title="删除线"
            >
              <s>S</s>
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: 2 })
                  .run()
              }
              active={editor?.isActive("heading", { level: 2 })}
              title="二级标题"
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .toggleHeading({ level: 3 })
                  .run()
              }
              active={editor?.isActive("heading", { level: 3 })}
              title="三级标题"
            >
              H3
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleBulletList().run()
              }
              active={editor?.isActive("bulletList")}
              title="无序列表"
            >
              &#8226;
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleOrderedList().run()
              }
              active={editor?.isActive("orderedList")}
              title="有序列表"
            >
              1.
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().toggleBlockquote().run()
              }
              active={editor?.isActive("blockquote")}
              title="引用"
            >
              &#8220;
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor?.chain().focus().setHorizontalRule().run()
              }
              title="分割线"
            >
              &mdash;
            </ToolbarButton>

            <Divider />

            <ToolbarButton onClick={addImage} title="插入图片 URL">
              🖼️
            </ToolbarButton>
            <ToolbarButton
              onClick={handleLocalImageUpload}
              title="上传本地图片"
            >
              📁
            </ToolbarButton>

            <Divider />

            <ToolbarButton
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              title="撤销 (Ctrl+Z)"
            >
              ↩
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              title="重做 (Ctrl+Y)"
            >
              ↪
            </ToolbarButton>
          </div>

          {/* 编辑器区域 */}
          <div
            className="min-h-[400px]"
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderTop: "none",
            }}
          >
            <EditorContent editor={editor} />
          </div>
        </div>

        {message && (
          <div
            className={`p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPublishing}
          className="px-8 py-3 text-white disabled:opacity-50"
          style={{ background: "var(--accent)", borderRadius: 0 }}
        >
          {isPublishing
            ? "发布中..."
            : editingPostId
              ? "更新文章"
              : "发布文章"}
        </button>
      </form>
    </div>
  );
}
