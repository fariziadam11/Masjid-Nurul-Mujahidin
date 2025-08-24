import React, { useState, useEffect } from 'react';
import { Download, Trash2, AlertTriangle, Info, Clock, Activity, Shield, BarChart3 } from 'lucide-react';
import { monitoring, LogEntry, PerformanceMetric, SecurityEvent } from '../lib/monitoring';
import { LanguageContext } from './Navigation';

const MonitoringDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'performance' | 'security'>('overview');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    severity: '',
    startDate: '',
    endDate: ''
  });
  const { language } = React.useContext(LanguageContext);

  const content = {
    id: {
      title: 'Dashboard Monitoring',
      overview: 'Ringkasan',
      logs: 'Log Aktivitas',
      performance: 'Performa',
      security: 'Keamanan',
      exportLogs: 'Ekspor Log',
      clearLogs: 'Hapus Log',
      totalLogs: 'Total Log',
      totalErrors: 'Total Error',
      totalWarnings: 'Total Warning',
      securityEvents: 'Event Keamanan',
      avgPageLoad: 'Rata-rata Load Page',
      avgApiCall: 'Rata-rata API Call',
      last24Hours: '24 Jam Terakhir',
      last7Days: '7 Hari Terakhir',
      noData: 'Tidak ada data',
      timestamp: 'Waktu',
      level: 'Level',
      category: 'Kategori',
      action: 'Aksi',
      details: 'Detail',
      severity: 'Tingkat Keparahan',
      event: 'Event',
      metric: 'Metrik',
      value: 'Nilai',
      unit: 'Unit'
    },
    en: {
      title: 'Monitoring Dashboard',
      overview: 'Overview',
      logs: 'Activity Logs',
      performance: 'Performance',
      security: 'Security',
      exportLogs: 'Export Logs',
      clearLogs: 'Clear Logs',
      totalLogs: 'Total Logs',
      totalErrors: 'Total Errors',
      totalWarnings: 'Total Warnings',
      securityEvents: 'Security Events',
      avgPageLoad: 'Avg Page Load',
      avgApiCall: 'Avg API Call',
      last24Hours: 'Last 24 Hours',
      last7Days: 'Last 7 Days',
      noData: 'No data available',
      timestamp: 'Timestamp',
      level: 'Level',
      category: 'Category',
      action: 'Action',
      details: 'Details',
      severity: 'Severity',
      event: 'Event',
      metric: 'Metric',
      value: 'Value',
      unit: 'Unit'
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [filters]);

  const loadData = () => {
    setLogs(monitoring.getLogs(
      filters.level as any,
      filters.category as any,
      filters.startDate,
      filters.endDate,
      100
    ));
    setPerformanceMetrics(monitoring.getPerformanceMetrics(
      undefined,
      filters.startDate,
      filters.endDate
    ));
    setSecurityEvents(monitoring.getSecurityEvents(
      filters.severity as any,
      undefined,
      filters.startDate,
      filters.endDate
    ));
    setAnalytics(monitoring.getAnalytics());
  };

  const handleExportLogs = () => {
    const data = monitoring.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mosque-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (confirm(language === 'id' ? 'Yakin ingin menghapus semua log?' : 'Are you sure you want to clear all logs?')) {
      monitoring.clearLogs();
      loadData();
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warn': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'debug': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(language === 'id' ? 'id-ID' : 'en-US');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentContent.title}</h1>
          <p className="text-gray-600">
            {language === 'id' 
              ? 'Monitor aktivitas, performa, dan keamanan sistem masjid'
              : 'Monitor system activity, performance, and security'
            }
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={handleExportLogs}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{currentContent.exportLogs}</span>
          </button>
          <button
            onClick={handleClearLogs}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>{currentContent.clearLogs}</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: currentContent.overview, icon: BarChart3 },
              { id: 'logs', label: currentContent.logs, icon: Info },
              { id: 'performance', label: currentContent.performance, icon: Activity },
              { id: 'security', label: currentContent.security, icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.totalLogs}</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalLogs || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.totalErrors}</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.last24Hours?.errors || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.totalWarnings}</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.last24Hours?.warnings || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.securityEvents}</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.last24Hours?.securityEvents || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentContent.logs}</h3>
              
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={filters.level}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">{currentContent.level}</option>
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>

                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">{currentContent.category}</option>
                  <option value="auth">Auth</option>
                  <option value="financial">Financial</option>
                  <option value="admin">Admin</option>
                  <option value="system">System</option>
                  <option value="security">Security</option>
                  <option value="performance">Performance</option>
                </select>

                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <button
                  onClick={() => setFilters({ level: '', category: '', severity: '', startDate: '', endDate: '' })}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  {language === 'id' ? 'Reset' : 'Reset'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.timestamp}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.level}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.category}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.action}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.details}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTimestamp(log.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(log.level)}`}>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        {currentContent.noData}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentContent.performance}</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.timestamp}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.metric}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.value}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.unit}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.details}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performanceMetrics.length > 0 ? (
                    performanceMetrics.map((metric) => (
                      <tr key={metric.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTimestamp(metric.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {metric.metric}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {metric.value.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {metric.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(metric.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        {currentContent.noData}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentContent.security}</h3>
              
              {/* Security Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">{currentContent.severity}</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="border border-gray-300 rounded-md px-3 py-2"
                />

                <button
                  onClick={() => setFilters({ level: '', category: '', severity: '', startDate: '', endDate: '' })}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  {language === 'id' ? 'Reset' : 'Reset'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.timestamp}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.event}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.severity}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {currentContent.details}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityEvents.length > 0 ? (
                    securityEvents.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatTimestamp(event.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.event}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.userEmail || event.userId || 'Anonymous'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        {currentContent.noData}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringDashboard;
