import React from 'react';
import { Fuel as Mosque, Phone, Mail, MapPin } from 'lucide-react';
import { LanguageContext } from './Navigation';

const Footer: React.FC = () => {
  const { language } = React.useContext(LanguageContext);

  const content = {
    id: {
      mosqueName: 'Masjid Nurul Mujahidin',
      description: 'Tempat ibadah, pembelajaran, dan berkumpulnya komunitas untuk semua umat Muslim. Bergabunglah dengan kami dalam shalat dan kegiatan komunitas kami.',
      established: 'Didirikan 1985',
      contactInfo: 'Informasi Kontak',
      address: 'Jalan Budi Mulya, RT 15/RW 10, Pademangan, RT.15/RW.10, Pademangan Bar., Kec. Pademangan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14420',
      phone: '+62-812-8681-1742',
      email: 'masmujahidin@gmail.com',
      copyright: '© 2024 Masjid Al-Hidayah. Semua hak dilindungi.'
    },
    en: {
      mosqueName: 'Nurul Mujahidin Mosque',
      description: 'A place of worship, learning, and community gathering for all Muslims. Join us in our prayers and community activities.',
      established: 'Est. 1985',
      contactInfo: 'Contact Information',
      address: 'Jalan Budi Mulya, RT 15/RW 10, Pademangan, RT.15/RW.10, Pademangan Bar., Kec. Pademangan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14420',
      phone: '+62-812-8681-1742',
      email: 'masmujahidin@gmail.com',
      copyright: '© 2024 Al-Hidayah Mosque. All rights reserved.'
    }
  };

  const currentContent = content[language];

  return (
    <footer className="bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Mosque Info */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
              <img 
                src="/image/20240810_142403.png" 
                alt="Nurul Mujahidin" 
                className="h-10 w-10 sm:h-12 sm:w-12 mx-auto sm:mx-0" 
              />
              <span className="text-lg sm:text-xl font-bold text-center sm:text-left">
                {currentContent.mosqueName}
              </span>
            </div>
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              {currentContent.description}
            </p>
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              {currentContent.established}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 lg:mt-0">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-center lg:text-left">
              {currentContent.contactInfo}
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 mt-0.5 flex-shrink-0 mx-auto sm:mx-0" />
                <div className="text-gray-300 text-center sm:text-left">
                  <p className="text-xs sm:text-sm leading-relaxed break-words">
                    {currentContent.address}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 flex-shrink-0 mx-auto sm:mx-0" />
                <a 
                  href={`tel:${currentContent.phone}`}
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-center sm:text-left text-sm sm:text-base"
                >
                  {currentContent.phone}
                </a>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400 flex-shrink-0 mx-auto sm:mx-0" />
                <a 
                  href={`mailto:${currentContent.email}`}
                  className="text-gray-300 hover:text-amber-400 transition-colors duration-200 text-center sm:text-left text-sm sm:text-base break-all"
                >
                  {currentContent.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            {currentContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;