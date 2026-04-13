"use client";

import { useState } from "react";

interface Comment {
  name: string;
  text: string;
  date: string;
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 加载评论
  useState(() => {
    const saved = localStorage.getItem("comments-hello-world");
    if (saved) {
      setComments(JSON.parse(saved));
    }
  });

  const submit = () => {
    if (!name.trim() || !text.trim()) return;
    
    const newComment: Comment = {
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleString("zh-CN"),
    };
    
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem("comments-hello-world", JSON.stringify(updated));
    setText("");
  };

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <h3 style={{ color: '#e5e5e5', marginBottom: '20px' }}>评论</h3>
      
      {/* 发表评论 */}
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="你的名字"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#e5e5e5',
            borderRadius: '4px',
          }}
        />
        <textarea
          placeholder="写下你的评论..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            background: '#1a1a1a',
            border: '1px solid #333',
            color: '#e5e5e5',
            borderRadius: '4px',
            resize: 'vertical',
          }}
        />
        <button
          onClick={submit}
          disabled={!name.trim() || !text.trim()}
          style={{
            padding: '8px 20px',
            background: name.trim() && text.trim() ? '#337ab7' : '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: name.trim() && text.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          提交评论
        </button>
      </div>

      {/* 评论列表 */}
      <div>
        {comments.length === 0 ? (
          <p style={{ color: '#666' }}>暂无评论，快来抢沙发~</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} style={{ 
              padding: '15px', 
              marginBottom: '15px', 
              background: '#1a1a1a', 
              borderRadius: '8px',
              borderLeft: '3px solid #337ab7'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: '#e5e5e5' }}>{c.name}</strong>
                <span style={{ color: '#666', fontSize: '12px' }}>{c.date}</span>
              </div>
              <p style={{ color: '#ccc', margin: 0, whiteSpace: 'pre-wrap' }}>{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}