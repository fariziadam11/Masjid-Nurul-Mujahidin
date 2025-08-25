import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Search, Filter, ChevronUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { supabase, FinancialRecord } from '../lib/supabase';
import { LanguageContext } from './Navigation';

const InfaqReport: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = React.useContext(LanguageContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expenditure'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'year'>('all');

  // Sort state
  const [sortField, setSortField] = useState<'date' | 'description' | 'type' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  const content = {
    id: {
      title: 'Laporan Keuangan Infaq',
      subtitle: 'Laporan keuangan transparan dari pendapatan dan pengeluaran masjid',
      totalIncome: 'Total Pendapatan',
      totalExpenditure: 'Total Pengeluaran',
      balance: 'Saldo',
      financialOverview: 'Ringkasan Keuangan',
      recentTransactions: 'Transaksi Terbaru',
      date: 'Tanggal',
      description: 'Deskripsi',
      type: 'Jenis',
      amount: 'Jumlah',
      income: 'pendapatan',
      expenditure: 'pengeluaran',
      noRecordsFound: 'Tidak ada catatan keuangan ditemukan',
      noRecordsDesc: 'Transaksi keuangan akan ditampilkan di sini setelah tersedia.',
      search: 'Cari transaksi...',
      filterByType: 'Filter berdasarkan jenis',
      filterByDate: 'Filter berdasarkan tanggal',
      all: 'Semua',
      week: 'Minggu ini',
      month: 'Bulan ini',
      year: 'Tahun ini',
      sortBy: 'Urutkan berdasarkan',
      showing: 'Menampilkan',
      of: 'dari',
      records: 'catatan',
      previous: 'Sebelumnya',
      next: 'Selanjutnya',
      noResults: 'Tidak ada hasil yang ditemukan'
    },
    en: {
      title: 'Infaq Financial Report',
      subtitle: 'Transparent financial reporting of mosque income and expenditures',
      totalIncome: 'Total Income',
      totalExpenditure: 'Total Expenditure',
      balance: 'Balance',
      financialOverview: 'Financial Overview',
      recentTransactions: 'Recent Transactions',
      date: 'Date',
      description: 'Description',
      type: 'Type',
      amount: 'Amount',
      income: 'income',
      expenditure: 'expenditure',
      noRecordsFound: 'No financial records found',
      noRecordsDesc: 'Financial transactions will be displayed here once available.',
      search: 'Search transactions...',
      filterByType: 'Filter by type',
      filterByDate: 'Filter by date',
      all: 'All',
      week: 'This week',
      month: 'This month',
      year: 'This year',
      sortBy: 'Sort by',
      showing: 'Showing',
      of: 'of',
      records: 'records',
      previous: 'Previous',
      next: 'Next',
      noResults: 'No results found'
    }
  };

  const currentContent = content[language];

  const fetchFinancialRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching financial records:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort records
  const getFilteredAndSortedRecords = () => {
    let filtered = [...records];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.type === typeFilter);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfPeriod = new Date();
      
      switch (dateFilter) {
        case 'week':
          startOfPeriod.setDate(now.getDate() - 7);
          break;
        case 'month':
          startOfPeriod.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startOfPeriod.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(record => new Date(record.date) >= startOfPeriod);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredRecords = getFilteredAndSortedRecords();

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handleSort = (field: 'date' | 'description' | 'type' | 'amount') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const totalIncome = records
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  const totalExpenditure = records
    .filter(record => record.type === 'expenditure')
    .reduce((sum, record) => sum + Number(record.amount), 0);

  const balance = totalIncome - totalExpenditure;

  // Prepare chart data
  const chartData = [
    { name: language === 'id' ? 'Pendapatan' : 'Income', amount: totalIncome, fill: '#10B981' },
    { name: language === 'id' ? 'Pengeluaran' : 'Expenditure', amount: totalExpenditure, fill: '#EF4444' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const SortableHeader: React.FC<{ field: 'date' | 'description' | 'type' | 'amount'; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  );

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{currentContent.title}</h1>
          <p className="text-lg text-gray-600">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{currentContent.totalIncome}</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{currentContent.totalExpenditure}</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenditure)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <DollarSign className={`h-8 w-8 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{currentContent.balance}</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{currentContent.financialOverview}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), '']}
              />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="space-y-4">
            {/* Search - Full width on mobile */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={currentContent.search}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Filter and Sort Controls - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.filterByType}
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value as 'all' | 'income' | 'expenditure');
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">{currentContent.all}</option>
                  <option value="income">{currentContent.income}</option>
                  <option value="expenditure">{currentContent.expenditure}</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.filterByDate}
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as 'all' | 'week' | 'month' | 'year');
                    handleFilterChange();
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="all">{currentContent.all}</option>
                  <option value="week">{currentContent.week}</option>
                  <option value="month">{currentContent.month}</option>
                  <option value="year">{currentContent.year}</option>
                </select>
              </div>

              {/* Sort */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {currentContent.sortBy}
                </label>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-') as ['date' | 'description' | 'type' | 'amount', 'asc' | 'desc'];
                    setSortField(field);
                    setSortDirection(direction);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="date-desc">{currentContent.date} ↓</option>
                  <option value="date-asc">{currentContent.date} ↑</option>
                  <option value="description-asc">{currentContent.description} ↑</option>
                  <option value="description-desc">{currentContent.description} ↓</option>
                  <option value="amount-desc">{currentContent.amount} ↓</option>
                  <option value="amount-asc">{currentContent.amount} ↑</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-emerald-900 text-white">
            <h3 className="text-xl font-semibold">{currentContent.recentTransactions}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <SortableHeader field="date">{currentContent.date}</SortableHeader>
                  <SortableHeader field="description">{currentContent.description}</SortableHeader>
                  <SortableHeader field="type">{currentContent.type}</SortableHeader>
                  <SortableHeader field="amount">{currentContent.amount}</SortableHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.type === 'income' ? currentContent.income : currentContent.expenditure}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(Number(record.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredRecords.length > 0 && (
            <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-700 text-center sm:text-left">
                  {currentContent.showing} {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, filteredRecords.length)} {currentContent.of} {filteredRecords.length} {currentContent.records}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentContent.previous}
                  </button>
                  <div className="flex items-center space-x-1">
                    <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                      {currentPage}
                    </span>
                    <span className="text-gray-500 text-sm">/</span>
                    <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md">
                      {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {currentContent.next}
                  </button>
                </div>
              </div>
            </div>
          )}

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || typeFilter !== 'all' || dateFilter !== 'all' 
                  ? currentContent.noResults 
                  : currentContent.noRecordsFound
                }
              </h3>
              <p className="text-gray-500">
                {searchTerm || typeFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : currentContent.noRecordsDesc
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfaqReport;