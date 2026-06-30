"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blog";

export default function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        আরো পড়ুন
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-200 dark:hover:border-indigo-800"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {post.title}
            </h4>
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-slate-500 dark:text-slate-400">{post.date}</span>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
