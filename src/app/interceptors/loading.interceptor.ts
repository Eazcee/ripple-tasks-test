import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

// Global variable to track requests (outside the interceptor function)
let totalRequests = 0;

export const LoadingInterceptor: HttpInterceptorFn = (request, next) => {
  totalRequests++;
  
  // Show loading indicator (only in browser environment)
  showLoading();
  
  return next(request).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests === 0) {
        hideLoading();
      }
    })
  );
};

function showLoading(): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  // Create or show global loading indicator
  let loadingElement = document.getElementById('global-loading');
  if (!loadingElement) {
    loadingElement = document.createElement('div');
    loadingElement.id = 'global-loading';
    loadingElement.innerHTML = `
      <div class="global-loading-overlay">
        <div class="global-loading-spinner">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    `;
    document.body.appendChild(loadingElement);
  }
  loadingElement.style.display = 'flex';
}

function hideLoading(): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;
  
  const loadingElement = document.getElementById('global-loading');
  if (loadingElement) {
    loadingElement.style.display = 'none';
  }
} 