import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { Data } from "../model/data.model"
import { createRequestOption } from "../request.util"
import { HttpClient, HttpResponse } from "@angular/common/http";


@Injectable()
export class DataService<T extends Data> {

    constructor(protected http: HttpClient, protected resourceUrl) { }


    save(entity: T): Observable<T> {
        return this.http.post(this.resourceUrl, entity)
            .map((res: any) => res && res.data)
    }

    find(id: string): Observable<T> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: any) => {
            return res && res.data
        })
    }
    queryUrl(params?: any, url?: string): Observable<any> {
        const options = createRequestOption(params)
        return this.http.get(this.resourceUrl + '/' + (url ? url : ''), options)
            .map((res: any) => res && res.data)
    }
    query(params?: any): Observable<any> {
        return this.queryUrl(params)
    }

    delete(id: string): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${id}`)
    }


}
