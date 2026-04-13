"use client";

import { useEffect, useRef } from "react";

export default function WalineComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initWaline = async () => {
      try {
        // 动态加载 CSS
        if (!document.getElementById("waline-style")) {
          const link = document.createElement("link");
          link.id = "waline-style";
          link.rel = "stylesheet";
          link.href = "/waline.css";
          document.head.appendChild(link);
        }

        // 等待 CSS 加载后加载 JS
        await new Promise(resolve => setTimeout(resolve, 100));

        // 动态加载 JS
        if (!(window as any).Waline) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "/waline.js";
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // 初始化 Waline
        if ((window as any).Waline && containerRef.current) {
          (window as any).Waline.init({
            el: containerRef.current,
            serverURL: "https://disscusion-ipr7wt9zu-eirian-designs-projects.vercel.app",
            lang: "zh-CN",
          });
        }
      } catch (e) {
        console.error("Waline init error:", e);
      }
    };

    initWaline();
  }, []);

  return (
    <>
      <div
        id="waline-container"
        ref={containerRef}
        className="mt-10 pt-6"
        style={{ borderTop: "1px solid #333" }}
      />
    </>
  );
}