"use client";

interface BlogContentProps {
  content: string;
  textSize: number;
}

export default function BlogContent({ content, textSize }: BlogContentProps) {
  return (
    <div 
      className="prose dark:prose-invert prose-indigo max-w-none mb-12 transition-all duration-300"
      style={{ fontSize: `${textSize}px`, lineHeight: '1.8' }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
