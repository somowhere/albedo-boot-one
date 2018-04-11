import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LayoutModule } from "../../../../layouts/layout.module";
import { routeChilds } from "../../../../api.routing.module";
import { DocsComponent } from "./docs.component";

const routesDocs = [
    {
        path: 'sys/docs',
        component: DocsComponent
    }
];

routeChilds.push(...routesDocs)
@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        // RouterModule.forChild(routes),
        LayoutModule
    ], exports: [
        DocsComponent,
        // RouterModule
    ], entryComponents: [
        DocsComponent,
    ], declarations: [
        DocsComponent,
    ], providers: [
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DocsModule {



}


