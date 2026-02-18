import React, { useState } from 'react';

const EventPlantationDetails = () => {
    const [areaType, setAreaType] = useState('Urban');
    const [height, setHeight] = useState(0);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    return (
        <div className="bg-[#EAF5E5] rounded-[40px] p-6 sm:p-10 flex flex-col gap-8 w-full mt-6 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2d4a22] text-center uppercase tracking-wider underline underline-offset-8">
                Plantation Details
            </h2>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-xl sm:text-2xl font-bold text-[#2d4a22]">Plant name</label>
                    <div className="relative">
                        <input type="text" className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4 focus:outline-none" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 text-[#2d4a22]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xl sm:text-2xl font-bold text-[#2d4a22]">Plant height (in feet)</label>
                        <div className="relative">
                            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col text-[#2d4a22]">
                                <button onClick={() => setHeight(prev => prev + 1)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" /></svg></button>
                                <button onClick={() => setHeight(prev => Math.max(0, prev - 1))}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg></button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="text-xl sm:text-2xl font-bold text-[#2d4a22]">Plantation date</label>
                        <div className="relative">
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent border-2 border-[#2d4a22] rounded-2xl py-3 px-4" />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2d4a22] pointer-events-none">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <label className="text-xl font-bold text-[#2d4a22]">Area Type</label>
                    <div className="flex gap-10">
                        {['Urban', 'Rural'].map(type => (
                            <button key={type} onClick={() => setAreaType(type)} className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-full border-2 border-[#2d4a22] ${areaType === type ? 'bg-[#2d4a22]' : 'bg-transparent'}`} />
                                <span className="font-bold text-[#2d4a22]">{type}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPlantationDetails;
