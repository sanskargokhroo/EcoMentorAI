// File: src/App.tsx — Main App component with routing and lazy loading

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Calculator = React.lazy(() => import('./pages/Calculator'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProductScanner = React.lazy(() => import('./pages/ProductScanner'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* SECURITY/A11Y: Skip to main content link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Dark mode background wrapper */}
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        
        {/* A11Y: main element to signify main content */}
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<div aria-live="polite" className="text-center p-8 dark:text-white">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/calculate" element={<Calculator />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scanner" element={<ProductScanner />} />
            </Routes>
          </Suspense>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
