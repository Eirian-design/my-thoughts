"use client";

import { useEffect } from "react";

export default function Comments() {
  useEffect(() => {
    // @ts-ignore
    if (window.commentBox) {
      // @ts-ignore
      window.commentBox("5671822670430208-proj", {
        theme: "dark",
        backgroundColor: "transparent",
        textColor: "#e5e5e5",
      });
    }
  }, []);

  return (
    <>
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
        <div id="commentbox" className="commentbox"></div>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/commentbox.io/dist/commentBox.min.js"
        async
      />
    </>
  );
}