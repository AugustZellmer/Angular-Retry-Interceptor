/* If you're not using ngx-translate, simply remove lines 13, 30 thru 36, and 54. */

import {fakeAsync, TestBed, tick} from '@angular/core/testing';

import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {AppRootComponent} from '../../app-root/app-root.component';
import {Location} from '@angular/common';
import {LoggerTestingModule} from 'ngx-logger/testing';
import {RetryInterceptor} from './retry.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {httpTranslateLoader} from '../../app.module';

describe('RetryInterceptor', () => {

  let httpTestingController: HttpTestingController;
  let http: HttpClient;
  let router: Router;
  let location: Location;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LoggerTestingModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpTranslateLoader,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: RetryInterceptor,
          multi: true,
        },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppRootComponent);
    router.initialNavigation();

    httpTestingController.expectOne({method: 'GET', url: '/app/assets/i18n/en.json'});
  });

  it('should not retry POSTs', fakeAsync(
    () => {
      http.post('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'POST', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });

      try{
        tick();
      }catch (e){
        // intentionally empty
      }
      tick();

      httpTestingController.verify();
    })
  );

  it('should not retry PATCHes', fakeAsync(
    () => {
      http.patch('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'PATCH', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });

      try{
        tick();
      }catch (e){
        // intentionally empty
      }
      tick();

      httpTestingController.verify();
    })
  );

  it('should retry DELETEs', fakeAsync(
    () => {
      http.delete('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'DELETE', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });
      httpTestingController.expectOne({method: 'DELETE', url: '/api/resource'});

      tick();
      tick();

      httpTestingController.verify();
    })
  );

  it('should retry GETs', fakeAsync(
    () => {
      http.get('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'GET', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });
      httpTestingController.expectOne({method: 'GET', url: '/api/resource'});

      tick();
      tick();

      httpTestingController.verify();
    })
  );

  it('should retry HEADs', fakeAsync(
    () => {
      http.head('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'HEAD', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });
      httpTestingController.expectOne({method: 'HEAD', url: '/api/resource'});

      tick();
      tick();

      httpTestingController.verify();
    })
  );

  it('should retry OPTIONs', fakeAsync(
    () => {
      http.options('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'OPTIONS', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });
      httpTestingController.expectOne({method: 'OPTIONS', url: '/api/resource'});

      tick();
      tick();

      httpTestingController.verify();
    })
  );

  it('should retry PUTs', fakeAsync(
    () => {
      http.put('/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'PUT', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });
      httpTestingController.expectOne({method: 'PUT', url: '/api/resource'});

      tick();
      tick();

      httpTestingController.verify();
    })
  );

  it('should retry TRACEs', fakeAsync(
    () => {
      http.request('TRACE', '/api/resource', {}).subscribe(response => expect(response).toBeTruthy());
      httpTestingController.expectOne({method: 'TRACE', url: '/api/resource'}).error(
        new ErrorEvent('network error', { message: 'bad request' }), { status: 400 });
      httpTestingController.expectOne({method: 'TRACE', url: '/api/resource'});

      tick();
      tick();

      httpTestingController.verify();
    })
  );
});
