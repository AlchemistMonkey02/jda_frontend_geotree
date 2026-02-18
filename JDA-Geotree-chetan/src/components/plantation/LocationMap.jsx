import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import client from '../../api/client';
import { useToast } from '../../context/ToastContext';

// Fix leafleft icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Black marker icon
const blackIcon = L.divIcon({
    html: `
        <div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="black" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3" fill="white"></circle>
            </svg>
        </div>
    `,
    className: 'custom-black-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

// Helper: Simple WKT MultiPolygon Parser
const parseWKT = (wkt) => {
    if (!wkt) return null;

    // Remove "MULTIPOLYGON" and outer parentheses
    const cleaned = wkt.replace('MULTIPOLYGON', '').trim();

    try {
        const polygons = [];
        // Match content inside the outermost usually (((...)))
        // We will match sets of coordinates separated by commas inside parens
        const coordSets = cleaned.match(/\(\(([^)]+)\)\)/g) || [];

        coordSets.forEach(set => {
            // Remove (( and ))
            const inner = set.replace(/\(\(/g, '').replace(/\)\)/g, '');
            const points = inner.split(',').map(pair => {
                const parts = pair.trim().split(/\s+/);
                if (parts.length >= 2) {
                    const lng = Number(parts[0]);
                    const lat = Number(parts[1]);
                    if (!isNaN(lat) && !isNaN(lng)) {
                        return [lat, lng]; // Leaflet expects [lat, lng]
                    }
                }
                return null;
            }).filter(p => p !== null); // Filter out any invalid points

            if (points.length > 0) {
                polygons.push(points);
            }
        });
        return polygons.length > 0 ? polygons : null;
    } catch (e) {
        console.error("WKT Parse Error", e);
        return null;
    }
};

const LocationMap = React.forwardRef(({ onLocationUpdate, initialPosition }, ref) => {
    const { showSuccess, showError } = useToast();
    const [position, setPosition] = useState(initialPosition || [26.9124, 75.7873]); // Default Jaipur
    const [loading, setLoading] = useState(false);
    const [addressDetails, setAddressDetails] = useState(null);
    const [boundary, setBoundary] = useState(null);
    const [permissionError, setPermissionError] = useState(false);

    // Expose refreshLocation method to parent via ref
    React.useImperativeHandle(ref, () => ({
        refreshLocation: () => {
            handleGetLocation();
        }
    }));

    const fetchAddressDetails = async (lat, lng) => {
        try {
            const response = await client.get(`/location/address-details`, {
                params: { lat, lon: lng }
            });

            const data = response.data;
            if (data && data.properties) {
                setAddressDetails(data.properties);
                if (onLocationUpdate) {
                    onLocationUpdate({ lat, lng, address: data.properties });
                }
            }

            if (data && data.geometry) {
                const polygonCoords = parseWKT(data.geometry);
                setBoundary(polygonCoords);
            }

        } catch (error) {
            console.error("Failed to fetch address details", error);
            // Don't show toast error for every move, just log it
        }
    };

    const handleGetLocation = useCallback(() => {
        setLoading(true);
        setPermissionError(false);

        if (!navigator.geolocation) {
            showError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPos = [latitude, longitude];
                setPosition(newPos);
                setLoading(false);
                fetchAddressDetails(latitude, longitude);
            },
            (err) => {
                console.error(err);
                setLoading(false);
                setPermissionError(true);
                if (err.code === 1) {
                    showError("Location permission denied. Please enable it.");
                } else {
                    showError("Unable to retrieve location.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [showError]);

    // Initial fetch if props allow auto-fetch or just center on initial
    useEffect(() => {
        if (initialPosition && initialPosition[0] !== 26.9124) {
            // If valid initial position passed, maybe fetch details for it?
            // For now, respect parent's data or wait for user action
        }
    }, [initialPosition]);

    return (
        <div className="flex flex-col gap-3 w-full animate-fade-in">
            <div className="relative w-full h-80 rounded-[20px] overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
                <MapContainer
                    center={position}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                    className="z-0"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />

                    <Marker position={position} icon={blackIcon}>
                        <Popup>
                            <div className="text-center">
                                <p className="font-bold text-[10px]">Current Location</p>
                                <p className="text-[9px]">{position[0].toFixed(5)}, {position[1].toFixed(5)}</p>
                            </div>
                        </Popup>
                    </Marker>

                    {boundary && (
                        <Polygon
                            positions={boundary}
                            pathOptions={{ color: '#00ff7f', fillColor: '#00ff7f', fillOpacity: 0.2, weight: 2 }}
                        />
                    )}

                    <RecenterMap center={position} />
                </MapContainer>

                {/* Overlays */}
                <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
                    <button
                        onClick={handleGetLocation}
                        className="w-10 h-10 bg-white rounded-xl shadow-lg text-black flex items-center justify-center hover:bg-[#EAF5E5] active:scale-90 transition-all duration-300 group"
                        title="Get Current Location"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-[#2d4a22] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[#7fb55c] transition-colors">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="22" y1="12" x2="18" y2="12"></line>
                                <line x1="6" y1="12" x2="2" y2="12"></line>
                                <line x1="12" y1="6" x2="12" y2="2"></line>
                                <line x1="12" y1="22" x2="12" y2="18"></line>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Status/Error Message Overlay */}
                {permissionError && (
                    <div className="absolute inset-x-4 top-4 bg-red-50/90 backdrop-blur-sm border border-red-200 p-3 rounded-xl z-[400] animate-fade-in-down flex items-center gap-3 shadow-sm">
                        <div className="p-2 bg-red-100 rounded-lg text-red-500 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-red-800">Location Access Denied</p>
                            <p className="text-[9px] text-red-600 font-medium leading-tight">Please enable location services in your browser settings to verify your site.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Address Details Card */}
            {addressDetails ? (
                <div className="bg-white rounded-[20px] p-4 shadow-sm border border-gray-100 animate-fade-in">
                    <div className="flex items-center gap-2 mb-3 border-b border-gray-50 pb-2">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-[#7fb55c]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <h3 className="text-xs font-black text-[#1a2e15] uppercase tracking-wide">Detected Location</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">District</span>
                            <span className="text-xs font-semibold text-gray-800">{addressDetails.dist_name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Block</span>
                            <span className="text-xs font-semibold text-gray-800">{addressDetails.block_name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Gram Panchayat</span>
                            <span className="text-xs font-semibold text-gray-800">{addressDetails.gp_name}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">Village</span>
                            <span className="text-xs font-semibold text-gray-800">{addressDetails.vllg_name}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-[20px] p-4 border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-center py-6">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-400">Tap the target icon on map to<br />detect your current location address.</p>
                </div>
            )}
        </div>
    );
});

export default LocationMap;
