import React from 'react';
import Hero from '../components/Home/Hero';
import Individual from '../components/Home/Individual';
import Certificate from '../components/Home/Certificate';
import History from '../components/Home/History';
import Mapping from '../components/Home/Mapping';

const Home = () => {
    return (
        <div className="flex-grow flex flex-col justify-center   w-full font-outfit py-2 sm:py-0">

            {/* Hero Section - Always Visible */}
            <div className="w-full">
                <Hero />
            </div>

            {/* Cards Grid Section */}
            <div className="flex-grow grid grid-cols-2 grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-2 sm:gap-6 w-full pb-2">
                <div className="min-w-0">
                    <Individual />
                </div>
                <div className="min-w-0">
                    <Certificate />
                </div>
                <div className="min-w-0">
                    <History />
                </div>
                <div className="min-w-0">
                    <Mapping />
                </div>
            </div>

            {/* MIS Dashboard CTA Section */}
            <div className="w-full mt-2 sm:mt-4 mb-2">
                <a
                    href="https://jda.geotree.io/mis-portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full bg-white p-3 sm:p-4 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md hover:bg-[#fcfdfa] hover:scale-[1.01] active:scale-[0.99] transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#EAF5E5] flex items-center justify-center text-[#2d4a22] group-hover:bg-[#2d4a22] group-hover:text-white transition-all duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-xs sm:text-sm font-black text-[#1a2e15] uppercase tracking-wider">MIS Dashboard</h3>
                            <p className="text-[10px] font-bold text-gray-400">View real-time analytics & insights</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#7fb55c] group-hover:text-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M7 17l10-10M7 7h10v10" /></svg>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Home;
