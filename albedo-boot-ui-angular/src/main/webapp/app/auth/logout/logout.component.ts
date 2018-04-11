import { Component, OnInit, ViewEncapsulation } from "@angular/core"
import { Router } from "@angular/router"
import { Helpers } from "../../helpers"
import { LoginService } from "../_services/login.service";

@Component({
    selector: 'app-logout',
    templateUrl: './logout.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit {

    constructor(private _router: Router,
        private _loginService: LoginService) {
    }

    ngOnInit(): void {
        Helpers.setLoading(true)
        // reset login status
        this._loginService.logout()
        this._router.navigate(['/login'])
    }
}
