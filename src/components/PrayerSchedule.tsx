import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunrise, Sunset, Moon, MapPin, ChevronDown, Search, X, Play, Pause } from 'lucide-react';
import { prayerService, type PrayerTime, type City } from '../lib/prayerService';

const PrayerSchedule: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('jakarta');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  useEffect(() => {
    fetchPrayerSchedule();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCity]);

  useEffect(() => {
    if (prayers.length > 0) {
      calculateNextPrayer();
    }
  }, [prayers, currentTime]);

  const content = {
    id: {
      title: 'Jadwal Sholat',
      subtitle: 'Jadwal sholat harian untuk Masjid Nurul Mujahidin. Bergabunglah dengan kami untuk sholat berjamaah.',
      currentTime: 'Waktu sekarang',
      todaySchedule: 'Jadwal Sholat Hari Ini',
      currentPrayer: 'SAAT INI',
      nextPrayer: 'SHALAT BERIKUTNYA',
      timeUntilNext: 'dalam',
      noScheduleFound: 'Jadwal sholat tidak ditemukan',
      noScheduleDesc: 'Jadwal sholat akan ditampilkan di sini setelah tersedia.',
      importantNotes: 'Catatan Penting',
      note1: 'Sholat berjamaah dimulai 10 menit setelah adzan',
      note2: 'Khutbah Jumat dimulai pukul 12:00, diikuti sholat Jumat',
      note3: 'Masjid dibuka 30 menit sebelum waktu sholat',
      note4: 'Jadwal khusus Ramadhan akan diumumkan selama bulan suci',
      note5: 'Jadwal sholat menggunakan koordinat kota yang dipilih',
      selectLocation: 'Pilih Lokasi',
      searchLocation: 'Cari lokasi...',
      errorTitle: 'Error Loading Prayer Times',
      tryAgain: 'Coba Lagi'
    },
    en: {
      title: 'Prayer Schedule',
      subtitle: 'Daily prayer schedule for Nurul Mujahidin Mosque. Join us for congregational prayers.',
      currentTime: 'Current time',
      todaySchedule: 'Today\'s Prayer Schedule',
      currentPrayer: 'CURRENT',
      nextPrayer: 'NEXT PRAYER',
      timeUntilNext: 'in',
      noScheduleFound: 'Prayer schedule not found',
      noScheduleDesc: 'Prayer schedule will be displayed here once available.',
      importantNotes: 'Important Notes',
      note1: 'Congregational prayer starts 10 minutes after adhan',
      note2: 'Friday sermon starts at 12:00, followed by Friday prayer',
      note3: 'Mosque opens 30 minutes before prayer time',
      note4: 'Special Ramadan schedule will be announced during the holy month',
      note5: 'Prayer schedule uses coordinates of selected city',
      selectLocation: 'Select Location',
      searchLocation: 'Search location...',
      errorTitle: 'Error Loading Prayer Times',
      tryAgain: 'Try Again'
    }
  };

  const currentContent = content[language];

  // Get cities from service
  const cities = prayerService.getCities();

  const filteredCities = cities.filter(city => 
    (language === 'id' ? city.name : city.nameEn)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const calculateNextPrayer = () => {
    const now = new Date();
    const currentTimeStr = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    let next = null;
    for (const prayer of prayers) {
      const prayerTime = new Date(`2000-01-01 ${prayer.time}`);
      const current = new Date(`2000-01-01 ${currentTimeStr}`);
      
      if (prayerTime > current) {
        next = prayer;
        break;
      }
    }

    // If no next prayer today, get first prayer of tomorrow
    if (!next && prayers.length > 0) {
      next = prayers[0];
    }

    setNextPrayer(next);
  };

  const calculateTimeUntil = (prayerTime: string) => {
    const now = new Date();
    const prayer = new Date(`2000-01-01 ${prayerTime}`);
    const current = new Date(`2000-01-01 ${now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`);

    let diff = prayer.getTime() - current.getTime();
    
    // If prayer time has passed today, calculate for tomorrow
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const fetchPrayerSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current date
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      setCurrentDate(dateStr);
      
      // Get selected city coordinates
      const selectedCityData = prayerService.findCity(selectedCity) || prayerService.getDefaultCity();
      const { latitude, longitude } = selectedCityData;
      
      try {
        // Try to fetch from API service
        const prayerTimes = await prayerService.fetchPrayerTimes(dateStr, latitude, longitude, language);
        setPrayers(prayerTimes);
      } catch (apiError) {
        console.warn('API call failed, using fallback times:', apiError);
        
        // Use fallback prayer times
        const fallbackTimes = prayerService.getFallbackPrayerTimes(dateStr, language);
        setPrayers(fallbackTimes);
        
        // Show a warning but don't treat it as an error
        console.log('Using fallback prayer times due to API unavailability');
      }
    } catch (error) {
      console.error('Error fetching prayer schedule:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to fetch prayer times';
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('Content Security Policy')) {
          errorMessage = 'Network access blocked by browser security. Please try refreshing the page or contact support.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to prayer time service. Please check your internet connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (cityKey: string) => {
    setSelectedCity(cityKey);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const getSelectedCityName = () => {
    const city = prayerService.findCity(selectedCity);
    return city ? (language === 'id' ? city.name : city.nameEn) : 'Jakarta Pusat';
  };

  const getPrayerIcon = (prayerName: string) => {
    const prayerLower = prayerName.toLowerCase();
    if (prayerLower === 'subuh' || prayerLower === 'fajr') {
      return <Sunrise className="h-6 w-6 text-orange-500" />;
    } else if (prayerLower === 'terbit' || prayerLower === 'sunrise') {
      return <Sunrise className="h-6 w-6 text-yellow-400" />;
    } else if (prayerLower === 'dzuhur' || prayerLower === 'dhuhr') {
      return <Sun className="h-6 w-6 text-yellow-500" />;
    } else if (prayerLower === 'ashar' || prayerLower === 'asr') {
      return <Sun className="h-6 w-6 text-amber-500" />;
    } else if (prayerLower === 'maghrib') {
      return <Sunset className="h-6 w-6 text-red-500" />;
    } else if (prayerLower === 'isya' || prayerLower === 'isha') {
      return <Moon className="h-6 w-6 text-blue-500" />;
    } else {
      return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isCurrentPrayer = (prayerTime: string) => {
    const current = new Date(`2000-01-01 ${getCurrentTime()}`);
    const prayer = new Date(`2000-01-01 ${prayerTime}`);
    
    return Math.abs(current.getTime() - prayer.getTime()) < 30 * 60 * 1000; // Within 30 minutes
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-300 rounded-lg w-1/2 mx-auto"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
              <div className="h-8 bg-gray-300 rounded w-1/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 mb-2">{currentContent.errorTitle}</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchPrayerSchedule}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {currentContent.tryAgain}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentContent.title}</h1>
          <p className="text-lg text-gray-600">
            {currentContent.subtitle}
          </p>
          
          {/* Enhanced Location Selector */}
          <div className="mt-8 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {currentContent.selectLocation}
            </label>
            <div className="relative max-w-md mx-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-left shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span className="text-gray-900 font-medium">{getSelectedCityName()}</span>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder={currentContent.searchLocation}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        autoFocus
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="h-3 w-3 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cities List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredCities.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No cities found
                      </div>
                    ) : (
                      filteredCities.map((city) => {
                        const cityKey = city.name.toLowerCase().replace(/\s+/g, '');
                        const isSelected = selectedCity === cityKey;
                        
                        return (
                          <button
                            key={city.name}
                            onClick={() => handleCitySelect(cityKey)}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group ${
                              isSelected ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <MapPin className={`h-4 w-4 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                              <span className="font-medium">
                                {language === 'id' ? city.name : city.nameEn}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Overlay to close dropdown */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>
          </div>
          
          {/* Current Time & Date */}
          <div className="mt-4 text-sm text-gray-500">
            {currentContent.currentTime}: {getCurrentTime()}
          </div>
          {currentDate && (
            <div className="mt-2 text-sm text-gray-500">
              {formatDate(currentDate)}
            </div>
          )}
        </div>

        {/* Next Prayer Countdown */}
        {nextPrayer && (
          <div className="mb-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">{currentContent.nextPrayer}</h3>
              <div className="flex items-center justify-center space-x-4 mb-3">
                {getPrayerIcon(nextPrayer.prayer_name)}
                <span className="text-2xl font-bold">{nextPrayer.prayer_name}</span>
              </div>
              <div className="text-sm opacity-90">
                {currentContent.timeUntilNext} <span className="font-bold text-xl">{calculateTimeUntil(nextPrayer.time)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Prayer Schedule Timeline */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="h-6 w-6 mr-2" />
              {currentContent.todaySchedule}
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-200"></div>
            
            <div className="divide-y divide-gray-100">
              {prayers.map((prayer, index) => (
                <div
                  key={prayer.id}
                  className={`relative px-6 py-6 hover:bg-gray-50 transition-all duration-300 ${
                    isCurrentPrayer(prayer.time) ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-6 w-4 h-4 rounded-full border-4 border-white shadow-lg transform -translate-x-2 ${
                    isCurrentPrayer(prayer.time) 
                      ? 'bg-amber-500 border-amber-500' 
                      : 'bg-emerald-500 border-emerald-500'
                  }`}></div>
                  
                  <div className="ml-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        isCurrentPrayer(prayer.time) 
                          ? 'bg-amber-100 text-amber-600' 
                          : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {getPrayerIcon(prayer.prayer_name)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{prayer.prayer_name}</h3>
                        {isCurrentPrayer(prayer.time) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            {currentContent.currentPrayer}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-700">{prayer.time}</div>
                      <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {prayers.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{currentContent.noScheduleFound}</h3>
            <p className="text-gray-500">{currentContent.noScheduleDesc}</p>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            {currentContent.importantNotes}
          </h3>
          <ul className="text-gray-700 space-y-3">
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{currentContent.note1}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{currentContent.note2}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{currentContent.note3}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{currentContent.note4}</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span>{currentContent.note5}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrayerSchedule;