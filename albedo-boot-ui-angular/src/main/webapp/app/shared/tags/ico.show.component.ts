import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { DictService } from "../../theme/pages/modules/sys/dict/dict.service";

@Component({
    selector: "alb-ico-show",
    templateUrl: "./ico.show.component.html"
})
export class AlbIcoShowComponent implements OnInit, AfterViewInit {

    @Input() id?: string
    @Input() title?: string //标题
    @Input() name?: string //标题
    @Input() disabled?: string //标题
    @Input() value?: string  //隐藏域值（ID）
    @Input() checked?: string  //是否显示复选框
    @Input() url?: string // 树结构数据地址
    @Input() checkNodeFn?: Function //选中事件
    @Input() beforeCheckNodeFn?: Function //菜单checkbox / radio被勾选 或 取消勾选之前的事件回调函数，并且根据返回值确定是否允许 勾选 或 取消勾选
    @Input() cancelClickNodeFn?: Function//菜单节点取消点击的事件回调函数
    @Input() clickNodeFn?: Function //菜单节点被点击的事件回调函数
    @Input() afterLoadNodeFn?: Function //菜单加载完毕回调函数
    @Input() nodesLevel?: string //菜单展开层数
    @Input() selectNodeId?: string // 默认选择节点Id
    @Input() notAllowSelectRoot?: string //不允许选择根节点
    @Input() notAllowSelectParent?: string //不允许选择父节点
    @Input() notAllowSelect?: string //不允许选择节点
    @Input() allowCancelSelect?: string //允许取消选择节点
    @Input() checkShowInputId?: string //树结构checked显示所有选择节点名称的文本框Id，并且仅当 cchecked为true、heckNodeFn为空时生效
    @Input() checkIdInputName?: string //树结构checked存放所有选择节点Id隐藏文本框名称，并且仅当 checked为true、checkNodeFn为空时生效
    @Input() onlyCheckedProperty?: string //是否只允许选择叶含某个属性节点的复选框
    @Input() selectedValueFn?: Function //选择节点后触发的函数
    @Input() onlyCheckedChild?: boolean
    private afterViewInit = false

    // tslint:disable-next-line: no-unused-variable
    constructor(private dictService: DictService) {
    }


    ngOnInit(): void {

    }


    /**/
    ngAfterViewInit(): void {
        this.afterViewInit = true
        this.initTags()
    }


    private initTags() {

    }

}
