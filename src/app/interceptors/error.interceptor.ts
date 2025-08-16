import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const ErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const snackBar = inject(MatSnackBar);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error (network error, etc.)
        errorMessage = `Network Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: Invalid data provided';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource was not found';
            break;
          case 409:
            errorMessage = 'Conflict: The resource already exists or conflicts with current state';
            break;
          case 422:
            errorMessage = 'Validation Error: Please check your input data';
            break;
          case 500:
            errorMessage = 'Server Error: Internal server error occurred';
            break;
          case 502:
            errorMessage = 'Bad Gateway: Server is temporarily unavailable';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Server is temporarily unavailable';
            break;
          case 504:
            errorMessage = 'Gateway Timeout: Request timed out';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Show error notification
      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar',
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      // Log error for debugging (in development)
      if (error.status !== 404) { // Don't log 404s as they're common
        console.error('HTTP Error:', {
          url: request.url,
          method: request.method,
          status: error.status,
          message: errorMessage,
          error: error
        });
      }

      return throwError(() => error);
    })
  );
}; 