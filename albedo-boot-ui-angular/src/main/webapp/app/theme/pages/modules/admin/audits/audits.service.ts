import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Audit } from './audit.model';
import { createRequestOption, createRequestParams } from "../../../../../shared/base/request.util";
import { PageModel } from "../../../../../shared/base/model/page.model";

@Injectable()
export class AuditsService {
    constructor(private http: HttpClient) { }

    query(req: any): Observable<PageModel<Audit>> {
        const params: HttpParams = createRequestParams(req);

        const requestURL = 'management/audits';

        return this.http.get<PageModel<Audit>>(requestURL, {
            params: params,
            observe: 'body'
        });
    }
}
