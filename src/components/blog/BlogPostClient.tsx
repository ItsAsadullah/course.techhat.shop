"use client";

import { useState } from "react";
import type { BlogPost } from "@/data/blog";
import BlogHeader from "./BlogHeader";
import BlogContent from "./BlogContent";
import ShareButtons from "./ShareButtons";
import CommentSection from "./CommentSection";

export default function BlogPostClient({ post, fullUrl }: { post: BlogPost, fullUrl: string }) {
  const [textSize, setTextSize] = useState(18);

  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800/50">
              {tag}
            </span>
          ))}
        </div>

        <BlogHeader 
          title={post.title}
          author={post.author}
          date={post.date}
          readTime={post.readTime}
          textSize={textSize}
          setTextSize={setTextSize}
        />
        
        <BlogContent content={post.content} textSize={textSize} />
        
        <ShareButtons url={fullUrl} title={post.title} />
        
        <CommentSection />
        
      </article>
    </div>
  );
}
