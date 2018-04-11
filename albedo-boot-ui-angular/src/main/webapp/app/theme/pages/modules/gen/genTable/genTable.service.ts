import { Injectable } from '@angular/core'
import { GenTable } from "./genTable.model"
import { DataService } from "../../../../../shared/base/service/data.service";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";


@Injectable()
export class GenTableService extends DataService<GenTable> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('gen_genTable') + '/gen/genTable')
    }

    formData(params: any) {
        return this.queryUrl(params, 'formData')
    }
}
