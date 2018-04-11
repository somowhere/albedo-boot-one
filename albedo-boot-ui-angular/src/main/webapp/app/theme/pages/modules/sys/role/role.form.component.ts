import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { CTX } from "../../../../../app.constants"
import { ActivatedRoute } from "@angular/router"
import { RoleService } from "./role.service"
import { Role } from "./role.model"
import { ModuleService } from "../module/module.service"
import { OrgService } from "../org/org.service"
import { DataSystemService } from "../../../../../shared/base/service/data.system.service";
import { PublicService } from "../../../../../shared/base/service/public.service";

@Component({
    selector: ".sys-role-form.page-form",
    templateUrl: "./role.form.component.html"
})
export class RoleFormComponent implements OnInit, OnDestroy, AfterViewInit {

    role: Role
    routerSub: any
    ctx: any
    id: any

    private afterViewInit = false
    private afterLoad = false
    constructor(
        private router: ActivatedRoute,
        private roleService: RoleService,
        private dataSystemService: DataSystemService,
        private publicService: PublicService) {
        this.ctx = publicService.getServiceCtx('sys_role')
        this.role = new Role()

    }

    ngOnInit() {
        this.routerSub = this.router.params.subscribe((params) => {
            this.id = params['id']
            if (this.id) {
                this.roleService.find(this.id).subscribe((data) => {
                    this.role = data
                    albedoForm.setData("#role-save-form", this.role)
                    this.afterLoad = true
                    this.initForm()
                })
            } else {
                this.afterLoad = true
                this.initForm()
            }
        })
    }

    ngOnDestroy() {
        this.routerSub.unsubscribe()
    }

    ngAfterViewInit() {
        this.afterViewInit = true
        this.initForm()
    }

    initForm() {
        if (!this.afterViewInit || !this.afterLoad) return

        var roleId = this.role.id, thisCtx = this.ctx
        albedoForm.initValidate($("#role-save-form"), {
            rules: {
                name: { remote: thisCtx + '/sys/role/checkByProperty?_statusFalse&id=' + encodeURIComponent(roleId) },
            },
            messages: {
                name: { message: '角色已存在' },
            },
        })
        this.initTree()
        albedoForm.init()
        albedoForm.initSave(null, function() {
            let treeRoleModule = $.fn.mTreeObj("treeRoleModule")
            if (treeRoleModule) {
                var nodes = treeRoleModule.getCheckedNodes()
                $('input[name=\'moduleIdList\']').remove()
                for (var o in nodes) {
                    $('#treeRoleModule').before($('<input type=\'hidden\' name=\'moduleIdList\' />').val(nodes[o].id))
                }
            }
            let treeRoleOrg = $.fn.mTreeObj("treeRoleOrg")
            if ($('#dataScope').val() == 5 && treeRoleOrg) {
                var nodes = treeRoleOrg.getCheckedNodes()
                $('input[name=\'orgIdList\']').remove()
                for (var i = 0; i < nodes.length; i++) {
                    if (!nodes[i].getCheckStatus().half) //排除半选中状态
                        $('#treeRoleModule').before($('<input type=\'hidden\' name=\'orgIdList\' />').val(nodes[i].id))
                }
            }
            if (!$('input[name=\'moduleIdList\']').val()) {
                mApp.alert({
                    container: $('#bootstrap-alerts'),
                    closeInSeconds: 8,
                    type: "warning",
                    message: '请重新选择操作权限！',
                })
                $(".operate-permision").removeClass("has-success").addClass("has-danger")
                return false
            } else {
                $(".operate-permision").removeClass("has-danger").addClass("has-success")
                return true
            }
        })


    }
    initTree() {
        var treeRoleModule, treeRoleOrg, data, setting = {
            view: { selectedMulti: false }, check: { enable: true, nocheckInherit: true },
            data: { key: { name: 'label' }, simpleData: { enable: true, idKey: 'id', pIdKey: 'pid' } }
        }

        this.dataSystemService.moduleTreeData().subscribe(
            (data: any) => {
                // 初始化树结构
                treeRoleModule = $.fn.mTreeInit($("#treeRoleModule"), setting, data)
                var nodes = treeRoleModule.expandAll(true)
                // 默认选择节点
                $("input[name='moduleIdList']").each(function() {
                    // console.log( $(this).val())
                    var node = treeRoleModule.getNodeByParam("id", $(this).val())
                    if (node) treeRoleModule.checkNode(node, true, false, false)
                })
            }
        )
        this.dataSystemService.orgTreeData().subscribe((data: any) => {
            // 初始化树结构
            treeRoleOrg = $.fn.mTreeInit($("#treeRoleOrg"), setting, data)
            var nodes = treeRoleOrg.expandAll(true)
            // 默认选择节点
            $("input[name='orgIdList']").each(function() {
                var node = treeRoleOrg.getNodeByParam("id", $(this).val())
                if (node) treeRoleOrg.checkNode(node, true, true, false)
            })
        })
    }
    refreshOrgTree() {
        $("input[name='dataScope']:checked").val() == 5 ? $(".treeRoleOrgBox").show() : $(".treeRoleOrgBox").hide()
    }

}
