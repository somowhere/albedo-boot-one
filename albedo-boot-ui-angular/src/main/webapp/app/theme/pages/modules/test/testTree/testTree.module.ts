/**
 * Copyright &copy; 2018 <a href="https://github.com/somewhereMrli/albedo-boot">albedo-boot</a> All rights reserved.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { TestTreeComponent } from "./testTree.component";
import { routeChilds } from "../../../../api.routing.module";
import { AlbedoBootSharedModule } from "../../../../../shared/shared.module";
import { LayoutModule } from "../../../../layouts/layout.module";
import { TestTreeService } from "./testTree.service";
import { TestTreeFormComponent } from "./testTree.form.component";

const routesTestTestTree = [
    {
        path: "test/testTree/list",
        component: TestTreeComponent
    },
    {
        path: "test/testTree/form",
        component: TestTreeFormComponent
    },
    {
        path: "test/testTree/form/:id",
        component: TestTreeFormComponent
    },
];

routeChilds.push(...routesTestTestTree)


@NgModule({
    imports: [
        AlbedoBootSharedModule,
        CommonModule,
        RouterModule,
        LayoutModule
    ], exports: [
        TestTreeComponent,
    ], entryComponents: [
        TestTreeComponent,
    ], declarations: [
        TestTreeComponent,
        TestTreeFormComponent,
    ], providers: [
        TestTreeService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TestTreeModule {


}
