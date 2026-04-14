"use client";

import { useState } from "react";

type Blank = { answer: string; hint: string };

type QuizMode = "blank" | "recall";

export default function Quiz({ 
  content, 
  blanks, 
  mode = "blank" as QuizMode
}: { 
  content: string; 
  blanks: Blank[];
  mode?: QuizMode;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode2, setMode2] = useState<"blank" | "recall">(mode);

  const switchMode = (newMode: "blank" | "recall") => {
    setMode2(newMode);
    setCurrentIndex(0);
    setInput("");
    setCorrect(false);
    setShowHint(false);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    const expected = blanks[currentIndex].answer;
    if (input.trim() === expected) {
      setCorrect(true);
      setTimeout(() => {
        if (currentIndex + 1 < blanks.length) {
          setCurrentIndex(currentIndex + 1);
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
      if (currentIndex + 1 < blanks.length) {
        setCurrentIndex(currentIndex + 1);
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
          onClick={() => { setCurrentIndex(0); setInput(""); setCompleted(false); setCorrect(false); setShowAnswer(false); }}
          className="px-6 py-2 rounded-lg"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          再来一次
        </button>
      </div>
    );
  }

  const currentAnswer = blanks[currentIndex].answer;
  const prevAnswer = currentIndex > 0 ? blanks[currentIndex - 1].answer : "";
  const hint = blanks[currentIndex]?.hint || "";

  // 挖空模式：显示完整句子，挖空关键部分（用_____表示）
  if (mode2 === "blank") {
    // 把答案中部分内容挖空，用 ____ 代替
    const chars = currentAnswer.split('');
    const hideCount = Math.max(2, Math.floor(chars.length * 0.6));
    const startHide = Math.floor((chars.length - hideCount) / 2);
    const displayText = chars.map((c, i) => 
      i >= startHide && i < startHide + hideCount ? '_' : c
    ).join('').replace(/_+/g, '___');
    
    return (
      <div>
        {/* 模式切换 */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => switchMode("blank")}
            className="px-3 py-1 rounded text-sm"
            style={{ background: mode2 === 'blank' ? 'var(--accent)' : '#333', color: '#fff' }}
          >
            挖空模式
          </button>
          <button
            onClick={() => switchMode("recall")}
            className="px-3 py-1 rounded text-sm"
            style={{ background: mode2 === 'recall' ? 'var(--accent)' : '#333', color: '#fff' }}
          >
            背下一句
          </button>
        </div>

        {/* 进度 */}
        <div className="mb-4 text-sm" style={{ color: '#666' }}>
          第 {currentIndex + 1} 题 / 共 {blanks.length} 题
        </div>

        {/* 题目：完整句子，关键部分挖空 */}
        <div className="mb-6 p-4 rounded-lg text-center" style={{ 
          background: '#f5f5f5', 
          color: '#1a1a1a',
          fontSize: '22px',
          fontFamily: 'serif',
          letterSpacing: '2px'
        }}>
          {displayText}
        </div>

        {/* 提示 */}
        <div className="mb-4 text-sm" style={{ color: '#888' }}>
          提示：{hint}
        </div>

        {/* 输入框 */}
        {!showAnswer && (
          <div className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
              placeholder={`填写挖空的内容`}
              className="w-full px-4 py-3 rounded-lg border text-lg"
              style={{ 
                borderColor: correct ? '#4ade80' : showHint ? '#f87171' : '#ddd', 
                background: '#fff', 
                color: '#1a1a1a'
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
                className="px-4 py-2 rounded-lg text-sm"
                style={{ border: '1px solid #ddd', color: '#666' }}
              >
                不会
              </button>
            </div>
          </div>
        )}

        {/* 显示答案 */}
        {showAnswer && (
          <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
            <p style={{ color: '#4ade80', fontSize: '20px' }}>答案: {currentAnswer}</p>
          </div>
        )}
      </div>
    );
  }

  // 背下一句模式：显示上一句，用户说下一句
  return (
    <div>
      {/* 模式切换 */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => switchMode("blank")}
          className="px-3 py-1 rounded text-sm"
          style={{ background: mode2 === 'blank' ? 'var(--accent)' : '#333', color: '#fff' }}
        >
          挖空模式
        </button>
        <button
          onClick={() => switchMode("recall")}
          className="px-3 py-1 rounded text-sm"
          style={{ background: mode2 === 'recall' ? 'var(--accent)' : '#333', color: '#fff' }}
        >
          背下一句
        </button>
      </div>

      {/* 进度 */}
      <div className="mb-4 text-sm" style={{ color: '#666' }}>
        第 {currentIndex + 1} 题 / 共 {blanks.length} 题
      </div>

      {/* 上一句（提示） */}
      {currentIndex > 0 && (
        <div className="mb-3 p-3 rounded-lg text-center" style={{ background: '#f0f0f0', color: '#666' }}>
          上一句：{prevAnswer}
        </div>
      )}

      {/* 当前题目 */}
      <div className="mb-6 p-4 rounded-lg text-center" style={{ 
        background: '#f5f5f5', 
        color: '#1a1a1a',
        fontSize: '22px',
        fontFamily: 'serif',
        letterSpacing: '2px'
      }}>
        {currentIndex === 0 ? "（请说出第一句）" : "请说下一句："}
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
              borderColor: correct ? '#4ade80' : showHint ? '#f87171' : '#ddd', 
              background: '#fff', 
              color: '#1a1a1a'
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
              className="px-4 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #ddd', color: '#666' }}
            >
              不会
            </button>
          </div>
        </div>
      )}

      {/* 显示答案 */}
      {showAnswer && (
        <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
          <p style={{ color: '#4ade80', fontSize: '20px' }}>答案: {currentAnswer}</p>
        </div>
      )}
    </div>
  );
}