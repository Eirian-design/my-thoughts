"use client";

import { useState, useRef, useEffect } from "react";

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
  const [mode2, setMode2] = useState<QuizMode>(mode);
  const formRef = useRef<HTMLFormElement>(null);
  const [blankAnswer, setBlankAnswer] = useState("");

  const switchMode = (newMode: "blank" | "recall") => {
    setMode2(newMode);
    setCurrentIndex(0);
    setInput("");
    setCorrect(false);
    setShowHint(false);
    setShowAnswer(false);
    setBlankAnswer("");
  };

  const checkAnswer = () => {
    const expected = blankAnswer || blanks[currentIndex].answer;
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
        setBlankAnswer("");
      } else {
        setCompleted(true);
      }
    }, 1500);
  };

  // 强制绑定点击事件
  useEffect(() => {
    const currentAns = blanks[currentIndex].answer;
    
    // 计算当前题的挖空答案
    const keywords = ['感冒', '风寒', '风热', '暑湿', '气虚', '阴虚', '阳虚'];
    let splitPoint = -1;
    for (const kw of keywords) {
      const idx = currentAns.lastIndexOf(kw);
      if (idx > splitPoint) {
        splitPoint = idx + kw.length;
      }
    }
    
    if (splitPoint > 0 && splitPoint < currentAns.length) {
      setBlankAnswer(currentAns.substring(splitPoint));
    } else {
      const keepCount = Math.min(6, Math.floor(currentAns.length * 0.5));
      setBlankAnswer(currentAns.substring(keepCount));
    }
    
    const forceBind = () => {
      const confirmBtn = document.getElementById('confirm-btn');
      const skipBtn = document.getElementById('skip-btn');
      
      if (confirmBtn) {
        confirmBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          checkAnswer();
        });
      }
      
      if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShowAnswer();
        });
      }
    };
    
    // 延迟执行确保DOM渲染完成
    setTimeout(forceBind, 500);
    window.addEventListener('load', forceBind);
    
    return () => {
      window.removeEventListener('load', forceBind);
    };
  }, [currentIndex]);

  if (completed) {
    return (
      <div className="text-center py-8">
        <p className="text-2xl mb-4" style={{ color: '#4ade80' }}>🎉 恭喜完成！</p>
        <div
          id="confirm-btn"
          className="px-6 py-2 rounded-lg inline-block"
          style={{ background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
        >
          再来一次
        </div>
      </div>
    );
  }

  const currentAnswer = blanks[currentIndex].answer;
  const prevAnswer = currentIndex > 0 ? blanks[currentIndex - 1].answer : "";
  const hint = blanks[currentIndex]?.hint || "";

  // 挖空模式：显示证型，填写方药
  if ((mode2 as string) === "blank") {
    let displayText = currentAnswer;
    let answerText = currentAnswer;
    
    // 尝试找到证型和方药的分界点
    // 格式一般是：证型+方药，如"风寒感冒荆防败"
    const keywords = ['感冒', '感冒', '风寒', '风热', '暑湿', '气虚', '阴虚', '阳虚'];
    
    // 找到最后一个关键词位置
    let splitPoint = -1;
    for (const kw of keywords) {
      const idx = currentAnswer.lastIndexOf(kw);
      if (idx > splitPoint) {
        splitPoint = idx + kw.length;
      }
    }
    
    // 如果找到分界点，显示证型，挖空方药
    if (splitPoint > 0 && splitPoint < currentAnswer.length) {
      const zhengxing = currentAnswer.substring(0, splitPoint);
      const fangyao = currentAnswer.substring(splitPoint);
      displayText = zhengxing + '———';
      answerText = fangyao;
    } else {
      // 没有找到关键词，按固定字符数分割
      const keepCount = Math.min(6, Math.floor(currentAnswer.length * 0.5));
      displayText = currentAnswer.substring(0, keepCount) + '———';
      answerText = currentAnswer.substring(keepCount);
    }
    
    return (
      <div>
        {/* 模式切换 */}
        <div className="mb-4 flex gap-2">
          <span
            onClick={() => switchMode("blank")}
            className="px-3 py-1 rounded text-sm inline-block"
            style={{ background: (mode2 as string) === 'blank' ? 'var(--accent)' : '#333', color: '#fff', cursor: 'pointer' }}
          >
            挖空模式
          </span>
          <span
            onClick={() => switchMode("recall")}
            className="px-3 py-1 rounded text-sm inline-block"
            style={{ background: (mode2 as string) === 'recall' ? 'var(--accent)' : '#333', color: '#fff', cursor: 'pointer' }}
          >
            背下一句
          </span>
        </div>

        <div className="mb-4 text-sm" style={{ color: '#666' }}>
          第 {currentIndex + 1} 题 / 共 {blanks.length} 题
        </div>

        <div className="mb-6 p-4 rounded-lg text-center" style={{ 
          background: '#f5f5f5', 
          color: '#1a1a1a',
          fontSize: '22px',
          fontFamily: 'serif',
          letterSpacing: '2px'
        }}>
          {displayText}
        </div>

        <div className="mb-4 text-sm" style={{ color: '#888' }}>
          提示：{hint}
        </div>

        {!showAnswer && (
          <form ref={formRef} onSubmit={(e) => { e.preventDefault(); checkAnswer(); }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`填写挖空的内容`}
              className="w-full px-4 py-3 rounded-lg border text-lg mb-4"
              style={{ 
                borderColor: correct ? '#4ade80' : showHint ? '#f87171' : '#ddd', 
                background: '#fff', 
                color: '#1a1a1a'
              }}
              autoFocus
            />
            
            <div className="flex items-center gap-3">
              <span
                id="confirm-btn"
                className="px-6 py-2 rounded-lg"
                style={{ background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
              >
                确认
              </span>
              <span
                id="skip-btn"
                className="px-4 py-2 rounded-lg text-sm"
                style={{ border: '1px solid #ddd', color: '#666', cursor: 'pointer' }}
              >
                不会
              </span>
            </div>
          </form>
        )}

        {showAnswer && (
          <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
            <p style={{ color: '#4ade80', fontSize: '20px' }}>答案: {currentAnswer}</p>
          </div>
        )}
      </div>
    );
  }

  // 背下一句模式
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <span
          onClick={() => switchMode("blank")}
          className="px-3 py-1 rounded text-sm inline-block"
          style={{ background: (mode2 as string) === 'blank' ? 'var(--accent)' : '#333', color: '#fff', cursor: 'pointer' }}
        >
          挖空模式
        </span>
        <span
          onClick={() => switchMode("recall")}
          className="px-3 py-1 rounded text-sm inline-block"
          style={{ background: (mode2 as string) === 'recall' ? 'var(--accent)' : '#333', color: '#fff', cursor: 'pointer' }}
        >
          背下一句
        </span>
      </div>

      <div className="mb-4 text-sm" style={{ color: '#666' }}>
        第 {currentIndex + 1} 题 / 共 {blanks.length} 题
      </div>

      {currentIndex > 0 && (
        <div className="mb-3 p-3 rounded-lg text-center" style={{ background: '#f0f0f0', color: '#666' }}>
          上一句：{prevAnswer}
        </div>
      )}

      <div className="mb-6 p-4 rounded-lg text-center" style={{ 
        background: '#f5f5f5', 
        color: '#1a1a1a',
        fontSize: '22px',
        fontFamily: 'serif',
        letterSpacing: '2px'
      }}>
        {currentIndex === 0 ? "（请说出第一句）" : "请说下一句："}
      </div>

      {!showAnswer && (
        <form onSubmit={(e) => { e.preventDefault(); checkAnswer(); }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="填写答案"
            className="w-full px-4 py-3 rounded-lg border text-lg mb-4"
            style={{ 
              borderColor: correct ? '#4ade80' : showHint ? '#f87171' : '#ddd', 
              background: '#fff', 
              color: '#1a1a1a'
            }}
            autoFocus
          />
          
          <div className="flex items-center gap-3">
            <span
              id="confirm-btn"
              className="px-6 py-2 rounded-lg"
              style={{ background: 'var(--accent)', color: '#fff', cursor: 'pointer' }}
            >
              确认
            </span>
            <span
              id="skip-btn"
              className="px-4 py-2 rounded-lg text-sm"
              style={{ border: '1px solid #ddd', color: '#666', cursor: 'pointer' }}
            >
              不会
            </span>
          </div>
        </form>
      )}

      {showAnswer && (
        <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
          <p style={{ color: '#4ade80', fontSize: '20px' }}>答案: {currentAnswer}</p>
        </div>
      )}
    </div>
  );
}
