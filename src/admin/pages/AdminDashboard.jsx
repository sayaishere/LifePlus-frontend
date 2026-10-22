import React, { useState } from 'react';
import { Users, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, Trash2 } from 'lucide-react';

function AdminDashboard() {
    const [requests, setRequests] = useState([
        { id: 1, patient: 'Baby of Priya', group: 'O-', hospital: 'Kozhikode Medical College', status: 'Pending' },
        { id: 2, patient: 'Rahul M', group: 'A+', hospital: 'Aster MIMS', status: 'Approved' }
    ]);

    const handleApprove = (id) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    };

    const handleReject = (id) => {
        setRequests(requests.filter(r => r.id !== id));
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] text-white p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Top Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Admin Management Dashboard</h1>
                        <p className="text-xs text-zinc-400 mt-0.5">LifePulse System Overview & Operations</p>
                    </div>
                    <a href="/" className="text-xs text-zinc-400 hover:text-white transition">← Back to Portal</a>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#16161c] border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="p-3 bg-red-950 text-red-500 rounded-lg"><Users size={24} /></div>
                        <div>
                            <h4 className="text-2xl font-bold">1,248</h4>
                            <p className="text-xs text-zinc-400">Total Registered Donors</p>
                        </div>
                    </div>

                    <div className="bg-[#16161c] border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="p-3 bg-red-950 text-red-500 rounded-lg"><AlertTriangle size={24} /></div>
                        <div>
                            <h4 className="text-2xl font-bold">14</h4>
                            <p className="text-xs text-zinc-400">Active Requests Today</p>
                        </div>
                    </div>

                    <div className="bg-[#16161c] border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
                        <div className="p-3 bg-emerald-950 text-emerald-400 rounded-lg"><ShieldCheck size={24} /></div>
                        <div>
                            <h4 className="text-2xl font-bold">98.4%</h4>
                            <p className="text-xs text-zinc-400">Verified Donors</p>
                        </div>
                    </div>
                </div>

                {/* Requests Management Table */}
                <div className="bg-[#16161c] border border-zinc-800 rounded-2xl p-5">
                    <h3 className="text-base font-bold mb-4">Manage Emergency Blood Requests</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-[#0f0f13] text-zinc-400 border-b border-zinc-800">
                                <tr>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Blood Group</th>
                                    <th className="p-3">Hospital</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/60">
                                {requests.map(r => (
                                    <tr key={r.id} className="hover:bg-zinc-900/50">
                                        <td className="p-3 font-semibold">{r.patient}</td>
                                        <td className="p-3 font-bold text-red-500">{r.group}</td>
                                        <td className="p-3 text-zinc-400">{r.hospital}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === 'Approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                                                }`}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right space-x-2">
                                            {r.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleApprove(r.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[11px] font-semibold transition"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleReject(r.id)}
                                                className="bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-400 p-1 rounded transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AdminDashboard;