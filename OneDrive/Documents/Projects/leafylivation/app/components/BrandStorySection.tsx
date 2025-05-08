import React from 'react';

export default function BrandStorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Brand story text */}
        <div>
          <h2 className="text-3xl font-extrabold text-brand-primary mb-4">Our Story</h2>
          <p className="text-lg text-brand-text-secondary mb-6">
            Leafylivation was founded with a simple mission: to refresh your living, naturally. We believe in sustainable choices, vibrant living, and building a community that cares for the planet and each other.
          </p>
          <blockquote className="italic text-brand-accent-primary font-semibold border-l-4 border-brand-accent-primary pl-4 mb-4">
            “We’re here to make eco-friendly living accessible, fun, and beautiful.”
          </blockquote>
          <p className="text-brand-text-secondary">— The Leafylivation Team</p>
        </div>
        {/* Right: Lifestyle image/illustration placeholder */}
        <div className="flex justify-center">
          <div className="w-72 h-72 rounded-full bg-brand-accent-secondary/10 flex items-center justify-center shadow-lg">
            {/* Placeholder for illustration */}
            <span className="text-7xl text-brand-accent-secondary">🌱</span>
          </div>
        </div>
      </div>
    </section>
  );
}
