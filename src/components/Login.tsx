import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Building2, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LanguageContext } from './Navigation';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { language } = React.useContext(LanguageContext);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const content = {
    id: {
      title: 'Login Admin',
      subtitle: 'Masuk untuk mengelola data masjid',
      emailAddress: 'Alamat Email',
      password: 'Kata Sandi',
      passwordPlaceholder: 'Masukkan kata sandi Anda',
      signingIn: 'Sedang masuk...',
      signIn: 'Masuk',
      backToHome: '← Kembali ke Beranda',
      demoCredentials: 'Kredensial Admin Demo:',
      demoEmail: 'admin@masjid.com',
      demoPassword: 'admin123',
      emailPlaceholder: 'Masukkan email Anda',
      forgotPassword: 'Lupa kata sandi?',
      rememberMe: 'Ingat saya',
      noAccount: 'Belum punya akun?',
      createAccount: 'Buat akun'
    },
    en: {
      title: 'Admin Login',
      subtitle: 'Sign in to manage mosque data',
      emailAddress: 'Email Address',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      signingIn: 'Signing in...',
      signIn: 'Sign In',
      backToHome: '← Back to Home',
      demoCredentials: 'Demo Admin Credentials:',
      demoEmail: 'admin@masjid.com',
      demoPassword: 'admin123',
      emailPlaceholder: 'Enter your email',
      forgotPassword: 'Forgot password?',
      rememberMe: 'Remember me',
      noAccount: "Don't have an account?",
      createAccount: 'Create account'
    }
  };

  const currentContent = content[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Show loading state
      Swal.fire({
        title: language === 'id' ? 'Sedang Masuk...' : 'Signing In...',
        text: language === 'id' ? 'Mohon tunggu sebentar' : 'Please wait a moment',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Swal.close();
        throw error;
      }

      // Close loading and show success message
      Swal.close();
      await Swal.fire({
        title: language === 'id' ? 'Berhasil Masuk!' : 'Successfully Signed In!',
        text: language === 'id' ? 'Selamat datang kembali!' : 'Welcome back!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-lg shadow-xl',
          icon: 'text-green-500'
        }
      });

      navigate('/admin');
    } catch (error: any) {
      Swal.close();
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, buttonElement: HTMLButtonElement) => {
    navigator.clipboard.writeText(text);
    // Show temporary success message
    const originalText = buttonElement.textContent;
    buttonElement.textContent = language === 'id' ? 'Tersalin!' : 'Copied!';
    setTimeout(() => {
      buttonElement.textContent = originalText;
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-blue-100/50"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            {currentContent.title}
          </h2>
          <p className="text-gray-600">{currentContent.subtitle}</p>
        </div>

        {/* Login Form */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                {currentContent.emailAddress}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder={currentContent.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                {currentContent.password}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder={currentContent.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-emerald-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{currentContent.signingIn}</span>
                  </div>
                ) : (
                  <span>{currentContent.signIn}</span>
                )}
              </button>
            </div>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-all duration-200 hover:scale-105"
            >
              {currentContent.backToHome}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;