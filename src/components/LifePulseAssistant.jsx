import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, RotateCcw } from 'lucide-react';
import axios from 'axios';
import mascotImg from '../assets/mascot.png';

const QUICK_PROMPTS = [
    'Check Eligibility',
    'Blood Compatibility',
    'How to Request Blood',
    'Find O+ Donors'
];

export default function LifePulseAssistant() {
    const [aiOpen, setAiOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'bot',
            text: "Hi! I'm your LifePulse assistant. How can I assist you with donor searches or donation guidelines today?"
        }
    ]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (aiOpen) {
            scrollToBottom();
        }
    }, [messages, aiOpen]);

    const handleSendMessage = async (textToSend) => {
        const text = (textToSend || inputMessage).trim();
        if (!text || isTyping) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Find the index of the first actual user message so we never start with a 'model' turn
            const firstUserIndex = messages.findIndex(m => m.sender === 'user');

            const validHistory = firstUserIndex !== -1
                ? messages.slice(firstUserIndex)
                    .filter(msg => msg.text)
                    .map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }))
                : [];

            const res = await axios.post('http://localhost:5000/api/chat', {
                message: text,
                history: validHistory
            });

            const botReply = {
                id: Date.now() + 1,
                sender: 'bot',
                text: res.data.reply
            };
            setMessages((prev) => [...prev, botReply]);
        } catch (err) {
            console.error('Chat API Error:', err);
            const fallbackReply = {
                id: Date.now() + 1,
                sender: 'bot',
                text: "I'm having trouble connecting to the LifePulse AI service. Please make sure the backend server is running on port 5000."
            };
            setMessages((prev) => [...prev, fallbackReply]);
        } finally {
            setIsTyping(false);
        }
    };
    const handleResetChat = () => {
        setMessages([
            {
                id: Date.now(),
                sender: 'bot',
                text: "Conversation reset. Feel free to ask any question regarding blood donation or platform guidance!"
            }
        ]);
    };

    return (
        <div className="fixed bottom-20 sm:bottom-12 right-6 sm:right-8 z-50 flex flex-col items-end">
            {/* Chat Popup Window */}
            {aiOpen && (
                <div className="w-80 sm:w-90 bg-[#16161c] border border-red-500/80 rounded-2xl shadow-2xl p-4 mb-3 glow-red transition duration-200 flex flex-col h-120 text-zinc-100">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-red-950/80 border border-red-800/60 p-0.5 flex items-center justify-center shrink-0">
                                <img src={mascotImg} alt="Mascot Avatar" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                    LifePulse Assistant <Sparkles size={11} className="text-red-400" />
                                </h4>
                                <p className="text-[10px] text-zinc-400">Emergency & Donation Guide</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleResetChat}
                                title="Reset chat"
                                className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition cursor-pointer"
                            >
                                <RotateCcw size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setAiOpen(false)}
                                className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Scroll Area */}
                    <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 whitespace-pre-line leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-red-600 text-white font-medium rounded-tr-none'
                                        : 'bg-[#101014] border border-zinc-800 text-zinc-300 rounded-tl-none shadow-sm'
                                        }`}
                                >
                                    {msg.text.replace(/\*\*/g, '')}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-[#101014] border border-zinc-800 text-zinc-400 text-[11px] px-3 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="pt-2 pb-2 border-t border-zinc-800/80 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                        {QUICK_PROMPTS.map((chip) => (
                            <button
                                key={chip}
                                type="button"
                                onClick={() => handleSendMessage(chip)}
                                className="bg-[#101014] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap transition cursor-pointer"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* Input Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="flex items-center gap-2 pt-1 shrink-0"
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask eligibility, matching, etc..."
                            disabled={isTyping}
                            className="flex-1 bg-[#101014] border border-zinc-700/80 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim() || isTyping}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shrink-0 cursor-pointer disabled:opacity-40 transition"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Circular Red Mascot Trigger Button */}
            <button
                type="button"
                onClick={() => setAiOpen(!aiOpen)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-950/90 hover:bg-red-900 border-2 border-red-600/80 p-2.5 shadow-2xl shadow-red-900/60 flex items-center justify-center hover:scale-105 active:scale-95 transition duration-200 cursor-pointer"
                title="Toggle AI Assistant"
            >
                <img
                    src={mascotImg}
                    alt="LifePulse AI Mascot"
                    className="w-full h-full object-contain drop-shadow-md"
                />
            </button>
        </div>
    );
}