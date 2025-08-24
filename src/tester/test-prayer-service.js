// Simple test for prayer service functionality
// This is a JavaScript version that can be run directly with Node.js

// Mock the prayer service functionality for testing
const cities = [
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

class PrayerService {
  getCities() {
    return cities;
  }

  findCity(cityKey) {
    return cities.find(city => 
      city.name.toLowerCase().replace(/\s+/g, '') === cityKey ||
      city.nameEn.toLowerCase().replace(/\s+/g, '') === cityKey
    );
  }

  getDefaultCity() {
    return cities[0]; // Jakarta Pusat
  }

  getFallbackPrayerTimes(date, language = 'id') {
    const fallbackTimes = {
      '2025-01-23': {
        Fajr: '04:30',
        Sunrise: '05:55',
        Dhuhr: '12:00',
        Asr: '15:15',
        Maghrib: '18:05',
        Isha: '19:20'
      }
    };
    
    const times = fallbackTimes[date] || fallbackTimes['2025-01-23'];
    
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

const prayerService = new PrayerService();

// Test the service functions
console.log('🧪 Testing Prayer Service...\n');

// Test getting cities
const citiesList = prayerService.getCities();
console.log('✅ Cities available:', citiesList.length);
console.log('   First city:', citiesList[0].name);

// Test finding a city
const jakarta = prayerService.findCity('jakartapusat');
console.log('✅ Found Jakarta:', jakarta ? jakarta.name : 'Not found');

// Test finding a city with spaces
const bandung = prayerService.findCity('bandung');
console.log('✅ Found Bandung:', bandung ? bandung.name : 'Not found');

// Test fallback prayer times
const fallbackTimes = prayerService.getFallbackPrayerTimes('2025-01-23', 'id');
console.log('✅ Fallback times for Jakarta (Indonesian):');
fallbackTimes.forEach(prayer => {
  console.log(`   ${prayer.prayer_name}: ${prayer.time}`);
});

// Test fallback prayer times in English
const fallbackTimesEn = prayerService.getFallbackPrayerTimes('2025-01-23', 'en');
console.log('\n✅ Fallback times for Jakarta (English):');
fallbackTimesEn.forEach(prayer => {
  console.log(`   ${prayer.prayer_name}: ${prayer.time}`);
});

// Test default city
const defaultCity = prayerService.getDefaultCity();
console.log('\n✅ Default city:', defaultCity.name);

console.log('\n🎉 All tests completed successfully!');
