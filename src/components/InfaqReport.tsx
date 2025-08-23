import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { supabase, FinancialRecord } from '../lib/supabase';
import { LanguageContext } from './Navigation';

const InfaqReport: React.FC = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = React.useContext(LanguageContext);

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
      noRecordsDesc: 'Transaksi keuangan akan ditampilkan di sini setelah tersedia.'
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
      noRecordsDesc: 'Financial transactions will be displayed here once available.'
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

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-emerald-900 text-white">
            <h3 className="text-xl font-semibold">{currentContent.recentTransactions}</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {currentContent.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {currentContent.description}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {currentContent.type}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {currentContent.amount}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
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

          {records.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{currentContent.noRecordsFound}</h3>
              <p className="text-gray-500">{currentContent.noRecordsDesc}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfaqReport;