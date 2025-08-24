// Security utilities for the mosque management system

// Input validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 999999999999.99;
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

// Input sanitization functions
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizeAmount = (amount: string): number => {
  const cleanAmount = amount.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleanAmount);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
};

// Rate limiting utilities
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Session management
export const sessionManager = {
  setSessionTimeout: (timeoutMs: number = 24 * 60 * 60 * 1000) => {
    const expiry = Date.now() + timeoutMs;
    localStorage.setItem('sessionExpiry', expiry.toString());
  },

  isSessionValid: (): boolean => {
    const expiry = localStorage.getItem('sessionExpiry');
    if (!expiry) return false;
    
    const now = Date.now();
    const isValid = now < parseInt(expiry);
    
    if (!isValid) {
      localStorage.removeItem('sessionExpiry');
    }
    
    return isValid;
  },

  clearSession: () => {
    localStorage.removeItem('sessionExpiry');
  }
};

// CSRF protection
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};

// XSS protection
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Secure headers configuration
export const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://api.aladhan.com;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Error handling utilities
export const secureErrorHandler = (error: any): string => {
  // Don't expose internal error details to users
  console.error('Application error:', error);
  
  if (error?.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  
  if (error?.message?.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account';
  }
  
  if (error?.message?.includes('Too many requests')) {
    return 'Too many attempts. Please try again later';
  }
  
  return 'An error occurred. Please try again later';
};

// Audit logging
export const auditLog = {
  logAction: (action: string, userId: string, details: any = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      details,
      userAgent: navigator.userAgent,
      ip: 'client-side' // Will be captured server-side
    };
    
    console.log('AUDIT LOG:', logEntry);
    // In production, send this to a secure logging service
  }
};
