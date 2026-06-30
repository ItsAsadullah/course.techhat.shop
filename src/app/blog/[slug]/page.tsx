import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blog";
import BlogPostClient from "@/components/blog/BlogPostClient";
import RelatedPosts from "@/components/blog/RelatedPosts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: \`\${post.title} | TechHat Blog\`,
    description: post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''), // Strips HTML tags for description
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160).replace(/<[^>]*>?/gm, ''),
      type: "article",
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.relatedSlugs);
  const fullUrl = \`https://techhat.com/blog/\${post.slug}\`;

  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-slate-950 min-h-screen">
        <BlogPostClient post={post} fullUrl={fullUrl} />
        
        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
            <RelatedPosts posts={relatedPosts} />
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
