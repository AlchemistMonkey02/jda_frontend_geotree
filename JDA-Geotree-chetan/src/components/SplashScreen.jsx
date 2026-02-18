import React, { useEffect } from 'react';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#E8EDDE] bg-cover bg-center bg-no-repeat transition-opacity duration-700"
        // style={{ backgroundImage: "url('/images/login bg.png')" }}
        >
            <div className="flex flex-col items-center justify-center gap-2 animate-fade-in-up">

                {/* Central Video/GIF */}
                <div className="relative">
                    <video
                        src="/images/Fallen tree and wind.webm"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-72 h-72 sm:w-96 sm:h-96 object-contain drop-shadow-xl relative z-10"
                    />
                </div>

                {/* Tagline Description */}
                <div className="flex flex-col items-center text-center px-6 max-w-lg mt-4">
                    <p className="text-[#2d4a22] font-bold text-xl sm:text-2xl tracking-wide leading-relaxed">
                        Plant a tree and help us to<br />
                        cure our planet. Join us in<br />
                        growing a greener future.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default SplashScreen;