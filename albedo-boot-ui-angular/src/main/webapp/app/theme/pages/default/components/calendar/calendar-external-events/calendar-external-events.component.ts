import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core'
import { Helpers } from '../../../../../../helpers'
import { ScriptLoaderService } from '../../../../../../shared/base/service/script-loader.service'


@Component({
    selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
    templateUrl: "./calendar-external-events.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class CalendarExternalEventsComponent implements OnInit, AfterViewInit {


    constructor(private _script: ScriptLoaderService) {

    }
    ngOnInit() {

    }
    ngAfterViewInit() {
        this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
            'assets/vendors/custom/jquery-ui/jquery-ui.bundle.js',
            'assets/demo/default/custom/components/calendar/external-events.js')

    }

}
