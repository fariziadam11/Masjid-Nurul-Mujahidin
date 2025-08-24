# 📊 Monitoring & Logging System Documentation

## Overview
Sistem monitoring dan logging yang komprehensif untuk aplikasi manajemen masjid. Sistem ini melacak aktivitas pengguna, performa aplikasi, dan event keamanan secara real-time.

## 🎯 Fitur Utama

### 1. **Activity Logging**
- Log semua aktivitas admin (CRUD operations)
- Log autentikasi (login/logout)
- Log error dan warning
- Log performa aplikasi

### 2. **Performance Monitoring**
- Page load times
- API call response times
- Database query performance
- Real-time metrics

### 3. **Security Monitoring**
- Login attempts (success/failure)
- Suspicious activities
- Permission violations
- Security alerts

### 4. **Analytics Dashboard**
- Overview metrics
- Filterable logs
- Performance charts
- Security event tracking

## 🏗️ Arsitektur Sistem

### Core Components
```
src/lib/monitoring.ts          # Core monitoring system
src/components/MonitoringDashboard.tsx  # Dashboard UI
```

### Data Storage
- **Local Storage**: Temporary storage untuk logs
- **Supabase**: Permanent storage (production)
- **Export**: JSON format untuk backup

## 📋 Kategori Log

### 1. **Authentication (auth)**
- `user_login`: Login berhasil
- `user_logout`: Logout
- `login_attempt`: Percobaan login
- `login_failure`: Login gagal
- `login_error`: Error saat login

### 2. **Financial (financial)**
- `transaction_created`: Transaksi baru
- `transaction_updated`: Update transaksi
- `transaction_deleted`: Hapus transaksi
- `financial_report_generated`: Laporan keuangan

### 3. **Admin (admin)**
- `data_created`: Data baru dibuat
- `data_updated`: Data diupdate
- `data_deleted`: Data dihapus
- `user_management`: Manajemen user

### 4. **System (system)**
- `javascript_error`: Error JavaScript
- `api_error`: Error API call
- `database_error`: Error database
- `performance_issue`: Masalah performa

### 5. **Security (security)**
- `login_attempt`: Percobaan login
- `login_success`: Login berhasil
- `login_failure`: Login gagal
- `logout`: Logout
- `permission_denied`: Akses ditolak
- `suspicious_activity`: Aktivitas mencurigakan

### 6. **Performance (performance)**
- `page_load`: Waktu load halaman
- `api_call`: Waktu response API
- `database_query`: Waktu query database
- `render_time`: Waktu render komponen

## 🔧 Cara Penggunaan

### Basic Logging
```typescript
import { logInfo, logError, logWarn, logDebug } from '../lib/monitoring';

// Info log
logInfo('auth', 'user_login', { userId: '123', email: 'user@example.com' });

// Error log
logError('system', 'api_error', { endpoint: '/api/data', error: 'Network error' });

// Warning log
logWarn('admin', 'data_deleted', { table: 'users', id: '456' });

// Debug log
logDebug('performance', 'api_call', { url: '/api/users', duration: 150 });
```

### Security Events
```typescript
import { logSecurity } from '../lib/monitoring';

// Login attempt
logSecurity('login_attempt', 'low', { email: 'user@example.com' });

// Failed login
logSecurity('login_failure', 'medium', { 
  email: 'user@example.com', 
  reason: 'Invalid password' 
});

// Successful login
logSecurity('login_success', 'low', { 
  email: 'user@example.com' 
}, 'user-id-123', 'user@example.com');
```

### Performance Monitoring
```typescript
import { logPerformance } from '../lib/monitoring';

// Page load time
logPerformance('page_load', 1200, 'ms', { url: '/admin' });

// API call duration
logPerformance('api_call', 250, 'ms', { 
  endpoint: '/api/financial', 
  method: 'POST' 
});
```

## 📊 Dashboard Features

### 1. **Overview Tab**
- Total logs dalam 24 jam
- Total errors dan warnings
- Security events
- Performance metrics

### 2. **Logs Tab**
- Filterable activity logs
- Search by level, category, date
- Detailed log information
- Export functionality

### 3. **Performance Tab**
- Page load times
- API response times
- Database performance
- Performance trends

### 4. **Security Tab**
- Security events
- Login attempts
- Suspicious activities
- Security alerts

## 🔍 Filtering & Search

### Log Filters
- **Level**: error, warn, info, debug
- **Category**: auth, financial, admin, system, security, performance
- **Date Range**: Start date to end date
- **User**: Filter by user ID or email

### Security Filters
- **Severity**: low, medium, high, critical
- **Event Type**: login_attempt, login_success, etc.
- **Date Range**: Custom date range

## 📈 Analytics & Reporting

### Real-time Metrics
```typescript
const analytics = monitoring.getAnalytics();
console.log(analytics);
// Output:
{
  sessionId: "session_1234567890_abc123",
  totalLogs: 150,
  totalMetrics: 45,
  totalSecurityEvents: 12,
  last24Hours: {
    totalLogs: 25,
    errors: 3,
    warnings: 5,
    securityEvents: 2
  },
  last7Days: {
    totalLogs: 150,
    errors: 15,
    warnings: 25,
    securityEvents: 12
  },
  performance: {
    avgPageLoad: 850.5,
    avgApiCall: 125.3,
    totalApiCalls: 45
  }
}
```

### Export Data
```typescript
// Export all logs to JSON
const exportData = monitoring.exportLogs();
// Returns JSON string with all logs, metrics, and analytics
```

## 🚨 Security Alerts

### Automatic Alerts
- **High/Critical Security Events**: Console warnings
- **Multiple Failed Logins**: Rate limiting
- **Suspicious Activities**: Pattern detection

### Alert Levels
- **Low**: Normal activities
- **Medium**: Minor security concerns
- **High**: Significant security events
- **Critical**: Immediate attention required

## 🔧 Konfigurasi

### Environment Variables
```bash
# Optional: External logging service
VITE_LOGGING_SERVICE_URL=your_logging_service_url
VITE_LOGGING_API_KEY=your_api_key
```

### Storage Limits
```typescript
// Default limits (configurable)
maxLogs: 1000
maxMetrics: 500
maxSecurityEvents: 200
```

## 📱 Mobile Responsive

Dashboard monitoring fully responsive dengan:
- Mobile-friendly tables
- Touch-friendly controls
- Optimized for small screens
- Collapsible sections

## 🔄 Real-time Updates

- Auto-refresh setiap 30 detik
- Real-time log streaming
- Live performance metrics
- Instant security alerts

## 🛠️ Maintenance

### Regular Tasks
- **Daily**: Review security events
- **Weekly**: Analyze performance trends
- **Monthly**: Export and archive logs
- **Quarterly**: Clean old logs

### Log Retention
- **Development**: 7 days
- **Production**: 30 days (configurable)
- **Security Events**: 90 days
- **Performance Metrics**: 60 days

## 🔗 Integration

### Supabase Integration
```typescript
// Send logs to Supabase (production)
private async sendToServer(logEntry: LogEntry): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    await supabase.from('application_logs').insert(logEntry);
  }
}
```

### External Services
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: APM monitoring
- **New Relic**: Performance monitoring

## 📚 Best Practices

### 1. **Logging Guidelines**
- Use appropriate log levels
- Include relevant context
- Avoid sensitive data in logs
- Use consistent naming conventions

### 2. **Performance Monitoring**
- Monitor critical user paths
- Track API response times
- Monitor database performance
- Set up performance alerts

### 3. **Security Monitoring**
- Monitor all authentication events
- Track permission changes
- Monitor suspicious patterns
- Set up security alerts

### 4. **Data Management**
- Regular log rotation
- Secure log storage
- Backup important logs
- Compliance with data regulations

## 🚀 Future Enhancements

### Planned Features
- **Real-time Notifications**: Email/SMS alerts
- **Advanced Analytics**: Machine learning insights
- **Custom Dashboards**: User-defined views
- **Integration APIs**: Third-party services
- **Mobile App**: Native monitoring app

### Performance Improvements
- **WebSocket**: Real-time updates
- **Caching**: Optimized data retrieval
- **Compression**: Reduced storage usage
- **Indexing**: Faster search capabilities

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintained By**: Mosque IT Team
