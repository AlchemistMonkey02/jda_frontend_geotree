import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-[#EAF5E5] py-2 px-4 mt-auto border-t border-[#dcebd6]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-3 md:gap-4">

                {/* Left Section: Logo */}
                <div className="flex justify-center md:justify-start w-full">
                    <img
                        src="/geotree.png"
                        alt="Geotree Logo"
                        className="h-8 sm:h-12 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105"
                    />
                </div>

                {/* Center Section: Developer Info */}
                <div className="flex flex-col items-center text-center w-full gap-0">
                    <h4 className="text-[9px] sm:text-sm font-bold text-[#7fb55c] uppercase tracking-widest leading-tight">
                        Developed by
                    </h4>
                    <p className="text-[9px] sm:text-sm font-bold text-[#1a2e15] leading-relaxed max-w-md">
                        Geo Planet Solution Pvt. Ltd.
                    </p>
                    <p className="text-[8px] sm:text-xs font-semibold text-[#2d4a22]/60">
                        Copyright © 2026, GPSPL. <a href="#" className="hover:text-[#2d4a22] underline decoration-1 underline-offset-2 transition-colors">Privacy Policy</a>
                    </p>
                </div>

                {/* Right Section: Empty Spacer (Visible on desktop for balance) */}
                <div className="hidden md:block w-full"></div>
            </div>
        </footer>
    );
};

export default Footer;
