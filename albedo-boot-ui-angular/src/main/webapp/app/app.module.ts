import { BrowserModule } from '@angular/platform-browser'
import { Injector, NgModule } from '@angular/core'
import { ThemeComponent } from './theme/theme.component'
import { LayoutModule } from './theme/layouts/layout.module'
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

import { AppRoutingModule } from './app.routing.module'
import { AppComponent } from './app.component'
// import { ThemeRoutingModule } from "./theme/theme.routing.module"
import { LocalStorageService, Ng2Webstorage, SessionStorageService } from 'ngx-webstorage'
import { JhiEventManager, NgJhipsterModule } from "ng-jhipster"
import { AlbedoBootSharedModule } from "./shared/shared.module"
import { AlbedoBootAuthModule } from "./auth/auth.module"
import { AlbedoBootEntityModule } from "./theme/pages/entity.module"
import { ApiRoutingModule } from "./theme/api.routing.module"
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./intercepter/auth.interceptor";
import { AuthExpiredInterceptor } from "./intercepter/auth-expired.interceptor";
import { ErrorHandlerInterceptor } from "./intercepter/errorhandler.interceptor";
import { NotificationInterceptor } from "./intercepter/notification.interceptor";

@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent
    ],
    imports: [
        Ng2Webstorage.forRoot({ prefix: 'alb', separator: '-' }),
        NgJhipsterModule.forRoot({
            // set below to true to make alerts look like toast
            alertAsToast: false,
            i18nEnabled: false,
            defaultI18nLang: 'zh-cn'
        }),
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ApiRoutingModule,
        // ThemeRoutingModule,
        // ThemeRoutingTestModule,
        AlbedoBootAuthModule,
        AlbedoBootSharedModule,
        AlbedoBootEntityModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [
                JhiEventManager
            ]
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NotificationInterceptor,
            multi: true,
            deps: [
                Injector
            ]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
