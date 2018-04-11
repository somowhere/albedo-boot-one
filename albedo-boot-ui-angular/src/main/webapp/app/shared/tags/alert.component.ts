// import { Component, OnInit } from "@angular/core"
// import { AlertService } from "../../auth/_services/index"
//
// @Component({
//     selector: 'app-alert',
//     template: '<div *ngIf="message" class="m-alert m-alert--outline alert alert-{{message.type}} alert-dismissible" role="alert">\n' +
//     '\t<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\n' +
//     '\t<span>{{message.text}}</span>\n' +
//     '</div>'
// })
//
// export class AlertComponent implements OnInit {
//     message: any
//
//     constructor(private _alertService: AlertService) {
//     }
//
//     ngOnInit() {
//         this._alertService.getMessage().subscribe(message => {
//             this.message = message
//         })
//     }
// }
