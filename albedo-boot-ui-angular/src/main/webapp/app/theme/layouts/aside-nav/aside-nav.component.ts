import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core'

import { LocalStorageService } from "ngx-webstorage"
import { Module } from "../../pages/modules/sys/module/module.model";
import { ModuleService } from "../../pages/modules/sys/module/module.service";
import { DataSystemService } from "../../../shared/base/service/data.system.service";
import { PublicService } from "../../../shared/base/service/public.service";

declare let mLayout: any
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {

    private menus: Module[]
    menusData: Module[]
    private afterViewInit = false

    constructor(
        private dataSystemService: DataSystemService,
        private publicService: PublicService,
    ) {
        this.dataSystemService.menus().subscribe(
            (data: Module[]) => {
                this.menus = data
                this.initMenuData()
            }
        )
    }
    ngOnInit() {
        // this.initMenuNav()
    }

    ngAfterViewInit() {
        this.afterViewInit = true

    }

    getChildMenus(id): Module[] {
        return this.menus.filter((item: Module) => {
            return item.parentId == id
        })
    }
    private initMenuData() {
        this.menusData = []
        this.menus.forEach(item => {
            if (item.menuTop) {
                this.menusData.push(item)
                this.getChildMenus(item.id).forEach(itemChild => {
                    if (!itemChild.menuLeaf) {
                        itemChild.childMenus = this.getChildMenus(itemChild.id)
                    }
                    this.menusData.push(itemChild)
                })
            }
        })
        var thisPublicService = this.publicService
        setTimeout(function() {
            mLayout.initAside()
            thisPublicService.setActiveItemMenu()
        }, 100)
    }

    private initMenuNav() {
        if (this.menus == null || $("#m_ver_menu .m-menu__nav").length > 0) return

        let $menuUl = $("<ul class=\"m-menu__nav  m-menu__nav--dropdown-submenu-arrow\" />")
        this.menus.forEach(item => {
            if (item.menuTop) {
                if (item.url != '') {
                    item.show && $menuUl.append("<li class=\"m-menu__item\" routerLinkActive=\"m-menu__item--active\" routerLinkActiveOptions=\"{ exact: true }\"  aria-haspopup=\"true\" >" +
                        "<a routerLink=\"/" + item.url + "\" class=\"m-menu__link\">" +
                        "<i class=\"m-menu__link-icon " + item.iconCls + "\"></i>" +
                        "<span class=\"m-menu__link-text\">" +
                        item.name +
                        "</span></a></li>")
                } else {
                    item.show && $menuUl.append("<li class=\"m-menu__section\">" +
                        "<h4 class=\"m-menu__section-text\">" +
                        item.name +
                        "</h4>" +
                        "<i class=\"m-menu__section-icon flaticon-more-v3\"></i>" +
                        "</li>")
                }

                this.getChildMenus(item.id).forEach(itemChild => {
                    if (!itemChild.menuLeaf) {
                        itemChild.show && $menuUl.append("<li class=\"m-menu__item  m-menu__item--submenu\" routerLinkActive=\"m-menu__item--active\" routerLinkActiveOptions=\"{ exact: true }\"  aria-haspopup=\"true\"  data-menu-submenu-toggle=\"hover\">" +
                            "<a  href=\"#\" class=\"m-menu__link m-menu__toggle\">" +
                            "<i class=\"m-menu__link-icon " + itemChild.iconCls + "\"></i>" +
                            "<span class=\"m-menu__link-text\">" +
                            itemChild.name +
                            "</span>" +
                            "<i class=\"m-menu__ver-arrow la la-angle-right\"></i>" +
                            "</a>" +
                            "<div class=\"m-menu__submenu\">" +
                            "                    <span class=\"m-menu__arrow\"></span>" +
                            "                    <ul class=\"m-menu__subnav\">" +
                            "                        </ul></div></li>")

                        this.getChildMenus(itemChild.id).forEach(itemMinChild => {
                            itemMinChild.show && $menuUl.find(".m-menu__item--submenu:contains('" + itemChild.name + "') ul.m-menu__subnav")
                                .append("<li class=\"m-menu__item\" routerLinkActive=\"m-menu__item--active\" routerLinkActiveOptions=\"{ exact: true }\"  aria-haspopup=\"true\" >" +
                                "<a routerLink=\"" + itemMinChild.url + "\" class=\"m-menu__link\">" +
                                "<i class=\"m-menu__link-bullet m-menu__link-bullet--dot\">" +
                                "<span></span>" +
                                "</i>" +
                                "<span class=\"m-menu__link-text\">" +
                                itemMinChild.name +
                                "</span>" +
                                "</a>" +
                                "</li>")
                        })

                    } else {
                        $menuUl.append("<li class=\"m-menu__item\" routerLinkActive=\"m-menu__item--active\" routerLinkActiveOptions=\"{ exact: true }\"  aria-haspopup=\"true\" >" +
                            "<a routerLink=\"/" + itemChild.url + "\" class=\"m-menu__link\">" +
                            "<i class=\"m-menu__link-icon " + itemChild.iconCls + "\"></i>" +
                            "<span class=\"m-menu__link-text\">" +
                            itemChild.name +
                            "</span></a></li>")
                    }
                })

            }

        })

        // noinspection TypeScriptUnresolvedFunction
        $("#m_ver_menu").append($menuUl)


    }

}
