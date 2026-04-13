"use client";

import Script from "next/script";

export default function Comments() {
  return (
    <>
      <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
        <div id="commentbox" className="comment-box"></div>
      </div>
      <Script
        id="commentbox-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var commentbox_settings = {
              // 这里填你的 project ID，注册后获取
              projectID: "5671822670430208-proj",
              theme: "dark",
              backgroundColor: "transparent",
              textColor: "#e5e5e5",
            };
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s);
              js.id = id;
              js.src = "https://commentbox.io/js/commentbox.js";
              fjs.parentNode.insertBefore(js, fjs);
            })(document, "script", "commentbox-script");
          `,
        }}
      />
    </>
  );
}