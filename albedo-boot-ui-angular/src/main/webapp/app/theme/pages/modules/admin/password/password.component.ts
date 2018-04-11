import { Component, OnInit } from '@angular/core';

import { PasswordService } from './password.service';
import { Principal } from "../../../../../auth/_services/principal.service";
import { MSG_TYPE_SUCCESS } from "../../../../../app.constants";

@Component({
    selector: 'alb-password.page',
    templateUrl: './password.component.html'
})
export class PasswordComponent implements OnInit {
    error: string;
    success: string;
    account: any;
    password: string;
    oldPassword: string;
    confirmPassword: string;

    constructor(
        private passwordService: PasswordService,
        private principal: Principal
    ) {
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
    }

    changePassword() {
        if (this.password !== this.confirmPassword) {
            this.error = "新密码和确认密码有误";
        } else if (this.password == this.oldPassword) {
            this.error = "新旧密码不能相同";
        } else {
            this.passwordService.save(this.password, this.oldPassword, this.confirmPassword).subscribe((data) => {
                if (data && data.status != MSG_TYPE_SUCCESS) {
                    this.success = null;
                    this.error = data.message;
                } else {
                    this.success = 'OK';
                    this.oldPassword = null;
                    this.password = null;
                    this.confirmPassword = null;
                    this.error = null;
                }
            }, (data) => {
                this.success = null;
                this.error = data && data.error && data.error.message ? data.error.message : '发生了一个错误 密码可能没有修改成功';
            });
        }
    }
}
