"use client";

export default function Comments() {
  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <div id="cusdis_thread"
        data-host="https://cusdis.com"
        data-app-id="59c8b9c9-e5a7-46c7-9484-02c7b5c3a0b0"
        data-page-id="hello-world"
        data-page-title="你好，世界"
        data-page-url="https://www.eirian.top/post/hello-world">
      </div>
      <script async defer src="https://cusdis.com/js/cusdis.js"></script>
    </div>
  );
}