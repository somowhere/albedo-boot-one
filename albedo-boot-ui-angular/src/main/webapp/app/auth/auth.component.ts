import {
    Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef,
    ViewEncapsulation
} from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { ScriptLoaderService } from "../shared/base/service/script-loader.service"
// import { AuthenticationService } from "./_services/authentication.service"
// import { AlertService } from "./_services/alert.service"
import { UserService } from "./_services/user.service"
// import { AlertComponent } from "../shared/tags/alert.component"
import { LoginCustom } from "./_helpers/login-custom"
import { Helpers } from "../helpers"
import { LoginService } from "./_services/login.service"
import { JhiEventManager } from "ng-jhipster"
import { StateStorageService } from "./_services/state-storage.service"
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"

@Component({
    selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
    templateUrl: './templates/login-2.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AuthComponent implements OnInit {
    model: any = {}
    loading = false
    returnUrl: string
    error: string

    @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef
    @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef
    @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef

    constructor(private _router: Router,
        private eventManager: JhiEventManager,
        private stateStorageService: StateStorageService,
        private _script: ScriptLoaderService,
        private _userService: UserService,
        private _route: ActivatedRoute,
        // private _authService: AuthenticationService,
        // private _alertService: AlertService,
        private loginService: LoginService,
        private cfr: ComponentFactoryResolver,
        public activeModal: NgbActiveModal) {
    }

    ngOnInit() {
        this.model.remember = true
        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/'
        this._router.navigate([this.returnUrl])

        this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js',
            'assets/frame/albedo.donation.js', )
            .then(() => {
                Helpers.setLoading(false)
                LoginCustom.init()
            })
    }

    signin() {
        this.loading = true

        this.loginService.login(this.model).then((data) => {
            // this.authenticationError = false
            this.activeModal.dismiss('login success')
            if (this._router.url === '/register' || (/^\/activate\//.test(this._router.url)) ||
                (/^\/reset\//.test(this._router.url))) {
                this._router.navigate([''])
            }

            this.eventManager.broadcast({
                name: 'authenticationSuccess',
                content: 'Sending Authentication Success'
            })

            // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            // // since login is succesful, go to stored previousState and clear previousState
            const redirect = this.stateStorageService.getUrl()
            if (redirect) {
                this.stateStorageService.storeUrl(null)
                this._router.navigate([redirect])
            } else {
                this._router.navigate([this.returnUrl])
            }
        }).catch((data) => {
            this.error = data && data.error && data.error.message ? data.error.message : "用户名或密码填写有误";
            // this.showAlert('alertSignin')
            // toastr.error()
            // this._alertService.error(error)
            this.loading = false
        })


        // this._authService.login(this.model.email, this.model.password)
        //     .subscribe(
        //     data => {
        //
        //     },
        //     error => {
        //
        //     })
    }

    signup() {
        this.loading = true
        this._userService.create(this.model)
            .subscribe(
            data => {
                this.showAlert('alertSignin')
                // this._alertService.success('Thank you. To complete your registration please check your email.', true)
                this.loading = false
                LoginCustom.displaySignInForm()
                this.model = {}
            },
            error => {
                this.showAlert('alertSignup')
                // this._alertService.error(error)
                this.loading = false
            })
    }

    forgotPass() {
        this.loading = true
        this._userService.forgotPassword(this.model.email)
            .subscribe(
            data => {
                this.showAlert('alertSignin')
                // this._alertService.success('Cool! Password recovery instruction has been sent to your email.', true)
                this.loading = false
                LoginCustom.displaySignInForm()
                this.model = {}
            },
            error => {
                this.showAlert('alertForgotPass')
                // this._alertService.error(error)
                this.loading = false
            })
    }

    showAlert(target) {
        this[target].clear()
        // let factory = this.cfr.resolveComponentFactory(AlertComponent)
        // let ref = this[target].createComponent(factory)
        // ref.changeDetectorRef.detectChanges()
    }
}
