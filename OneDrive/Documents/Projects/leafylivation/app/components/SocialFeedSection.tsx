import React from 'react';

export default function SocialFeedSection() {
  return (
    <section className="py-16 bg-brand-neutral-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-primary mb-6 text-center">
          Join the Leafylivation Community
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4">
          {[1,2,3,4,5].map((n) => (
            <div key={n} className="min-w-[220px] bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center p-4">
              <div className="w-40 h-40 bg-brand-accent-secondary/10 rounded-lg mb-3 flex items-center justify-center">
                {/* Placeholder for social image/video */}
                <span className="text-5xl text-brand-accent-secondary">📸</span>
              </div>
              <p className="text-sm text-brand-text-secondary text-center">#Leafylivation</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="bg-brand-accent-primary text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-brand-accent-secondary transition">
            Share Your Leafylivation
          </button>
        </div>
      </div>
    </section>
  );
}
