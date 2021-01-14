import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor() { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    let apiReq = request.clone({ url: `${request.url}` });

      if (localStorage.getItem('loggedinUserId')) {
        request = request.clone({
          setHeaders: {
            'x-mentordex-auth-token': localStorage.getItem('mentordex-superadmin-x-auth-token')
          }
        });
      }
    
    //console.log(request)
    return next.handle(request);

  }
}
