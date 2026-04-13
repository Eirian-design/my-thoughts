"use client";

import Script from "next/script";

export default function Comments() {
  return (
    <>
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
        <div id="comments"></div>
      </div>
      <Script
        src="https://utteranc.es/client.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-ignore
          window.utterances = {
            repo: "Eirian-design/my-thoughts",
            issueTerm: "pathname",
            label: "comment",
            theme: "github-dark",
          };
        }}
      />
    </>
  );
}