import { useEffect } from 'react';

// Performance monitoring utilities
export const reportWebVitals = (metric: any) => {
  // In production, you might want to send these to an analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics or other monitoring service
    console.log('Web Vital:', metric);
    
    // You can send to analytics services like this:
    // gtag('event', metric.name, {
    //   event_category: 'Web Vitals',
    //   event_label: metric.id,
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   non_interaction: true,
    // });
  }
};

// Hook for monitoring Core Web Vitals
export const useWebVitals = () => {
  useEffect(() => {
    // Dynamically import web-vitals to avoid affecting bundle size
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onINP(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    }).catch(() => {
      // Silently fail if web-vitals is not available
    });
  }, []);
};

// Performance observer for long tasks
export const observeLongTasks = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            console.warn('Long task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Browser might not support longtask observation
    }
  }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
      percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    };
  }
  return null;
};

// Navigation timing
export const getNavigationTiming = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const timing = performance.timing;
    return {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      tcpConnect: timing.connectEnd - timing.connectStart,
      serverResponse: timing.responseEnd - timing.requestStart,
      domProcessing: timing.domComplete - timing.domLoading
    };
  }
  return null;
};