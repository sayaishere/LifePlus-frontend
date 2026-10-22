import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Bell, PlusCircle, Menu, X, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchBloodRequests } from '../../services/api';

function UserHeader({ onRequestClick }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [urgentRequests, setUrgentRequests] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const notificationRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Read logged-in user from localStorage
    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem('user') || '{}');
    });

    // Fetch active urgent blood requests for notifications
    const loadEmergencyAlerts = async () => {
        try {
            const res = await fetchBloodRequests();
            const data = res.data || [];
            setUrgentRequests(data.slice(0, 5)); // Show up to 5 recent emergencies
            setUnreadCount(data.length);
        } catch (err) {
            console.error("Failed to load notification alerts:", err);
        }
    };

    useEffect(() => {
        loadEmergencyAlerts();

        // Listen for new requests submitted elsewhere in the app
        window.addEventListener('bloodRequestCreated', loadEmergencyAlerts);
        return () => window.removeEventListener('bloodRequestCreated', loadEmergencyAlerts);
    }, []);

    // Close notifications panel on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setNotificationsOpen(false);
            }
        };

        if (notificationsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notificationsOpen]);

    // Listen for storage changes (login/logout/register across tabs or components)
    useEffect(() => {
        const syncUser = () => {
            setUser(JSON.parse(localStorage.getItem('user') || '{}'));
        };

        window.addEventListener('storage', syncUser);
        return () => window.removeEventListener('storage', syncUser);
    }, []);

    // Helper to generate 2-letter initials
    const getInitials = (name) => {
        if (!name) return 'LP';
        return name
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="border-b border-zinc-800 bg-[#121215] px-6 py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Scaled-up Brand Logo & Text */}
                <Link to="/" className="flex items-center gap-3 text-2xl md:text-3xl font-extrabold tracking-tight text-white group">
                    <Droplet className="text-red-500 fill-red-500 transition-transform group-hover:scale-105" size={34} />
                    <span>LifePulse</span>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-2">
                    <Link
                        to="/"
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${isActive('/') ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/requests"
                        className={`px-3 py-1.5 text-sm transition rounded-full font-medium ${isActive('/requests') ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Find Donors
                    </Link>
                    <Link
                        to="/profile"
                        className={`px-3 py-1.5 text-sm transition rounded-full font-medium ${isActive('/profile') ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                            }`}
                    >
                        Profile
                    </Link>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Post Request Action Button */}
                    <button
                        type="button"
                        onClick={onRequestClick}
                        className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-md transition glow-red cursor-pointer"
                    >
                        <PlusCircle size={15} />
                        <span>Post Request</span>
                    </button>

                    {/* Notification Bell with Dynamic Drawer */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            type="button"
                            onClick={() => setNotificationsOpen(!notificationsOpen)}
                            className="relative p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-full transition cursor-pointer"
                            title="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown Panel */}
                        {notificationsOpen && (
                            <>
                                {/* Backdrop dimming on mobile */}
                                <div
                                    className="fixed inset-0 bg-black/50 backdrop-blur-xs sm:hidden z-45"
                                    onClick={() => setNotificationsOpen(false)}
                                />

                                {/* Elevated Popover */}
                                <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-18 sm:top-auto mt-0 sm:mt-3 sm:w-96 bg-linear-to-b from-[#1c1417] via-[#141418] to-[#121216] border border-red-500/40 rounded-2xl shadow-[0_20px_50px_rgba(220,38,38,0.25)] overflow-hidden z-50">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-red-500/20 flex items-center justify-between bg-red-950/40">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            <h4 className="text-xs font-bold text-red-200 uppercase tracking-wider flex items-center gap-1.5">
                                                <AlertTriangle size={14} className="text-red-400" />
                                                Emergency Alerts
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-red-400 bg-red-950/90 border border-red-800/60 px-2 py-0.5 rounded-full">
                                            {urgentRequests.length} Active
                                        </span>
                                    </div>

                                    {/* Notification Items List */}
                                    <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                                        {urgentRequests.length === 0 ? (
                                            <div className="p-6 text-center text-xs text-zinc-400">
                                                No emergency requests right now.
                                            </div>
                                        ) : (
                                            urgentRequests.map((req) => (
                                                <div
                                                    key={req._id}
                                                    onClick={() => {
                                                        setNotificationsOpen(false);
                                                        navigate('/requests');
                                                    }}
                                                    className="p-3.5 hover:bg-red-500/10 transition cursor-pointer flex items-start gap-3"
                                                >
                                                    <span className="bg-red-600/30 text-red-400 border border-red-500/50 text-xs font-bold px-2 py-1 rounded-lg shrink-0 shadow-xs">
                                                        {req.bloodGroup}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <p className="text-xs font-bold text-white truncate">
                                                                {req.patientName}
                                                            </p>
                                                            <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1 shrink-0 bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 rounded">
                                                                <Clock size={10} /> 24h
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-zinc-300 truncate mt-0.5">
                                                            {req.hospitalName} &bull; <span className="text-zinc-400">{req.location}</span>
                                                        </p>
                                                        <p className="text-[10px] text-red-300/80 mt-1 font-medium">
                                                            Needs {req.unitsNeeded} {req.unitsNeeded === 1 ? 'unit' : 'units'} urgently
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer Action */}
                                    <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950/60">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNotificationsOpen(false);
                                                navigate('/requests');
                                            }}
                                            className="w-full py-2 text-center text-xs font-semibold text-white bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <span>View all in directory</span>
                                            <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Dynamic Profile Badge */}
                    <Link to="/profile" className="flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 rounded-full px-3 py-1 bg-zinc-900 transition">
                        <div className="bg-red-950 text-red-400 border border-red-900/50 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {getInitials(user.name)}
                        </div>
                        <span className="text-xs font-medium text-zinc-200 hidden xs:inline max-w-28 truncate">
                            {user.name || 'Account'}
                        </span>
                    </Link>

                    {/* Mobile Hamburger Menu Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-zinc-400 hover:text-white p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 transition cursor-pointer"
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-3">
                    <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${isActive('/') ? 'bg-red-600/20 text-red-400 border border-red-600/40' : 'text-zinc-300 hover:text-white'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/requests"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${isActive('/requests') ? 'bg-red-600/20 text-red-400 border border-red-600/40' : 'text-zinc-300 hover:text-white'
                            }`}
                    >
                        Find Donors
                    </Link>
                    <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold ${isActive('/profile') ? 'bg-red-600/20 text-red-400 border border-red-600/40' : 'text-zinc-300 hover:text-white'
                            }`}
                    >
                        Profile
                    </Link>

                    {/* Post Request Action Button (Mobile View) */}
                    <button
                        type="button"
                        onClick={() => {
                            setMobileMenuOpen(false);
                            onRequestClick();
                        }}
                        className="sm:hidden flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white w-full py-2.5 rounded-xl text-xs font-semibold shadow-md transition mt-1 cursor-pointer"
                    >
                        <PlusCircle size={16} />
                        <span>Post Emergency Request</span>
                    </button>
                </div>
            )}
        </nav>
    );
}

export default UserHeader;