"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

// Inline SVGs for social icons to prevent lucide-react export errors
const Facebook = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const Youtube = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;
const Linkedin = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

export default function Footer() {
  return (
    <footer className="bg-[#0f62fe] text-white pt-20 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Col 1 */}
        <div>
          <div className="bg-white p-3 rounded-xl inline-block mb-6">
            <Image src="/logo.png" width={180} height={45} alt="TechHat Logo" className="object-contain" />
          </div>
          <p className="text-blue-100 text-sm leading-relaxed mb-6">
            টেকহ্যাট কম্পিউটার ট্রেনিং সেন্টার একটি বিশ্বস্ত ও স্বনামধন্য আইটি প্রশিক্ষণ প্রতিষ্ঠান। আমরা দক্ষতা উন্নয়ন ও ক্যারিয়ার গড়ার লক্ষ্যে কাজ করে যাচ্ছি।
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#0f62fe] transition-colors"><Facebook /></Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#0f62fe] transition-colors"><Youtube /></Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#0f62fe] transition-colors"><Linkedin /></Link>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">Quick Links</h3>
          <ul className="space-y-3">
            {['Home', 'About Us', 'All Courses', 'Success Stories', 'Contact Us'].map((link) => (
              <li key={link}>
                <Link href="#" className="text-blue-100 hover:text-white hover:underline text-sm font-medium transition-colors">
                  → {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">Popular Courses</h3>
          <ul className="space-y-3">
            {['Basic Computer', 'Graphics Design', 'Digital Marketing', 'Web Development', 'Video Editing'].map((course) => (
              <li key={course}>
                <Link href="#" className="text-blue-100 hover:text-white hover:underline text-sm font-medium transition-colors">
                  → {course}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h3 className="text-xl font-bold mb-6 text-white border-b border-white/20 pb-2 inline-block">Contact Info</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-blue-100">
              <MapPin className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>Mirpur 10, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-blue-100">
              <Phone className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>+880 1788-827474</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-blue-100">
              <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
              <span>info@techhat.com.bd</span>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="border-t border-blue-400/50 pt-8 text-center px-4">
        <p className="text-blue-200 text-sm font-medium">© {new Date().getFullYear()} TechHat Computer Training Center. All rights reserved. Developed by TechHat.</p>
      </div>
    </footer>
  );
}
