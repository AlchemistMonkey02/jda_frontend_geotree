import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-[70vh] items-center justify-center p-6 text-center animate-fade-in font-outfit">
            {/* Header Section (Internal) */}
            <div className="fixed top-[72px] inset-x-0 z-30 bg-white/80 backdrop-blur-sm py-3 px-4 sm:px-8 border-b border-gray-100 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#2d4a22] shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <h1 className="text-xl font-black text-[#2d4a22]">Notifications</h1>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            {/* Empty State Illustration */}
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-[#f0fdf4] flex items-center justify-center animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-[#EAF5E5] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7fb55c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                        </svg>
                    </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-400 border-4 border-white"></div>
            </div>

            <h2 className="text-2xl font-extrabold text-[#1a2e15] mb-2 tracking-tight">All caught up!</h2>
            <p className="text-gray-500 max-w-xs leading-relaxed font-medium">
                You don't have any new notifications at the moment. We'll let you know when something important happens.
            </p>

            <button
                onClick={() => navigate('/')}
                className="mt-10 py-3.5 px-8 rounded-2xl bg-[#2d4a22] text-white font-black text-sm hover:bg-[#1a2e15] active:scale-95 transition-all shadow-lg shadow-green-900/20 tracking-wide uppercase"
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default Notifications;
