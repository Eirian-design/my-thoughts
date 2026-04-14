"use client";

import { useState } from "react";

type Blank = { answer: string; hint: string };

type QuizMode = "blank" | "recall"; // 挖空模式 or 背下一句模式

export default function Quiz({ 
  content, 
  blanks, 
  mode = "blank" as QuizMode,
  showPrevLine = true // 是否显示上一句提示
}: { 
  content: string; 
  blanks: Blank[];
  mode?: QuizMode;
  showPrevLine?: boolean;
}) {
  const [currentBlank, setCurrentBlank] = useState(0);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // 把歌诀按句子分开
  const lines = content.split(/[；；\n]/).filter(l => l.trim());

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
          setShowAnswer(false);
        } else {
          setCompleted(true);
        }
      }, 800);
    } else {
      setCorrect(false);
      setShowHint(true);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setTimeout(() => {
      if (currentBlank + 1 < blanks.length) {
        setCurrentBlank(currentBlank + 1);
        setInput("");
        setCorrect(false);
        setShowHint(false);
        setShowAnswer(false);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };

  if (completed) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl mb-4" style={{ color: '#4ade80' }}>🎉 恭喜完成！</p>
        <button
          onClick={() => { setCurrentBlank(0); setInput(""); setCompleted(false); setCorrect(false); setShowAnswer(false); }}
          className="px-6 py-2 rounded-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          再来一次
        </button>
      </div>
    );
  }

  const currentLine = blanks[currentBlank]?.answer || "";
  const prevLine = currentBlank > 0 ? blanks[currentBlank - 1]?.answer : "";

  // 挖空模式：显示当前句，关键词留空
  if (mode === "blank") {
    const hint = blanks[currentBlank]?.hint || "";
    
    return (
      <div>
        {/* 显示进度 */}
        <div className="mb-4 flex items-center gap-2" style={{ color: '#666' }}>
          <span>{currentBlank + 1}</span> / <span>{blanks.length}</span>
        </div>

        {/* 当前句子 */}
        <div className="leading-relaxed text-xl mb-6 p-4 rounded-lg" style={{ 
          background: 'var(--bg-card)', 
          color: '#ffffff', 
          fontFamily: 'serif',
          borderLeft: '3px solid var(--accent)'
        }}>
          {currentLine}
        </div>

        {/* 输入框 */}
        {!showAnswer && (
          <div className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder={`填写答案${hint ? `（${hint}）` : ''}`}
              className="w-full px-4 py-3 rounded-lg border text-lg"
              style={{ 
                borderColor: correct ? '#4ade80' : showHint ? '#f87171' : 'var(--border)', 
                background: 'var(--bg-card)', 
                color: '#fff'
              }}
              autoFocus
            />
            
            <div className="flex items-center gap-3">
              <button
                onClick={checkAnswer}
                className="px-6 py-2 rounded-lg"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                确认
              </button>
              <button
                onClick={handleShowAnswer}
                className="px-4 py-2 rounded-lg"
                style={{ border: '1px solid var(--border)', color: '#888' }}
              >
                不会，点此显示
              </button>
              {showHint && (
                <span style={{ color: '#f87171' }}>提示: {hint}</span>
              )}
            </div>
          </div>
        )}

        {/* 显示答案后 */}
        {showAnswer && (
          <div className="p-4 rounded-lg" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80' }}>
            <p style={{ color: '#4ade80' }}>答案: {currentLine}</p>
          </div>
        )}
      </div>
    );
  }

  // 背下一句模式：显示上一句，用户说下一句
  return (
    <div>
      {/* 显示进度 */}
      <div className="mb-4 flex items-center gap-2" style={{ color: '#666' }}>
        <span>{currentBlank + 1}</span> / <span>{blanks.length}</span>
      </div>

      {/* 上一句（提示） */}
      {showPrevLine && currentBlank > 0 && (
        <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--bg-card)', color: '#666' }}>
          上一句：{prevLine}
        </div>
      )}

      {/* 空格让用户填写 */}
      <div className="leading-relaxed text-xl mb-6 p-6 rounded-lg" style={{ 
        background: 'var(--bg-card)', 
        color: '#ffffff', 
        fontFamily: 'serif',
        borderLeft: '3px solid var(--accent)'
      }}>
        {currentBlank === 0 ? "（请说出第一句）" : "请说下一句："}
      </div>

      {/* 输入框 */}
      {!showAnswer && (
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
            placeholder="填写答案"
            className="w-full px-4 py-3 rounded-lg border text-lg"
            style={{ 
              borderColor: correct ? '#4ade80' : showHint ? '#f87171' : 'var(--border)', 
              background: 'var(--bg-card)', 
              color: '#ffffff'
            }}
            autoFocus
          />
          
          <div className="flex items-center gap-3">
            <button
              onClick={checkAnswer}
              className="px-6 py-2 rounded-lg"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              确认
            </button>
            <button
              onClick={handleShowAnswer}
              className="px-4 py-2 rounded-lg"
              style={{ border: '1px solid var(--border)', color: '#888' }}
            >
              不会，点此显示
            </button>
          </div>
        </div>
      )}

      {/* 显示答案后 */}
      {showAnswer && (
        <div className="p-4 rounded-lg" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80' }}>
          <p style={{ color: '#4ade80' }}>答案: {currentLine}</p>
        </div>
      )}
    </div>
  );
}