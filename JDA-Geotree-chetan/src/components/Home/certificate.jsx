import React from 'react';
import { useNavigate } from 'react-router-dom';

const Certificate = () => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate('/my-certificates')}
            className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-3 sm:p-5 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300 min-h-[160px] sm:min-h-[240px] cursor-pointer group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#f0fdf4] rounded-bl-[30px] sm:rounded-bl-[40px] -mr-4 -mt-4 z-0"></div>

            <div className="flex-grow w-full flex items-center justify-center mb-2 z-10 relative">
                <img
                    src="/images/certificate.png"
                    alt="Certificate"
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                />
            </div>

            <div className="mt-auto flex items-end justify-between gap-1 sm:gap-2 z-10 relative pt-2">
                <h3 className="text-sm sm:text-lg font-bold text-[#1a2e15] leading-tight font-outfit max-w-[75%] sm:max-w-[70%]">
                    Certificate
                </h3>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#7fb55c] flex items-center justify-center text-white shadow-md group-hover:bg-[#6da04e] group-active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 translate-x-0.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Certificate;
