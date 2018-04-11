import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { createRequestOption } from "../request.util"
import { HttpClient } from "@angular/common/http";
import { CTX } from "../../../app.constants";


@Injectable()
export class DataSystemService {

    constructor(protected http: HttpClient) { }


    dictCodes(req?: any): Observable<any> {
        const options = createRequestOption(req)
        return this.http.get(CTX + '/dataSystem/dict/codes', options)
            .map((data: any) => data)
    }

    menus(): Observable<any> {
        return this.moduleData(createRequestOption({ type: 'menu' }))
    }

    moduleData(params?: any): Observable<any> {
        return this.http.get(CTX + '/dataSystem/module/data', params)
            .map((res: any) => {
                if (res && res.data) {
                    albedo.setGatewayModel(res.data.gatewayModel ? res.data.gatewayModel : false);
                    return res.data.moduleList
                }
                return null;
            })
    }

    moduleTreeData(): Observable<any> {
        return this.http.get(CTX + '/dataSystem/module/findTreeData')
            .map((res: any) => res && res.data)
    }
    dictTreeData(): Observable<any> {
        return this.http.get(CTX + '/dataSystem/dict/findTreeData')
            .map((res: any) => res && res.data)
    }
    orgTreeData(): Observable<any> {
        return this.http.get(CTX + '/dataSystem/org/findTreeData')
            .map((res: any) => res && res.data)
    }

}
