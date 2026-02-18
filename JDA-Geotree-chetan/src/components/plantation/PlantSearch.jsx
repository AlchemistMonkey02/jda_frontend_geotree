import React, { useState, useEffect, useRef, useCallback } from 'react';
import client from '../../api/client';
import { ENDPOINTS } from '../../api/config';

const PlantSearch = ({ selectedPlant, onSelect, label = "Plant Name" }) => {
    const [inputValue, setInputValue] = useState(selectedPlant || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const wrapperRef = useRef(null);
    const listRef = useRef(null);
    const debounceTimer = useRef(null);

    // Initial load check
    useEffect(() => {
        if (selectedPlant !== inputValue) {
            setInputValue(selectedPlant || '');
        }
    }, [selectedPlant]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPlants = async (currentPage, query, append = false) => {
        if (loading) return;
        setLoading(true);
        try {
            // Assuming endpoint is mapped to /plants
            const response = await client.get('/plants', {
                params: {
                    page: currentPage,
                    limit: 10,
                    search: query
                }
            });

            const { plants, hasMore: moreAvailable } = response.data;

            if (append) {
                setSuggestions(prev => [...prev, ...plants]);
            } else {
                setSuggestions(plants);
            }

            setHasMore(moreAvailable);
        } catch (error) {
            console.error("Failed to fetch plants", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced Search
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setSearchQuery(value);
        setPage(1);
        setIsOpen(true);
        setHasMore(true);

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {
            fetchPlants(1, value, false);
        }, 500); // 500ms debounce
    };

    // Focus handler
    const handleFocus = () => {
        setIsOpen(true);
        if (suggestions.length === 0) {
            fetchPlants(1, searchQuery, false);
        }
    };

    // Scroll Handler for Infinite Scroll
    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPlants(nextPage, searchQuery, true);
        }
    };

    const handleSelect = (plant) => {
        setInputValue(plant.englishName);
        setIsOpen(false);
        if (onSelect) {
            onSelect(plant);
        }
    };

    return (
        <div ref={wrapperRef} className="col-span-2 relative">
            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder="Search plant..."
                    className="w-full bg-[#f8f9fa] rounded-lg py-2 px-3 text-xs font-semibold text-gray-700 outline-none focus:ring-1 focus:ring-[#7fb55c] border border-gray-100 placeholder-gray-400"
                />

                {/* Search Icon or Loading Spinner */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-[#7fb55c] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    )}
                </div>

                {/* Dropdown Results */}
                {isOpen && (
                    <div className="absolute z-[1010] w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto animate-fade-in-down" onScroll={handleScroll} ref={listRef}>
                        {/* Default or Search Results */}
                        {suggestions.length > 0 ? (
                            suggestions.map((plant, index) => (
                                <div
                                    key={`${plant.id}-${index}`}
                                    onClick={() => handleSelect(plant)}
                                    className="px-4 py-3 hover:bg-[#EAF5E5] cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex flex-col items-start"
                                >
                                    <span className="text-xs font-bold text-[#2d4a22]">{plant.englishName}</span>
                                    {(plant.hindiName || plant.scientificName) && (
                                        <span className="text-[10px] text-gray-500 font-medium">
                                            {plant.hindiName} • <em className="text-gray-400">{plant.scientificName}</em>
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            !loading && (
                                <div className="p-4 text-center text-xs text-gray-400 font-medium">
                                    No plants found
                                </div>
                            )
                        )}

                        {/* Loading Indicator at bottom */}
                        {loading && suggestions.length > 0 && (
                            <div className="p-2 text-center text-[10px] text-[#7fb55c] font-bold">
                                Loading more...
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlantSearch;
