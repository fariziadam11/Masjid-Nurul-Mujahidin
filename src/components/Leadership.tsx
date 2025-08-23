import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { supabase, Leadership as LeadershipType } from '../lib/supabase';
import { LanguageContext } from './Navigation';

const Leadership: React.FC = () => {
  const [leaders, setLeaders] = useState<LeadershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    fetchLeadership();
  }, []);

  const content = {
    id: {
      title: 'Kepemimpinan Masjid',
      subtitle: 'Kenali para pemimpin yang berdedikasi yang membimbing komunitas masjid kami dengan kebijaksanaan, kasih sayang, dan komitmen terhadap nilai-nilai Islam.',
      dedication: 'Berdedikasi untuk melayani komunitas masjid kami dengan integritas dan prinsip-prinsip Islam.',
      noDataFound: 'Data kepemimpinan tidak ditemukan',
      noDataDesc: 'Informasi kepemimpinan akan ditampilkan di sini setelah tersedia.'
    },
    en: {
      title: 'Mosque Leadership',
      subtitle: 'Meet the dedicated leaders who guide our mosque community with wisdom, compassion, and commitment to Islamic values.',
      dedication: 'Dedicated to serving our mosque community with integrity and Islamic principles.',
      noDataFound: 'No leadership data found',
      noDataDesc: 'Leadership information will be displayed here once available.'
    }
  };

  const currentContent = content[language];

  const fetchLeadership = async () => {
    try {
      const { data, error } = await supabase
        .from('leadership')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error('Error fetching leadership:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentContent.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader) => (
            <div
              key={leader.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={leader.photo_url}
                  alt={leader.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{leader.name}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-4 w-4 text-amber-600" />
                  <span className="text-amber-600 font-medium">{leader.role}</span>
                </div>
                <p className="text-gray-600">
                  {currentContent.dedication}
                </p>
              </div>
            </div>
          ))}
        </div>

        {leaders.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{currentContent.noDataFound}</h3>
            <p className="text-gray-500">{currentContent.noDataDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leadership;