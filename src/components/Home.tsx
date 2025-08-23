import React from "react";
import { Link } from "react-router-dom";
import { Users, Clock, DollarSign, Megaphone, ArrowRight } from "lucide-react";
import { LanguageContext } from './Navigation';

const Home: React.FC = () => {
  const { language } = React.useContext(LanguageContext);

  const content = {
    id: {
      welcome: 'Selamat Datang di Masjid Nurul Mujahidin',
      description: 'Tempat ibadah, pembelajaran, dan berkumpulnya komunitas untuk semua umat Muslim. Bergabunglah dengan kami dalam shalat dan kegiatan komunitas kami.',
      viewPrayerTimes: 'Lihat Jadwal Shalat',
      latestNews: 'Berita Terbaru',
      communityMembers: 'Anggota Komunitas',
      dailyPrayers: 'Shalat Harian',
      programsEvents: 'Program & Acara',
      transparentFunding: 'Pendanaan Transparan',
      ourServices: 'Layanan Kami',
      servicesDescription: 'Jelajahi berbagai layanan dan informasi yang tersedia di masjid kami',
      leadership: 'Kepemimpinan',
      leadershipDesc: 'Kenali tim kepemimpinan masjid kami yang berdedikasi',
      learnMore: 'Pelajari Lebih Lanjut',
      prayerTimes: 'Jadwal Shalat',
      prayerTimesDesc: 'Jadwal shalat harian dan waktu jamaah',
      viewSchedule: 'Lihat Jadwal',
      infaqReport: 'Laporan Infaq',
      infaqReportDesc: 'Laporan keuangan transparan dan donasi',
      viewReport: 'Lihat Laporan',
      announcements: 'Pengumuman',
      announcementsDesc: 'Berita terbaru dan pembaruan komunitas',
      readMore: 'Baca Selengkapnya'
    },
    en: {
      welcome: 'Welcome to Masjid Nurul Mujahidin',
      description: 'A place of worship, learning, and community gathering for all Muslims. Join us in our prayers and community activities.',
      viewPrayerTimes: 'View Prayer Times',
      latestNews: 'Latest News',
      communityMembers: 'Community Members',
      dailyPrayers: 'Daily Prayers',
      programsEvents: 'Programs & Events',
      transparentFunding: 'Transparent Funding',
      ourServices: 'Our Services',
      servicesDescription: 'Explore the various services and information available at our mosque',
      leadership: 'Leadership',
      leadershipDesc: 'Meet our dedicated mosque leadership team',
      learnMore: 'Learn More',
      prayerTimes: 'Prayer Times',
      prayerTimesDesc: 'Daily prayer schedule and congregation times',
      viewSchedule: 'View Schedule',
      infaqReport: 'Infaq Report',
      infaqReportDesc: 'Transparent financial reporting and donations',
      viewReport: 'View Report',
      announcements: 'Announcements',
      announcementsDesc: 'Latest news and community updates',
      readMore: 'Read More'
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative bg-emerald-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <img
              src="/image/20240810_142403.png"
              alt="Al-Hidayah Mosque Logo"
              className="h-52 w-auto mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {currentContent.welcome}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {currentContent.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/prayers"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              {currentContent.viewPrayerTimes}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/announcements"
              className="border-2 border-white hover:bg-white hover:text-emerald-900 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              {currentContent.latestNews}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">{currentContent.communityMembers}</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">5</h3>
              <p className="text-gray-600">{currentContent.dailyPrayers}</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Weekly</h3>
              <p className="text-gray-600">{currentContent.programsEvents}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">100%</h3>
              <p className="text-gray-600">{currentContent.transparentFunding}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentContent.ourServices}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {currentContent.servicesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/leadership"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors duration-200">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentContent.leadership}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentContent.leadershipDesc}
              </p>
              <span className="text-emerald-600 font-medium group-hover:text-emerald-700">
                {currentContent.learnMore} →
              </span>
            </Link>

            <Link
              to="/prayers"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors duration-200">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentContent.prayerTimes}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentContent.prayerTimesDesc}
              </p>
              <span className="text-amber-600 font-medium group-hover:text-amber-700">
                {currentContent.viewSchedule} →
              </span>
            </Link>

            <Link
              to="/infaq"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-200">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentContent.infaqReport}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentContent.infaqReportDesc}
              </p>
              <span className="text-green-600 font-medium group-hover:text-green-700">
                {currentContent.viewReport} →
              </span>
            </Link>

            <Link
              to="/announcements"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                <Megaphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentContent.announcements}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentContent.announcementsDesc}
              </p>
              <span className="text-blue-600 font-medium group-hover:text-blue-700">
                {currentContent.readMore} →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
