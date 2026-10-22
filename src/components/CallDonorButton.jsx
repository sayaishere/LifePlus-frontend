import React, { useState } from 'react';
import { Phone, QrCode, Copy, Check, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const CallDonorButton = ({ phoneNumber, donorName, className = "" }) => {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    // Clean number so native dialer reads it without spaces or format issues
    const cleanPhone = phoneNumber ? String(phoneNumber).replace(/\s+/g, '') : '';

    const handleCall = (e) => {
        // Robust mobile detection (User Agent + touch device with mobile width)
        const isMobile =
            /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            (window.matchMedia('(max-width: 768px)').matches && 'ontouchstart' in window);

        if (isMobile) {
            // Direct launch to mobile phone dialer
            window.location.href = `tel:${cleanPhone}`;
        } else {
            // Laptop / Desktop: Open QR Code modal
            setShowModal(true);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(cleanPhone || phoneNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <button
                type="button"
                onClick={handleCall}
                className={className || "w-full border border-red-600/60 hover:bg-red-600 text-red-400 hover:text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"}
            >
                <Phone size={14} /> Call ({phoneNumber})
            </button>

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-[#16161c] border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl glow-red"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>

                        <div className="w-12 h-12 bg-red-950/80 rounded-full text-red-500 border border-red-900/50 flex items-center justify-center mx-auto mb-3">
                            <QrCode size={24} />
                        </div>

                        <h3 className="text-lg font-bold text-white">Contact {donorName}</h3>
                        <p className="text-xs text-zinc-400 mt-1 mb-4">
                            Scan this QR code with your mobile camera to call directly from your phone.
                        </p>

                        <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner">
                            <QRCodeSVG value={`tel:${cleanPhone}`} size={160} />
                        </div>

                        <div className="flex items-center justify-between bg-[#0f0f13] border border-zinc-800 rounded-xl p-2.5">
                            <span className="text-xs font-mono font-bold text-red-400 pl-2">{phoneNumber}</span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
                            >
                                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                <span>{copied ? "Copied" : "Copy"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CallDonorButton;