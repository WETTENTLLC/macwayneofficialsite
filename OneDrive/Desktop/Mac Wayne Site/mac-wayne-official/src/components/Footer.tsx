'use client';

import Link from 'next/link';
import { Music, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t-2 border-orange-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="bebas-header text-3xl text-orange-500 mb-4">
              MAC WAYNE OFFICIAL
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              The Blind Visionary's Universe - Raw storytelling meets accessibility innovation. 
              Experience music, get live help, and dive into the documentary world.
            </p>
            <p className="text-orange-500 font-bold italic">
              "Ain't about sight – it's about vision."
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="bebas-header text-xl text-white mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Shop Music & Merch
                </Link>
              </li>
              <li>
                <Link href="/live" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Help the Blind Man
                </Link>
              </li>
              <li>
                <Link href="/documentary" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Documentary Experience
                </Link>
              </li>
              <li>
                <a href="#loyalty" className="text-gray-400 hover:text-orange-500 transition-colors">
                  Sheriff Thizz Rewards
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="bebas-header text-xl text-white mb-4">CONNECT</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-400">
                <Mail size={16} className="mr-2" />
                <span>contact@macwayneofficial.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin size={16} className="mr-2" />
                <span>Everett, WA</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Music size={16} className="mr-2" />
                <span>Streaming on all platforms</span>
              </li>
            </ul>

            {/* Social Media Placeholder */}
            <div className="mt-4 space-y-2">
              <a href="#" className="block text-gray-400 hover:text-orange-500 transition-colors">
                Follow on Instagram
              </a>
              <a href="#" className="block text-gray-400 hover:text-orange-500 transition-colors">
                Subscribe on YouTube
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © 2025 Mac Wayne Official. Built raw, built real.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Accessibility first. Music forever.
          </p>
        </div>
      </div>
    </footer>
  );
}
