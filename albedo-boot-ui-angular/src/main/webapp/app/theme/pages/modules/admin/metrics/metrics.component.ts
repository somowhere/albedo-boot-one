import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetricsService } from "./metrics.service";
import { MetricsMonitoringModalComponent } from "./metrics.modal.component";


@Component({
    selector: 'alb-metrics.page',
    templateUrl: './metrics.component.html'
})
export class MetricsMonitoringComponent implements OnInit, AfterViewInit {

    metrics: any = {};
    cachesStats: any = {};
    servicesStats: any = {};
    updatingMetrics = true;
    JCACHE_KEY: string;

    constructor(
        private modalService: NgbModal,
        private metricsService: MetricsService
    ) {
        this.JCACHE_KEY = 'net.sf.ehcache.Cache';
    }

    ngOnInit() {
        this.refresh();
    }
    ngAfterViewInit(): void {

    }
    refresh() {
        this.updatingMetrics = true;
        this.metricsService.getMetrics().subscribe((metrics) => {
            this.metrics = metrics;
            this.updatingMetrics = false;
            this.servicesStats = {};
            this.cachesStats = {};
            Object.keys(metrics.timers).forEach((key) => {
                const value = metrics.timers[key];
                if (key.indexOf('web') !== -1 || key.indexOf('service') !== -1) {
                    this.servicesStats[key] = value;
                }
            });
            Object.keys(metrics.gauges).forEach((key) => {
                if (key.indexOf('jcache.statistics') !== -1) {
                    const value = metrics.gauges[key].value;
                    // remove gets or puts
                    const index = key.lastIndexOf('.');
                    const newKey = key.substr(0, index);

                    // Keep the name of the domain
                    this.cachesStats[newKey] = {
                        'name': this.JCACHE_KEY.length,
                        'value': value
                    };
                }
            });
            setTimeout(albedoList.initHtmlTable($(".m_datatable")), 1000)
        });

    }

    refreshThreadDumpData() {
        this.metricsService.threadDump().subscribe((data) => {
            const modalRef = this.modalService.open(MetricsMonitoringModalComponent, { size: 'lg' });
            modalRef.componentInstance.threadDump = data;
            modalRef.result.then((result) => {
                // Left blank intentionally, nothing to do here
            }, (reason) => {
                // Left blank intentionally, nothing to do here
            });
        });
    }

    filterNaN(input) {
        if (isNaN(input)) {
            return 0;
        }
        return input;
    }

}
