"use client";

import { useEffect } from "react";

export default function Comments() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/commentbox.io/dist/commentBox.min.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore
      window.commentBox("5671822670430208-proj");
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div className="commentbox"></div>
    </div>
  );
}