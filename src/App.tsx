import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation, { LanguageProvider } from './components/Navigation';
import Footer from './components/Footer';
import Home from './components/Home';
import Leadership from './components/Leadership';
import PrayerSchedule from './components/PrayerSchedule';
import InfaqReport from './components/InfaqReport';
import Announcements from './components/Announcements';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/prayers" element={<PrayerSchedule />} />
              <Route path="/infaq" element={<InfaqReport />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;