"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export default function CommentSection() {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, author: "Rahim Uddin", text: "খুবই দারুণ একটি পোস্ট! অনেক কিছু জানতে পারলাম।", date: "2 hours ago" },
    { id: 2, author: "Sadia Rahman", text: "Next.js 14 এর এই ফিচারগুলো সত্যিই চমৎকার কাজ করে।", date: "5 hours ago" }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    // Mock network request
    setTimeout(() => {
      setComments([
        { id: Date.now(), author: "You (Guest)", text: comment, date: "Just now" },
        ...comments
      ]);
      setComment("");
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-indigo-600" />
        মতামত জানান ({comments.length})
      </h3>

      <form onSubmit={handleSubmit} className="mb-10 relative">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="আপনার মতামত লিখুন..."
          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-slate-100 transition-shadow resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim()}
          className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? "পোস্ট হচ্ছে..." : "পোস্ট করুন"}
          {!isSubmitting && <Send className="w-4 h-4" />}
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold shrink-0">
              {c.author.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">{c.author}</span>
                <span className="text-xs text-slate-500 dark:text-slate-500">{c.date}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
