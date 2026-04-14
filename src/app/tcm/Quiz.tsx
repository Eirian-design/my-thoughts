"use client";

import { useState } from "react";

type Blank = { answer: string; hint: string };

export default function Quiz({ content, blanks }: { content: string; blanks: Blank[] }) {
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

  // 处理歌诀显示
  const renderContent = () => {
    let parts: React.ReactNode[] = [];
    let remainingContent = content;

    blanks.forEach((blank, idx) => {
      const blankText = blank.answer;
      const idxPos = remainingContent.indexOf(blankText);
      
      if (idxPos !== -1 && idx === currentBlank) {
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
        if (idxPos > 0) {
          parts.push(<span key={`text-done-${idx}`} style={{ color: '#888' }}>{remainingContent.slice(0, idxPos)}</span>);
        }
        parts.push(<span key={`done-${idx}`} style={{ color: '#4ade80' }}>{blankText}</span>);
        remainingContent = remainingContent.slice(idxPos + blankText.length);
      }
    });
    
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