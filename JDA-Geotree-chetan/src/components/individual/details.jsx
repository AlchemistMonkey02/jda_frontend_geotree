import React, { useState } from 'react';

const PlantDetails = () => {
    const [formData, setFormData] = useState({
        plantName: '',
        height: '',
        date: '',
        areaType: 'urban'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="bg-[#fcfdfa] rounded-[30px] p-5 sm:p-8 flex flex-col gap-6 w-full mt-6 shadow-sm border border-gray-100 relative">
            <h3 className="text-xl sm:text-2xl font-black text-[#2d4a22] text-center border-b-2 border-[#2d4a22]/10 pb-2 uppercase tracking-wider w-fit mx-auto px-4">Plant Details</h3>

            <div className="flex flex-col gap-5 w-full">
                {/* Plant Name Input */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="plantName" className="text-sm font-bold text-[#2d4a22] ml-1">Plant name<span className="text-red-500">*</span></label>
                    <div className="relative group">
                        <input
                            type="text"
                            id="plantName"
                            name="plantName"
                            value={formData.plantName}
                            onChange={handleChange}
                            className="w-full bg-[#EAF5E5] rounded-xl py-3 pl-4 pr-10 outline-none border border-[#7fb55c] focus:ring-2 focus:ring-[#7fb55c]/20 text-gray-800 font-medium placeholder-gray-400/70 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-[#7fb55c] transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Plant Height Input */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="height" className="text-sm font-bold text-[#2d4a22] ml-1">Plant height <span className="text-xs font-normal text-gray-500">(in feet)</span><span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full bg-[#EAF5E5] rounded-xl py-3 px-4 outline-none border border-[#7fb55c] focus:ring-2 focus:ring-[#7fb55c]/20 text-gray-800 font-medium placeholder-gray-400/70 transition-all appearance-none"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col opacity-50 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="-mt-1"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Plantation Date Input */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="date" className="text-sm font-bold text-[#2d4a22] ml-1">Plantation date<span className="text-red-500">*</span></label>
                        <div className="relative group">
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-[#EAF5E5] rounded-xl py-3 px-4 outline-none border border-[#7fb55c] focus:ring-2 focus:ring-[#7fb55c]/20 text-gray-800 font-medium placeholder-gray-400/70 transition-all"
                            />
                            {/* Custom calendar icon to replace browser default if needed, for now distinct border style matches */}
                        </div>
                    </div>
                </div>

                {/* Area Type Selection */}
                <div className="flex flex-col gap-2 mt-1">
                    <label className="text-sm font-bold text-[#2d4a22] ml-1">Area Type</label>
                    <div className="flex items-center gap-8 px-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.areaType === 'urban' ? 'border-[#7fb55c]' : 'border-gray-400 group-hover:border-[#7fb55c]'}`}>
                                {formData.areaType === 'urban' && <div className="w-2.5 h-2.5 rounded-full bg-[#7fb55c]"></div>}
                            </div>
                            <input
                                type="radio"
                                name="areaType"
                                value="urban"
                                checked={formData.areaType === 'urban'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <span className={`text-sm font-bold ${formData.areaType === 'urban' ? 'text-[#2d4a22]' : 'text-gray-600'}`}>Urban</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.areaType === 'rural' ? 'border-[#7fb55c]' : 'border-gray-400 group-hover:border-[#7fb55c]'}`}>
                                {formData.areaType === 'rural' && <div className="w-2.5 h-2.5 rounded-full bg-[#7fb55c]"></div>}
                            </div>
                            <input
                                type="radio"
                                name="areaType"
                                value="rural"
                                checked={formData.areaType === 'rural'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            <span className={`text-sm font-bold ${formData.areaType === 'rural' ? 'text-[#2d4a22]' : 'text-gray-600'}`}>Rural</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlantDetails;
