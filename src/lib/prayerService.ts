// Prayer Schedule Service
// Handles API calls to Aladhan API with fallback mechanisms

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

interface PrayerTime {
  id: string;
  prayer_name: string;
  time: string;
  date: string;
}

interface City {
  name: string;
  nameEn: string;
  latitude: number;
  longitude: number;
}

// List of cities in Indonesia with their coordinates
const cities: City[] = [
  { name: 'Jakarta Pusat', nameEn: 'Central Jakarta', latitude: -6.1754, longitude: 106.8272 },
  { name: 'Jakarta Utara', nameEn: 'North Jakarta', latitude: -6.1384, longitude: 106.8661 },
  { name: 'Jakarta Barat', nameEn: 'West Jakarta', latitude: -6.1697, longitude: 106.7893 },
  { name: 'Jakarta Selatan', nameEn: 'South Jakarta', latitude: -6.2297, longitude: 106.7997 },
  { name: 'Jakarta Timur', nameEn: 'East Jakarta', latitude: -6.2088, longitude: 106.8456 },
  { name: 'Bandung', nameEn: 'Bandung', latitude: -6.9175, longitude: 107.6191 },
  { name: 'Surabaya', nameEn: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
  { name: 'Medan', nameEn: 'Medan', latitude: 3.5952, longitude: 98.6722 },
  { name: 'Semarang', nameEn: 'Semarang', latitude: -6.9932, longitude: 110.4203 },
  { name: 'Palembang', nameEn: 'Palembang', latitude: -2.9761, longitude: 104.7754 },
  { name: 'Makassar', nameEn: 'Makassar', latitude: -5.1477, longitude: 119.4327 },
  { name: 'Tangerang', nameEn: 'Tangerang', latitude: -6.2024, longitude: 106.6527 },
  { name: 'Depok', nameEn: 'Depok', latitude: -6.4025, longitude: 106.7942 },
  { name: 'Bekasi', nameEn: 'Bekasi', latitude: -6.2349, longitude: 106.9896 },
  { name: 'Bogor', nameEn: 'Bogor', latitude: -6.5971, longitude: 106.8060 },
  { name: 'Yogyakarta', nameEn: 'Yogyakarta', latitude: -7.7971, longitude: 110.3708 },
  { name: 'Malang', nameEn: 'Malang', latitude: -7.9839, longitude: 112.6214 },
  { name: 'Denpasar', nameEn: 'Denpasar', latitude: -8.6500, longitude: 115.2167 },
  { name: 'Padang', nameEn: 'Padang', latitude: -0.9444, longitude: 100.4172 },
  { name: 'Manado', nameEn: 'Manado', latitude: 1.4748, longitude: 124.8421 }
];

// CORS proxy options
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors-anywhere.herokuapp.com/'
];

class PrayerService {
  private async makeRequest(url: string, attempt: number = 0): Promise<Response> {
    const maxAttempts = CORS_PROXIES.length + 2; // Direct + simple + proxy attempts
    
    try {
      if (attempt === 0) {
        // Direct API call with minimal headers
        return await fetch(url, {
          method: 'GET',
          mode: 'cors',
        });
      } else if (attempt === 1) {
        // Simple API call with no headers
        return await fetch(url);
      } else {
        // Use CORS proxy
        const proxyIndex = attempt - 2;
        if (proxyIndex < CORS_PROXIES.length) {
          const proxyUrl = CORS_PROXIES[proxyIndex] + url;
          return await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Origin': window.location.origin,
            },
          });
        }
      }
    } catch (error) {
      console.warn(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxAttempts - 1) {
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        return this.makeRequest(url, attempt + 1);
      }
    }
    
    throw new Error('All API attempts failed');
  }

  async fetchPrayerTimes(date: string, latitude: number, longitude: number, language: 'id' | 'en' = 'id'): Promise<PrayerTime[]> {
    const url = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=8`;
    
    try {
      const response = await this.makeRequest(url);
      
      if (!response.ok) {
        console.warn(`API returned status ${response.status}: ${response.statusText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: AladhanResponse = await response.json();
      
      if (data.code !== 200) {
        console.warn(`API returned error code ${data.code}: ${data.status}`);
        throw new Error(data.status || 'API returned error');
      }
      
      const timings = data.data.timings;
      return [
        {
          id: '1',
          prayer_name: language === 'id' ? 'Subuh' : 'Fajr',
          time: timings.Fajr,
          date: date
        },
        {
          id: '2',
          prayer_name: language === 'id' ? 'Terbit' : 'Sunrise',
          time: timings.Sunrise,
          date: date
        },
        {
          id: '3',
          prayer_name: language === 'id' ? 'Dzuhur' : 'Dhuhr',
          time: timings.Dhuhr,
          date: date
        },
        {
          id: '4',
          prayer_name: language === 'id' ? 'Ashar' : 'Asr',
          time: timings.Asr,
          date: date
        },
        {
          id: '5',
          prayer_name: language === 'id' ? 'Maghrib' : 'Maghrib',
          time: timings.Maghrib,
          date: date
        },
        {
          id: '6',
          prayer_name: language === 'id' ? 'Isya' : 'Isha',
          time: timings.Isha,
          date: date
        }
      ];
    } catch (error) {
      console.error('Prayer service error:', error);
      
      // Provide more specific error information
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          console.warn('CORS or network error detected - this is expected in some browsers');
        }
      }
      
      throw error;
    }
  }

  getCities(): City[] {
    return cities;
  }

  findCity(cityKey: string): City | undefined {
    return cities.find(city => 
      city.name.toLowerCase().replace(/\s+/g, '') === cityKey ||
      city.nameEn.toLowerCase().replace(/\s+/g, '') === cityKey
    );
  }

  getDefaultCity(): City {
    return cities[0]; // Jakarta Pusat
  }

  // Fallback prayer times for Jakarta (approximate)
  getFallbackPrayerTimes(date: string, language: 'id' | 'en' = 'id'): PrayerTime[] {
    // These are approximate times for Jakarta
    const fallbackTimes = {
      '2025-01-23': {
        Fajr: '04:30',
        Sunrise: '05:55',
        Dhuhr: '12:00',
        Asr: '15:15',
        Maghrib: '18:05',
        Isha: '19:20'
      },
      '2025-01-24': {
        Fajr: '04:30',
        Sunrise: '05:55',
        Dhuhr: '12:00',
        Asr: '15:15',
        Maghrib: '18:05',
        Isha: '19:20'
      },
      '2025-08-24': {
        Fajr: '04:45',
        Sunrise: '06:00',
        Dhuhr: '12:00',
        Asr: '15:30',
        Maghrib: '18:00',
        Isha: '19:15'
      }
    };
    
    // Default times for any date not in the list
    const defaultTimes = {
      Fajr: '04:30',
      Sunrise: '05:55',
      Dhuhr: '12:00',
      Asr: '15:15',
      Maghrib: '18:05',
      Isha: '19:20'
    };
    
    const times = fallbackTimes[date as keyof typeof fallbackTimes] || defaultTimes;
    
    return [
      {
        id: '1',
        prayer_name: language === 'id' ? 'Subuh' : 'Fajr',
        time: times.Fajr,
        date: date
      },
      {
        id: '2',
        prayer_name: language === 'id' ? 'Terbit' : 'Sunrise',
        time: times.Sunrise,
        date: date
      },
      {
        id: '3',
        prayer_name: language === 'id' ? 'Dzuhur' : 'Dhuhr',
        time: times.Dhuhr,
        date: date
      },
      {
        id: '4',
        prayer_name: language === 'id' ? 'Ashar' : 'Asr',
        time: times.Asr,
        date: date
      },
      {
        id: '5',
        prayer_name: language === 'id' ? 'Maghrib' : 'Maghrib',
        time: times.Maghrib,
        date: date
      },
      {
        id: '6',
        prayer_name: language === 'id' ? 'Isya' : 'Isha',
        time: times.Isha,
        date: date
      }
    ];
  }
}

export const prayerService = new PrayerService();
export type { PrayerTime, City, AladhanResponse };
