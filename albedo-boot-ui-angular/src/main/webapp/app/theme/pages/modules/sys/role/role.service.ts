import { Injectable } from '@angular/core'
import { CTX } from "../../../../../app.constants"
import { Role } from "./role.model"
import { DataService } from "../../../../../shared/base/service/data.service";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";


@Injectable()
export class RoleService extends DataService<Role> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('sys_role') + '/sys/role')
    }




}
