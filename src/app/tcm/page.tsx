import Quiz from "./Quiz";

export const metadata = {
  title: "TCM - 中医歌诀 | Eirian's Thoughts",
  description: "中医歌诀学习",
};

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