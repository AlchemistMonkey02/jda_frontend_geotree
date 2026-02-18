import React from 'react';

const EaseStep = ({ onNext }) => {
    return (
        <div className="h-[100dvh] w-full relative flex flex-col font-outfit overflow-hidden select-none bg-[#E6FFD6]" style={{ touchAction: 'none' }}>

            {/* Bottom Background Image - The Dark Green Wave Area */}
            <img
                src="/images/Vector 1.png"
                alt="Background"
                className="absolute bottom-0 left-0 w-full h-[70%] sm:h-[75%] object-cover z-0 pointer-events-none"
            />

            {/* Content Layer (Empty for now/To be added) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">

                {/* Header Section */}
                <div className="pt-6 sm:pt-8 px-6 flex items-center w-full pointer-events-auto z-20">
                    <div className=" p-1.5  w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                        <img src="/images/jda.png" alt="JDA Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[#c0392b] font-bold text-xl sm:text-base md:text-lg leading-tight tracking-tight whitespace-nowrap">
                        Jaipur Development Authority
                    </span>
                </div>

                {/* Central Illustration */}
                <div className="flex-1 flex items-center justify-center -mt-8 relative w-full pointer-events-none">
                    <img
                        src="/images/ease.png"
                        alt="Plant with Ease Illustration"
                        className="w-[85%] max-w-[340px] object-contain drop-shadow-2xl z-10 animate-fade-in"
                    />
                </div>

                {/* Bottom Text Content */}
                <div className="flex flex-col items-center text-center px-4 pb-8 w-full pointer-events-auto">

                    {/* Title */}
                    <h2 className="text-white font-bold text-3xl tracking-wide drop-shadow-md mb-6">
                        Plant with Ease
                    </h2>

                    {/* Description */}
                    <p className="text-[#B0C0A0] text-sm font-medium leading-relaxed max-w-[280px] mb-14 tracking-wide opacity-90">
                        Secure, simple, and transparent tree plantation—right from your phone.
                    </p>

                    {/* Pagination Indicators - Bars (Middle styling active) */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-12 h-1.5 bg-[#4a6b46] rounded-full opacity-60"></div>
                        <div className="w-12 h-1.5 bg-[#E8EDDE] rounded-full opacity-100"></div>
                        <div className="w-12 h-1.5 bg-[#4a6b46] rounded-full opacity-60"></div>
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

export default EaseStep;
