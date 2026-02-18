import React from 'react';

const Hero = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full py-2 md:py-8 text-center gap-2 md:gap-8 bg-white overflow-hidden mb-2">
            {/* Main Heading */}
            <h1 className="text-lg sm:text-3xl md:text-5xl font-bold text-[#1a2e15] leading-tight tracking-wide font-outfit max-w-6xl mx-auto px-4">
                Help Us To <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d4a22] via-[#5c9b42] to-[#7fb55c]">Save Our Mother Earth</span>
            </h1>

            {/* Decorative Background Elements (Optional aesthetic touch) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-green-100 rounded-full blur-3xl mix-blend-multiply filter opacity-70"></div>
                <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-yellow-100 rounded-full blur-3xl mix-blend-multiply filter opacity-70"></div>
            </div>
        </div>
    );
};

export default Hero;
