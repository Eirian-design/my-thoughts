export const metadata = {
  title: "TCM - 中医歌诀 | Eirian's Thoughts",
  description: "中医歌诀学习",
};

export default function TCMPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="py-10 mb-8 border-b" style={{ borderColor: '#333' }}>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#666' }}>Traditional Chinese Medicine</p>
        <h1 className="text-3xl font-serif" style={{ color: '#e5e5e5' }}>TCM 中医歌诀</h1>
        <p className="mt-4" style={{ color: '#888' }}>
          背诵学习中医经典歌诀，包含汤头歌诀、穴位定位、药性赋等。
        </p>
      </header>

      <div className="space-y-6">
        <article className="card rounded-lg p-6 hover:opacity-80 transition-opacity">
          <h2 className="text-xl font-serif mb-2" style={{ color: '#e5e5e5' }}>
            汤头歌诀
          </h2>
          <div className="flex items-center gap-3 text-sm mb-3" style={{ color: '#666' }}>
            <time>2026-04-14</time>
            <span>·</span>
            <span>入门</span>
          </div>
          <p style={{ color: '#888' }}>
            经典方剂编成的歌诀，方便记忆...
          </p>
        </article>

        <article className="card rounded-lg p-6 hover:opacity-80 transition-opacity">
          <h2 className="text-xl font-serif mb-2" style={{ color: '#e5e5e5' }}>
            针灸大成·穴位歌
          </h2>
          <div className="flex items-center gap-3 text-sm mb-3" style={{ color: '#666' }}>
            <time>2026-04-14</time>
            <span>·</span>
            <span>针灸</span>
          </div>
          <p style={{ color: '#888' }}>
            常用穴位定位与主治歌诀...
          </p>
        </article>

        <article className="card rounded-lg p-6 hover:opacity-80 transition-opacity">
          <h2 className="text-xl font-serif mb-2" style={{ color: '#e5e5e5' }}>
            药性赋
          </h2>
          <div className="flex items-center gap-3 text-sm mb-3" style={{ color: '#666' }}>
            <time>2026-04-14</time>
            <span>·</span>
            <span>中药</span>
          </div>
          <p style={{ color: '#888' }}>
            中药药性记忆歌诀...
          </p>
        </article>

        <div className="card rounded-lg p-6 text-center">
          <p style={{ color: '#888' }}>更多内容持续更新中...</p>
        </div>
      </div>
    </div>
  );
}