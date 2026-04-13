"use client";

import Script from "next/script";

export default function Comments() {
  return (
    <>
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}></div>
      <Script
        src="https://giscus.app/client.js"
        strategy="afterInteractive"
        data-repo="Eirian-design/my-thoughts"
        data-repo-id="R_kgDOR-3s6g"
        data-category="Announcements"
        data-category-id="DIC_kwDOR-3s6s4C6mNC"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="dark"
        data-lang="zh-CN"
        data-loading="lazy"
        crossOrigin="anonymous"
      />
    </>
  );
}