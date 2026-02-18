import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { ENDPOINTS, getMultipartHeaders } from '../api/config';

// Fix for default marker icon in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Tree Icon
const treeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684907.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Tree Data for Dropdowns
const TREE_DATA = [
    { "id": 1, "name": "Neem", "scientific_name": "Azadirachta indica", "category": "Medicinal" },
    { "id": 2, "name": "Peepal", "scientific_name": "Ficus religiosa", "category": "Religious" },
    { "id": 3, "name": "Banyan", "scientific_name": "Ficus benghalensis", "category": "Shade" },
    { "id": 4, "name": "Mango", "scientific_name": "Mangifera indica", "category": "Fruit" },
    { "id": 5, "name": "Ashoka", "scientific_name": "Saraca asoca", "category": "Ornamental" },
    { "id": 6, "name": "Gulmohar", "scientific_name": "Delonix regia", "category": "Ornamental" },
    { "id": 7, "name": "Teak", "scientific_name": "Tectona grandis", "category": "Timber" },
    { "id": 8, "name": "Sandalwood", "scientific_name": "Santalum album", "category": "Medicinal" },
    { "id": 9, "name": "Eucalyptus", "scientific_name": "Eucalyptus globulus", "category": "Commercial" },
    { "id": 10, "name": "Arjun", "scientific_name": "Terminalia arjuna", "category": "Medicinal" },
    { "id": 11, "name": "Jamun", "scientific_name": "Syzygium cumini", "category": "Fruit" },
    { "id": 12, "name": "Amla", "scientific_name": "Phyllanthus emblica", "category": "Medicinal" },
    { "id": 13, "name": "Kadamba", "scientific_name": "Neolamarckia cadamba", "category": "Shade" },
    { "id": 14, "name": "Coconut", "scientific_name": "Cocos nucifera", "category": "Fruit" },
    { "id": 15, "name": "Palm", "scientific_name": "Arecaceae", "category": "Decorative" },
    { "id": 16, "name": "Pine", "scientific_name": "Pinus", "category": "Timber" },
    { "id": 17, "name": "Oak", "scientific_name": "Quercus", "category": "Timber" },
    { "id": 18, "name": "Maple", "scientific_name": "Acer", "category": "Shade" },
    { "id": 19, "name": "Cherry Blossom", "scientific_name": "Prunus serrulata", "category": "Ornamental" },
    { "id": 20, "name": "Baobab", "scientific_name": "Adansonia", "category": "Exotic" }
];

// Extract unique categories
const CATEGORIES = [...new Set(TREE_DATA.map(tree => tree.category))];

const HEIGHT_RANGES = [
    "0 - 2 (Feet)",
    "3 - 4 (Feet)",
    "5 - 6 (Feet)",
    "6+ (Feet)"
];

const IndividualPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('individual');

    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState('selection'); // 'selection' or 'certificate'
    const [selfiePreview, setSelfiePreview] = useState(null);
    const [selfieFile, setSelfieFile] = useState(null);
    const selfieInputRef = React.useRef(null);

    // Form and File Ref State
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const [image1Preview, setImage1Preview] = useState(null);
    const [image1File, setImage1File] = useState(null);
    const [image2Preview, setImage2Preview] = useState(null);
    const [image2File, setImage2File] = useState(null);

    // Location
    const [position, setPosition] = useState([26.817331, 75.818598]);

    // Details - Initialize with keys matching the form
    const [plantData, setPlantData] = useState({
        plantName: '',
        height: '',
        date: '',
        areaType: 'urban',
        category: '', // Added category
        eventCode: '' // Added for Event tab
    });

    // Ownership
    const [ownership, setOwnership] = useState('');

    // API State
    const [plantationId, setPlantationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [certName, setCertName] = useState('');

    const handlePlantChange = (e) => {
        const { name, value } = e.target;
        setPlantData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-select category if plant name changes
            if (name === 'plantName') {
                const selectedTree = TREE_DATA.find(t => t.name === value);
                if (selectedTree) {
                    newData.category = selectedTree.category;
                }
            }
            return newData;
        });
    };

    const handleImageUpload = (e, setPreview, setFile) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!plantData.plantName || !image1File || !image2File) {
            alert("Please fill all details and upload both photos.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', activeTab);
            if (activeTab === 'event') formData.append('eventCode', plantData.eventCode);
            formData.append('plantName', plantData.plantName);
            formData.append('category', plantData.category);
            formData.append('height', plantData.height);
            formData.append('areaType', plantData.areaType);
            formData.append('landOwnership', ownership);
            formData.append('lat', position[0]);
            formData.append('lng', position[1]);
            formData.append('siteImage', image1File);
            formData.append('plantationImage', image2File);

            const response = await axios.post(ENDPOINTS.PLANTATION.CREATE, formData, getMultipartHeaders());

            if (response.data.success) {
                setPlantationId(response.data.data._id);
                setIsModalOpen(true);
                setModalStep('selection');
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to submit plantation.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCertificate = async () => {
        if (!selfieFile) {
            alert("Please upload a selfie for the certificate.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('plantationId', plantationId);
            formData.append('name', certName);
            formData.append('selfieImage', selfieFile);

            await axios.post(ENDPOINTS.CERTIFICATE.GENERATE, formData, getMultipartHeaders());

            navigate('/my-certificates');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to generate certificate.');
        } finally {
            setLoading(false);
        }
    }

    const handleDownloadClick = () => {
        setModalStep('certificate');
    };

    const handleSkip = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalStep('selection');
        setSelfiePreview(null);
        setSelfieFile(null);
    };

    const handleSelfieChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelfieFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelfiePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-full w-full relative max-w-lg mx-auto px-4 pb-6 font-outfit">

            {/* 1. Header Row (Sticky) */}
            <div className="flex items-center gap-4 py-2 sticky top-[60px] sm:top-[72px] bg-[#fcfdfa] z-40 transition-all">
                <button
                    onClick={() => navigate('/')}
                    className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2d4a22] shadow-sm hover:shadow-md active:scale-95 transition-all shrink-0"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="flex flex-col">
                    <h1 className="text-lg font-black text-[#1a2e15] leading-none">
                        {activeTab === 'individual' ? 'New Plantation' : 'Event Plantation'}
                    </h1>
                    <span className="text-[10px] font-semibold text-[#7fb55c]">Save Mother Earth</span>
                </div>
            </div>

            {/* 2. Tabs */}
            <div className="w-full bg-[#EAF5E5] rounded-xl p-1 flex items-center mb-2 shrink-0 transition-transform">
                <button
                    onClick={() => setActiveTab('individual')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'individual' ? 'bg-white text-[#2d4a22] shadow-sm' : 'text-[#2d4a22]/60 hover:text-[#2d4a22]'}`}
                >
                    Individual
                </button>
                <button
                    onClick={() => setActiveTab('event')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${activeTab === 'event' ? 'bg-white text-[#2d4a22] shadow-sm' : 'text-[#2d4a22]/60 hover:text-[#2d4a22]'}`}
                >
                    Event
                </button>
            </div>

            {/* 3. Main Form Content (Scrollable Area) */}
            <div className="flex flex-col gap-2 animate-fade-in">

                {/* Event Code Field (Visible only for Event Tab) */}
                {activeTab === 'event' && (
                    <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col gap-1.5 animate-fade-in-down">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Event Code / ID</label>
                        <input
                            type="text"
                            name="eventCode"
                            value={plantData.eventCode}
                            onChange={handlePlantChange}
                            placeholder="Enter Event Code"
                            className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-sm font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] transition-all border border-gray-100"
                        />
                    </div>
                )}

                {/* A. Photos (Grid Layout) */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Photo 1: Site Prep */}
                    <div className="flex flex-col gap-1">
                        <input type="file" ref={fileInputRef1} onChange={(e) => handleImageUpload(e, setImage1Preview, setImage1File)} className="hidden" accept="image/*" />
                        <div onClick={() => fileInputRef1.current.click()} className="bg-white rounded-xl border border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#7fb55c] hover:bg-green-50/30 transition-all relative overflow-hidden group shadow-sm">
                            {image1Preview ? (
                                <img src={image1Preview} alt="Site Prep" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 mb-1 p-2 bg-green-50 rounded-full text-[#7fb55c] group-hover:scale-110 transition-transform flex items-center justify-center">
                                        <img src="/images/upload1.png" alt="" className="w-full h-full object-contain opacity-80" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-semibold text-center leading-tight px-2">Tap to upload<br />site digging</p>
                                </>
                            )}
                        </div>
                        <p className="text-center text-[9px] font-bold text-[#2d4a22] uppercase tracking-wide">1. Site Preparation</p>
                    </div>

                    {/* Photo 2: Plantation */}
                    <div className="flex flex-col gap-1">
                        <input type="file" ref={fileInputRef2} onChange={(e) => handleImageUpload(e, setImage2Preview, setImage2File)} className="hidden" accept="image/*" />
                        <div onClick={() => fileInputRef2.current.click()} className="bg-white rounded-xl border border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#7fb55c] hover:bg-green-50/30 transition-all relative overflow-hidden group shadow-sm">
                            {image2Preview ? (
                                <img src={image2Preview} alt="Planting" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 mb-1 p-2 bg-green-50 rounded-full text-[#7fb55c] group-hover:scale-110 transition-transform flex items-center justify-center">
                                        <img src="/images/upload2.png" alt="" className="w-full h-full object-contain opacity-80" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-semibold text-center leading-tight px-2">Tap to upload<br />plantation</p>
                                </>
                            )}
                        </div>
                        <p className="text-center text-[9px] font-bold text-[#2d4a22] uppercase tracking-wide">2. Plantation</p>
                    </div>
                </div>

                {/* B. Details & Location (Consolidated Card) */}
                <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                    <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EAF5E5] text-[#2d4a22] text-[10px] font-bold">3</span>
                        <h3 className="text-xs font-black text-[#1a2e15] uppercase tracking-wide">Details & Location</h3>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Plant Name Dropdown */}
                        <div className="col-span-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Plant Name</label>
                            <div className="relative">
                                <select
                                    name="plantName"
                                    value={plantData.plantName}
                                    onChange={handlePlantChange}
                                    className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] appearance-none border border-gray-100 placeholder-gray-400"
                                >
                                    <option value="">Select Plant</option>
                                    {TREE_DATA.map(tree => (
                                        <option key={tree.id} value={tree.name}>{tree.name}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Plant Category Dropdown */}
                        <div className="col-span-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Plantation Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={plantData.category}
                                    onChange={handlePlantChange}
                                    className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] appearance-none border border-gray-100"
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Height Dropdown */}
                        <div className="col-span-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Height</label>
                            <div className="relative">
                                <select
                                    name="height"
                                    value={plantData.height}
                                    onChange={handlePlantChange}
                                    className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] appearance-none border border-gray-100"
                                >
                                    <option value="">Select Height</option>
                                    {HEIGHT_RANGES.map((range, index) => (
                                        <option key={index} value={range}>{range}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Land Ownership</label>
                            <div className="relative">
                                <select value={ownership} onChange={(e) => setOwnership(e.target.value)} className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] appearance-none border border-gray-100">
                                    <option value="">Select Type</option>
                                    <option value="Private">Private</option>
                                    <option value="Government">Government</option>
                                    <option value="Community">Community</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Compact Map */}
                    <div className="mt-1">
                        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                            <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                                <TileLayer attribution='&copy; Esri' url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                                <Marker position={position} icon={treeIcon}><Popup>Lat: {position[0]}, Long: {position[1]}</Popup></Marker>
                            </MapContainer>
                            <div className="absolute top-2 right-2 flex flex-col gap-2 z-[400]">
                                <button className="w-6 h-6 bg-white rounded-md shadow-md text-[#2d4a22] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                </button>
                            </div>
                            <button className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm text-[#2d4a22] text-[9px] font-bold flex items-center gap-1 z-[400] hover:bg-white active:scale-95 transition-all border border-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><location x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                Current Location
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit Action */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#2d4a22] text-white py-3 rounded-xl font-black text-base shadow-xl shadow-green-900/10 hover:bg-[#1a2e15] active:scale-95 transition-all mt-1 uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>

            {/* Modal Portal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#fcfdfa] rounded-[2rem] p-5 sm:p-8 w-[95%] sm:w-full max-w-md shadow-2xl relative flex flex-col gap-6 border border-white/50 animate-fade-in-up">
                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-all active:scale-95 z-10"
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>
                        {modalStep === 'selection' ? (
                            <>
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl sm:text-3xl font-black text-[#2d4a22]">Thank You!</h3>
                                    <p className="text-gray-600 font-medium text-sm sm:text-base">Your contribution creates a greener future.</p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button onClick={handleDownloadClick} className="w-full py-4 bg-[#2d4a22] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#233a1b] transition-all active:scale-95 flex items-center justify-center gap-2 group">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                        Get Your Certificate
                                    </button>
                                    <button onClick={handleSkip} className="w-full py-4 bg-white text-gray-500 rounded-2xl font-bold text-lg border-2 border-transparent hover:border-gray-100 hover:text-gray-700 transition-all active:scale-95">Skip</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-center space-y-1">
                                    <h3 className="text-xl sm:text-2xl font-black text-[#2d4a22]">Get Your Certificate</h3>
                                    <p className="text-sm text-gray-500 font-medium">Enter details to generate</p>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#2d4a22] ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={certName}
                                            onChange={(e) => setCertName(e.target.value)}
                                            placeholder="Enter Full Name"
                                            className="w-full bg-[#f0fdf4] rounded-xl py-3.5 px-4 outline-none border border-transparent focus:border-[#7fb55c] text-gray-700 text-base font-semibold placeholder-gray-400/80 transition-all shadow-inner"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#2d4a22] ml-1">Selfie with Plant</label>
                                        <input
                                            type="file"
                                            ref={selfieInputRef}
                                            onChange={handleSelfieChange}
                                            accept="image/*"
                                            capture="user"
                                            className="hidden"
                                        />
                                        <div
                                            onClick={() => selfieInputRef.current?.click()}
                                            className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#7fb55c] transition-all group active:scale-[0.98]"
                                        >
                                            {selfiePreview ? (
                                                <img src={selfiePreview} alt="Selfie preview" className="w-full h-32 object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#7fb55c] mb-2 transition-colors"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                                    <span className="text-xs text-gray-500 font-medium group-hover:text-[#7fb55c] transition-colors">Click to upload</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={handleGenerateCertificate} disabled={loading} className="w-full py-4 bg-[#7fb55c] text-white rounded-xl font-bold text-lg shadow-lg hover:bg-[#6da04e] hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all mt-2 disabled:opacity-70">
                                        {loading ? 'Generating...' : 'Generate & Download'}
                                    </button>
                                    <button onClick={() => setModalStep('selection')} className="text-xs sm:text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors pt-2">← Back to options</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default IndividualPage;
