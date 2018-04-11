import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { DictService } from "../../theme/pages/modules/sys/dict/dict.service";

@Component({
    selector: "alb-tree-select",
    templateUrl: "./tree.select.component.html"
})
export class AlbTreeSelectComponent implements OnInit, AfterViewInit {

    @Input() id?: string
    @Input() name?: string //隐藏域名称（ID）
    @Input() value?: string  //隐藏域值（ID）
    @Input() cssClass?: string
    @Input() labelName?: string //输入框名称（Name）
    @Input() labelValue?: string //输入框值（Name）
    @Input() searchItem?: string
    @Input() operate?: string
    @Input() attrType?: string
    @Input() title?: string //选择框标题
    @Input() url?: string //树结构数据地址
    @Input() checked?: string //是否显示复选框
    @Input() extId?: string // 排除掉的编号（不能选择的编号）
    @Input() notAllowSelectRoot?: string //不允许选择根节点
    @Input() notAllowSelectParent?: string //不允许选择父节点
    @Input() module?: string //过滤栏目模型（只显示指定模型，仅针对CMS的Category树）
    @Input() selectScopeModule?: string //选择范围内的模型（控制不能选择公共模型，不能选择本栏目外的模型）（仅针对CMS的Category树）
    @Input() allowClear?: string //是否允许清除
    @Input() nodesLevel?: string //菜单展开层数
    @Input() nameLevel?: string //返回名称关联级别
    @Input() selectedValueFn?: string //选择节点后触发的函数
    @Input() disabled?: boolean
    @Input() disabledStr?: string
    private afterViewInit = false

    // tslint:disable-next-line: no-unused-variable
    constructor(private dictService: DictService) {
        this.disabledStr = this.disabled ? "disabled='disalbed'" : ""
    }


    ngOnInit(): void {

    }


    /**/
    ngAfterViewInit(): void {
        this.afterViewInit = true
        this.initTags()
    }


    private initTags() {
        // if (this.afterViewInit != true || this.comboData == null) return
        // let $formTag
        // this.operate = this.operate ? this.operate : 'like'
        // if (this.boxType == AlbFormComponent.BOX_TYPE_SELECT) {
        //     $formTag = $("<select " +
        //         "id=\"" + this.toStr(this.id) + "\" " +
        //         "name=\"" + this.toStr(this.name) + "\" " +
        //         "searchItem=\"" + this.toStr(this.searchItem) + "\" " +
        //         "attrType=\"" + this.toStr(this.attrType) + "\" " +
        //         "operate=\"" + this.toStr(this.operate) + "\" " +
        //         "analytiColumn=\"" + this.toStr(this.analytiColumn) + "\" " +
        //         "analytiColumnPrefix=\"" + this.toStr(this.analytiColumnPrefix) + "\" " +
        //         "class=\"form-control m-bootstrap-select " + this.toStr(this.cssClass) + "\">" +
        //         "</select>")
        //
        //     if (!this.cssClass || this.cssClass.indexOf("required") == -1) {
        //         $formTag.append($("<option value=\">请选择...</option>"))
        //     }
        //     this.comboData.forEach(item => {
        //         $formTag.append($("<option value=\"" + this.toStr(item.id) + "\" " + (this.value == item.id ? "selected='selected'" : "") + ">" + item.name + "</option>"))
        //     })
        // } else {
        //     $formTag = $("<div class=\"m-" + this.toStr(this.boxType) + "-inline\"></div>")
        //     let i = 1
        //     this.comboData.forEach(item => {
        //         let valLabel = item.id, nameLabel = item.name
        //         $formTag.append($("<label class=\"m-" + this.boxType + "\">" +
        //             "<input type=\"" + (AlbFormComponent.BOX_TYPE_CHECKBOX == this.boxType ? AlbFormComponent.BOX_TYPE_CHECKBOX : AlbFormComponent.BOX_TYPE_RADIO) + "\" " +
        //             "id=\"" + (this.id ? this.name : this.id) + (i) + "\" " +
        //             "name=\"" + this.name + "\" " +
        //             "searchItem=\"" + this.toStr(this.searchItem) + "\" " +
        //             "attrType=\"" + this.toStr(this.attrType) + "\"" +
        //             "operate=\"" + this.toStr(this.operate) + "\" " +
        //             "analytiColumn=\"" + this.toStr(this.analytiColumn) + "\" " +
        //             "analytiColumnPrefix=\"" + this.toStr(this.analytiColumnPrefix) + "\" " +
        //             "itemLabel=\"" + this.toStr(this.itemLabel) + "\" " +
        //             "itemValue=\"" + this.toStr(this.itemValue) + "\" " +
        //             "value=\"" + valLabel + "\" " +
        //             "class=\"" + this.toStr(this.cssClass) + "\"" +
        //             (valLabel == this.value && this.value.indexOf(valLabel) != -1 ? "checked=\"checked\"" : "") +
        //             "data-options=\"" + this.toStr(this.dataOptions) + "\"  />" + nameLabel + "<span></span></label>"))
        //         i++
        //     })
        // }
        // $("#form-item-" + this.id).parent().parent().empty({{$formTag)
        //     .find('.m-bootstrap-select').selectpicker()
        // this.scriptLoaderService.load(".m-bootstrap-select", "assets/common/formInit.js")

    }

}
