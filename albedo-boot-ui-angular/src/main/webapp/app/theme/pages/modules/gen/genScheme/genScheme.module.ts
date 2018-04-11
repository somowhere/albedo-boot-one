import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from "../../../../layouts/layout.module"
import { GenSchemeComponent } from "./genScheme.component"
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module"
import { GenSchemeFormComponent } from "./genScheme.form.component"
import { RouterModule } from "@angular/router"
import { GenSchemeService } from "./genScheme.service"
import { routeChilds } from "../../../../api.routing.module"

const routesGenScheme = [
    {
        path: "gen/genScheme/list",
        component: GenSchemeComponent
    },
    {
        path: "gen/genScheme/form",
        component: GenSchemeFormComponent
    },
    {
        path: "gen/genScheme/form/:id",
        component: GenSchemeFormComponent
    },
]

routeChilds.push(...routesGenScheme)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        GenSchemeComponent,
        // RouterModule
    ], entryComponents: [
        GenSchemeComponent,
    ], declarations: [
        GenSchemeComponent,
        GenSchemeFormComponent,
    ], providers: [
        GenSchemeService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GenSchemeModule {



}
