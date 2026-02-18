import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ENDPOINTS } from '../api/config';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch History
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await client.get(ENDPOINTS.PLANTATION.HISTORY);
                setHistory(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Lock scroll when modal is open
    React.useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-[#2d4a22]">Loading History...</div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-2 w-full relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-6 font-outfit">

            {/* Header Section */}
            <div className="sticky top-[60px] sm:top-[72px] z-30 bg-[#fcfdfa]/80 backdrop-blur-sm py-1.5 mb-0.5 transition-all">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#2d4a22] shadow-[0_2px_8px_rgb(0,0,0,0.05)] hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
                        aria-label="Go back"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>
                    <div className="flex flex-col items-center justify-center text-center">
                        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d4a22] via-[#5c9b42] to-[#7fb55c]">Plantation History</span>
                        </h1>
                        <div className="inline-flex items-center gap-1 bg-[#f0fdf4] px-3 py-0.5 rounded-full border border-[#dcebd6] mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c]">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            <p className="text-[10px] sm:text-xs text-[#2d4a22] font-bold">Track contributions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="flex flex-col gap-3">
                {history.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">No plantations found. Start planting!</div>
                ) : (
                    history.map((item, index) => (
                        <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col gap-4">

                            {/* Upper Section: Details */}
                            <div className="flex gap-3 w-full">
                                {/* Serial Number */}
                                <div className="flex items-start justify-center shrink-0 pt-0.5">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#EAF5E5] text-[#2d4a22] font-black text-sm border border-[#dcebd6]">
                                        {index + 1}
                                    </span>
                                </div>

                                {/* Details / Info Column */}
                                <div className="flex-grow flex flex-col gap-2">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-[#2d4a22] leading-tight flex items-center gap-2 flex-wrap">
                                            {item.plantName}
                                            <span className={`inline-flex ${item.status === 'verified' ? 'bg-[#f0fdf4] text-[#7fb55c]' : item.status === 'pending' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'} text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'verified' ? 'border-[#dcebd6]' : item.status === 'pending' ? 'border-orange-100' : 'border-red-100'}`}>
                                                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                                            </span>
                                            {item.certificateId && (
                                                <span className="inline-flex bg-blue-50 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 gap-1 items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                                    Cert Issued
                                                </span>
                                            )}
                                        </h3>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">
                                            {item.category} • {item.date}
                                            {item.eventCode && <span className="text-[#7fb55c] ml-1.5">• Event: {item.eventCode}</span>}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                        <div className="flex items-start gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-xl w-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c] mt-0.5 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                            <span className="font-semibold leading-relaxed">{item.location}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {item.height && (
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c] shrink-0"><path d="M12 2v20M8 6l4-4 4 4" /></svg>
                                                    <span className="font-semibold">{item.height}</span>
                                                </div>
                                            )}
                                            {item.landOwnership && (
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c] shrink-0"><path d="M3 21h18M5 21V7l8-4 8 4v14" /></svg>
                                                    <span className="font-semibold">{item.landOwnership}</span>
                                                </div>
                                            )}
                                            {item.areaType && (
                                                <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-xl">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c] shrink-0"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                                                    <span className="font-semibold capitalize">{item.areaType}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {item.remark && (
                                        <p className="text-xs text-gray-400 italic bg-gray-50/50 p-2 rounded-lg border-l-2 border-[#dcebd6]">
                                            "{item.remark}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Bellow Section: Images Grid */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2 border-t border-gray-50 pt-4">
                                {item.images.site ? (
                                    <div
                                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 group/img bg-gray-50"
                                        onClick={() => setSelectedImage({ src: item.images.site, title: "Site Preparation Photo" })}
                                    >
                                        <img
                                            src={item.images.site}
                                            alt="Site Prep"
                                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                            onError={(e) => e.target.src = '/images/logo.png'}
                                        />
                                        <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors"></div>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-[2px] py-1 text-center">
                                            <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Site Prep</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-[10px]">No Image</div>
                                )}

                                {item.images.plantation ? (
                                    <div
                                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 group/img bg-gray-50"
                                        onClick={() => setSelectedImage({ src: item.images.plantation, title: "Plantation Photo" })}
                                    >
                                        <img
                                            src={item.images.plantation}
                                            alt="Plantation"
                                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                            onError={(e) => e.target.src = '/images/logo.png'}
                                        />
                                        <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors"></div>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-[2px] py-1 text-center">
                                            <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Plantation</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-[10px]">No Image</div>
                                )}

                                {item.images.selfie ? (
                                    <div
                                        className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-sm border border-gray-100 group/img bg-gray-50"
                                        onClick={() => setSelectedImage({ src: item.images.selfie, title: "Certificate Selfie" })}
                                    >
                                        <img
                                            src={item.images.selfie}
                                            alt="Selfie"
                                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                                            onError={(e) => e.target.src = '/images/logo.png'}
                                        />
                                        <div className="absolute top-2 right-2 bg-[#7fb55c] p-1 rounded-full shadow-lg z-10 animate-pulse">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/40 backdrop-blur-[2px] py-1 text-center">
                                            <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Selfie</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-[10px]">No Image</div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-2xl w-full flex flex-col items-center bg-white rounded-[2.5rem] p-2 shadow-2xl animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 sm:top-4 right-0 sm:right-4 w-10 h-10 rounded-full bg-white/20 sm:bg-gray-100 hover:bg-white/40 sm:hover:bg-gray-200 text-white sm:text-gray-500 flex items-center justify-center transition-all active:scale-95 z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                        </button>

                        <img
                            src={selectedImage.src}
                            alt={selectedImage.title}
                            className="w-full h-auto max-h-[80vh] object-contain rounded-[2rem]"
                        />
                        <div className="w-full py-4 flex justify-center">
                            <p className="text-[#2d4a22] font-black text-xs sm:text-sm tracking-widest uppercase bg-[#EAF5E5] px-6 py-2 rounded-full border border-[#dcebd6]">
                                {selectedImage.title}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
