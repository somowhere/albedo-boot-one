import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { Data } from "../model/data.model"
import { createRequestOption } from "../request.util"
import { HttpClient, HttpResponse } from "@angular/common/http";
import { PublicService } from "./public.service";
import { DataService } from "./data.service";
import { Org } from "../../../theme/pages/modules/sys/org/org.model";
import { Module } from "../../../theme/pages/modules/sys/module/module.model";


@Injectable()
export class TreeService<T extends Data> extends DataService<T> {

    constructor(protected http: HttpClient, protected resourceUrl) {
        super(http, resourceUrl)
    }

    formData(id?: String, parentId?: String): Observable<T> {
        let params = {};
        if (id) params["id"] = id;
        if (parentId) params["parentId"] = parentId;
        return this.http.get(this.resourceUrl + `/formData`, createRequestOption(params)).map((res: any) => {
            return res && res.data
        })
    }
}
