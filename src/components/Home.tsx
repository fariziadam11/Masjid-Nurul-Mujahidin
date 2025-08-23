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
      communityMembers: 'Jamaah',

      programsEvents: 'Program & Acara',
      transparentFunding: 'Pendanaan Transparan',
      ourServices: 'Informasi Seputar Kegiatan Masjid',
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
      communityMembers: 'congregation',

      programsEvents: 'Programs & Events',
      transparentFunding: 'Transparent Funding',
      ourServices: 'Information about Mosque Activities',
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
      <section className="relative bg-emerald-900 text-white py-12 sm:py-16 md:py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6 sm:mb-8">
            <img
              src="/image/20240810_142403.png"
              alt="Al-Hidayah Mosque Logo"
              className="h-32 sm:h-40 md:h-52 w-auto mx-auto mb-4 sm:mb-6"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 px-2">
              {currentContent.welcome}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-2">
              {currentContent.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/prayers"
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
            >
              {currentContent.viewPrayerTimes}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              to="/announcements"
              className="border-2 border-white hover:bg-white hover:text-emerald-900 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base"
            >
              {currentContent.latestNews}
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-sm sm:text-base text-gray-600">{currentContent.communityMembers}</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Megaphone className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                {language === 'id' ? 'Mingguan' : 'Weekly'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">{currentContent.programsEvents}</p>
            </div>
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">100%</h3>
              <p className="text-sm sm:text-base text-gray-600">{currentContent.transparentFunding}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              {currentContent.ourServices}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              {currentContent.servicesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <Link
              to="/leadership"
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-emerald-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-emerald-200 transition-colors duration-200">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {currentContent.leadership}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {currentContent.leadershipDesc}
              </p>
              <span className="text-emerald-600 font-medium group-hover:text-emerald-700 text-sm sm:text-base">
                {currentContent.learnMore} →
              </span>
            </Link>

            <Link
              to="/prayers"
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-amber-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-amber-200 transition-colors duration-200">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {currentContent.prayerTimes}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {currentContent.prayerTimesDesc}
              </p>
              <span className="text-amber-600 font-medium group-hover:text-amber-700 text-sm sm:text-base">
                {currentContent.viewSchedule} →
              </span>
            </Link>

            <Link
              to="/infaq"
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors duration-200">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {currentContent.infaqReport}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {currentContent.infaqReportDesc}
              </p>
              <span className="text-green-600 font-medium group-hover:text-green-700 text-sm sm:text-base">
                {currentContent.viewReport} →
              </span>
            </Link>

            <Link
              to="/announcements"
              className="bg-white rounded-lg shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {currentContent.announcements}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {currentContent.announcementsDesc}
              </p>
              <span className="text-blue-600 font-medium group-hover:text-blue-700 text-sm sm:text-base">
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
