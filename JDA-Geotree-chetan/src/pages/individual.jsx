import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import client from '../api/client';
import { ENDPOINTS } from '../api/config';
import { useToast } from '../context/ToastContext';
import PlantSearch from '../components/plantation/PlantSearch';
import EventSearch from '../components/plantation/EventSearch';
import LocationMap from '../components/plantation/LocationMap';
import { resizeImage } from '../utils/imageUtils';

// Tree Data for Dropdowns
// Tree Data for Dropdowns (Now loaded from API, but keeping structure for reference if needed or as fallback)
// const TREE_DATA = [ ... ];

// Extract unique categories
// Extract unique categories (These might come from API too, but keeping static for now or could fetch)
const CATEGORIES = ['Medicinal', 'Religious', 'Shade', 'Fruit', 'Ornamental', 'Timber', 'Commercial', 'Decorative', 'Exotic', 'Other'];

// Height ranges removed, using dynamic input
// const HEIGHT_RANGES = [ ... ];

const IndividualPage = () => {
    const { showSuccess, showError } = useToast();
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
    const [image1Processing, setImage1Processing] = useState(false);
    const [image2Preview, setImage2Preview] = useState(null);
    const [image2File, setImage2File] = useState(null);
    const [image2Processing, setImage2Processing] = useState(false);
    const [selfieProcessing, setSelfieProcessing] = useState(false);

    const locationMapRef = useRef(null);

    // Location
    const [position, setPosition] = useState([26.817331, 75.818598]);
    const [addressString, setAddressString] = useState(''); // Store formatted address string

    // Details - Initialize with keys matching the form
    const [plantData, setPlantData] = useState({
        plantName: '',
        hindiName: '',
        scientificName: '',
        height: '',
        heightUnit: 'Feet', // Added unit state
        date: '',
        areaType: 'urban',
        category: '',
        eventCode: '',
        eventName: '' // Added to store event name for display/logic
    });

    // Ownership
    const [ownership, setOwnership] = useState('');

    // API State
    const [plantationId, setPlantationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [certName, setCertName] = useState('');
    const [events, setEvents] = useState([]);

    // Land Ownership Options
    const [ownershipOptions, setOwnershipOptions] = useState([]);
    const [loadingOwnership, setLoadingOwnership] = useState(false);

    useEffect(() => {
        const fetchOwnerships = async () => {
            setLoadingOwnership(true);
            try {
                const response = await client.get('/options/land-ownership');
                if (response.data.success) {
                    const sortedOptions = response.data.data.sort((a, b) => a.name.localeCompare(b.name));
                    setOwnershipOptions(sortedOptions);
                }
            } catch (error) {
                console.error("Failed to fetch ownership options", error);
            } finally {
                setLoadingOwnership(false);
            }
        };
        fetchOwnerships();
    }, []);

    // Event fetching is now handled by EventSearch component
    // useEffect(() => {
    //     const fetchEvents = async () => { ... };
    //     fetchEvents();
    // }, []);

    const handleHeightChange = (e) => {
        setPlantData(prev => ({ ...prev, height: e.target.value }));
    };

    const handleUnitChange = (e) => {
        const newUnit = e.target.value;
        setPlantData(prev => {
            let newHeight = prev.height;
            if (prev.height) {
                if (newUnit === 'Meter' && prev.heightUnit === 'Feet') {
                    newHeight = (parseFloat(prev.height) * 0.3048).toFixed(2);
                } else if (newUnit === 'Feet' && prev.heightUnit === 'Meter') {
                    newHeight = (parseFloat(prev.height) / 0.3048).toFixed(2);
                }
            }
            return { ...prev, height: newHeight, heightUnit: newUnit };
        });
    };

    const handlePlantSelect = (plant) => {
        setPlantData(prev => ({
            ...prev,
            plantName: plant.englishName,
            hindiName: plant.hindiName,
            scientificName: plant.scientificName,
            category: plant.category || 'Other'
        }));
    };

    const handleEventSelect = (event) => {
        setPlantData(prev => ({
            ...prev,
            eventCode: event.code,
            eventName: event.name
        }));
    };

    const handleImageUpload = async (e, setPreview, setFile, setProcessing) => {
        const file = e.target.files[0];
        if (file) {
            setProcessing(true);
            try {
                // Resize image like WhatsApp (max 1280px on longest side, 0.8 quality)
                const resizedFile = await resizeImage(file, 1280, 0.8);
                setFile(resizedFile);

                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                    setProcessing(false);
                };
                reader.readAsDataURL(resizedFile);

                // Refresh location on image capture/upload
                if (locationMapRef.current) {
                    locationMapRef.current.refreshLocation();
                }
            } catch (error) {
                console.error("Image processing failed", error);
                showError("Failed to process image");
                setFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                    setProcessing(false);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!plantData.plantName || !image1File || !image2File) {
            showError("Please fill all details and upload both photos.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('type', activeTab);
            if (activeTab === 'event') formData.append('eventCode', plantData.eventCode);
            formData.append('plantName', plantData.plantName);
            formData.append('category', plantData.category);
            formData.append('height', `${plantData.height} ${plantData.heightUnit}`); // Combine value and unit
            formData.append('areaType', plantData.areaType);
            formData.append('landOwnership', ownership);
            formData.append('lat', position[0]);
            formData.append('lng', position[1]);
            if (addressString) {
                formData.append('address', addressString);
            }
            formData.append('siteImage', image1File);
            formData.append('plantationImage', image2File);

            const response = await client.post(ENDPOINTS.PLANTATION.CREATE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setPlantationId(response.data.data._id);
                setIsModalOpen(true);
                setModalStep('selection');
                showSuccess('Plantation submitted successfully!');
            }
        } catch (error) {
            console.error(error);
            // Global interceptor handles error toast
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateCertificate = async () => {
        if (!selfieFile) {
            showError("Please upload a selfie for the certificate.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('plantationId', plantationId);
            formData.append('name', certName);
            // Append formatted address if available
            if (addressString) {
                formData.append('location', addressString);
            }
            formData.append('selfieImage', selfieFile);

            await client.post(ENDPOINTS.CERTIFICATE.GENERATE, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showSuccess('Certificate generated!');
            navigate('/my-certificates');
        } catch (error) {
            console.error(error);
            // Global interceptor handles error toast
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

    const handleSelfieChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelfieProcessing(true);
            try {
                // Resize selfie like WhatsApp
                const resizedFile = await resizeImage(file, 1280, 0.8);
                setSelfieFile(resizedFile);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelfiePreview(reader.result);
                    setSelfieProcessing(false);
                };
                reader.readAsDataURL(resizedFile);
            } catch (error) {
                console.error("Selfie processing failed", error);
                setSelfieFile(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setSelfiePreview(reader.result);
                    setSelfieProcessing(false);
                };
                reader.readAsDataURL(file);
            }
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

                {/* Event Selection Trigger (Visible only for Event Tab) */}
                {activeTab === 'event' && (
                    <EventSearch
                        selectedEvent={plantData.eventName}
                        onSelect={handleEventSelect}
                    />
                )}

                {/* A. Photos (Grid Layout) */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Photo 1: Site Prep */}
                    <div className="flex flex-col gap-1">
                        <input type="file" ref={fileInputRef1} onChange={(e) => handleImageUpload(e, setImage1Preview, setImage1File, setImage1Processing)} className="hidden" accept="image/*" />
                        <div onClick={() => !image1Processing && fileInputRef1.current.click()} className="bg-white rounded-xl border border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#7fb55c] hover:bg-green-50/30 transition-all relative overflow-hidden group shadow-sm">
                            {image1Preview ? (
                                <img src={image1Preview} alt="Site Prep" className={`absolute inset-0 w-full h-full object-cover ${image1Processing ? 'opacity-40 blur-[2px]' : ''}`} />
                            ) : (
                                <>
                                    <div className="w-16 h-16 mb-1 p-2 bg-green-50 rounded-full text-[#7fb55c] group-hover:scale-110 transition-transform flex items-center justify-center">
                                        <img src="/images/upload1.png" alt="" className="w-full h-full object-contain opacity-80" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-semibold text-center leading-tight px-2">Tap to upload<br />site digging</p>
                                </>
                            )}
                            {image1Processing && (
                                <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center gap-2">
                                    <div className="w-6 h-6 border-2 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[8px] font-black text-[#2d4a22] uppercase tracking-widest">Processing</span>
                                </div>
                            )}
                        </div>
                        <p className="text-center text-[9px] font-bold text-[#2d4a22] uppercase tracking-wide">1. Site Preparation</p>
                    </div>

                    {/* Photo 2: Plantation */}
                    <div className="flex flex-col gap-1">
                        <input type="file" ref={fileInputRef2} onChange={(e) => handleImageUpload(e, setImage2Preview, setImage2File, setImage2Processing)} className="hidden" accept="image/*" />
                        <div onClick={() => !image2Processing && fileInputRef2.current.click()} className="bg-white rounded-xl border border-dashed border-gray-300 aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-[#7fb55c] hover:bg-green-50/30 transition-all relative overflow-hidden group shadow-sm">
                            {image2Preview ? (
                                <img src={image2Preview} alt="Planting" className={`absolute inset-0 w-full h-full object-cover ${image2Processing ? 'opacity-40 blur-[2px]' : ''}`} />
                            ) : (
                                <>
                                    <div className="w-16 h-16 mb-1 p-2 bg-green-50 rounded-full text-[#7fb55c] group-hover:scale-110 transition-transform flex items-center justify-center">
                                        <img src="/images/upload2.png" alt="" className="w-full h-full object-contain opacity-80" />
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-semibold text-center leading-tight px-2">Tap to upload<br />plantation</p>
                                </>
                            )}
                            {image2Processing && (
                                <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center gap-2">
                                    <div className="w-6 h-6 border-2 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-[8px] font-black text-[#2d4a22] uppercase tracking-widest">Processing</span>
                                </div>
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

                    {/* Compact Map - Replaced with LocationMap */}
                    <div className="mt-1">
                        <LocationMap
                            ref={locationMapRef}
                            initialPosition={position}
                            onLocationUpdate={(data) => {
                                setPosition([data.lat, data.lng]);
                                // Format address from properties if available
                                if (data.address) {
                                    const { vllg_name, gp_name, block_name, dist_name } = data.address;
                                    const formatted = [vllg_name, gp_name, block_name, dist_name]
                                        .filter(Boolean)
                                        .join(', ');
                                    setAddressString(formatted);
                                    // console.log("New Address:", formatted);
                                }
                            }}
                        />
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Plant Name Dropdown */}
                        <div className="col-span-2">
                            <PlantSearch
                                selectedPlant={plantData.plantName}
                                onSelect={handlePlantSelect}
                            />
                            {plantData.plantName && (
                                <div className="mt-2 ml-1 flex flex-col gap-1">
                                    {plantData.hindiName && (
                                        <div className="flex items-center gap-1.5 px-2 py-1.5 bg-green-50/50 rounded-lg border border-green-100/50">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Hindi Name:</span>
                                            <span className="text-[10px] font-bold text-gray-700">{plantData.hindiName}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        {plantData.scientificName && (
                                            <div className="flex-1 flex flex-col px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Scientific Name</span>
                                                <span className="text-[10px] font-medium text-gray-600 italic leading-tight">{plantData.scientificName}</span>
                                            </div>
                                        )}
                                        {plantData.category && (
                                            <div className="flex-1 flex flex-col px-2 py-1 bg-blue-50/30 rounded-lg border border-blue-100/30">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Category</span>
                                                <span className="text-[10px] font-bold text-gray-700 leading-tight">{plantData.category}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="col-span-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Land Ownership</label>
                            <div className="relative">
                                <select
                                    value={ownership}
                                    onChange={(e) => setOwnership(e.target.value)}
                                    className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] appearance-none border border-gray-100 disabled:bg-gray-100 disabled:text-gray-400"
                                    disabled={loadingOwnership}
                                >
                                    <option value="">Select Type</option>
                                    {ownershipOptions.map((opt) => (
                                        <option key={opt.id} value={opt.name}>{opt.name}</option>
                                    ))}
                                    {!loadingOwnership && ownershipOptions.length === 0 && (
                                        <>
                                            <option value="Private">Private</option>
                                            <option value="Government">Government</option>
                                            <option value="Community">Community</option>
                                        </>
                                    )}
                                </select>
                                {loadingOwnership && (
                                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                                        <div className="w-3 h-3 border-2 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>

                        {/* Height Input with Unit Selection */}
                        <div className="col-span-2">
                            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">Height</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="number"
                                        name="height"
                                        value={plantData.height}
                                        onChange={handleHeightChange}
                                        placeholder="Enter Height"
                                        className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] border border-gray-100 placeholder-gray-400"
                                    />
                                </div>
                                <div className="relative w-1/3">
                                    <select
                                        name="heightUnit"
                                        value={plantData.heightUnit}
                                        onChange={handleUnitChange}
                                        className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] appearance-none border border-gray-100"
                                    >
                                        <option value="Feet">Feet</option>
                                        <option value="Meter">Meter</option>
                                    </select>
                                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Submit Action */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#2d4a22] text-white py-3 rounded-xl font-black text-base shadow-xl shadow-green-900/10 hover:bg-[#1a2e15] active:scale-95 transition-all mt-4 uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
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
                                            onClick={() => !selfieProcessing && selfieInputRef.current?.click()}
                                            className="relative border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-[#7fb55c] transition-all group active:scale-[0.98] overflow-hidden"
                                        >
                                            {selfiePreview ? (
                                                <img src={selfiePreview} alt="Selfie preview" className={`w-full h-32 object-cover rounded-lg ${selfieProcessing ? 'opacity-40 blur-[2px]' : ''}`} />
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#7fb55c] mb-2 transition-colors"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                                    <span className="text-xs text-gray-500 font-medium group-hover:text-[#7fb55c] transition-colors">Click to upload</span>
                                                </>
                                            )}
                                            {selfieProcessing && (
                                                <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center gap-2">
                                                    <div className="w-8 h-8 border-3 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-[10px] font-black text-[#2d4a22] uppercase tracking-widest">Processing Selfie</span>
                                                </div>
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
