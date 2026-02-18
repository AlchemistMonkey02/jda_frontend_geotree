import React, { useState } from 'react';

const LandOwnership = () => {
    const [ownership, setOwnership] = useState('');

    return (
        <div className="bg-[#EAF5E5] rounded-[40px] p-4 sm:p-8 flex flex-col gap-6 w-full mt-6 shadow-sm">
            <div className="flex flex-col gap-2">
                <label htmlFor="ownership" className="text-sm font-semibold text-[#2d4a22] ml-1">Land Ownership</label>
                <div className="relative">
                    <select
                        id="ownership"
                        value={ownership}
                        onChange={(e) => setOwnership(e.target.value)}
                        className="w-full bg-white rounded-2xl py-3 px-4 outline-none border border-transparent focus:border-[#7fb55c] text-gray-700 shadow-sm appearance-none transition-all cursor-pointer"
                    >
                        <option value="">Select Ownership Type</option>
                        <option value="Private">Private</option>
                        <option value="Government">Government</option>
                        <option value="Community">Community</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandOwnership;
