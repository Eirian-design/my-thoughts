"use client";

import Script from "next/script";

export default function Comments() {
  return (
    <>
      <div className="mt-10 pt-6" style={{ borderTop: "1px solid #333" }}>
        <div id="disqus_thread"></div>
      </div>
      <Script
        id="disqus-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var disqus_config = function() {
              this.page.url = window.location.href;
              this.page.identifier = window.location.pathname;
            };
            (function() {
              var d = document, s = d.createElement('script');
              s.src = 'https://eirian-top.disqus.com/embed.js';
              s.setAttribute('data-timestamp', +new Date());
              (d.head || d.body).appendChild(s);
            })();
          `,
        }}
      />
      <noscript>
        请启用 JavaScript 以查看评论系统
      </noscript>
    </>
  );
}