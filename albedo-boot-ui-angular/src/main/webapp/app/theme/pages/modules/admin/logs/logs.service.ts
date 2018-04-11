import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Log } from './log.model';

@Injectable()
export class LogsService {
    constructor(private http: HttpClient) { }

    changeLevel(log: Log): Observable<HttpResponse<any>> {
        return this.http.put('management/logs', log, { observe: 'response' });
    }

    findAll(): Observable<HttpResponse<Log[]>> {
        return this.http.get<Log[]>('management/logs', { observe: 'response' });
    }
}
