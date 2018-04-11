
import { Injector } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { MSG_TYPE_ERROR, MSG_TYPE_INFO, MSG_TYPE_SUCCESS, MSG_TYPE_WARNING } from "../app.constants"
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";

export class NotificationInterceptor implements HttpInterceptor {

    // private alertService: JhiAlertService;

    // tslint:disable-next-line: no-unused-variable
    constructor(private injector: Injector) {
        // setTimeout(() => this.alertService = injector.get(JhiAlertService));
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                const arr = event.headers.keys();
                let alert = null;
                let alertParams = null;
                arr.forEach((entry) => {
                    if (entry.endsWith('app-alert')) {
                        alert = event.headers.get(entry);
                    } else if (entry.endsWith('app-params')) {
                        alertParams = event.headers.get(entry);
                    }
                });
                if (alert) {
                    if (typeof alert === 'string') {
                        toastr.success(alert, { param: alertParams })
                    }
                }
                var obj = event.body
                if (obj) {
                    // toastr.info(reData.msg, {})
                    if (obj.status && obj.status != MSG_TYPE_SUCCESS) {
                        if (obj.status == MSG_TYPE_INFO) {
                            toastr.info(obj.message)
                        } else if (obj.status == MSG_TYPE_WARNING) {
                            toastr.warning(obj.message)
                        } else if (obj.status == MSG_TYPE_ERROR) {
                            toastr.error(obj.message)
                        }
                    }
                }
            }
        }, (data: any) => {
            if (data.status != 403 && toastr) {
                toastr.error(data.error && data.error.message ? data.error.message : '网络异常，请检查您的网络连接！', { closeButton: true, positionClass: 'toast-bottom-right' })
            }
        });
    }

}
