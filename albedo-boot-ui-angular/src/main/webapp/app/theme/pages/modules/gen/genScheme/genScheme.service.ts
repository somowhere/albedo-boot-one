import { Injectable } from '@angular/core'
import { GenScheme } from "./genScheme.model"
import { DataService } from "../../../../../shared/base/service/data.service";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";


@Injectable()
export class GenSchemeService extends DataService<GenScheme> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('gen_genScheme') + '/gen/genScheme')
    }
    formData(params: any) {
        return this.queryUrl(params, 'formData')
    }
}
