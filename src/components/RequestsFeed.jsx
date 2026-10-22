import React from 'react';
import RequestsFeed from './components/RequestsFeed'; // Import the feed

function Dashboard() {
    return (
        <div className="min-h-screen bg-[#0f0f13] text-white p-6">
            <h1 classname="text-2xl font-bold mb-4">LifePulse Dashboard</h1>

            {/* Render your live requests feed here! */}
            <RequestsFeed />
        </div>
    );
}

export default Dashboard;