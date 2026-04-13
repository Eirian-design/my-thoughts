"use client";

import { useEffect, useRef } from "react";

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/commentbox.io/dist/commentBox.min.js';
    script.async = true;
    
    script.onload = () => {
      // @ts-ignore
      if (window.commentBox) {
        // @ts-ignore
        window.commentBox('5671822670430208-proj');
      }
    };
    
    document.body.appendChild(script);
  }, []);

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div ref={containerRef} className="commentbox"></div>
    </div>
  );
}