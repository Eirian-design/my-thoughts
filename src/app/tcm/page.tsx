import Quiz from "./Quiz";

export const metadata = {
  title: "TCM - 中医歌诀 | Eirian's Thoughts",
  description: "中医歌诀学习",
};

const songs = [
  {
    id: "gan-mao",
    title: "感冒",
    // 歌诀按句子分开，用 | 分隔每句
    lines: "感冒卫表肺失宣|恶风恶寒鼻咽兼|风寒感冒荆防败|风热感冒银翘散|暑湿感冒新香薷|气虚感冒参苏短|阴虚感冒加葳蕤|阳虚感冒麻附寒",
    blanks: [
      { answer: "感冒卫表肺失宣", hint: "第一句" },
      { answer: "恶风恶寒鼻咽兼", hint: "第二句" },
      { answer: "风寒感冒荆防败", hint: "第三句" },
      { answer: "风热感冒银翘散", hint: "第四句" },
      { answer: "暑湿感冒新香薷", hint: "第五句" },
      { answer: "气虚感冒参苏短", hint: "第六句" },
      { answer: "阴虚感冒加葳蕤", hint: "第七句" },
      { answer: "阳虚感冒麻附寒", hint: "第八句" },
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
          两种学习模式：<br/>
          • 挖空模式 - 填写完整的句子<br/>
          • 背下一句 - 显示上一句，填写下一句
        </p>
      </header>

      <div className="space-y-8">
        {songs.map((song) => (
          <div key={song.id} className="card rounded-lg p-6">
            <h2 className="text-xl font-serif mb-4" style={{ color: '#e5e5e5' }}>{song.title}</h2>
            
            {/* 挖空模式 */}
            <div className="mb-6">
              <h3 className="text-sm mb-3" style={{ color: '#666' }}>模式一：挖空测验</h3>
              <Quiz 
                content={song.lines} 
                blanks={song.blanks} 
                mode="blank"
              />
            </div>

            <hr className="my-6" style={{ borderColor: '#333' }} />

            {/* 背下一句模式 */}
            <div>
              <h3 className="text-sm mb-3" style={{ color: '#666' }}>模式二：背下一句</h3>
              <Quiz 
                content={song.lines} 
                blanks={song.blanks} 
                mode="recall"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}