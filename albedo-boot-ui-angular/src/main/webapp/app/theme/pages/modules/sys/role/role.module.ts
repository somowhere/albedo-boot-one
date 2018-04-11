import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from "../../../../layouts/layout.module"
import { RoleComponent } from "./role.component"
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module"
import { RoleFormComponent } from "./role.form.component"
import { RouterModule } from "@angular/router"
import { RoleService } from "./role.service"
import { routeChilds } from "../../../../api.routing.module"

const routesSysRole = [
    {
        path: "sys/role/list",
        component: RoleComponent
    },
    {
        path: "sys/role/form",
        component: RoleFormComponent
    },
    {
        path: "sys/role/form/:id",
        component: RoleFormComponent
    },
]
routeChilds.push(...routesSysRole)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        RoleComponent,
        // RouterModule
    ], entryComponents: [
        RoleComponent,
    ], declarations: [
        RoleComponent,
        RoleFormComponent,
    ], providers: [
        RoleService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RoleModule {



}
