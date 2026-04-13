"use client";

import Script from "next/script";

export default function WalineComments() {
  return (
    <>
      <div id="waline-container" className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}></div>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@waline/client@v3/dist/waline.css" />
      <Script src="https://cdn.jsdelivr.net/npm/@waline/client@v3/dist/waline.js" strategy="afterInteractive" />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', function() {
              setTimeout(function() {
                if (typeof Waline !== 'undefined') {
                  Waline.init({
                    el: '#waline-container',
                    serverURL: 'https://waline.vercel.app',
                    lang: 'zh-CN',
                    dark: 'body',
                  });
                }
              }, 1500);
            });
          `,
        }}
      />
    </>
  );
}