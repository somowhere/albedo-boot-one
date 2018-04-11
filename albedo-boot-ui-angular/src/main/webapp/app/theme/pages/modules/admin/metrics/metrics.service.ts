import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CTX } from "../../../../../app.constants";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MetricsService {

    constructor(private http: HttpClient) { }

    getMetrics(): Observable<any> {
        return this.http.get(CTX + '/management/metrics').map((data: any) => data);
    }

    threadDump(): Observable<any> {
        return this.http.get('/management/dump').map((data: any) => data);
    }

}
