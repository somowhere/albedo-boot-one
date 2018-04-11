import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { CTX } from "../../../../../app.constants"
import { DataService } from "../../../../../shared/base/service/data.service";
import { User } from "./user.model";
import { HttpClient } from "@angular/common/http";
import { PublicService } from "../../../../../shared/base/service/public.service";


@Injectable()
export class UserService extends DataService<User> {

    constructor(
        protected http: HttpClient,
        protected publicService: PublicService) {
        super(http, publicService.getServiceCtx('sys_user') + '/sys/user')
    }





}
