import React from 'react';
import { Fuel as Mosque, Phone, Mail, MapPin } from 'lucide-react';
import { LanguageContext } from './Navigation';

const Footer: React.FC = () => {
  const { language } = React.useContext(LanguageContext);

  const content = {
    id: {
      mosqueName: 'Masjid Al-Hidayah',
      description: 'Tempat ibadah, pembelajaran, dan berkumpulnya komunitas untuk semua umat Muslim. Bergabunglah dengan kami dalam shalat dan kegiatan komunitas kami.',
      established: 'Didirikan 1985',
      contactInfo: 'Informasi Kontak',
      address: 'Jalan Budi Mulya, RT 15/RW 10, Pademangan, RT.15/RW.10, Pademangan Bar., Kec. Pademangan, Jkt Utara, Daerah Khusus Ibukota Jakarta 14420',
      phone: '+62-812-8681-1742',
      email: 'masmujahidin@gmail.com',
      copyright: '© 2024 Masjid Al-Hidayah. Semua hak dilindungi.'
    },
    en: {
      mosqueName: 'Al-Hidayah Mosque',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mosque Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Mosque className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold">{currentContent.mosqueName}</span>
            </div>
            <p className="text-gray-300 mb-4">
              {currentContent.description}
            </p>
            <div className="text-sm text-gray-400">
              {currentContent.established}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{currentContent.contactInfo}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>{currentContent.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">{currentContent.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <span className="text-gray-300">{currentContent.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-800 mt-8 pt-8 text-center text-gray-400">
          <p>{currentContent.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;