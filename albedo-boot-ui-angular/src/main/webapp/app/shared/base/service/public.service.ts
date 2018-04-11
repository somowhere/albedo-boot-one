import { Injectable } from "@angular/core";
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { CTX, GATEWAY_MODEL } from "../../../app.constants";
import { containSpiltStr } from "../base.util";

declare let mLayout: any
@Injectable()
export class PublicService {
    constructor(private sessionStorage: SessionStorageService,
        private localStorage: LocalStorageService) {

    }

    getServiceCtx(permission: string): String {
        let modules = this.sessionStorage.retrieve("modules"), rsCtx = CTX;
        // console.log(modules)
        if (GATEWAY_MODEL && modules && modules.length > 0) {
            modules.forEach(function(module) {
                if (module.microservice && (module.permission == permission || containSpiltStr(module.permission, permission))) {
                    rsCtx = module.microservice
                }
            })
        }
        return rsCtx
    }

    setActiveItemMenu = (url?: String) => {
        let menu = mLayout.getAsideMenu()
        url = (url ? url : window.location.hash)
        let item = $(menu).find('a[href="' + url + '"]').parent('.m-menu__item')
        if (item.length > 0) {
            this.localStorage.store("activeItemMenu", url)
        } else {
            item = $(menu).find('a[href="' + this.localStorage.retrieve("activeItemMenu") + '"]').parent('.m-menu__item')
        }
        let menuObj = (<any>$(menu).data('menu'))
        menuObj && menuObj.setActiveItem(item)
    }


}
