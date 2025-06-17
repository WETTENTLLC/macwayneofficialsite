import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SocialFeedSection from './components/SocialFeedSection';
import BrandStorySection from './components/BrandStorySection';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero Section with video background and overlay */}
      {/* If you have a VideoBackground component, import and use it here */}
      {/* <VideoBackground /> */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between min-h-screen max-w-7xl mx-auto px-4 sm:px-8 py-16">
        {/* Left: Brand message and CTAs */}
        <div className="flex-1 flex flex-col items-start justify-center text-left space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-brand-primary drop-shadow-lg">
            <span className="block">Welcome to</span>
            <span className="block text-brand-accent-primary font-extrabold">Leafylivation</span>
          </h1>
          <p className="text-lg sm:text-xl text-brand-text-secondary max-w-lg drop-shadow">
            Experience sustainable living with our premium eco-friendly products.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="bg-brand-accent-primary text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-brand-accent-secondary transition">
              Shop Now
            </Link>
            <Link href="/stores" className="bg-white text-brand-accent-primary px-8 py-3 rounded-lg font-semibold shadow hover:bg-brand-accent-secondary border border-brand-accent-primary transition">
              Find a Store
            </Link>
            <Link href="/wholesale" className="bg-brand-accent-secondary text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-brand-accent-primary border border-brand-accent-secondary transition">
              Wholesale Login
            </Link>
          </div>
        </div>
        {/* Right: Dynamic product/lifestyle image */}
        <div className="flex-1 flex items-center justify-center mt-12 lg:mt-0">
          <Image
            src="/images/site-logo.jpeg"
            alt="Leafylivation Can"
            width={350}
            height={350}
            className="rounded-2xl shadow-2xl border-4 border-white bg-white/80 object-contain"
            priority
          />
        </div>
      </div>
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-brand-primary sm:text-4xl">
              Why Choose Leafylivation?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-brand-text-secondary lg:mx-auto">
              We're committed to providing sustainable solutions for a better tomorrow
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-3">
            {[
              {
                title: 'Eco-Friendly Products',
                description: 'All our products are sustainably sourced and environmentally conscious.'
              },
              {
                title: 'Quality Assurance',
                description: 'Every product meets our high standards for quality and sustainability.'
              },
              {
                title: 'Community Focus',
                description: 'Supporting local communities through sustainable practices and education.'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center bg-brand-neutral-soft rounded-xl p-8 shadow hover:shadow-lg transition">
                <h3 className="mt-6 text-lg leading-6 font-bold text-brand-accent-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-base text-brand-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Social Feed Section */}
      <SocialFeedSection />
      {/* Brand Story Section */}
      <BrandStorySection />
    </main>
  );
}
