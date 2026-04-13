"use client";

export default function Comments() {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'Eirian-design/my-thoughts');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('label', 'comment');
    script.setAttribute('theme', 'github-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    document.getElementById('comments')?.appendChild(script);
  }

  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div id="comments"></div>
    </div>
  );
}