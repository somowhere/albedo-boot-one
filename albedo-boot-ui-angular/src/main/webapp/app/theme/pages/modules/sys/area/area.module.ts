/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { AreaComponent } from "./area.component";
import { routeChilds } from "../../../../api.routing.module";
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { LayoutModule } from "../../../../layouts/layout.module";
import { AreaService } from "./area.service";


const routesSysArea = [
    {
        path: "sys/area/list",
        component: AreaComponent
    },

];

routeChilds.push(...routesSysArea)


@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        LayoutModule
    ], exports: [
        AreaComponent,
    ], entryComponents: [
        AreaComponent,
    ], declarations: [
        AreaComponent,

    ], providers: [
        AreaService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AreaModule {


}
