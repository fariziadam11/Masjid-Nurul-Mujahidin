import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { prayerService } from './prayerService';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock response data
const mockApiResponse = {
  code: 200,
  status: 'OK',
  data: {
    timings: {
      Fajr: '04:30',
      Sunrise: '05:55',
      Dhuhr: '12:00',
      Asr: '15:15',
      Sunset: '18:05',
      Maghrib: '18:05',
      Isha: '19:20'
    },
    date: {
      readable: '23 Jan 2025',
      timestamp: '1737657600'
    }
  }
};

describe('PrayerService', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Clean up after each test
    vi.clearAllMocks();
  });

  describe('getCities', () => {
    it('should return all cities', () => {
      const cities = prayerService.getCities();
      expect(cities).toHaveLength(20);
      expect(cities[0]).toEqual({
        name: 'Jakarta Pusat',
        nameEn: 'Central Jakarta',
        latitude: -6.1754,
        longitude: 106.8272
      });
    });
  });

  describe('findCity', () => {
    it('should find Jakarta Pusat by Indonesian name', () => {
      const city = prayerService.findCity('jakartapusat');
      expect(city).toBeDefined();
      expect(city?.name).toBe('Jakarta Pusat');
    });

    it('should find Jakarta Pusat by English name', () => {
      const city = prayerService.findCity('centraljakarta');
      expect(city).toBeDefined();
      expect(city?.nameEn).toBe('Central Jakarta');
    });

    it('should find Bandung', () => {
      const city = prayerService.findCity('bandung');
      expect(city).toBeDefined();
      expect(city?.name).toBe('Bandung');
    });

    it('should return undefined for non-existent city', () => {
      const city = prayerService.findCity('nonexistentcity');
      expect(city).toBeUndefined();
    });
  });

  describe('getDefaultCity', () => {
    it('should return Jakarta Pusat as default', () => {
      const defaultCity = prayerService.getDefaultCity();
      expect(defaultCity.name).toBe('Jakarta Pusat');
      expect(defaultCity.nameEn).toBe('Central Jakarta');
    });
  });

  describe('getFallbackPrayerTimes', () => {
    it('should return prayer times in Indonesian', () => {
      const times = prayerService.getFallbackPrayerTimes('2025-01-23', 'id');
      expect(times).toHaveLength(6);
      
      expect(times[0]).toEqual({
        id: '1',
        prayer_name: 'Subuh',
        time: '04:30',
        date: '2025-01-23'
      });

      expect(times[1]).toEqual({
        id: '2',
        prayer_name: 'Terbit',
        time: '05:55',
        date: '2025-01-23'
      });
    });

    it('should return prayer times in English', () => {
      const times = prayerService.getFallbackPrayerTimes('2025-01-23', 'en');
      expect(times).toHaveLength(6);
      
      expect(times[0]).toEqual({
        id: '1',
        prayer_name: 'Fajr',
        time: '04:30',
        date: '2025-01-23'
      });

      expect(times[1]).toEqual({
        id: '2',
        prayer_name: 'Sunrise',
        time: '05:55',
        date: '2025-01-23'
      });
    });

    it('should handle different dates', () => {
      const times = prayerService.getFallbackPrayerTimes('2025-01-24', 'id');
      expect(times).toHaveLength(6);
      expect(times[0].date).toBe('2025-01-24');
    });
  });

  describe('fetchPrayerTimes', () => {
    it('should successfully fetch prayer times from API', async () => {
      // This test verifies that the API is working and returns prayer times
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });
      const times = await prayerService.fetchPrayerTimes('2025-01-23', -6.1754, 106.8272, 'id');
      
      expect(times).toBeDefined();
      expect(times).toHaveLength(6);
      expect(times[0]).toHaveProperty('id');
      expect(times[0]).toHaveProperty('prayer_name');
      expect(times[0]).toHaveProperty('time');
      expect(times[0]).toHaveProperty('date');
      
      // Verify prayer names are in Indonesian
      expect(times[0].prayer_name).toBe('Subuh');
      expect(times[1].prayer_name).toBe('Terbit');
      expect(times[2].prayer_name).toBe('Dzuhur');
      expect(times[3].prayer_name).toBe('Ashar');
      expect(times[4].prayer_name).toBe('Maghrib');
      expect(times[5].prayer_name).toBe('Isya');
      
      // Verify times are in HH:MM format
      times.forEach(prayer => {
        expect(prayer.time).toMatch(/^\d{2}:\d{2}$/);
      });
    });

    it('should return prayer times in English when language is en', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });
      const times = await prayerService.fetchPrayerTimes('2025-01-23', -6.1754, 106.8272, 'en');
      
      expect(times).toBeDefined();
      expect(times).toHaveLength(6);
      
      // Verify prayer names are in English
      expect(times[0].prayer_name).toBe('Fajr');
      expect(times[1].prayer_name).toBe('Sunrise');
      expect(times[2].prayer_name).toBe('Dhuhr');
      expect(times[3].prayer_name).toBe('Asr');
      expect(times[4].prayer_name).toBe('Maghrib');
      expect(times[5].prayer_name).toBe('Isha');
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      await expect(
        prayerService.fetchPrayerTimes('2025-01-23', -6.1754, 106.8272, 'id')
      ).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should handle network errors gracefully', async () => {
      // Mock fetch to fail immediately for all attempts
      mockFetch.mockRejectedValue(new Error('Failed to fetch'));

      await expect(
        prayerService.fetchPrayerTimes('2025-01-23', -6.1754, 106.8272, 'id')
      ).rejects.toThrow('All API attempts failed');
    });
  });
});
