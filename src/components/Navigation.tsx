import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

// Create a global language context
export const LanguageContext = React.createContext<{
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
}>({
  language: 'id',
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'id' | 'en'>('id');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = React.useContext(LanguageContext);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const content = {
    id: {
      mosqueName: 'Masjid Nurul Mujahidin',
      home: 'Beranda',
      leadership: 'Kepemimpinan',
      prayerTimes: 'Jadwal Shalat',
      infaqReport: 'Laporan Infaq',
      announcements: 'Pengumuman',
      admin: 'Admin',
      adminLogin: 'Login Admin',
      adminDashboard: 'Dashboard Admin',
      signOut: 'Keluar',
      languageLabel: 'Bahasa'
    },
    en: {
      mosqueName: 'Masjid Nurul Mujahidin',
      home: 'Home',
      leadership: 'Leadership',
      prayerTimes: 'Prayer Times',
      infaqReport: 'Infaq Report',
      announcements: 'Announcements',
      admin: 'Admin',
      adminLogin: 'Admin Login',
      adminDashboard: 'Admin Dashboard',
      signOut: 'Sign Out',
      languageLabel: 'Language'
    }
  };

  const currentContent = content[language];

  return (
    <nav className="bg-emerald-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">{currentContent.mosqueName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-amber-400" />
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 text-xs rounded ${
                  language === 'id' 
                    ? 'bg-amber-400 text-emerald-900 font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs rounded ${
                  language === 'en' 
                    ? 'bg-amber-400 text-emerald-900 font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <Link to="/" className="text-gray-200 hover:text-amber-400 transition-colors duration-200">
              {currentContent.home}
            </Link>
            <Link to="/leadership" className="text-gray-200 hover:text-amber-400 transition-colors duration-200">
              {currentContent.leadership}
            </Link>
            <Link to="/prayers" className="text-gray-200 hover:text-amber-400 transition-colors duration-200">
              {currentContent.prayerTimes}
            </Link>
            <Link to="/infaq" className="text-gray-200 hover:text-amber-400 transition-colors duration-200">
              {currentContent.infaqReport}
            </Link>
            <Link to="/announcements" className="text-gray-200 hover:text-amber-400 transition-colors duration-200">
              {currentContent.announcements}
            </Link>
            {user && (
              <div className="flex items-center space-x-2">
                <Link 
                  to="/admin" 
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  {currentContent.admin}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-200 hover:text-amber-400 transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-amber-400 transition-colors duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-emerald-800 pb-4">
            {/* Mobile Language Switcher */}
            <div className="px-3 py-2 border-b border-emerald-700">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-gray-300">{currentContent.languageLabel}:</span>
                <button
                  onClick={() => setLanguage('id')}
                  className={`px-2 py-1 text-xs rounded ${
                    language === 'id' 
                      ? 'bg-amber-400 text-emerald-900 font-semibold' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 text-xs rounded ${
                    language === 'en' 
                      ? 'bg-amber-400 text-emerald-900 font-semibold' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className={`block px-3 py-2 transition-colors duration-200 ${
                  location.pathname === '/' 
                    ? 'text-amber-400 bg-emerald-700 rounded-md' 
                    : 'text-gray-200 hover:text-amber-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {currentContent.home}
              </Link>
              <Link 
                to="/leadership" 
                className={`block px-3 py-2 transition-colors duration-200 ${
                  location.pathname === '/leadership' 
                    ? 'text-amber-400 bg-emerald-700 rounded-md' 
                    : 'text-gray-200 hover:text-amber-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {currentContent.leadership}
              </Link>
              <Link 
                to="/prayers" 
                className={`block px-3 py-2 transition-colors duration-200 ${
                  location.pathname === '/prayers' 
                    ? 'text-amber-400 bg-emerald-700 rounded-md' 
                    : 'text-gray-200 hover:text-amber-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {currentContent.prayerTimes}
              </Link>
              <Link 
                to="/infaq" 
                className={`block px-3 py-2 transition-colors duration-200 ${
                  location.pathname === '/infaq' 
                    ? 'text-amber-400 bg-emerald-700 rounded-md' 
                    : 'text-gray-200 hover:text-amber-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {currentContent.infaqReport}
              </Link>
              <Link 
                to="/announcements" 
                className={`block px-3 py-2 transition-colors duration-200 ${
                  location.pathname === '/announcements' 
                    ? 'text-amber-400 bg-emerald-700 rounded-md' 
                    : 'text-gray-200 hover:text-amber-400'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {currentContent.announcements}
              </Link>
              {user && (
                <>
                  <Link 
                    to="/admin" 
                    className={`block px-3 py-2 rounded-md mx-3 mt-2 transition-colors duration-200 ${
                      location.pathname === '/admin' 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {currentContent.adminDashboard}
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="block px-3 py-2 text-gray-200 hover:text-amber-400"
                  >
                    {currentContent.signOut}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;