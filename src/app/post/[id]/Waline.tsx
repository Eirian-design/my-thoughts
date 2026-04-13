"use client";

export default function Comments() {
  return (
    <div className="mt-10 pt-6" style={{ borderTop: '1px solid #333' }}>
      <h3 style={{ color: '#e5e5e5', marginBottom: '20px' }}>评论</h3>
      <iframe 
        src="https://docs.google.com/forms/d/e/1FAIpQLSdXa5NhIbLqKkG7H1qYxN-GY8qQ9jP3qN-YqKxG7H1qYxN-GY8/viewform?embedded=true" 
        width="100%" 
        height="500" 
        frameBorder="0" 
        marginHeight={0} 
        marginWidth={0}
        style={{ background: '#1a1a1a', borderRadius: '8px' }}
      >
        加载中…
      </iframe>
    </div>
  );
}