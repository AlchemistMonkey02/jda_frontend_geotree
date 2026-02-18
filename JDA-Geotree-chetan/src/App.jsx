import React, { useEffect } from 'react';
import Header from './components/layout/header'
import Footer from './components/layout/footer'
import Home from './pages/Home'
import IndividualPage from './pages/individual'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyCertificates from './pages/MyCertificates'
import HistoryPage from './pages/History'
import Notifications from './pages/Notifications'
import OnboardingFlow from './components/onboarding/OnboardingFlow'
import Login from './components/auth/Login'
import SplashScreen from './components/SplashScreen'

import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import client from './api/client';

// Axios Interceptor Component to use Hooks
const AxiosInterceptor = () => {
  const { showError } = useToast();
  const { logout } = useAuth(); // Use logout from context

  useEffect(() => {
    const interceptor = client.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        if (error.response?.status === 401) {
          showError('Session expired. Please login again.');
          logout(); // Use context logout instead of direct localStorage/window.location
        } else if (error.response?.status === 500) {
          showError(`Server Error: ${message}`);
        } else {
          showError(message);
        }
        return Promise.reject(error);
      }
    );

    return () => client.interceptors.response.eject(interceptor);
  }, [showError, logout]);

  return null;
};

function AppContent() {
  const { currentScreen, completeOnboarding, finishSplash, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  if (currentScreen === 'ONBOARDING') {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  if (currentScreen === 'LOGIN') {
    return <Login />;
  }

  if (currentScreen === 'SPLASH') {
    return <SplashScreen onFinish={finishSplash} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col font-outfit bg-white">
      {/* Global Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-100"
        style={{ backgroundImage: "url('/images/app2bg.png')" }}
      ></div>

      <div className="relative z-10 flex flex-col min-h-screen w-full bg-transparent">
        <Header />
        <main className="flex-grow pt-[72px] pb-2 flex flex-col animate-fade-in">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/individual" element={<IndividualPage />} />
              <Route path="/my-certificates" element={<MyCertificates />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/notifications" element={<Notifications />} />
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
    <ToastProvider>
      <AuthProvider>
        <AxiosInterceptor />
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App;
