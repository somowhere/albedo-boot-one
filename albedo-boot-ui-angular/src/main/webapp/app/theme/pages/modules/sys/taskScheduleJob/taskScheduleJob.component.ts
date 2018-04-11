import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from "../../../../../shared/base/service/script-loader.service";
import { CTX, DATA_STATUS } from "../../../../../app.constants";
import { ActivatedRoute } from "@angular/router";
import { Principal } from "../../../../../auth/_services/principal.service";
import { PublicService } from "../../../../../shared/base/service/public.service";

@Component({
    selector: ".sys-taskScheduleJob-list.page-list",
    templateUrl: "./taskScheduleJob.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class TaskScheduleJobComponent implements AfterViewInit {

    ctx: any
    constructor(
        private _script: ScriptLoaderService,
        private router: ActivatedRoute,
        private principal: Principal,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_taskScheduleJob')
    }

    ngAfterViewInit() {
        this.initTable()
    }

    initTable() {
        var thisPrincipal = this.principal, thisCtx = this.ctx;
        var options = {
            data: {
                source: {
                    read: {
                        method: 'GET',
                        url: CTX + '/sys/taskScheduleJob/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    title: '名称', field: 'name'
                    , width: 110, sortable: 'asc', overflow: 'visible', template: function(row) {
                        return thisPrincipal.hasAnyAuthorityDirectOne("sys_taskScheduleJob_edit") ? ('<a href="#/sys/taskScheduleJob/form/' + row.id + '" class="m-link" title="点击编辑任务调度">' + row.name + '</a>') : row.name;
                    },
                },
                {
                    title: '分组', field: 'group'
                },
                {
                    title: '任务状态', field: 'jobStatus'
                },
                {
                    title: 'cron表达式', field: 'cronExpression'
                },
                {
                    title: '包名+类名', field: 'beanClass'
                },
                {
                    title: '任务是否有状态', field: 'isConcurrent'
                },
                {
                    title: 'spring bean', field: 'springId'
                },
                {
                    title: 'source_id', field: 'sourceId'
                },
                {
                    title: '任务调用的方法名', field: 'methodName'
                },
                {
                    title: '方法参数', field: 'methodParams'
                },
            ],
        };
        if (thisPrincipal.hasAnyAuthorityDirect(["sys_taskScheduleJob_edit", "sys_taskScheduleJob_lock", "sys_taskScheduleJob_delete"])) {
            options.columns.push({
                field: 'Actions',
                width: 110,
                title: '操作',
                sortable: false,
                overflow: 'visible',
                template: function(row) {
                    var template = '';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_taskScheduleJob_edit"))
                        template += '<a href="#/sys/taskScheduleJob/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                            \<i class="la la-edit"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_taskScheduleJob_lock"))
                        template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '任务调度"\
                     data-table-id="#data-table-taskScheduleJob" data-method="put"  data-title="你确认要操作【' + row.name + '】任务调度吗？" data-url="' + thisCtx + '/sys/taskScheduleJob/' + row.id + '">\
                            \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                            \</a>';
                    if (thisPrincipal.hasAnyAuthorityDirectOne("sys_taskScheduleJob_delete"))
                        template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                               data-table-id="#data-table-taskScheduleJob" data-method="delete"  data-title="你确认要删除【' + row.name + '】任务调度吗？" data-url="' + thisCtx + '/sys/taskScheduleJob/' + row.id + '">\
                            \<i class="la la-trash"></i>\
                            \</a>';
                    return template;
                },
            })
        }
        albedoList.initTable($('#data-table-taskScheduleJob'), $('#taskScheduleJob-search-form'), options);
        albedoList.init();
        albedoForm.init();
    }



}
