import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ShieldCheck, Clock, Save, LogOut, Loader2, CheckCircle2, Droplet, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../../services/api';

const MONTH_NAMES = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const currentYear = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: currentYear - 1970 + 1 }, (_, i) => currentYear - i);

function Profile() {
    const navigate = useNavigate();

    // Read stored user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = storedUser.id || storedUser._id;

    const [user, setUser] = useState(storedUser);
    const [bloodGroup, setBloodGroup] = useState(storedUser.bloodGroup || 'O+');
    const [lastDonation, setLastDonation] = useState(''); // Internal ISO: YYYY-MM-DD

    // Discrete date segment states (replicates native input with fixed slashes)
    const [dayInput, setDayInput] = useState('');
    const [monthInput, setMonthInput] = useState('');
    const [yearInput, setYearInput] = useState('');

    const [isAvailable, setIsAvailable] = useState(storedUser.isAvailable !== false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    // Input Refs for smooth auto-advancing between segments
    const dayRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);

    // Calendar Picker Popup States
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [viewDate, setViewDate] = useState(new Date());
    const [calendarMode, setCalendarMode] = useState('days'); // 'days' | 'months' | 'years'
    const calendarRef = useRef(null);

    // Close calendar on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setIsCalendarOpen(false);
                setCalendarMode('days');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync segments when full valid date is ready
    const validateAndSyncDate = (d, m, y) => {
        if (d.length === 2 && m.length === 2 && y.length === 4) {
            const dayNum = parseInt(d, 10);
            const monthNum = parseInt(m, 10);
            const yearNum = parseInt(y, 10);

            if (
                dayNum >= 1 && dayNum <= 31 &&
                monthNum >= 1 && monthNum <= 12 &&
                yearNum >= 1900 && yearNum <= currentYear
            ) {
                const iso = `${y}-${m}-${d}`;
                const checkDate = new Date(iso);
                if (!isNaN(checkDate.getTime()) && checkDate <= new Date()) {
                    setLastDonation(iso);
                    setViewDate(checkDate);
                    return;
                }
            }
        }
        setLastDonation('');
    };

    // Fetch fresh profile details from MongoDB
    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const loadProfile = async () => {
            setLoading(true);
            try {
                const res = await getUserProfile(userId);
                if (res.data) {
                    setUser(res.data);
                    setBloodGroup(res.data.bloodGroup || 'O+');
                    setIsAvailable(res.data.isAvailable !== false);
                    if (res.data.lastDonationDate) {
                        const dateStr = new Date(res.data.lastDonationDate).toISOString().split('T')[0];
                        setLastDonation(dateStr);
                        const [y, m, d] = dateStr.split('-');
                        setYearInput(y);
                        setMonthInput(m);
                        setDayInput(d);
                        setViewDate(new Date(res.data.lastDonationDate));
                    }
                }
            } catch (err) {
                console.error('Failed to load profile:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId, navigate]);

    // Compute 90-day cooldown status
    const calculateEligibility = () => {
        if (!lastDonation) return null;

        const parts = lastDonation.split('-');
        if (parts.length !== 3 || parts[0].length !== 4) return null;

        const year = parseInt(parts[0], 10);
        if (isNaN(year) || year < 1900) return null;

        const donationDate = new Date(lastDonation);
        if (isNaN(donationDate.getTime())) return null;
        if (donationDate > new Date()) return null;

        const diff = (new Date() - donationDate) / (1000 * 60 * 60 * 24);
        return diff >= 90;
    };

    const isEligible = calculateEligibility();

    // Get avatar initials from user name
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Input handlers with auto-focus between fields
    const handleDayChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setDayInput(val);
        validateAndSyncDate(val, monthInput, yearInput);
        if (val.length === 2) {
            monthRef.current?.focus();
        }
    };

    const handleMonthChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setMonthInput(val);
        validateAndSyncDate(dayInput, val, yearInput);
        if (val.length === 2) {
            yearRef.current?.focus();
        }
    };

    const handleYearChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
        setYearInput(val);
        validateAndSyncDate(dayInput, monthInput, val);
    };

    // Backspace handling across segments
    const handleKeyDown = (e, field) => {
        if (e.key === 'Backspace') {
            if (field === 'year' && yearInput === '') {
                monthRef.current?.focus();
            } else if (field === 'month' && monthInput === '') {
                dayRef.current?.focus();
            }
        }
    };

    // Calendar Pick selection
    const handleSelectDate = (year, month, day) => {
        const mm = String(month + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        const yyyy = String(year);

        setDayInput(dd);
        setMonthInput(mm);
        setYearInput(yyyy);
        setLastDonation(`${yyyy}-${mm}-${dd}`);

        setIsCalendarOpen(false);
        setCalendarMode('days');
    };

    const handleClearDate = () => {
        setDayInput('');
        setMonthInput('');
        setYearInput('');
        setLastDonation('');
        setIsCalendarOpen(false);
    };

    // Save changes to MongoDB
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFeedback({ type: '', message: '' });

        const targetId = user?._id || user?.id || storedUser?._id || storedUser?.id;

        if (!targetId) {
            setFeedback({ type: 'error', message: 'User session expired. Please log in again.' });
            setSaving(false);
            return;
        }

        try {
            const payload = {
                bloodGroup,
                isAvailable,
                lastDonationDate: lastDonation ? new Date(lastDonation) : null,
                location: user.location,
            };

            const res = await updateUserProfile(targetId, payload);

            if (res.data && res.data.user) {
                const updated = { ...storedUser, ...res.data.user };
                localStorage.setItem('user', JSON.stringify(updated));
                setUser(updated);
                setFeedback({ type: 'success', message: 'Profile updated successfully!' });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setFeedback({
                type: 'error',
                message: err.response?.data?.message || 'Failed to update profile.',
            });
        } finally {
            setSaving(false);
            setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
        }
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const changeMonth = (delta) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
    };

    // Build calendar matrix
    const renderCalendarDays = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const startingCol = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const cells = [];
        const today = new Date();

        for (let i = startingCol - 1; i >= 0; i--) {
            const dayNum = prevMonthTotalDays - i;
            cells.push(
                <div key={`prev-${dayNum}`} className="flex items-center justify-center p-1">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-zinc-600 border border-zinc-800/40">
                        {dayNum}
                    </span>
                </div>
            );
        }

        for (let day = 1; day <= totalDaysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const isFuture = cellDate > today;
            const isSelected = lastDonation && new Date(lastDonation).toDateString() === cellDate.toDateString();

            cells.push(
                <div key={`curr-${day}`} className="flex items-center justify-center p-1">
                    <button
                        type="button"
                        disabled={isFuture}
                        onClick={() => handleSelectDate(year, month, day)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${isSelected
                            ? 'bg-white text-zinc-950 font-bold shadow-md scale-105'
                            : isFuture
                                ? 'text-zinc-600 border border-zinc-800/40 cursor-not-allowed opacity-40'
                                : 'text-zinc-200 border border-zinc-700/80 hover:border-red-500 hover:text-white hover:bg-zinc-800 cursor-pointer'
                            }`}
                    >
                        {day}
                    </button>
                </div>
            );
        }

        const remainingCells = (7 - (cells.length % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            cells.push(
                <div key={`next-${i}`} className="flex items-center justify-center p-1">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-zinc-600 border border-zinc-800/40">
                        {i}
                    </span>
                </div>
            );
        }

        return cells;
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-20 text-center text-zinc-400 text-sm">
                <Loader2 className="animate-spin inline-block mr-2" size={18} />
                Loading your profile...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="bg-[#16161c] border border-zinc-800 rounded-2xl p-6 shadow-xl">
                {/* Header / Avatar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-red-950 text-red-500 rounded-full border border-red-900/50 flex items-center justify-center font-bold text-xl shrink-0">
                            {getInitials(user.name)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{user.name || 'User Profile'}</h2>
                            <p className="text-xs text-zinc-400">
                                {user.role === 'donor' || user.isAvailable !== undefined ? 'Registered Donor' : 'Standard User'} | {user.location || 'Location Not Set'}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {/* Blood Group Badge */}
                                <span className="bg-red-950/80 text-red-400 border border-red-800/80 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                                    <Droplet size={11} className="text-red-500 fill-red-500" />
                                    Blood Group: {bloodGroup}
                                </span>

                                {/* Eligibility Badge */}
                                {isEligible !== null && (
                                    isEligible ? (
                                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            <ShieldCheck size={12} /> Eligible to Donate
                                        </span>
                                    ) : (
                                        <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            <Clock size={12} /> 90-Day Cooldown Active
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="self-start sm:self-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-700/80 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>

                {/* Status Feedback Message */}
                {feedback.message && (
                    <div
                        className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${feedback.type === 'success'
                            ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                            : 'bg-red-950/80 border border-red-800 text-red-300'
                            }`}
                    >
                        {feedback.type === 'success' && <CheckCircle2 size={14} />}
                        <span>{feedback.message}</span>
                    </div>
                )}

                {/* Profile Settings Form */}
                <form onSubmit={handleSave} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                        {/* Column 1: Last Donation Date */}
                        <div className="relative" ref={calendarRef}>
                            {/* Matching single-line Label Container (h-5) */}
                            <div className="h-5 flex items-center mb-1.5">
                                <label className="text-xs font-medium text-zinc-400 leading-none">Last Donation Date</label>
                            </div>

                            {/* Masked/Segmented Input Container (h-11) */}
                            <div className="w-full h-11 bg-[#0f0f13] border border-zinc-700 focus-within:border-red-500 text-xs rounded-xl px-3.5 text-white flex items-center justify-between transition shadow-inner">
                                <div className="flex items-center text-xs font-medium">
                                    <input
                                        ref={dayRef}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="dd"
                                        value={dayInput}
                                        onChange={handleDayChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'day')}
                                        className="w-5 bg-transparent text-center text-white placeholder-zinc-500 outline-none"
                                    />
                                    <span className="text-zinc-500 mx-1 select-none font-semibold">/</span>
                                    <input
                                        ref={monthRef}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="mm"
                                        value={monthInput}
                                        onChange={handleMonthChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'month')}
                                        className="w-6 bg-transparent text-center text-white placeholder-zinc-500 outline-none"
                                    />
                                    <span className="text-zinc-500 mx-1 select-none font-semibold">/</span>
                                    <input
                                        ref={yearRef}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="yyyy"
                                        value={yearInput}
                                        onChange={handleYearChange}
                                        onKeyDown={(e) => handleKeyDown(e, 'year')}
                                        className="w-10 bg-transparent text-center text-white placeholder-zinc-500 outline-none"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCalendarOpen(!isCalendarOpen);
                                        setCalendarMode('days');
                                    }}
                                    className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition cursor-pointer"
                                    title="Open calendar"
                                >
                                    <CalendarIcon size={16} />
                                </button>
                            </div>

                            {/* Subtext Row: Helper Text on Left + Clean Clear Link on Right */}
                            <div className="flex items-center justify-between mt-1.5 px-0.5">
                                <p className="text-[10px] text-zinc-500">Updates your 90-day availability cooldown automatically.</p>
                                {(dayInput || monthInput || yearInput) && (
                                    <button
                                        type="button"
                                        onClick={handleClearDate}
                                        className="text-[10px] text-zinc-400 hover:text-red-400 transition cursor-pointer ml-2 shrink-0"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Circular Calendar Dropdown Popup */}
                            {isCalendarOpen && (
                                <div className="absolute left-0 mt-2 z-50 w-72 bg-[#1a1b24] border border-zinc-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
                                    {/* Header: Interactive Month & Year */}
                                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-zinc-800/80">
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => setCalendarMode(calendarMode === 'months' ? 'days' : 'months')}
                                                className={`text-xs font-bold tracking-wider uppercase px-1.5 py-0.5 rounded transition cursor-pointer ${calendarMode === 'months' ? 'bg-red-600 text-white' : 'text-zinc-200 hover:text-white hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {MONTH_NAMES[viewDate.getMonth()]}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setCalendarMode(calendarMode === 'years' ? 'days' : 'years')}
                                                className={`text-xs font-bold tracking-wider uppercase px-1.5 py-0.5 rounded transition cursor-pointer ${calendarMode === 'years' ? 'bg-red-600 text-white' : 'text-zinc-200 hover:text-white hover:bg-zinc-800'
                                                    }`}
                                            >
                                                {viewDate.getFullYear()}
                                            </button>
                                        </div>

                                        {calendarMode === 'days' && (
                                            <div className="flex items-center gap-1 text-zinc-400">
                                                <button
                                                    type="button"
                                                    onClick={() => changeMonth(-1)}
                                                    className="p-1 hover:text-white hover:bg-zinc-800 rounded-md transition cursor-pointer"
                                                >
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => changeMonth(1)}
                                                    className="p-1 hover:text-white hover:bg-zinc-800 rounded-md transition cursor-pointer"
                                                >
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* MODE 1: Fast Full Year Selection Grid */}
                                    {calendarMode === 'years' && (
                                        <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto py-1 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                                            {YEARS_LIST.map((yr) => (
                                                <button
                                                    key={yr}
                                                    type="button"
                                                    onClick={() => {
                                                        setViewDate(new Date(yr, viewDate.getMonth(), 1));
                                                        setCalendarMode('days');
                                                    }}
                                                    className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer border ${viewDate.getFullYear() === yr
                                                        ? 'bg-red-600 border-red-500 text-white shadow-sm'
                                                        : 'text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white hover:border-zinc-700'
                                                        }`}
                                                >
                                                    {yr}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* MODE 2: Fast Month Selection Grid */}
                                    {calendarMode === 'months' && (
                                        <div className="grid grid-cols-3 gap-2 py-1">
                                            {MONTH_NAMES.map((mName, idx) => (
                                                <button
                                                    key={mName}
                                                    type="button"
                                                    onClick={() => {
                                                        setViewDate(new Date(viewDate.getFullYear(), idx, 1));
                                                        setCalendarMode('days');
                                                    }}
                                                    className={`py-2 text-xs font-semibold rounded-lg transition cursor-pointer border ${viewDate.getMonth() === idx
                                                        ? 'bg-red-600 border-red-500 text-white'
                                                        : 'text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                                                        }`}
                                                >
                                                    {mName.slice(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* MODE 3: Default Days Matrix */}
                                    {calendarMode === 'days' && (
                                        <>
                                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                                {WEEKDAYS.map((wd) => (
                                                    <div key={wd} className="text-[10px] font-medium text-zinc-400">
                                                        {wd}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7 gap-y-1">
                                                {renderCalendarDays()}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Column 2: Donation Availability */}
                        <div>
                            {/* Matching single-line Label Container (h-5) */}
                            <div className="h-5 flex items-center mb-1.5">
                                <label className="text-xs font-medium text-zinc-400 leading-none">Donation Availability</label>
                            </div>

                            {/* Standardized Button Container Height (h-11) */}
                            <button
                                type="button"
                                onClick={() => setIsAvailable(!isAvailable)}
                                className={`w-full h-11 px-4 rounded-xl text-xs font-semibold border flex items-center justify-between transition cursor-pointer ${isAvailable
                                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                                    }`}
                            >
                                <span>Status: {isAvailable ? 'Available for Requests' : 'Paused / Unavailable'}</span>
                                <span className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-zinc-800">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition glow-red cursor-pointer disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={14} /> Save Profile Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;