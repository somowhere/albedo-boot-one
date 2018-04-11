import { NgModule } from '@angular/core'
import { ThemeComponent } from './theme.component'
import { RouterModule, Routes } from '@angular/router'
import { AlbedoBootAuthGuard } from "../auth/_guards/auth.guard"
import { DefaultComponent } from "./pages/default/default.component"


export const routeChilds = []
const routes: Routes = [
    {
        path: "",
        component: ThemeComponent,
        canActivate: [AlbedoBootAuthGuard],
        children: [
            {
                path: "",
                component: DefaultComponent,
                children: routeChilds
            },
            {
                path: "header\/actions",
                loadChildren: ".\/pages\/default\/header\/header-actions\/header-actions.module#HeaderActionsModule"
            },
            {
                path: "header\/profile",
                loadChildren: ".\/pages\/default\/header\/header-profile\/header-profile.module#HeaderProfileModule"
            },
            {
                path: "404",
                loadChildren: ".\/pages\/default\/not-found\/not-found.module#NotFoundModule"
            },
            {
                path: "",
                "redirectTo": "index",
                "pathMatch": "full"
            },
            {
                path: "index",
                loadChildren: ".\/pages\/default\/index\/index.module#IndexModule"
            },
        ]
    },
    {
        path: "**",
        "redirectTo": "404",
        "pathMatch": "full"
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes),

    ],
    exports: [
        RouterModule
    ]
})
export class ApiRoutingModule {
}
