import React, { useState, useEffect } from 'react';
import CallDonorButton from '../../components/CallDonorButton';
import {
    MapPin,
    Search,
    ShieldCheck,
    Clock,
    AlertTriangle,
    Building2,
    RotateCcw,
    Droplet,
    UserX,
    FileQuestion
} from 'lucide-react';
import { getBloodRequests, fetchDonors } from '../../services/api';

function FindDonors() {
    const [selectedTab, setSelectedTab] = useState('donors');

    // Input form field states
    const [bloodGroup, setBloodGroup] = useState('');
    const [location, setLocation] = useState('');

    // Applied filter states (used to synchronously filter both tabs on Submit)
    const [appliedFilters, setAppliedFilters] = useState({ bloodGroup: '', location: '' });

    // Live database states
    const [donors, setDonors] = useState([]);
    const [liveRequests, setLiveRequests] = useState([]);
    const [loadingDonors, setLoadingDonors] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);

    // Fetch live emergency requests from MongoDB
    const loadRequests = async () => {
        try {
            const response = await getBloodRequests();
            setLiveRequests(response.data || []);
        } catch (err) {
            console.error("Error fetching live requests:", err);
        } finally {
            setLoadingRequests(false);
        }
    };

    // Fetch live donors from MongoDB
    const loadDonors = async (filters = appliedFilters) => {
        setLoadingDonors(true);
        try {
            const params = {};
            if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
            if (filters.location?.trim()) params.location = filters.location.trim();

            const response = await fetchDonors(params);
            setDonors(response.data || []);
        } catch (err) {
            console.error("Error fetching live donors:", err);
        } finally {
            setLoadingDonors(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadDonors({ bloodGroup: '', location: '' });
        loadRequests();

        const handleNewRequest = (event) => {
            if (event.detail && (event.detail._id || event.detail.patientName)) {
                setLiveRequests((prev) => [event.detail, ...prev]);
            } else {
                loadRequests();
            }
            setSelectedTab('requests');
        };

        window.addEventListener('bloodRequestPosted', handleNewRequest);

        return () => {
            window.removeEventListener('bloodRequestPosted', handleNewRequest);
        };
    }, []);

    const handleApplyFilters = (e) => {
        e.preventDefault();
        const nextFilters = { bloodGroup, location: location.trim() };
        setAppliedFilters(nextFilters);
        loadDonors(nextFilters);
    };

    const handleResetFilters = () => {
        setBloodGroup('');
        setLocation('');
        const resetFilters = { bloodGroup: '', location: '' };
        setAppliedFilters(resetFilters);
        loadDonors(resetFilters);
    };

    // Filter requests in-memory synchronously based on APPLIED filters
    const filteredRequests = liveRequests.filter((req) => {
        const matchesBlood = appliedFilters.bloodGroup
            ? req.bloodGroup === appliedFilters.bloodGroup
            : true;
        const matchesLocation = appliedFilters.location
            ? (req.location?.toLowerCase().includes(appliedFilters.location.toLowerCase()) ||
                req.hospitalName?.toLowerCase().includes(appliedFilters.location.toLowerCase()))
            : true;
        return matchesBlood && matchesLocation;
    });

    const hasActiveFilters = Boolean(appliedFilters.bloodGroup || appliedFilters.location);

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">

            {/* Header & Directory Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Donor & Emergency Directory</h1>
                    <p className="text-xs text-zinc-400 mt-1">
                        Search real-time available donors and active emergency requests
                    </p>
                </div>

                <div className="bg-[#18181c] p-1 rounded-xl border border-zinc-800/80 inline-flex items-center self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setSelectedTab('donors')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${selectedTab === 'donors'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Available Donors ({donors.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedTab('requests')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${selectedTab === 'requests'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Emergency Requests ({filteredRequests.length})
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <form onSubmit={handleApplyFilters} className="bg-[#18181c] border border-zinc-800/90 rounded-2xl p-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5">
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Blood Group</label>
                        <select
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            className="w-full bg-[#111115] border border-zinc-700/80 text-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500"
                        >
                            <option value="">All Blood Groups</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Search district, place, or hospital..."
                            className="w-full bg-[#111115] border border-zinc-700/80 text-zinc-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-red-500"
                        />
                    </div>

                    <div className="md:col-span-3 flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                            <Search size={14} /> Apply Filters
                        </button>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleResetFilters}
                                title="Reset Filters"
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                                <RotateCcw size={13} /> Reset
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* Content Display */}
            {selectedTab === 'donors' ? (
                <>
                    {loadingDonors ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3, 4, 5, 6].map((idx) => (
                                <div key={idx} className="bg-[#18181c] border border-zinc-800/80 rounded-2xl p-4 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-zinc-800 rounded-xl"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
                                            <div className="h-3 bg-zinc-800/60 rounded w-1/3"></div>
                                        </div>
                                    </div>
                                    <div className="h-9 bg-zinc-800/70 rounded-xl mt-4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {donors.map((donor) => (
                                <div
                                    key={donor._id}
                                    className="bg-[#18181c] border border-zinc-800/90 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700/80 transition"
                                >
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-950/80 text-red-500 border border-red-900/60 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                                {donor.bloodGroup}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white">{donor.name}</h3>
                                                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                                                    <MapPin size={12} className="text-zinc-500" />
                                                    <span>{donor.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {donor.isAvailable !== false ? (
                                            <span className="inline-flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0">
                                                <ShieldCheck size={11} /> Eligible
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-zinc-800/90 text-zinc-400 border border-zinc-700/50 text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0">
                                                <Clock size={11} /> In Cooldown
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full mt-2">
                                        <CallDonorButton
                                            phone={donor.phone}
                                            phoneNumber={donor.phone}
                                            donorName={donor.name}
                                            donor={donor}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loadingDonors && donors.length === 0 && (
                        <div className="border border-zinc-800 bg-[#16161a] rounded-2xl p-12 text-center max-w-md mx-auto my-6">
                            <div className="w-12 h-12 bg-zinc-800/80 text-zinc-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UserX size={22} />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">No Donors Found</h3>
                            <p className="text-xs text-zinc-400 mb-4">
                                No registered donors match your current filter selection.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                <>
                    {loadingRequests ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[1, 2, 3].map((idx) => (
                                <div key={idx} className="bg-[#18181c] border border-red-500/20 rounded-2xl p-4 animate-pulse">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-red-950/40 rounded-xl"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                                            <div className="h-3 bg-zinc-800/60 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                    <div className="h-20 bg-zinc-800/40 rounded-xl mb-3"></div>
                                    <div className="h-9 bg-zinc-800/60 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredRequests.map((req) => (
                                <div
                                    key={req._id || Math.random()}
                                    className="bg-[#18181c] border border-red-500/40 rounded-2xl p-4 flex flex-col justify-between hover:border-red-500/70 transition shadow-lg shadow-red-950/20"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-red-950 text-red-500 border border-red-800 rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                                                    {req.bloodGroup}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-bold text-white">Patient: {req.patientName}</h3>
                                                    <span className="text-[11px] text-red-400 font-medium">
                                                        Units Needed: {req.unitsNeeded}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                                <AlertTriangle size={10} /> {req.priorityLevel || 'Urgent'}
                                            </span>
                                        </div>

                                        <div className="text-xs text-zinc-300 space-y-1.5 my-3 bg-[#111115] p-3 rounded-xl border border-zinc-800/80">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={13} className="text-zinc-400 shrink-0" />
                                                <span className="truncate">{req.hospitalName}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={13} className="text-zinc-400 shrink-0" />
                                                <span>{req.location}</span>
                                            </div>
                                            {req.additionalNotes && (
                                                <p className="text-[11px] text-zinc-400 italic pt-1 border-t border-zinc-800">
                                                    "{req.additionalNotes}"
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full mt-2">
                                        <CallDonorButton
                                            phoneNumber={req.contactPhone}
                                            phone={req.contactPhone}
                                            donorName={`Contact for ${req.patientName}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loadingRequests && filteredRequests.length === 0 && (
                        <div className="border border-zinc-800 bg-[#16161a] rounded-2xl p-12 text-center max-w-md mx-auto my-6">
                            <div className="w-12 h-12 bg-red-950/40 text-red-400 border border-red-900/40 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileQuestion size={22} />
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">No Emergency Requests</h3>
                            <p className="text-xs text-zinc-400 mb-4">
                                There are no active emergency requests matching your criteria.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={handleResetFilters}
                                    className="text-xs font-semibold text-red-400 hover:text-red-300 transition"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FindDonors;