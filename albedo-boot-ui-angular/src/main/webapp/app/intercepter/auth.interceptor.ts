import { Observable } from 'rxjs/Observable'
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { CTX } from "../app.constants";

export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
        if (!request || !request.url || (/^http/.test(request.url) && !(CTX && request.url.startsWith(CTX)))) {
            return next.handle(request);
        }


        if (!!token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token
                }
            });
        }
        return next.handle(request);
    }

}
