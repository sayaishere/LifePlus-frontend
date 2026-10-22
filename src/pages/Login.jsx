import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplet, Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { loginUser } from '../services/api';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await loginUser({ email, password });

            if (res.data && res.data.token) {
                // Save token and user details to localStorage
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                // Redirect to directory
                navigate('/');
            }
        } catch (err) {
            console.error('Login failed:', err);
            setErrorMessage(
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Invalid email or password. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-md bg-[#16161c] border border-zinc-800 rounded-2xl p-8 shadow-2xl glow-red">
                {/* Brand Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Droplet size={28} className="text-red-500 fill-red-500" />
                        <span className="text-2xl font-bold tracking-tight text-white">LifePulse</span>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-200">Welcome Back</h2>
                    <p className="text-xs text-zinc-400 mt-1">Sign in to manage your blood requests & donations</p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl text-center">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-zinc-500" />
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3 top-3 text-zinc-500" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-red-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition glow-red mt-2 cursor-pointer disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Signing In...
                            </>
                        ) : (
                            <>
                                <LogIn size={16} /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <p className="text-xs text-center text-zinc-400 mt-6">
                    Don't have an account? <Link to="/register" className="text-red-400 font-semibold hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;