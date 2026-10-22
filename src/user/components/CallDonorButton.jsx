import React, { useState } from 'react';
import { Phone, QrCode, Copy, Check, X } from 'lucide-react';

function CallDonorButton({ phone, donorName }) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(phone);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Mobile Direct Call Link */}
            <a
                href={`tel:${phone}`}
                className="sm:hidden flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
                <Phone size={14} /> Call
            </a>

            {/* Desktop Modal Trigger */}
            <button
                onClick={() => setShowModal(true)}
                className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
            >
                <Phone size={14} /> Call Donor
            </button>

            {/* Desktop Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#16161c] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full relative shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
                        >
                            <X size={18} />
                        </button>

                        <h3 className="text-sm font-bold text-white mb-1">Contact {donorName}</h3>
                        <p className="text-xs text-zinc-400 mb-4">Scan QR code or copy the number below.</p>

                        {/* QR Code Placeholder */}
                        <div className="bg-white p-4 rounded-xl flex items-center justify-center mx-auto w-40 h-40 mb-4">
                            <QrCode size={120} className="text-black" />
                        </div>

                        {/* Phone Number Display & Copy Button */}
                        <div className="flex items-center justify-between bg-[#0f0f13] border border-zinc-700 rounded-lg p-2.5">
                            <span className="text-xs font-mono font-bold text-white">{phone}</span>
                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-2.5 py-1 rounded-md transition"
                            >
                                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CallDonorButton;