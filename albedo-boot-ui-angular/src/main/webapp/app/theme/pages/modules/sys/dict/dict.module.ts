import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from "../../../../layouts/layout.module"
import { DictComponent } from "./dict.component"
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module"
import { DictFormComponent } from "./dict.form.component"
import { RouterModule } from "@angular/router"
import { DictService } from "./dict.service"
import { routeChilds } from "../../../../api.routing.module"

const routesSysDict = [
    {
        path: "sys/dict/list",
        component: DictComponent
    },
    {
        path: "sys/dict/form",
        component: DictFormComponent
    },
    {
        path: "sys/dict/form/:id",
        component: DictFormComponent
    },
]
routeChilds.push(...routesSysDict)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        DictComponent,
        // RouterModule
    ], entryComponents: [
        DictComponent,
    ], declarations: [
        DictComponent,
        DictFormComponent,
    ], providers: [
        DictService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DictModule {



}
