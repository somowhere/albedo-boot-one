import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LogoutComponent } from "./auth/logout/logout.component"
import { HashLocationStrategy, LocationStrategy } from "@angular/common"
import { BrowserModule } from "@angular/platform-browser"

const routes: Routes = [
    { path: 'login', loadChildren: './auth/auth.module#AlbedoBootAuthModule' },
    { path: 'logout', component: LogoutComponent },
    { path: '', redirectTo: 'index', pathMatch: 'full' },
]

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ]

})
export class AppRoutingModule {
}
