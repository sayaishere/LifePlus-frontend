import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './user/pages/Home';
import FindDonors from './user/pages/FindDonors';
import Profile from './user/pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './admin/pages/AdminDashboard';

// Shared Components
import UserHeader from './user/components/UserHeader';
import Footer from './components/Footer';
import RequestModal from './components/RequestModal';
import LifePulseAssistant from './components/LifePulseAssistant';

// Layout Wrapper
function UserLayout({ children, onRequestClick }) {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col justify-between relative">
      <UserHeader onRequestClick={onRequestClick} />
      <main className="flex-1 pb-24 sm:pb-12">{children}</main>
      <LifePulseAssistant />
      <Footer />
    </div>
  );
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <UserLayout onRequestClick={handleOpenModal}>
              <Home />
            </UserLayout>
          }
        />
        <Route
          path="/requests"
          element={
            <UserLayout onRequestClick={handleOpenModal}>
              <FindDonors />
            </UserLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <UserLayout onRequestClick={handleOpenModal}>
              <Profile />
            </UserLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <RequestModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </Router>
  );
}

export default App;