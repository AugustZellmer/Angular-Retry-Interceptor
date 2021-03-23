import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {retry} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

  private IDEMPOTENT_METHODS = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PUT', 'TRACE'];

  constructor(private router: Router, private logger: NGXLogger) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.IDEMPOTENT_METHODS.includes(request.method)){
      return next.handle(request)
        .pipe(
          retry(1));
    }
    else{
      return next.handle(request);
    }
  }
}
