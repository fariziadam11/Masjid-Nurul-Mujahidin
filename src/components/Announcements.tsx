import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Clock } from 'lucide-react';
import { supabase, Announcement } from '../lib/supabase';
import { LanguageContext } from './Navigation';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const content = {
    id: {
      title: 'Pengumuman Masjid',
      subtitle: 'Tetap terhubung dengan berita terbaru, acara, dan pengumuman dari komunitas masjid kami.',
      latest: 'Terbaru',
      noAnnouncementsFound: 'Tidak ada pengumuman ditemukan',
      noAnnouncementsDesc: 'Kembali lagi nanti untuk pengumuman dan pembaruan masjid.',
      stayConnected: 'Tetap Terhubung',
      stayConnectedDesc: 'Ingin tetap terhubung dengan semua kegiatan dan pengumuman masjid?',
      followSocial: 'Ikuti saluran media sosial kami',
      subscribeWhatsapp: 'Berlangganan daftar siaran WhatsApp kami',
      visitWebsite: 'Kunjungi situs web kami secara teratur untuk pembaruan',
      joinNewsletter: 'Bergabung dengan newsletter mingguan kami',
      today: 'Hari ini',
      yesterday: 'Kemarin',
      daysAgo: 'hari yang lalu',
      weeksAgo: 'minggu yang lalu',
      monthsAgo: 'bulan yang lalu'
    },
    en: {
      title: 'Mosque Announcements',
      subtitle: 'Stay updated with the latest news, events, and announcements from our mosque community.',
      latest: 'Latest',
      noAnnouncementsFound: 'No announcements found',
      noAnnouncementsDesc: 'Check back later for mosque announcements and updates.',
      stayConnected: 'Stay Connected',
      stayConnectedDesc: 'Want to stay updated with all mosque activities and announcements?',
      followSocial: 'Follow our social media channels',
      subscribeWhatsapp: 'Subscribe to our WhatsApp broadcast list',
      visitWebsite: 'Visit our website regularly for updates',
      joinNewsletter: 'Join our weekly newsletter',
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: 'days ago',
      weeksAgo: 'weeks ago',
      monthsAgo: 'months ago'
    }
  };

  const currentContent = content[language];

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return currentContent.today;
    if (diffInDays === 1) return currentContent.yesterday;
    if (diffInDays < 7) return `${diffInDays} ${currentContent.daysAgo}`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} ${currentContent.weeksAgo}`;
    return `${Math.floor(diffInDays / 30)} ${currentContent.monthsAgo}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentContent.title}</h1>
          <p className="text-lg text-gray-600">
            {currentContent.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement, index) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                index === 0 ? 'border-l-4 border-l-amber-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Megaphone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {announcement.title}
                      </h3>
                      {index === 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                          {currentContent.latest}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {announcement.content}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{getTimeAgo(announcement.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{currentContent.noAnnouncementsFound}</h3>
            <p className="text-gray-500">{currentContent.noAnnouncementsDesc}</p>
          </div>
        )}

        <div className="mt-12 bg-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Megaphone className="h-5 w-5 mr-2 text-emerald-600" />
            {currentContent.stayConnected}
          </h3>
          <p className="text-gray-700 mb-3">
            {currentContent.stayConnectedDesc}
          </p>
          <ul className="text-gray-600 space-y-1">
            <li>• {currentContent.followSocial}</li>
            <li>• {currentContent.subscribeWhatsapp}</li>
            <li>• {currentContent.visitWebsite}</li>
            <li>• {currentContent.joinNewsletter}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Announcements;