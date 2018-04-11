import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core'
import { ComboSearch } from "../base/model/combo.search.model"
import { ComboData } from "../base/model/combo.data.model"
import { Http } from "@angular/http"
import { createRequestOption } from "../base/request.util"
import { OnChanges } from "@angular/core/src/metadata/lifecycle_hooks"
import { DictQuery } from "../../theme/pages/modules/sys/dict/dict.query.model";
import { DictService } from "../../theme/pages/modules/sys/dict/dict.service";
import { HttpClient } from "@angular/common/http";
import { DataSystemService } from "../base/service/data.system.service";

@Component({
    selector: "alb-form",
    templateUrl: "./form.component.html"
})
export class AlbFormComponent implements OnInit, AfterViewInit, OnChanges {

    @Input()
    public dictQuery?: DictQuery
    @Input()
    public comboSearch?: ComboSearch
    /**有延迟*/
    @Input()
    comboData?: ComboData[]
    /**无延迟*/
    @Input()
    data?: string
    @Input()
    public dictCode?: string
    @Input()
    public name?: string
    @Input()
    public searchItem?: string
    @Input()
    operate?: string
    @Input()
    clickFunc?: Function
    @Input()
    multiple?: string
    @Input()
    dataLiveSearch: boolean
    @Input()
    analytiColumn?: string
    @Input()
    analytiColumnPrefix?: string
    @Input()
    itemLabel?: string
    @Input()
    itemValue?: string
    @Input()
    attrType?: string
    @Input()
    id?: string
    @Input()
    value?: string
    @Input()
    cssClass?: string
    @Input()
    dataOptions?: string
    @Input()
    boxType?: string
    @Input()
    url?: string
    @Input()
    params?: any
    private afterViewInit = false

    // tslint:disable-next-line: no-unused-variable
    constructor(protected http: HttpClient, private dataSystemService: DataSystemService) {


    }
    ngOnInit(): void {
        if (!this.comboData) {
            if (this.dictCode != null) this.dictQuery = new DictQuery(this.dictCode)
            let params = this.dictQuery != null ? this.dictQuery : this.comboSearch
            params && this.dataSystemService.dictCodes(params).subscribe(
                (res: any) => {
                    this.comboData = res.data
                    this.initTags()
                }
            )
            this.url && this.http.get(this.url, createRequestOption(this.params)).map((res: any) => res).subscribe(
                (res: any) => {
                    this.comboData = res.data
                    this.initTags()
                }
            )
            this.data && eval("this.comboData =" + this.data)
        }
        // console.log(this.data)

    }


    equleValue(valLabel): boolean {
        return this.value && (valLabel == this.value || ("," + this.value + ",").indexOf("," + valLabel + ",") != -1)
    }

    /**/
    ngAfterViewInit(): void {
        this.afterViewInit = true
        this.initTags()
    }

    toStr(input: string): string {
        return input ? input : ""
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if(changes.value && changes.value.currentValue){

        //     var ngValue = changes.value.currentValue,$selfBox = $("#form-item-" + this.id).parent()
        //     console.log(ngValue)
        //     if(this.boxType == AlbFormComponent.BOX_TYPE_SELECT){
        //         $selfBox.find("select option").removeAttr("selected")
        //         $selfBox.find("select option[value='"+ngValue+"']").attr("selected", "selected")
        //     }else {
        //         $selfBox.find("input[type='"+this.boxType+"']").removeAttr("checked")
        //         var ngValues = ngValue.toString().split(",")
        //         for(var itemValue in ngValues){
        //             itemValue && $selfBox.find("input[type='"+this.boxType+"'][value='"+itemValue+"']").attr("checked", "checked")
        //         }
        //
        //     }
        // }
    }
    private initTags() {
        var self = this
        if (self.afterViewInit != true || self.comboData == null) return
        // console.log(self.comboData)
        setTimeout(function() {
            $('.m-bootstrap-select').selectpicker().on('hidden.bs.select', function(e) {
                self.changeVal()
            })
        }, 400)
        // if(!self.value){
        //     var ngValue = $("#form-item-" + self.id).parent().attr("ng-reflect-value")
        //     if(ngValue) self.value = ngValue
        // }
        // console.log(self.value)
        // let $formTag
        // self.operate = self.operate ? self.operate : 'like'
        // if (self.boxType == AlbFormComponent.BOX_TYPE_SELECT) {
        //     $formTag = $("<select " +
        //         "id=\"" + self.toStr(self.id) + "\" " +
        //         "name=\"" + self.toStr(self.name) + "\" " + (self.searchItem ? ("searchItem=\"" + self.toStr(self.searchItem) + "\" attrType=\"" + self.toStr(self.attrType) + "\" " +
        //             "operate=\"" + self.toStr(self.operate) + "\" " +
        //             "analytiColumn=\"" + self.toStr(self.analytiColumn) + "\" " +
        //             "analytiColumnPrefix=\"" + self.toStr(self.analytiColumnPrefix) + "\" " ) : "") +
        //
        //         "class=\"form-control m-bootstrap-select " + self.toStr(self.cssClass) + "\">" +
        //         "</select>")
        //
        //     if (!self.cssClass || self.cssClass.indexOf("required") == -1) {
        //         $formTag.append($("<option value=\"\">请选择...</option>"))
        //     }
        //     self.comboData.forEach(item => {
        //         $formTag.append($("<option value=\"" + self.toStr(item.id) + "\" " + (self.value == item.id ? "selected='selected'" : "") + ">" + item.name + "</option>"))
        //     })
        // } else {
        //     $formTag = $("<div class=\"m-" + self.toStr(self.boxType) + "-inline\"></div>")
        //     let i = 1
        //     self.comboData.forEach(item => {
        //         let valLabel = item.id, nameLabel = item.name
        //         $formTag.append($("<label class=\"m-" + self.boxType + "\">" +
        //             "<input type=\"" + (AlbFormComponent.BOX_TYPE_CHECKBOX == self.boxType ? AlbFormComponent.BOX_TYPE_CHECKBOX : AlbFormComponent.BOX_TYPE_RADIO) + "\" " +
        //             "id=\"" + (self.id ? self.name : self.id) + (i) + "\" " +
        //             "name=\"" + self.name + "\" " +(self.searchItem? (
        //                 "searchItem=\"" + self.toStr(self.searchItem) + "\" " +
        //                 "attrType=\"" + self.toStr(self.attrType) + "\"" +
        //                 "operate=\"" + self.toStr(self.operate) + "\" " +
        //                 "analytiColumn=\"" + self.toStr(self.analytiColumn) + "\" " +
        //                 "analytiColumnPrefix=\"" + self.toStr(self.analytiColumnPrefix) + "\" "
        //             ) : "")+"itemLabel=\"" + self.toStr(self.itemLabel) + "\" " +
        //             "itemValue=\"" + self.toStr(self.itemValue) + "\" " +
        //             "value=\"" + valLabel + "\" " +
        //             "class=\"" + self.toStr(self.cssClass) + "\"" +
        //             (self.value && (valLabel == self.value || (","+self.value+",").indexOf(","+valLabel+",") != -1) ? "checked=\"checked\"" : "") +
        //             "data-options=\"" + self.toStr(self.dataOptions) + "\"  />" + nameLabel + "<span></span></label>"))
        //         i++
        //     })
        // }
        // $("#form-item-" + self.id).parent().append($formTag)
        //     .find('.m-bootstrap-select').selectpicker()
        // self.scriptLoaderService.load(".m-bootstrap-select", "assets/common/formInit.js")

    }

    changeVal() {
        this.clickFunc && this.clickFunc()
    }

}
