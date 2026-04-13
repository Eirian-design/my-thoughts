"use client";

import { useEffect } from "react";

export default function Comments() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'Eirian-design/my-thoughts');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'comment');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    const container = document.getElementById('comments');
    if (container) {
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div id="comments"></div>
    </div>
  );
}