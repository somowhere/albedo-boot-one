import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from "../../../../layouts/layout.module"
import { UserComponent } from "./user.component"
import { UserService } from "./user.service"
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module"
import { UserFormComponent } from "./user.form.component"
import { RouterModule } from "@angular/router"
import { routeChilds } from "../../../../api.routing.module";

const routesSysUser = [
    {
        path: "sys/user/list",
        component: UserComponent
    },
    {
        path: "sys/user/form",
        component: UserFormComponent
    },
    {
        path: "sys/user/form/:id",
        component: UserFormComponent
    },
]

routeChilds.push(...routesSysUser)


@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        UserComponent,
        // RouterModule
    ], entryComponents: [
        UserComponent,
    ], declarations: [
        UserComponent,
        UserFormComponent,
    ], providers: [
        UserService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserModule {



}
