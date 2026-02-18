import React from 'react';

const LegacyStep = ({ onNext }) => {
    return (
        <div className="h-[100dvh] w-full relative flex flex-col font-outfit overflow-hidden select-none bg-[#FBFCFB]" style={{ touchAction: 'none' }}>

            {/* 1. Illustration Layer (Behind the Wave) */}
            <div className="absolute top-12 left-0 mb-8 w-full h-[57%] z-0">
                <img
                    src="/images/legacy.png"
                    alt="Grow Your Legacy Illustration"
                    className="w-full h-full object-cover drop-shadow-xl animate-fade-in"
                />
            </div>

            {/* 2. Bottom Wave Background (Overlaps the Illustration bottom) */}
            <div className="absolute bottom-0 left-0 w-full h-[60%] z-10 pointer-events-none drop-shadow-[0_-5px_15px_rgba(255,255,255,0.3)]">
                <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path
                        fill="#1f3516"
                        fillOpacity="1"
                        d="M0,0 C360,110 1080,110 1440,0 V320 H0 Z"
                    />
                </svg>
            </div>

            {/* 3. Content Layer (Top-most) */}
            <div className="relative z-20 w-full h-full flex flex-col justify-between pointer-events-none">

                {/* Header Section */}
                <div className="pt-6 sm:pt-8 px-6 flex items-center w-full pointer-events-auto z-20">
                    <div className=" p-1.5  w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                        <img src="/images/jda.png" alt="JDA Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[#c0392b] font-bold text-xl sm:text-base md:text-lg leading-tight tracking-tight whitespace-nowrap">
                        Jaipur Development Authority
                    </span>
                </div>

                {/* Spacer to push bottom content down */}
                <div className="flex-1"></div>

                {/* Bottom Text Content */}
                <div className="flex flex-col items-center text-center px-8 pb-8 w-full pointer-events-auto">

                    {/* Title */}
                    <h2 className="text-white font-bold text-3xl tracking-wide drop-shadow-md mb-4">
                        Grow Your Legacy
                    </h2>

                    {/* Description */}
                    <p className="text-[#B0C0A0] text-sm font-medium leading-relaxed max-w-[280px] mb-14 tracking-wide opacity-90">
                        Track your trees, share your journey, and help make the planet healthier.
                    </p>

                    {/* Pagination Indicators - Bars (3rd active) */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-12 h-1.5 bg-[#4a6b46] rounded-full opacity-60"></div>
                        <div className="w-12 h-1.5 bg-[#4a6b46] rounded-full opacity-60"></div>
                        <div className="w-12 h-1.5 bg-[#E8EDDE] rounded-full opacity-100"></div>
                    </div>

                    {/* Get Started Button */}
                    <button
                        onClick={onNext}
                        className="w-full bg-[#E8EDDE] active:bg-white text-[#1f3516] font-bold text-xl py-4 rounded-xl shadow-xl transition-transform active:scale-95 hover:shadow-2xl"
                    >
                        Next
                    </button>
                </div>
            </div>

        </div>
    );
};

export default LegacyStep;
