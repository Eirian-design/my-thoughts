export const metadata = {
  title: "TCM - 中医歌诀 | Eirian's Thoughts",
  description: "中医歌诀学习",
};

// 歌诀数据
const songs = [
  {
    id: "gan-mao",
    title: "感冒",
    content: `感冒卫表肺失宣，恶风恶寒鼻咽兼；风寒感冒荆防败，风热感冒银翘散；
暑湿感冒新香薷，气虚感冒参苏短；阴虚感冒加葳蕤，阳虚感冒麻附寒。`,
    blanks: [
      { answer: "卫表肺失宣", hint: "病机" },
      { answer: "荆防败", hint: "风寒用什么方" },
      { answer: "银翘散", hint: "风热用什么方" },
      { answer: "新香薷", hint: "暑湿用什么方" },
      { answer: "参苏短", hint: "气虚用什么方" },
      { answer: "加葳蕤", hint: "阴虚用什么方" },
      { answer: "麻附寒", hint: "阳虚用什么方" },
    ],
  },
];

export default function TCMPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="py-10 mb-8 border-b" style={{ borderColor: '#333' }}>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#666' }}>Traditional Chinese Medicine</p>
        <h1 className="text-3xl font-serif" style={{ color: '#e5e5e5' }}>TCM 中医歌诀</h1>
        <p className="mt-4" style={{ color: '#888' }}>
          背诵学习中医经典歌诀，点击词语开始填空测验。
        </p>
      </header>

      <div className="space-y-8">
        {songs.map((song) => (
          <div key={song.id} className="card rounded-lg p-6">
            <h2 className="text-xl font-serif mb-4" style={{ color: '#e5e5e5' }}>{song.title}</h2>
            <Quiz content={song.content} blanks={song.blanks} />
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

function Quiz({ content, blanks }: { content: string; blanks: { answer: string; hint: string }[] }) {
  const [currentBlank, setCurrentBlank] = useState(0);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const checkAnswer = () => {
    const expected = blanks[currentBlank].answer;
    if (input.trim() === expected) {
      setCorrect(true);
      setTimeout(() => {
        if (currentBlank + 1 < blanks.length) {
          setCurrentBlank(currentBlank + 1);
          setInput("");
          setCorrect(false);
          setShowHint(false);
        } else {
          setCompleted(true);
        }
      }, 800);
    } else {
      setCorrect(false);
      setShowHint(true);
    }
  };

  if (completed) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl mb-4" style={{ color: '#4ade80' }}>🎉 恭喜完成！</p>
        <button
          onClick={() => { setCurrentBlank(0); setInput(""); setCompleted(false); setCorrect(false); }}
          className="px-6 py-2 rounded-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          再来一次
        </button>
      </div>
    );
  }

  // 处理歌诀显示，把需要填空的词语替换为输入框
  const renderContent = () => {
    let parts: React.ReactNode[] = [];
    let remainingContent = content;

    // 按顺序处理每个blank
    let lastIndex = 0;
    blanks.forEach((blank, idx) => {
      const blankText = blank.answer;
      const idxPos = remainingContent.indexOf(blankText);
      
      if (idxPos !== -1 && idx === currentBlank) {
        // 找到当前需要填的词，显示为输入框
        if (idxPos > 0) {
          parts.push(<span key={`text-${idx}`} style={{ color: '#888' }}>{remainingContent.slice(0, idxPos)}</span>);
        }
        parts.push(
          <input
            key={`input-${idx}`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            placeholder="填写答案"
            className="px-2 py-1 rounded border mx-1 text-center"
            style={{ 
              borderColor: correct ? '#4ade80' : showHint ? '#f87171' : 'var(--border)', 
              background: 'var(--bg-card)', 
              color: '#e5e5e5',
              width: `${Math.max(60, blankText.length * 20)}px`
            }}
            autoFocus
          />
        );
        remainingContent = remainingContent.slice(idxPos + blankText.length);
      } else if (idxPos !== -1) {
        // 已完成的填空，显示为绿色
        if (idxPos > 0) {
          parts.push(<span key={`text-done-${idx}`} style={{ color: '#888' }}>{remainingContent.slice(0, idxPos)}</span>);
        }
        parts.push(<span key={`done-${idx}`} style={{ color: '#4ade80' }}>{blankText}</span>);
        remainingContent = remainingContent.slice(idxPos + blankText.length);
      }
    });
    
    // 添加剩余内容
    if (remainingContent) {
      parts.push(<span key="text-end" style={{ color: '#888' }}>{remainingContent}</span>);
    }
    
    return parts;
  };

  return (
    <div>
      <div className="leading-relaxed text-lg mb-6" style={{ color: '#e5e5e5', fontFamily: 'serif' }}>
        {renderContent()}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={checkAnswer}
          className="px-6 py-2 rounded-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          确认
        </button>
        <span style={{ color: '#666' }}>
          {currentBlank + 1} / {blanks.length}
        </span>
        {showHint && (
          <span style={{ color: '#f87171' }}>提示: {blanks[currentBlank].hint}</span>
        )}
      </div>
    </div>
  );
}