import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, User, Mail, Lock, Phone, MapPin, UserPlus, Loader2 } from 'lucide-react';
import { registerUser } from '../services/api';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        bloodGroup: '',
        location: '',
        role: 'user'
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                bloodGroup: formData.bloodGroup,
                location: formData.location
            });

            if (res.data) {
                // Save session for auto-login
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token);
                }
                if (res.data.user) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                }

                // Notify other components (like UserHeader) that user state updated
                window.dispatchEvent(new Event('storage'));

                // Navigate directly to the directory
                navigate('/');
            }
        } catch (err) {
            console.error('Registration failed:', err);
            setErrorMessage(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-lg bg-[#16161c] border border-zinc-800 rounded-2xl p-8 shadow-2xl glow-red">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Droplet size={28} className="text-red-500 fill-red-500" />
                        <span className="text-2xl font-bold tracking-tight text-white">LifePulse</span>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-200">Create Account</h2>
                    <p className="text-xs text-zinc-400 mt-1">Join as a donor or request blood during emergencies</p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-2.5 text-zinc-500" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3 top-2.5 text-zinc-500" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-2.5 text-zinc-500" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
                            <div className="relative">
                                <Phone size={15} className="absolute left-3 top-2.5 text-zinc-500" />
                                <input
                                    type="tel"
                                    required
                                    placeholder="+91 9876543210"
                                    className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Blood Group</label>
                            <select
                                required
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            >
                                <option value="">Select Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Location</label>
                            <div className="relative">
                                <MapPin size={15} className="absolute left-3 top-2.5 text-zinc-500" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Kozhikode"
                                    className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white focus:outline-none focus:border-red-500"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition glow-red mt-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Registering...
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} /> Register as Donor
                            </>
                        )}
                    </button>
                </form>

                <p className="text-xs text-center text-zinc-400 mt-5">
                    Already registered? <Link to="/login" className="text-red-400 font-semibold hover:underline">Sign in here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;