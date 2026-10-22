import React, { useState } from 'react';
import {
    Droplet, MapPin, Search, AlertCircle,
    Users, HeartPulse, ChevronRight
} from 'lucide-react';
import CallDonorButton from '../../components/CallDonorButton';

// SVG Graphic: Watermark Blood Droplet + ECG Pulse Line
function HeroGraphic() {
    return (
        <div className="relative w-64 h-40 flex items-center justify-center opacity-80 select-none pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                    <radialGradient id="dropGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#f87171" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
                    </linearGradient>
                </defs>

                <circle cx="100" cy="100" r="80" fill="url(#dropGlow)" />
                <path
                    d="M100 25 C100 25, 145 90, 145 125 A45 45 0 0 1 55 125 C55 90, 100 25, 100 25 Z"
                    fill="#b91c1c"
                    fillOpacity="0.22"
                />
                <path
                    d="M 10 115 H 65 L 73 100 L 82 135 L 96 75 L 110 145 L 122 105 L 130 115 H 190"
                    fill="none"
                    stroke="url(#pulseGradient)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

function Home() {
    const [bloodGroup, setBloodGroup] = useState('');
    const [location, setLocation] = useState('');

    const donors = [
        { name: 'Anjali Nair', blood: 'O+', dist: '2.3 km', city: 'Kozhikode', time: '3 months ago', phone: '+919847123456', img: 'https://i.pravatar.cc/150?img=1' },
        { name: 'Rahul Kumar', blood: 'A+', dist: '4.7 km', city: 'Kozhikode', time: '2 months ago', phone: '+919847654321', img: 'https://i.pravatar.cc/150?img=12' },
        { name: 'Sneha Thomas', blood: 'B+', dist: '6.1 km', city: 'Kozhikode', time: '4 months ago', phone: '+919745112233', img: 'https://i.pravatar.cc/150?img=5' },
        { name: 'Arjun P', blood: 'AB+', dist: '8.9 km', city: 'Kozhikode', time: '1 month ago', phone: '+919946887766', img: 'https://i.pravatar.cc/150?img=3' },
    ];

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-linear-to-b from-[#2e080a] via-[#150a0c] to-[#0f0f11] border-b border-zinc-800/80 py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                    {/* Left Side: Headline & Search Inputs */}
                    <div className="lg:col-span-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Every Drop <span className="text-red-500">Saves a Life</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mt-2">
                            Find verified blood donors near you, when you need them most.
                        </p>

                        {/* Filter Box */}
                        <div className="bg-[#18181c] border border-zinc-800 rounded-xl p-4 mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end glow-red">
                            <div className="md:col-span-5">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Blood Group</label>
                                <select
                                    className="w-full bg-[#111115] border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                >
                                    <option value="">Select Blood Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                        <option key={bg} value={bg}>{bg}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Location</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#111115] border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-500"
                                    placeholder="Enter location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <div className="md:col-span-3">
                                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition cursor-pointer">
                                    <Search size={16} /> Search Donors
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Pulse Graphic & Platform Stats */}
                    <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4">
                        <div className="hidden lg:block">
                            <HeroGraphic />
                        </div>

                        {/* Platform Stats Panel */}
                        <div className="w-full bg-[#18181c] border border-zinc-800 rounded-xl p-5 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-950/60 text-red-500 rounded-lg border border-red-900/40">
                                    <Users size={22} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">1,248+</h4>
                                    <p className="text-xs text-zinc-400">Eligible Donors <span className="text-red-400 font-medium">(90-day cooldown checked)</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-950/60 text-red-500 rounded-lg border border-red-900/40">
                                    <HeartPulse size={22} />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold">892+</h4>
                                    <p className="text-xs text-zinc-400">Successful Donations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Emergency Alert Banner */}
            <div className="max-w-7xl mx-auto px-6 mt-8">
                <div className="bg-linear-to-r from-red-900 via-red-800 to-red-950 border border-red-700/80 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 glow-alert">
                    <div className="flex items-center gap-4">
                        <div className="bg-white text-red-600 rounded-full p-2.5 shrink-0">
                            <AlertCircle size={22} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base">EMERGENCY: O- Blood Required Urgently!</h3>
                            <p className="text-xs text-red-100 opacity-90 mt-0.5">
                                Baby admitted in Kozhikode Medical College. O- Negative blood needed immediately.
                            </p>
                        </div>
                    </div>
                    <button className="whitespace-nowrap border border-white/40 hover:bg-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 transition cursor-pointer">
                        View Details <ChevronRight size={14} />
                    </button>
                </div>

                {/* Donors Grid */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-100">
                        <MapPin size={20} className="text-red-500" /> Available Donors Near You
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {donors.map((d, index) => (
                        <div key={index} className="bg-[#18181c] border border-zinc-800/90 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={d.img} alt={d.name} className="w-11 h-11 rounded-full object-cover border border-zinc-700" />
                                        <div>
                                            <h4 className="font-semibold text-sm text-zinc-100">{d.name}</h4>
                                            <div className="flex items-center gap-1 text-red-500 font-bold text-xs mt-0.5">
                                                <Droplet size={12} className="fill-red-500" /> {d.blood}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                        Available
                                    </span>
                                </div>

                                <div className="text-xs text-zinc-400 space-y-1 my-3 pl-1">
                                    <div>📍 {d.dist}</div>
                                    <div>📍 {d.city}</div>
                                    <div className="text-zinc-500 pt-1 text-[11px]">Last Donated: {d.time}</div>
                                </div>
                            </div>

                            <div className="mt-2">
                                <CallDonorButton
                                    phoneNumber={d.phone || "+919847123456"}
                                    donorName={d.name}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home;