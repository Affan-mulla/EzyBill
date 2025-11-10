/**
 * Formatting utilities for consistent data display
 */

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date to readable format
 * Handles various date formats including ISO strings, timestamps, and Date objects
 */
export function formatDate(date, options = {}) {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };
    
    return dateObj.toLocaleDateString('en-IN', defaultOptions);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format date with time
 * Handles various date formats and displays in readable format
 */
export function formatDateTime(date) {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, length = 50) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Format a date to Indian Standard Time (IST) in the form: dd-MM-yyyy hh:mm AM/PM
 * Uses Intl formatToParts to reliably compose the string across browsers.
 * Accepts Date, number (timestamp) or string.
 */
export function formatIST(date) {
  if (!date) return 'N/A';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';

    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(d);

    const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
    // en-GB returns day/month/year; we want dd-MM-yyyy and keep 2-digit month with '-'
    const day = map.day;
    const month = map.month; // already 2-digit
    const year = map.year;
    const hour = map.hour.padStart(2, '0');
    const minute = map.minute.padStart(2, '0');
    const dayPeriod = (map.dayPeriod || '').toUpperCase(); // AM/PM

    return `${day}-${month}-${year} ${hour}:${minute} ${dayPeriod}`.trim();
  } catch (e) {
    console.error('formatIST error:', e);
    return 'Invalid Date';
  }
}

/**
 * Format date in compact format (e.g., "10 Nov 2025")
 */
export function formatDateCompact(date) {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date) {
  if (!date) return 'N/A';
  
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const diff = Math.floor(diffInSeconds / secondsInUnit);
      if (diff >= 1) {
        return `${diff} ${unit}${diff > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Invalid Date';
  }
}
