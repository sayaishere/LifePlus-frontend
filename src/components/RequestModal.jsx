import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';
import { createBloodRequest } from '../services/api';

const initialFormState = {
    patientName: '',
    bloodGroup: '',
    unitsNeeded: 1,
    hospitalName: '',
    location: '',
    contactNumber: '',
    urgencyLevel: 'Emergency (Immediate)',
    notes: ''
};

function RequestModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    // Close on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Sanitize phone number (remove spaces, parentheses, dashes)
        const cleanPhone = formData.contactNumber.replace(/[\s\-()]/g, '');

        try {
            const payload = {
                patientName: formData.patientName.trim(),
                bloodGroup: formData.bloodGroup,
                unitsNeeded: Number(formData.unitsNeeded),
                priorityLevel: formData.urgencyLevel,
                hospitalName: formData.hospitalName.trim(),
                location: formData.location.trim(),
                contactPhone: cleanPhone,
                additionalNotes: formData.notes.trim()
            };

            const res = await createBloodRequest(payload);

            // Close modal immediately
            setLoading(false);
            onClose();

            // Dispatch both event names to sync both UserHeader and FindDonors
            window.dispatchEvent(new CustomEvent('bloodRequestPosted', { detail: res.data }));
            window.dispatchEvent(new CustomEvent('bloodRequestCreated', { detail: res.data }));

            // Reset form fields
            setFormData(initialFormState);
        } catch (err) {
            console.error('Error posting blood request:', err);
            alert('Failed to post request. Make sure your backend server is running.');
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
            onClick={(e) => {
                // Close if clicking outside the modal box
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-[#16161c] border border-red-500/60 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative glow-red text-white my-auto">

                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-red-950/80 text-red-500 rounded-lg border border-red-900/50">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Post Blood Request</h3>
                            <p className="text-xs text-zinc-400">Request will expire automatically in 24 hours</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
                        aria-label="Close modal"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Request Form */}
                <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Patient Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Full Name"
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Blood Group</label>
                            <select
                                required
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 cursor-pointer"
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            >
                                <option value="">Select Group</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Units Needed</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                required
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                value={formData.unitsNeeded}
                                onChange={(e) => setFormData({ ...formData, unitsNeeded: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Priority Level</label>
                            <select
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 cursor-pointer"
                                value={formData.urgencyLevel}
                                onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
                            >
                                <option value="Emergency (Immediate)">🚨 Emergency (Immediate)</option>
                                <option value="Urgent">⚠️ Urgent (Within 12 hrs)</option>
                                <option value="Standard">ℹ Standard (Planned)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">Hospital Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Medical College"
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                value={formData.hospitalName}
                                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-zinc-300 mb-1">City / Location</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Kozhikode"
                                className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Contact Phone Number</label>
                        <input
                            type="tel"
                            required
                            placeholder="+91 9876543210"
                            className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Additional Notes</label>
                        <textarea
                            rows="2"
                            placeholder="Any specific instructions or room details..."
                            className="w-full bg-[#0f0f13] border border-zinc-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 resize-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg transition glow-red disabled:opacity-50 cursor-pointer"
                        >
                            <Send size={14} /> {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RequestModal;