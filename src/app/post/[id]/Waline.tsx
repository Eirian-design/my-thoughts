"use client";

export default function Comments() {
  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <iframe
        id="commentbox"
        src="https://commentbox.io/widget/5671822670430208-proj"
        style={{ width: '100%', minHeight: '200px', border: 'none', background: 'transparent' }}
      />
    </div>
  );
}