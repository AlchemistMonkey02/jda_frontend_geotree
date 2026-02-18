import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issue in Leaflet + React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Tree Icon to match screenshot
const treeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684907.png', // A leaf/tree pin icon
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const LocationSection = () => {
    const [position, setPosition] = useState([26.817331, 75.818598]); // Coordinates from screenshot

    return (
        <div className="bg-[#EAF5E5] rounded-[40px] p-4 sm:p-8 flex flex-col gap-6 w-full mt-6 shadow-sm overflow-hidden">
            {/* Map Container */}
            <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-[32px] overflow-hidden border-4 border-white shadow-inner z-10">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    <Marker position={position} icon={treeIcon}>
                        <Popup className="custom-popup">
                            <div className="p-1">
                                <p className="font-bold text-gray-800 border-b border-gray-100 pb-1 mb-1">Details:</p>
                                <p className="text-[11px] text-gray-600">Latitude: {position[0]}</p>
                                <p className="text-[11px] text-gray-600">Longitude: {position[1]}</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>

                {/* Search/Locate Overlay Button on Map */}
                <div className="absolute bottom-4 right-4 z-[1000]">
                    <button
                        onClick={() => alert('Searching for location...')}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#7fb55c] hover:bg-gray-50 active:scale-95 transition-all cursor-pointer pointer-events-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row gap-3 sm:gap-6 w-full">
                <button
                    onClick={() => alert('Manual selection mode enabled')}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#7fb55c] text-white py-3 sm:py-4 rounded-2xl font-bold shadow-md hover:bg-[#6fa34d] transition-colors active:scale-95 text-xs sm:text-base whitespace-nowrap cursor-pointer pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" sm:width="22" sm:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    Select manually
                </button>
                <button
                    onClick={() => alert('Detecting current location...')}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#7fb55c] text-white py-3 sm:py-4 rounded-2xl font-bold shadow-md hover:bg-[#6fa34d] transition-colors active:scale-95 text-xs sm:text-base whitespace-nowrap cursor-pointer pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" sm:width="22" sm:height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    Current location
                </button>
            </div>
        </div>
    );
};

export default LocationSection;
