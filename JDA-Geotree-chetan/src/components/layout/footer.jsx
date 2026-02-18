import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#fcfdfa]/90 backdrop-blur-md py-3 px-4 mt-auto border-t border-gray-100 font-outfit relative">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">

                {/* Brand & Dev Notice */}
                <div className="flex items-center gap-3">
                    <img
                        src="/geotree.png"
                        alt="Geotree Logo"
                        className="h-7 sm:h-9 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105 cursor-pointer"
                    />
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-1.5 bg-orange-50/80 border border-orange-100 px-2 py-0.5 rounded-full">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                        </span>
                        <p className="text-[8px] sm:text-[9px] font-black text-orange-700 uppercase tracking-wider whitespace-nowrap">
                            Test Version
                        </p>
                    </div>
                </div>

                {/* Developer Info */}
                <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Powered by</span>
                        <h4 className="text-xs sm:text-sm font-black text-[#1a2e15] tracking-tight whitespace-nowrap">
                            Geo Planet Solution Pvt. Ltd.
                        </h4>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-0.5">
                        Copyright © 2026 <span className="text-[#7fb55c]">GPSPL</span> • v1.0.4-beta
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
