import React, { lazy, Suspense } from 'react';

// Dynamic import for LiveShowsPage
const LiveShowsPage = lazy(() => import('../features/live/LiveShowsPage'));

// Loader component for LiveShowsPage with Suspense
const LiveShowsPageLoader = () => {
  return (
    <Suspense fallback={<div className="text-yellow-lotus text-2xl animate-pulse">Loading live shows...</div>}>
      <LiveShowsPage />
    </Suspense>
  );
};

export default LiveShowsPageLoader;
