export const metadata = {
  title: "TCM - 体质检测 | Eirian's Thoughts",
  description: "中医体质检测",
};

export default function TCMPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="py-10 mb-8 border-b" style={{ borderColor: '#333' }}>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#666' }}>Health</p>
        <h1 className="text-3xl font-serif" style={{ color: '#e5e5e5' }}>TCM 体质检测</h1>
        <p className="mt-4" style={{ color: '#888' }}>
          了解你的体质类型，根据中医理论进行养生调理。
        </p>
      </header>

      <div className="card rounded-lg p-8">
        <p style={{ color: '#e5e5e5' }} className="mb-6">
          中医体质检测问卷即将上线。通过一系列问题，帮助你了解自己的体质类型：
        </p>
        <ul className="space-y-3 mb-8" style={{ color: '#888' }}>
          <li>🩺 平和质 - 健康体质</li>
          <li>😔 气虚质 - 容易疲劳</li>
          <li>😰 阳虚质 - 怕冷体质</li>
          <li>🔥 阴虚质 - 容易上火</li>
          <li>💧 痰湿质 - 湿气重</li>
          <li>🌞 湿热质 - 容易长痘</li>
          <li>🩸 血瘀质 - 容易淤青</li>
          <li>😤 气郁质 - 容易抑郁</li>
          <li>🤒 特禀质 - 过敏体质</li>
        </ul>
        
        <div className="p-4 rounded-lg" style={{ background: 'var(--bg-card)', borderLeft: '3px solid var(--accent)' }}>
          <p style={{ color: '#e5e5e5' }}>🚧 问卷开发中，敬请期待...</p>
        </div>
      </div>
    </div>
  );
}