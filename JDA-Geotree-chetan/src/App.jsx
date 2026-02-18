import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import IndividualPage from './pages/Individual'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import MyCertificates from './pages/MyCertificates'
import HistoryPage from './pages/History'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import Login from './components/auth/Login'
import SplashScreen from './components/SplashScreen'

function AppContent() {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => {
      setShowOnboarding(false);
      setShowLogin(true);
    }} />;
  }

  if (showLogin) {
    return <Login onLogin={() => {
      setShowLogin(false);
      setShowSplash(true);
    }} />;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col font-outfit animate-fade-in bg-white">
      {/* Global Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-100"
        style={{ backgroundImage: "url('/images/app2bg.png')" }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen w-full bg-transparent">
        <Header />
        <main className="flex-grow pt-[72px] pb-2 flex flex-col">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/individual" element={<IndividualPage />} />
              <Route path="/my-certificates" element={<MyCertificates />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App;
