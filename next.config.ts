import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // AVIF/WebP served automatically by next/image for optimizable sources.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      // Cloudinary — primary media store
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // Supabase Storage (avatars / misc)
      { protocol: 'https', hostname: '*.supabase.co' },
      // Video thumbnails
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
    ],
  },
}
export default nextConfig
