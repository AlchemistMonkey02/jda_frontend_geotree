import React, { useState } from 'react';

const EventDetails = () => {
    const [orgType, setOrgType] = useState('Private');
    const [landArea, setLandArea] = useState(0);

    return (
        <div className="bg-[#EAF5E5] rounded-[40px] p-6 sm:p-10 flex flex-col gap-8 w-full mt-6 shadow-sm border border-white/40">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2d4a22] text-center uppercase tracking-wider underline underline-offset-8">
                Event Details
            </h2>

            <div className="flex flex-col gap-6">
                {/* Event Type and Select Event Row */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xl font-bold text-[#2d4a22]">Event type</label>
                        <div className="relative">
                            <select className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4 focus:outline-none appearance-none text-[#2d4a22] font-semibold">
                                <option>Select event type</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2d4a22]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xl font-bold text-[#2d4a22]">Select event</label>
                        <div className="relative">
                            <select className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4 focus:outline-none appearance-none text-[#2d4a22] font-semibold">
                                <option>Choose an event</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2d4a22]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Land Ownership and Area Row */}
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xl font-bold text-[#2d4a22]">Land ownership</label>
                        <div className="relative">
                            <select className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4 focus:outline-none appearance-none text-[#2d4a22] font-semibold">
                                <option>Select ownership</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#2d4a22]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xl font-bold text-[#2d4a22]">Area of land <span className="text-sm font-medium">(in hectares)</span></label>
                        <div className="relative">
                            <input
                                type="number"
                                value={landArea}
                                onChange={(e) => setLandArea(e.target.value)}
                                className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4 focus:outline-none text-[#2d4a22] font-semibold"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col text-[#2d4a22]">
                                <button onClick={() => setLandArea(prev => Number(prev) + 1)} className="hover:scale-110 transition-transform">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="18 15 12 9 6 15" /></svg>
                                </button>
                                <button onClick={() => setLandArea(prev => Math.max(0, Number(prev) - 1))} className="hover:scale-110 transition-transform">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="6 9 12 15 18 9" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Organisation Type Selection */}
                <div className="flex flex-col gap-4 mt-2">
                    <label className="text-2xl font-black text-[#2d4a22]">
                        Organisation Type
                    </label>
                    <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                        {['Private', 'Government', 'NGO'].map(type => (
                            <button
                                key={type}
                                onClick={() => setOrgType(type)}
                                className="flex items-center gap-3 cursor-pointer outline-none group"
                            >
                                <div className={`w-5 h-5 rounded-full border-2 border-[#2d4a22] flex items-center justify-center transition-all ${orgType === type ? 'bg-[#2d4a22]' : 'bg-transparent'}`}>
                                    {orgType === type && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <span className={`text-lg font-bold transition-colors ${orgType === type ? 'text-[#2d4a22]' : 'text-[#2d4a22]/50'}`}>
                                    {type}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
