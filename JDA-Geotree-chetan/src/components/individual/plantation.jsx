import React, { useRef, useState } from 'react';
import { resizeImage } from '../../utils/imageUtils';

const PlantationUpload = () => {
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [processing1, setProcessing1] = useState(false);
    const [processing2, setProcessing2] = useState(false);

    const handleUploadClick = (ref) => {
        ref.current.click();
    };

    const handleFileChange = async (e, setImage, setProcessing) => {
        const file = e.target.files[0];
        if (file) {
            setProcessing(true);
            try {
                const resizedFile = await resizeImage(file, 1280, 0.8);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                    setProcessing(false);
                };
                reader.readAsDataURL(resizedFile);
            } catch (error) {
                console.error("Image processing failed", error);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                    setProcessing(false);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // ... (imports remain same)

    return (
        <div className="bg-[#EAF5E5] rounded-[40px] p-4 sm:p-8 flex flex-row gap-4 sm:gap-8 w-full overflow-hidden">
            {/* Box 1: Site Preparation */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <input
                    type="file"
                    ref={fileInputRef1}
                    onChange={(e) => handleFileChange(e, setImage1, setProcessing1)}
                    className="hidden"
                    accept="image/*"
                />
                <div
                    onClick={() => !processing1 && handleUploadClick(fileInputRef1)}
                    className="bg-white rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm border border-white/50 aspect-[4/5] sm:aspect-auto sm:min-h-[300px] cursor-pointer group hover:bg-gray-50 transition-all relative overflow-hidden"
                >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center overflow-hidden rounded-2xl relative">
                        {image1 ? (
                            <img src={image1} alt="Preview" className={`w-full h-full object-cover ${processing1 ? 'opacity-40 blur-[2px]' : ''}`} />
                        ) : (
                            <img
                                src="/images/upload1.png"
                                alt="Site Preparation"
                                className={`w-full h-auto object-contain scale-110 group-hover:scale-125 transition-transform duration-300 ${processing1 ? 'opacity-40 blur-[2px]' : ''}`}
                            />
                        )}
                    </div>
                    {processing1 && (
                        <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-3 z-20">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] sm:text-xs font-black text-[#2d4a22] uppercase tracking-widest">Processing</span>
                        </div>
                    )}
                    <p className="text-gray-400 text-[10px] sm:text-sm font-medium leading-tight">
                        {image1 ? "Image selected" : "Click to capture or upload"}
                    </p>
                    <button disabled={processing1} className="flex items-center justify-center gap-2 bg-[#7fb55c] text-white w-full sm:w-auto px-4 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-Base font-bold shadow-md group-hover:bg-[#6fa34d] transition-all active:scale-95 whitespace-nowrap mt-auto disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="truncate">{image1 ? "Change Photo" : "Upload Photo"}</span>
                    </button>
                </div>

                <div className="flex flex-col gap-1 px-1">
                    <div className="flex items-start gap-1.5 text-[#2d4a22]/80 text-[10px] sm:text-sm font-semibold leading-tight justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        <p className="text-center">Upload photo while digging</p>
                    </div>
                    <h3 className="text-sm sm:text-xl font-black text-[#2d4a22] text-center leading-tight tracking-tight mt-1">
                        Site Preparation<br />Photo
                    </h3>
                </div>
            </div>

            {/* Box 2: Plantation Completed */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                <input
                    type="file"
                    ref={fileInputRef2}
                    onChange={(e) => handleFileChange(e, setImage2, setProcessing2)}
                    className="hidden"
                    accept="image/*"
                />
                <div
                    onClick={() => !processing2 && handleUploadClick(fileInputRef2)}
                    className="bg-white rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm border border-white/50 aspect-[4/5] sm:aspect-auto sm:min-h-[300px] cursor-pointer group hover:bg-gray-50 transition-all relative overflow-hidden"
                >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center overflow-hidden rounded-2xl relative">
                        {image2 ? (
                            <img src={image2} alt="Preview" className={`w-full h-full object-cover ${processing2 ? 'opacity-40 blur-[2px]' : ''}`} />
                        ) : (
                            <img
                                src="/images/upload2.png"
                                alt="Plantation Photo"
                                className={`w-full h-auto object-contain scale-110 group-hover:scale-125 transition-transform duration-300 ${processing2 ? 'opacity-40 blur-[2px]' : ''}`}
                            />
                        )}
                    </div>
                    {processing2 && (
                        <div className="absolute inset-0 bg-white/40 flex flex-col items-center justify-center gap-3 z-20">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-[10px] sm:text-xs font-black text-[#2d4a22] uppercase tracking-widest">Processing</span>
                        </div>
                    )}
                    <p className="text-gray-400 text-[10px] sm:text-sm font-medium leading-tight">
                        {image2 ? "Image selected" : "Click to capture or upload"}
                    </p>
                    <button disabled={processing2} className="flex items-center justify-center gap-2 bg-[#7fb55c] text-white w-full sm:w-auto px-4 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs sm:text-base font-bold shadow-md group-hover:bg-[#6fa34d] transition-all active:scale-95 whitespace-nowrap mt-auto disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span className="truncate">{image2 ? "Change Photo" : "Upload Photo"}</span>
                    </button>
                </div>

                <div className="flex flex-col gap-1 px-1">
                    <div className="flex items-start gap-1.5 text-[#2d4a22]/80 text-[10px] sm:text-sm font-semibold leading-tight justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                        <p className="text-center">Upload photo after planting</p>
                    </div>
                    <h3 className="text-sm sm:text-xl font-black text-[#2d4a22] text-center leading-tight tracking-tight mt-1">
                        Plantation<br />Photo
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default PlantationUpload;
