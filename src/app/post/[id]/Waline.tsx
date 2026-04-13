"use client";

import { useEffect } from "react";

export default function Comments() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'Eirian-design/my-thoughts');
    script.setAttribute('data-repo-id', 'R_kgDOExample');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOExample');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    const container = document.getElementById('giscus-container');
    if (container) {
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div id="giscus-container"></div>
    </div>
  );
}