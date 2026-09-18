import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <AppRoutes />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
