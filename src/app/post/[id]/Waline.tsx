"use client";

import Script from "next/script";

export default function Comments() {
  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div className="commentbox"></div>
      <Script
        src="https://cdn.jsdelivr.net/npm/commentbox.io/dist/commentBox.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore
          window.commentBox("5671822670430208-proj");
        }}
      />
    </div>
  );
}