export const metadata = {
  title: "Words - 语言学习 | Eirian's Thoughts",
  description: "语言学习笔记",
};

export default function WordsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <header className="py-10 mb-8 border-b" style={{ borderColor: '#333' }}>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#666' }}>Language</p>
        <h1 className="text-3xl font-serif" style={{ color: '#e5e5e5' }}>Words 语言学习</h1>
      </header>

      <div className="space-y-6">
        <div className="card rounded-lg p-6">
          <h2 className="text-xl font-serif mb-4" style={{ color: '#e5e5e5' }}>视频学习</h2>
          <div className="w-full aspect-video rounded-lg overflow-hidden border" style={{ borderColor: '#333' }}>
            <iframe
              src="http://video.pollykann.com/movie"
              className="w-full h-full"
              allow="fullscreen"
              title="Video Learning"
            />
          </div>
          <p className="mt-3 text-sm" style={{ color: '#666' }}>
            来源: video.pollykann.com/movie
          </p>
        </div>

        <div className="card rounded-lg p-6">
          <h2 className="text-xl font-serif mb-4" style={{ color: '#e5e5e5' }}>英语学习笔记</h2>
          <div className="flex items-center gap-3 text-sm mb-3" style={{ color: '#666' }}>
            <time>2026-04-14</time>
            <span>·</span>
            <span>英语</span>
          </div>
          <p style={{ color: '#888' }}>
            常用短语、词汇辨析、语法笔记...
          </p>
        </div>

        <div className="card rounded-lg p-6 text-center">
          <p style={{ color: '#888' }}>更多内容持续更新中...</p>
        </div>
      </div>
    </div>
  );
}