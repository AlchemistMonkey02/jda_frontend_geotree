import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS, getAuthHeaders } from '../../api/config';

const Header = () => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [userData, setUserData] = useState({
        name: "User",
        phone: "",
        email: "",
        role: "Member"
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.token) {
                    // Optimistically set from local storage first if available
                    setUserData(prev => ({
                        ...prev,
                        name: user.name || prev.name,
                        phone: user.mobileNumber || prev.phone,
                        email: user.email || prev.email,
                        role: user.role || prev.role
                    }));

                    const response = await axios.get(ENDPOINTS.AUTH.PROFILE, getAuthHeaders());
                    const { name, mobileNumber, email, role } = response.data;
                    setUserData({
                        name: name || "User",
                        phone: mobileNumber || "",
                        email: email || "Not provided",
                        role: role || "Member"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                // Optionally redirect to login if 401? For now just stay.
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex items-center justify-between gap-4">

                    {/* Logo & Branding Section */}
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <img
                            src="/images/jda.png"
                            alt="JDA Logo"
                            className="h-10 md:h-14 w-auto object-contain shrink-0"
                            onError={(e) => {
                                e.target.src = "/images/jda.png"; // Fallback
                            }}
                        />
                        <div className="flex flex-col justify-center leading-none">
                            <h1 className="text-[11px] sm:text-sm md:text-base font-extrabold uppercase tracking-wide leading-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a2e15] via-[#2d4a22] to-[#5c9b42]">Jaipur Development Authority</span>
                            </h1>
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#2d4a22] hidden xs:block whitespace-nowrap">
                                Urban Development and Housing
                            </span>
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-[#7fb55c] hidden sm:block whitespace-nowrap">
                                Government of Rajasthan
                            </span>
                        </div>
                    </div>

                    {/* Right Actions Section */}
                    <div className="flex items-center gap-3 md:gap-6 shrink-0">

                        {/* Notifications Button */}
                        <button
                            className="relative p-2.5 rounded-full bg-gray-50 hover:bg-[#EAF5E5] text-gray-500 hover:text-[#2d4a22] transition-all duration-300 hover:scale-105 active:scale-95 group"
                            aria-label="Notifications"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="group-hover:rotate-12 transition-transform duration-300"
                            >
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                            </svg>
                            <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 border-2 border-white rounded-full shadow-sm animate-pulse"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileModalOpen(true)}
                                className="flex items-center gap-2 p-1 pl-1 pr-1 rounded-full border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-[#7fb55c]/30 transition-all duration-300 active:scale-95 group"
                            >
                                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-[#EAF5E5] to-[#f0fdf4] border border-[#dcebd6] flex items-center justify-center overflow-hidden relative">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#2d4a22"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Profile Information Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20">
                    <div
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsProfileModalOpen(false)}
                    ></div>
                    <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
                        {/* Header Background */}
                        <div className="bg-gradient-to-br from-green-800 via-green-600 to-green-500 h-32 flex items-end justify-center pb-0 relative">
                            <div className="absolute top-4 right-4 focus:outline-none">
                                <button
                                    onClick={() => setIsProfileModalOpen(false)}
                                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shadow-xl translate-y-12 border-4 border-white overflow-hidden">
                                <div className="w-full h-full bg-green-50 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#1f6121ff"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="pt-16 pb-8 px-8 text-center">
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{userData.name}</h3>
                            <p className="text-green-600 font-medium text-sm mt-1 uppercase tracking-widest">{userData.role}</p>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-green-50 hover:border-green-100 transition-all duration-300">
                                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 text-green-500 group-hover:text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                                        <p className="text-gray-700 font-semibold">{userData.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group hover:bg-green-50 hover:border-green-100 transition-all duration-300">
                                    <div className="p-2.5 rounded-xl bg-white shadow-sm border border-gray-100 text-green-500 group-hover:text-green-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                                        <p className="text-gray-700 font-semibold">{userData.email || "—"}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
