"use client";

import Script from "next/script";

export default function Comments() {
  return (
    <>
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
        <div id="comments"></div>
      </div>
      <Script
        id="utterances"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var s = document.createElement('script');
            s.src = 'https://utteranc.es/client.js';
            s.setAttribute('repo', 'Eirian-design/my-thoughts');
            s.setAttribute('issue-term', 'pathname');
            s.setAttribute('label', 'comment');
            s.setAttribute('theme', 'github-dark');
            s.setAttribute('crossorigin', 'anonymous');
            s.async = true;
            document.getElementById('comments').appendChild(s);
          `,
        }}
      />
    </>
  );
}