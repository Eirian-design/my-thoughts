import Quiz from "./Quiz";

export const metadata = {
  title: "TCM - 中医歌诀 | Eirian's Thoughts",
  description: "中医歌诀学习",
};

const songs = [
  {
    id: "gan-mao",
    title: "感冒",
    // 每句歌诀
    lines: "感冒卫表肺失宣|恶风恶寒鼻咽兼|风寒感冒荆防败|风热感冒银翘散|暑湿感冒新香薷|气虚感冒参苏短|阴虚感冒加葳蕤|阳虚感冒麻附寒",
    blanks: [
      { answer: "感冒卫表肺失宣", hint: "病机" },
      { answer: "恶风恶寒鼻咽兼", hint: "症状" },
      { answer: "风寒感冒荆防败", hint: "风寒方" },
      { answer: "风热感冒银翘散", hint: "风热方" },
      { answer: "暑湿感冒新香薷", hint: "暑湿方" },
      { answer: "气虚感冒参苏短", hint: "气虚方" },
      { answer: "阴虚感冒加葳蕤", hint: "阴虚方" },
      { answer: "阳虚感冒麻附寒", hint: "阳虚方" },
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
            <Quiz 
              content={song.lines} 
              blanks={song.blanks} 
              mode="blank"
            />
          </div>
        ))}
      </div>
    </div>
  );
}