import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from "../../../../layouts/layout.module"
import { OrgComponent } from "./org.component"
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module"
import { RouterModule } from "@angular/router"
import { OrgService } from "./org.service"
import { routeChilds } from "../../../../api.routing.module"

const routesSysOrg = [
    {
        path: "sys/org/list",
        component: OrgComponent
    },
]
routeChilds.push(...routesSysOrg)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        LayoutModule
    ], exports: [
        OrgComponent,
    ], entryComponents: [
        OrgComponent,
    ], declarations: [
        OrgComponent,
    ], providers: [
        OrgService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrgModule {



}
