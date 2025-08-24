// Comprehensive Monitoring & Logging System for Mosque Management

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: 'auth' | 'financial' | 'admin' | 'system' | 'security' | 'performance';
  action: string;
  userId?: string;
  userEmail?: string;
  details: any;
  userAgent: string;
  url: string;
  ip?: string;
  sessionId: string;
}

export interface PerformanceMetric {
  id: string;
  timestamp: string;
  metric: 'page_load' | 'api_call' | 'database_query' | 'render_time';
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  details: any;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  event: 'login_attempt' | 'login_success' | 'login_failure' | 'logout' | 'permission_denied' | 'suspicious_activity';
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent: string;
  details: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class MonitoringSystem {
  private logs: LogEntry[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private securityEvents: SecurityEvent[] = [];
  private sessionId: string;
  private maxLogs: number = 1000;
  private maxMetrics: number = 500;
  private maxSecurityEvents: number = 200;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
    this.setupPerformanceMonitoring();
    this.setupErrorHandling();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem('mosque_logs');
      const storedMetrics = localStorage.getItem('mosque_metrics');
      const storedSecurity = localStorage.getItem('mosque_security');

      if (storedLogs) this.logs = JSON.parse(storedLogs);
      if (storedMetrics) this.performanceMetrics = JSON.parse(storedMetrics);
      if (storedSecurity) this.securityEvents = JSON.parse(storedSecurity);
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('mosque_logs', JSON.stringify(this.logs));
      localStorage.setItem('mosque_metrics', JSON.stringify(this.performanceMetrics));
      localStorage.setItem('mosque_security', JSON.stringify(this.securityEvents));
    } catch (error) {
      console.error('Failed to save logs to storage:', error);
    }
  }

  private setupPerformanceMonitoring(): void {
    // Monitor page load times
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.recordPerformanceMetric('page_load', loadTime, 'ms', {
          url: window.location.href,
          loadTime: loadTime
        });
      });

      // Monitor API calls
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const startTime = performance.now();
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          this.recordPerformanceMetric('api_call', endTime - startTime, 'ms', {
            url: args[0],
            method: args[1]?.method || 'GET',
            status: response.status
          });
          return response;
        } catch (error) {
          const endTime = performance.now();
          this.recordPerformanceMetric('api_call', endTime - startTime, 'ms', {
            url: args[0],
            method: args[1]?.method || 'GET',
            error: error instanceof Error ? error.message : String(error)
          });
          throw error;
        }
      };
    }
  }

  private setupErrorHandling(): void {
    if (typeof window !== 'undefined') {
      // Global error handler
      window.addEventListener('error', (event) => {
        this.log('error', 'system', 'javascript_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack
        });
      });

      // Unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        this.log('error', 'system', 'unhandled_promise_rejection', {
          reason: event.reason,
          promise: event.promise
        });
      });
    }
  }

  // Main logging function
  log(
    level: LogEntry['level'],
    category: LogEntry['category'],
    action: string,
    details: any,
    userId?: string,
    userEmail?: string
  ): void {
    const logEntry: LogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      userId,
      userEmail,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId
    };

    this.logs.push(logEntry);
    
    // Keep logs under limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.saveToStorage();
    this.sendToServer(logEntry);
    
    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
      console[consoleMethod](`[${category.toUpperCase()}] ${action}:`, details);
    }
  }

  // Performance monitoring
  recordPerformanceMetric(
    metric: PerformanceMetric['metric'],
    value: number,
    unit: PerformanceMetric['unit'],
    details: any
  ): void {
    const metricEntry: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      metric,
      value,
      unit,
      details
    };

    this.performanceMetrics.push(metricEntry);
    
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }

    this.saveToStorage();
  }

  // Security event logging
  recordSecurityEvent(
    event: SecurityEvent['event'],
    severity: SecurityEvent['severity'],
    details: any,
    userId?: string,
    userEmail?: string
  ): void {
    const securityEntry: SecurityEvent = {
      id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      event,
      userId,
      userEmail,
      userAgent: navigator.userAgent,
      details,
      severity
    };

    this.securityEvents.push(securityEntry);
    
    if (this.securityEvents.length > this.maxSecurityEvents) {
      this.securityEvents = this.securityEvents.slice(-this.maxSecurityEvents);
    }

    this.saveToStorage();
    this.sendSecurityAlert(securityEntry);
  }

  // Send logs to server (Supabase)
  private async sendToServer(logEntry: LogEntry): Promise<void> {
    try {
      // In production, send to Supabase or external logging service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to Supabase logs table
        // await supabase.from('application_logs').insert(logEntry);
        console.log('Log sent to server:', logEntry);
      }
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // Send security alerts
  private async sendSecurityAlert(securityEvent: SecurityEvent): Promise<void> {
    if (securityEvent.severity === 'high' || securityEvent.severity === 'critical') {
      // In production, send email/SMS alerts
      console.warn('SECURITY ALERT:', securityEvent);
    }
  }

  // Get logs with filtering
  getLogs(
    level?: LogEntry['level'],
    category?: LogEntry['category'],
    startDate?: string,
    endDate?: string,
    limit: number = 100
  ): LogEntry[] {
    let filteredLogs = [...this.logs];

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }

    if (startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= startDate);
    }

    if (endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= endDate);
    }

    return filteredLogs.slice(-limit);
  }

  // Get performance metrics
  getPerformanceMetrics(
    metric?: PerformanceMetric['metric'],
    startDate?: string,
    endDate?: string
  ): PerformanceMetric[] {
    let filteredMetrics = [...this.performanceMetrics];

    if (metric) {
      filteredMetrics = filteredMetrics.filter(m => m.metric === metric);
    }

    if (startDate) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp >= startDate);
    }

    if (endDate) {
      filteredMetrics = filteredMetrics.filter(m => m.timestamp <= endDate);
    }

    return filteredMetrics;
  }

  // Get security events
  getSecurityEvents(
    severity?: SecurityEvent['severity'],
    event?: SecurityEvent['event'],
    startDate?: string,
    endDate?: string
  ): SecurityEvent[] {
    let filteredEvents = [...this.securityEvents];

    if (severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === severity);
    }

    if (event) {
      filteredEvents = filteredEvents.filter(e => e.event === event);
    }

    if (startDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= startDate);
    }

    if (endDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= endDate);
    }

    return filteredEvents;
  }

  // Analytics and reporting
  getAnalytics(): any {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const logs24h = this.getLogs(undefined, undefined, last24Hours);
    const logs7d = this.getLogs(undefined, undefined, last7Days);

    return {
      sessionId: this.sessionId,
      totalLogs: this.logs.length,
      totalMetrics: this.performanceMetrics.length,
      totalSecurityEvents: this.securityEvents.length,
      last24Hours: {
        totalLogs: logs24h.length,
        errors: logs24h.filter(log => log.level === 'error').length,
        warnings: logs24h.filter(log => log.level === 'warn').length,
        securityEvents: this.getSecurityEvents(undefined, undefined, last24Hours).length
      },
      last7Days: {
        totalLogs: logs7d.length,
        errors: logs7d.filter(log => log.level === 'error').length,
        warnings: logs7d.filter(log => log.level === 'warn').length,
        securityEvents: this.getSecurityEvents(undefined, undefined, last7Days).length
      },
      performance: {
        avgPageLoad: this.calculateAverageMetric('page_load'),
        avgApiCall: this.calculateAverageMetric('api_call'),
        totalApiCalls: this.performanceMetrics.filter(m => m.metric === 'api_call').length
      }
    };
  }

  private calculateAverageMetric(metric: PerformanceMetric['metric']): number {
    const metrics = this.performanceMetrics.filter(m => m.metric === metric);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
    this.performanceMetrics = [];
    this.securityEvents = [];
    this.saveToStorage();
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify({
      logs: this.logs,
      performanceMetrics: this.performanceMetrics,
      securityEvents: this.securityEvents,
      analytics: this.getAnalytics(),
      exportDate: new Date().toISOString()
    }, null, 2);
  }
}

// Create singleton instance
export const monitoring = new MonitoringSystem();

// Convenience functions
export const logInfo = (category: LogEntry['category'], action: string, details: any, userId?: string, userEmail?: string) => {
  monitoring.log('info', category, action, details, userId, userEmail);
};

export const logWarn = (category: LogEntry['category'], action: string, details: any, userId?: string, userEmail?: string) => {
  monitoring.log('warn', category, action, details, userId, userEmail);
};

export const logError = (category: LogEntry['category'], action: string, details: any, userId?: string, userEmail?: string) => {
  monitoring.log('error', category, action, details, userId, userEmail);
};

export const logDebug = (category: LogEntry['category'], action: string, details: any, userId?: string, userEmail?: string) => {
  monitoring.log('debug', category, action, details, userId, userEmail);
};

export const logSecurity = (event: SecurityEvent['event'], severity: SecurityEvent['severity'], details: any, userId?: string, userEmail?: string) => {
  monitoring.recordSecurityEvent(event, severity, details, userId, userEmail);
};

export const logPerformance = (metric: PerformanceMetric['metric'], value: number, unit: PerformanceMetric['unit'], details: any) => {
  monitoring.recordPerformanceMetric(metric, value, unit, details);
};
