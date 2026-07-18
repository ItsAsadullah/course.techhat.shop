export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
  tags: string[];
  content: string;
  relatedSlugs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "getting-started-with-nextjs-14",
    title: "Next.js 14 দিয়ে শুরু করুন: অ্যাপ রাউটার এবং টার্বোপ্যাকের বিস্তারিত",
    date: "12 May, 2026",
    readTime: "5 min read",
    author: {
      name: "Tanjim Hasan",
      role: "Senior Software Engineer",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
    },
    tags: ["Next.js", "React", "Web Development"],
    relatedSlugs: ["react-server-components-guide", "tailwind-css-best-practices"],
    content: `
      <h2>Next.js 14 কেন এত স্পেশাল?</h2>
      <p>Next.js এর নতুন ভার্সনটি ওয়েব ডেভেলপমেন্ট জগতে একটি বড় পরিবর্তন এনেছে। বিশেষ করে App Router এবং Server Components এর ব্যবহার আগের যেকোনো সময়ের চেয়ে সহজ এবং দ্রুত করা হয়েছে।</p>
      
      <h3>১. অ্যাপ রাউটার (App Router)</h3>
      <p>নতুন অ্যাপ রাউটার ফাইল সিস্টেম-ভিত্তিক রাউটিংকে আরও শক্তিশালী করেছে। এখন আপনি <code>layout.tsx</code>, <code>page.tsx</code>, <code>loading.tsx</code> এবং <code>error.tsx</code> ব্যবহার করে খুব সহজেই জটিল UI তৈরি করতে পারবেন।</p>
      
      <blockquote>"Next.js 14 শুধু একটি আপডেট নয়, এটি ডেভেলপার এক্সপেরিয়েন্সের এক নতুন দিগন্ত।" - Vercel Team</blockquote>

      <h3>২. টার্বোপ্যাক (Turbopack)</h3>
      <p>ওয়েবপ্যাকের তুলনায় টার্বোপ্যাক অনেক গুণ বেশি দ্রুত। লোকাল ডেভেলপমেন্টে এর পারফরম্যান্স দেখলে আপনি অবাক হবেন।</p>
      
      <pre><code class="language-bash">npx create-next-app@latest my-app --example with-turbopack</code></pre>
      
      <p>উপরের কমান্ডটি ব্যবহার করে আপনি খুব সহজেই একটি নতুন প্রোজেক্ট শুরু করতে পারেন।</p>
      
      <h2>উপসংহার</h2>
      <p>আপনি যদি রিঅ্যাক্ট ডেভেলপার হন, তবে নেক্সট জেএস শেখা আপনার জন্য বাধ্যতামূলক। এটি শুধু আপনার সময়ই বাঁচাবে না, বরং আপনার অ্যাপ্লিকেশনকে আরও দ্রুত এবং এসইও-বান্ধব করবে।</p>
    `
  },
  {
    slug: "react-server-components-guide",
    title: "React Server Components: একটি পূর্ণাঙ্গ গাইড",
    date: "10 May, 2026",
    readTime: "7 min read",
    author: {
      name: "Tanjim Hasan",
      role: "Senior Software Engineer",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
    },
    tags: ["React", "Performance"],
    relatedSlugs: ["getting-started-with-nextjs-14"],
    content: "<p>React Server components...</p>"
  },
  {
    slug: "tailwind-css-best-practices",
    title: "Tailwind CSS এর সেরা প্র্যাকটিসগুলো",
    date: "05 May, 2026",
    readTime: "4 min read",
    author: {
      name: "Tanjim Hasan",
      role: "Senior Software Engineer",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200"
    },
    tags: ["Tailwind", "CSS"],
    relatedSlugs: ["getting-started-with-nextjs-14"],
    content: "<p>Tailwind CSS is awesome...</p>"
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getRelatedPosts(slugs: string[]): BlogPost[] {
  return blogPosts.filter(post => slugs.includes(post.slug));
}
