import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { Helpers } from '../../../helpers'
import { ScriptLoaderService } from '../../../shared/base/service/script-loader.service'


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-grid.m-grid--ver-desktop.m-grid--desktop.m-body",
    templateUrl: "./default.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DefaultComponent implements OnInit {


    constructor() {

    }
    ngOnInit() {

        // console.log("DefaultComponent")
    }

}
