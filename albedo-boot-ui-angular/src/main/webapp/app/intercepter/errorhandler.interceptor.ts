import { JhiEventManager } from 'ng-jhipster'
import { Observable } from 'rxjs/Observable'
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private eventManager: JhiEventManager) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).do((event: HttpEvent<any>) => { }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (!(err.status === 401 && (err.message === '' || (err.url && err.url.indexOf('/api/account') === 0)))) {
                    if (this.eventManager !== undefined) {
                        this.eventManager.broadcast({ name: 'albedoBoot.httpError', content: err });
                    }
                }
            }
        });
    }

}
