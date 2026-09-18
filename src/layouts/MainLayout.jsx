import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FreeTrialTopBar from '../components/FreeTrialTopBar';
import { Toaster } from 'react-hot-toast';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isCoachApp = location.pathname.startsWith('/dashboard/coach');
  // Keep case workspace viewport locked so header density stays consistent across all tabs.
  const isCoachCase = /\/dashboard\/coach\/cases\/[^/]+/.test(location.pathname);
  const lockCoachViewport = isCoachCase;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        lockCoachViewport ? 'h-dvh max-h-dvh overflow-hidden' : ''
      }`}
    >
      <Toaster position="top-right" />
      <div className="shrink-0">
        <FreeTrialTopBar />
        <Navbar />
      </div>
      <main
        className={`flex-grow min-h-0 ${
          lockCoachViewport ? 'overflow-hidden flex flex-col' : ''
        }`}
      >
        {children}
      </main>
      {!isCoachApp && <Footer />}
    </div>
  );
};

export default MainLayout;
