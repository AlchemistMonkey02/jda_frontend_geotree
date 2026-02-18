import React from 'react';

const WelcomeStep = ({ onNext }) => {
    return (
        <div
            className="h-[100dvh] w-full relative flex flex-col font-outfit overflow-hidden select-none bg-[#D7E3D5]"
            style={{ touchAction: 'none' }}
        >

            {/* Bottom Background Image - The Dark Green Wave Area */}
            <img
                src="/images/halfpage1.png"
                alt="Background"
                className="absolute bottom-0 left-0 w-full h-[70%] sm:h-[75%] object-cover z-0 pointer-events-none"
            />

            {/* Main Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between pointer-events-none">

                {/* Header Section */}
                <div className="pt-6 sm:pt-8 px-6 flex items-center gap-3 w-full pointer-events-auto z-20">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                        <img src="/images/jda.png" alt="JDA Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[#c0392b] font-bold text-xl sm:text-base md:text-lg leading-tight tracking-tight whitespace-nowrap">
                        Jaipur Development Authority
                    </span>
                </div>

                {/* Central Illustration - Earth/People */}
                <div className="flex-1 flex items-center justify-center -mt-6 sm:-mt-8 min-h-0 relative w-full pointer-events-none">
                    <img
                        src="/images/welcome.png"
                        alt="Welcome Illustration"
                        className="w-[80%] sm:w-[85%] max-w-[360px] max-h-[45vh] object-contain drop-shadow-2xl z-10 animate-fade-in "
                    />
                </div>

                {/* Bottom Text Content */}
                <div className="flex flex-col items-center text-center px-6 pb-8 w-full pointer-events-auto">

                    {/* Headings */}
                    <div className="flex flex-col items-center mb-5">
                        <h2 className="text-white font-bold text-3xl tracking-wide drop-shadow-md ">
                            Welcome to
                        </h2>
                        <h1 className="text-[#99B66F] font-black text-5xl tracking-tight drop-shadow-lg ">
                            <span className="text-white decoration-white">Geo</span>Tree
                        </h1>
                    </div>

                    {/* Description */}
                    <p className="text-[#B0C0A0] text-sm font-medium leading-relaxed max-w-[300px] mb-8 tracking-wide opacity-90">
                        Join millions in growing a greener future. GeoTree is your secure, trusted platform for tree plantation, making it simple and accessible for everyone to contribute to a healthier planet.
                    </p>

                    {/* Pagination Indicators - Bars */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-12 h-1.5 bg-[#E8EDDE] rounded-full opacity-100"></div>
                        <div className="w-12 h-1.5 bg-[#4a6b46] rounded-full opacity-60"></div>
                        <div className="w-12 h-1.5 bg-[#4a6b46] rounded-full opacity-60"></div>
                    </div>

                    {/* Get Started Button */}
                    <button
                        onClick={onNext}
                        className="w-full bg-[#E8EDDE] active:bg-white text-[#1f3516] font-bold text-xl py-4 rounded-xl shadow-xl transition-transform active:scale-95 hover:shadow-2xl"
                    >
                        Get started
                    </button>
                </div>

            </div>
        </div>
    );
};

export default WelcomeStep;
