import React, { useState, useEffect, useRef } from 'react';
import client from '../../api/client';
import { ENDPOINTS } from '../../api/config';

const EventSearch = ({ selectedEvent, onSelect, label = "Select Event" }) => {
    const [inputValue, setInputValue] = useState(selectedEvent || '');
    const [allEvents, setAllEvents] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const wrapperRef = useRef(null);
    const fetchedRef = useRef(false);

    // Initial load check
    useEffect(() => {
        if (selectedEvent !== inputValue) {
            setInputValue(selectedEvent || '');
        }
    }, [selectedEvent]);

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

    const fetchEvents = async () => {
        if (loading || fetchedRef.current) return;
        setLoading(true);
        try {
            const response = await client.get(ENDPOINTS.EVENTS.GET_ALL);
            // Assuming response.data is an array of events based on controller
            setAllEvents(response.data);
            setSuggestions(response.data);
            fetchedRef.current = true;
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setIsOpen(true);

        if (!fetchedRef.current) {
            fetchEvents();
        }

        const filtered = allEvents.filter(event =>
            event.name.toLowerCase().includes(value.toLowerCase()) ||
            event.code.toLowerCase().includes(value.toLowerCase()) ||
            event.location.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
    };

    // Focus handler
    const handleFocus = () => {
        setIsOpen(true);
        if (!fetchedRef.current) {
            fetchEvents();
        } else {
            // Re-filter based on current input if already fetched
            const filtered = allEvents.filter(event =>
                event.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                event.code.toLowerCase().includes(inputValue.toLowerCase()) ||
                event.location.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
        }
    };

    const handleSelect = (event) => {
        setInputValue(event.name);
        setIsOpen(false);
        if (onSelect) {
            onSelect(event);
        }
    };

    return (
        <div ref={wrapperRef} className="col-span-2 relative animate-fade-in-down z-20">
            <label className="text-[9px] font-bold text-gray-400 uppercase ml-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder="Search event by name, code or location..."
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
            </div>
            {/* Dropdown Results */}
            {isOpen && (
                <div className="absolute z-[1010] w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-60 overflow-y-auto animate-fade-in-down">
                    {/* Results */}
                    {suggestions.length > 0 ? (
                        suggestions.map((event) => (
                            <div
                                key={event._id}
                                onClick={() => handleSelect(event)}
                                className="px-4 py-3 hover:bg-[#EAF5E5] cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex flex-col items-start"
                            >
                                <div className="flex justify-between w-full">
                                    <span className="text-xs font-bold text-[#2d4a22]">{event.name}</span>
                                    <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1 rounded">{event.code}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 border-l border-gray-200 pl-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                        {event.location}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && (
                            <div className="p-4 text-center text-xs text-gray-400 font-medium">
                                No events found
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default EventSearch;
