import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import client from '../api/client';
import { ENDPOINTS } from '../api/config';
import { useAuth } from '../context/AuthContext';

const MyCertificates = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedCert, setSelectedCert] = useState(null);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch Certificates
    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await client.get(ENDPOINTS.CERTIFICATE.MY_CERTIFICATES);
                setCertificates(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load certificates');
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handleDownload = async () => {
        const element = document.getElementById('certificate-download-area');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`Certificate-${selectedCert?.plantName || 'Plantation'}.pdf`);
        } catch (error) {
            console.error("Error generating certificate:", error);
            alert("Failed to download certificate. Please try again.");
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-[#2d4a22]">Loading Certificates...</div>;
    }

    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col gap-2 w-full relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-6 font-outfit">
            {/* ... (Header Section remains same) ... */}
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d4a22] via-[#5c9b42] to-[#7fb55c]">My Certificates</span>
                        </h1>
                        <div className="inline-flex items-center gap-1 bg-[#f0fdf4] px-3 py-0.5 rounded-full border border-[#dcebd6] mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c]">
                                <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                            </svg>
                            <p className="text-[10px] sm:text-xs text-[#2d4a22] font-bold">View & Download</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certificates List */}
            <div className="flex flex-col gap-2">
                {certificates.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">No certificates found. Create a plantation and generate one!</div>
                ) : (
                    certificates.map((cert) => (
                        <div key={cert.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative">

                            {/* Image at Right */}
                            <div className="absolute top-2 right-2 z-10">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shadow-sm border border-gray-100">
                                    <img
                                        src={cert.image}
                                        alt={cert.plantName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => e.target.src = '/images/jda.png'}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    <span className="absolute bottom-1 left-1 text-white text-[9px] font-bold bg-[#7fb55c] px-1.5 py-0.5 rounded-md shadow-sm">
                                        {cert.date}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="pr-24">
                                {/* Details Section */}
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-sm sm:text-base font-bold text-[#2d4a22] leading-tight">{cert.plantName}</h3>
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#7fb55c]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                        <span className="truncate max-w-[180px] sm:max-w-[250px] font-medium">{cert.location}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-mono">ID: {cert.certificateId}</p>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => setSelectedCert(cert)}
                                        className="py-1.5 px-3 rounded-lg bg-[#EAF5E5] text-[#2d4a22] font-bold text-xs hover:bg-[#dcebd6] active:scale-95 transition-all flex items-center justify-center gap-1.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                        View
                                    </button>
                                    <button
                                        onClick={() => setSelectedCert(cert)}
                                        className="py-1.5 px-3 rounded-lg bg-[#2d4a22] text-white font-bold text-xs hover:bg-[#1a2e15] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        Download
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* Modal using Portal */}
            {selectedCert && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#fcfdfa] rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh] animate-scale-up">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                            <div>
                                <h3 className="text-xl font-black text-[#2d4a22]">Certificate Preview</h3>
                                <p className="text-xs text-gray-400 font-bold tracking-wide uppercase">Ready for download</p>
                            </div>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                            </button>
                        </div>

                        {/* Certificate Content - Simulated */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 flex flex-col items-center justify-center">
                            <div id="certificate-download-area" className="w-full aspect-[1/1.414] sm:aspect-[1.414/1] bg-white border-[8px] border-[#2d4a22] p-6 relative shadow-xl flex flex-col items-center text-center justify-center gap-4 bg-[url('/images/pattern-bg.png')] bg-repeat">
                                <div className="absolute inset-0 border-2 border-[#7fb55c] m-1.5 pointer-events-none"></div>

                                <img src="/images/jda.png" alt="Logo" className="h-12 w-auto mb-1 opacity-90" />

                                <h1 className="text-2xl sm:text-3xl font-serif text-[#1a2e15] font-bold uppercase tracking-widest">Certificate</h1>
                                <p className="text-base font-serif text-[#7fb55c] italic -mt-1">of Plantation</p>

                                <p className="text-gray-500 mt-2 text-sm sm:text-base">This is to certify that</p>
                                <h2 className="text-xl sm:text-3xl font-cursive text-[#2d4a22] border-b-2 border-[#dcebd6] px-6 py-1 font-bold">
                                    {selectedCert.name || user?.name || "User"}
                                </h2>

                                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-1 max-w-[80%]">
                                    has successfully planted a <span className="font-bold text-[#1a2e15]">{selectedCert.plantName}</span> at <span className="font-bold text-[#1a2e15]">{selectedCert.location}</span> on {selectedCert.date}.
                                </p>

                                <div className="flex justify-between w-full mt-6 px-2 gap-4">
                                    <div className="flex flex-col items-center gap-1 w-1/2">
                                        <div className="w-full h-8 border-b border-gray-400"></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Commissioner, JDA</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 w-1/2">
                                        <div className="w-full h-8 border-b border-gray-400"></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Director, Geotree</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-2 right-3 text-[8px] text-gray-300 font-mono">
                                    ID: {selectedCert.certificateId}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 flex gap-3 justify-end bg-white z-10">
                            <button
                                className="flex-1 py-3.5 px-6 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
                                onClick={() => setSelectedCert(null)}
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDownload}
                                className="flex-[2] py-3.5 px-6 rounded-xl bg-[#2d4a22] text-white font-bold text-sm hover:bg-[#1a2e15] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MyCertificates;
