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
        </div>
    );
};

export default Home;
