import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorHandler implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';

        if (typeof window !== 'undefined' && error.error instanceof ErrorEvent) {
          errorMessage = `Client Error: ${error.error.message}`;
        } else {
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
        }

        console.error('Testing....', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
