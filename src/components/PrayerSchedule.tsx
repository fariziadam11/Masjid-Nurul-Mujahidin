import React, { useState, useEffect } from 'react';
import { Clock, Sun, Sunrise, Sunset, Moon } from 'lucide-react';
import { LanguageContext } from './Navigation';

interface PrayerTime {
  id: string;
  prayer_name: string;
  time: string;
  date: string;
}

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
    };
    date: {
      readable: string;
      timestamp: string;
    };
  };
}

const PrayerSchedule: React.FC = () => {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    fetchPrayerSchedule();
  }, []);

  const content = {
    id: {
      title: 'Jadwal Sholat',
      subtitle: 'Jadwal sholat harian untuk Masjid Nurul Mujahidin. Bergabunglah dengan kami untuk sholat berjamaah.',
      currentTime: 'Waktu sekarang',
      todaySchedule: 'Jadwal Sholat Hari Ini',
      currentPrayer: 'SAAT INI',
      noScheduleFound: 'Jadwal sholat tidak ditemukan',
      noScheduleDesc: 'Jadwal sholat akan ditampilkan di sini setelah tersedia.',
      importantNotes: 'Catatan Penting',
      note1: 'Sholat berjamaah dimulai 10 menit setelah adzan',
      note2: 'Khutbah Jumat dimulai pukul 12:00, diikuti sholat Jumat',
      note3: 'Masjid dibuka 30 menit sebelum waktu sholat',
      note4: 'Jadwal khusus Ramadhan akan diumumkan selama bulan suci',
      note5: 'Jadwal sholat menggunakan koordinat Jakarta (dapat diubah sesuai lokasi)',
      errorTitle: 'Error Loading Prayer Times',
      tryAgain: 'Coba Lagi'
    },
    en: {
      title: 'Prayer Schedule',
      subtitle: 'Daily prayer schedule for Nurul Mujahidin Mosque. Join us for congregational prayers.',
      currentTime: 'Current time',
      todaySchedule: 'Today\'s Prayer Schedule',
      currentPrayer: 'CURRENT',
      noScheduleFound: 'Prayer schedule not found',
      noScheduleDesc: 'Prayer schedule will be displayed here once available.',
      importantNotes: 'Important Notes',
      note1: 'Congregational prayer starts 10 minutes after adhan',
      note2: 'Friday sermon starts at 12:00, followed by Friday prayer',
      note3: 'Mosque opens 30 minutes before prayer time',
      note4: 'Special Ramadan schedule will be announced during the holy month',
      note5: 'Prayer schedule uses Jakarta coordinates (can be changed according to location)',
      errorTitle: 'Error Loading Prayer Times',
      tryAgain: 'Try Again'
    }
  };

  const currentContent = content[language];

  const fetchPrayerSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current date
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      setCurrentDate(dateStr);
      
      // Jakarta coordinates (you can change this to any city in Indonesia)
      const latitude = -6.2088;
      const longitude = 106.8456;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=8`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }
      
      const data: AladhanResponse = await response.json();
      
      if (data.code !== 200) {
        throw new Error(data.status || 'Failed to fetch prayer times');
      }
      
      const timings = data.data.timings;
      const prayerTimes: PrayerTime[] = [
        {
          id: '1',
          prayer_name: language === 'id' ? 'Subuh' : 'Fajr',
          time: timings.Fajr,
          date: dateStr
        },
        {
          id: '2',
          prayer_name: language === 'id' ? 'Terbit' : 'Sunrise',
          time: timings.Sunrise,
          date: dateStr
        },
        {
          id: '3',
          prayer_name: language === 'id' ? 'Dzuhur' : 'Dhuhr',
          time: timings.Dhuhr,
          date: dateStr
        },
        {
          id: '4',
          prayer_name: language === 'id' ? 'Ashar' : 'Asr',
          time: timings.Asr,
          date: dateStr
        },
        {
          id: '5',
          prayer_name: language === 'id' ? 'Maghrib' : 'Maghrib',
          time: timings.Maghrib,
          date: dateStr
        },
        {
          id: '6',
          prayer_name: language === 'id' ? 'Isya' : 'Isha',
          time: timings.Isha,
          date: dateStr
        }
      ];
      
      setPrayers(prayerTimes);
    } catch (error) {
      console.error('Error fetching prayer schedule:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch prayer times');
    } finally {
      setLoading(false);
    }
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
    return new Date().toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isCurrentPrayer = (prayerTime: string) => {
    const currentTime = getCurrentTime();
    const current = new Date(`2000-01-01 ${currentTime}`);
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
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentContent.title}</h1>
          <p className="text-lg text-gray-600">
            {currentContent.subtitle}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {currentContent.currentTime}: {getCurrentTime()}
          </div>
          {currentDate && (
            <div className="mt-2 text-sm text-gray-500">
              {formatDate(currentDate)}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-emerald-900 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="h-6 w-6 mr-2" />
              {currentContent.todaySchedule}
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                  isCurrentPrayer(prayer.time) ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {getPrayerIcon(prayer.prayer_name)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{prayer.prayer_name}</h3>
                    {isCurrentPrayer(prayer.time) && (
                      <span className="text-xs text-amber-600 font-medium">{currentContent.currentPrayer}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-700">{prayer.time}</div>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { weekday: 'long' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {prayers.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{currentContent.noScheduleFound}</h3>
            <p className="text-gray-500">{currentContent.noScheduleDesc}</p>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{currentContent.importantNotes}</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• {currentContent.note1}</li>
            <li>• {currentContent.note2}</li>
            <li>• {currentContent.note3}</li>
            <li>• {currentContent.note4}</li>
            <li>• {currentContent.note5}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrayerSchedule;