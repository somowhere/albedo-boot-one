var albedoForm = function () {
    var _searchInputFocusKey = function ($key) {
        if ($key.hasClass("empty")) {
            $key.removeClass("empty");
        }
    }
    var _searchInputBlurKey = function ($key, $container) {
        if ($key.get(0).value === "") {
            $key.addClass("empty");
        }
        _searchNode($key, $container);
    }
    var _searchNode = function ($key, $container) {
        // 取得输入的关键字的值
        var value = $.trim($key.get(0).value);

        if ($key.hasClass("empty")) {
            value = "";
        }
        // 如果和上次一次，就退出不查了。
        if ($key.attr("lastValue_") === value) {
            return value;
        }
        // 保存最后一次
        $key.attr("lastValue_", value);
        // 如果要查空字串，就退出不查了。
        if (value === "") {
            {
                $container&&$container.length>0&&$container.mCustomScrollbar('scrollTo', 0);
            }
            return value;
        }
        return value;
    }
    var _getOptions = function($target){
        var options={};
        try {
            eval("var options=" + ($target.attr("options")));
        }catch (e){}
        return options;
    }
    var _searchTreeInputBlurKey = function ($key, tree) {
        if ($key.get(0).value === "") {
            $key.addClass("empty");
        }
        // _searchTreeNode($key, tree);
    }
    var _searchTreeNode = function ($key, tree) {

        var $container = tree.setting.treeObj;
        var searchValue = _searchNode($key, $container);
        if(searchValue && tree){
            // 按名字查询
            var keyType = "label";
            _treeSearchUpdateNodes(tree, false, tree.transformToArray(tree.getNodes()));
            _treeSearchUpdateNodes(tree, true, tree.getNodesByParamFuzzy(keyType, searchValue, null));
        }
    }
    var _treeSearchUpdateNodes = function (tree, highlight, nodeList) {
        var $container = tree.setting.treeObj;
        for (var i = 0, l = nodeList.length; i < l; i++) {
            nodeList[i].highlight = highlight;
            tree.updateNode(nodeList[i]);
            tree.expandNode(nodeList[i].getParentNode(), true, false, true);
            if (i == 0 && highlight) {
                // var scorll = $("a[title='" + nodeList[i].label + "']").offset().top - $container.offset().top - 5;
//				$container.animate({scrollTop: scorll},500)
                var $scorllTarget = $("a[title='" + nodeList[i].label + "']");
                $container.mCustomScrollbar('scrollTo', $scorllTarget);
            }
        }
    }
    var _mapData={};
    var _getData = function (key) {
        return _mapData ? _mapData[key] : null;
    }
    var _setData = function (key, data) {
        _mapData[key] = data;
    }
    var handleClearData = function () {
        if(_mapData){
            _mapData = {}
        }
    }
    var handleClearDataBylikeKey = function (key) {
        if(_mapData){
            for(var temp in _mapData){
                if(temp.indexOf(key)!=-1){
                    _mapData[temp] = null
                }
            }
        }
    }
    /**public**/

    var treeShow = function ($thiz) {
        var name = $thiz.attr("name"),
            url = $thiz.attr("_url") ? $thiz.attr("_url") : "",
            checked = $thiz.attr("_checked") == "true" ? true : false,
            onlyCheckedChild = $thiz.attr("_onlyCheckedChild") ? $thiz.attr("_onlyCheckedChild") : false,
            onlyCheckedProperty = $thiz.attr("_onlyCheckedProperty") ? $thiz.attr("_onlyCheckedProperty") : false,
            checkIdInputName = $thiz.attr("_checkIdInputName") ? $thiz.attr("_checkIdInputName") : "",
            checkShowInputId = $thiz.attr("_checkShowInputId") ? $thiz.attr("_checkShowInputId") : "",
            notAllowSelectRoot = $thiz.attr("_notAllowSelectRoot") ? $thiz.attr("_notAllowSelectRoot") : false,
            notAllowSelectParent = $thiz.attr("_notAllowSelectParent") ? $thiz.attr("_notAllowSelectParent") : false,
            notAllowSelect = $thiz.attr("_notAllowSelect") ? $thiz.attr("_notAllowSelect") : false,
            allowCancelSelect = $thiz.attr("_allowCancelSelect") ? $thiz.attr("_allowCancelSelect") : false,
            nodesLevel = $thiz.attr("_nodesLevel") ? $thiz.attr("_nodesLevel") : "",
            afterLoadNodeFn = $thiz.attr("_afterLoadNodeFn") ? $thiz.attr("_afterLoadNodeFn") : "",
            clickNodeFn = $thiz.attr("_clickNodeFn") ? $thiz.attr("_clickNodeFn") : "",
            cancelClickNodeFn = $thiz.attr("_cancelClickNodeFn") ? $thiz.attr("_cancelClickNodeFn") : "",
            beforeCheckNodeFn = $thiz.attr("_beforeCheckNodeFn") ? $thiz.attr("_beforeCheckNodeFn") : "",
            checkNodeFn = $thiz.attr("_checkNodeFn") ? $thiz.attr("_checkNodeFn") : "";

        var $key, lastValue_ = "", nodeList = [];
        var tree, setting = {
            view: {
                selectedMulti: false, fontCss: function (treeId, treeNode) {
                    return (!!treeNode.highlight) ? {"font-weight": "bold"} : {"font-weight": "normal"};
                }
            },
            check: {enable: checked, nocheckInherit: true},
            data: {key: {name: 'label'}, simpleData: {enable: true, idKey: 'id', pIdKey: 'pid'}},
            callback: {
                beforeClick: function (treeId, treeNode) {
                    if (allowCancelSelect && tree && tree.getSelectedNodes()[0] && tree.getSelectedNodes()[0].id == treeNode.id) {
                        tree.cancelSelectedNode();
                        var cancelClickNodeFnName;
                        cancelClickNodeFn && cancelClickNodeFn.indexOf("function")!=1 && eval("cancelClickNodeFnName = "+cancelClickNodeFn);
                        if ((typeof cancelClickNodeFnName) == "function") {
                            var param = [treeId, treeNode];
                            cancelClickNodeFnName.apply(tree, param);
                        }
                        // eval((cancelClickNodeFnName?cancelClickNodeFnName:cancelClickNodeFn) + "();")
                        return false;
                    } else if (notAllowSelect) {
                        return false;
                    } else if (!notAllowSelect && notAllowSelectRoot && treeNode.level == 0) {
                        toastr.warning("不能选择根节点（" + treeNode.name + "）请重新选择。");
                        return false;
                    } else if (!notAllowSelect && notAllowSelectParent && treeNode.isParent) {
                        toastr.warning("不能选择父节点（" + treeNode.name + "）请重新选择。");
                        return false;
                    } else {
                        return true;
                    }
                }

            }
        };

        try{
            clickNodeFn && eval("setting.callback.onClick = " + clickNodeFn);
        }catch(e){
            console.log(e);}
        try{
            beforeCheckNodeFn && eval("setting.callback.beforeCheck = " + beforeCheckNodeFn);
        }catch(e){}
        try{
            checkNodeFn && eval("setting.callback.onCheck = " + checkNodeFn);
        }catch(e){}
        if (checked && !checkNodeFn && checkShowInputId) {
            var _checkedNode_ = function (treeNode, showInput, showName) {
                if (treeNode.checked) {
                    if (!showName) showName = treeNode.name;
                    else showName = showName + "," + treeNode.name;
                    if (checkIdInputName) showInput.after($('<input type="hidden" name="' + checkIdInputName + '" />').val(treeNode.id));
                }
                return showName;
            }
            setting.callback.onCheck = function (event, treeId, treeNode, clickFlag) {
                var showInput = $("#" + checkShowInputId), showName = showInput.val();
                if (tree) {
                    nodes = tree.getCheckedNodes(), showName = "", eval("flag = ((onlyCheckedProperty && nodes[i]." + onlyCheckedProperty + ") || !onlyCheckedProperty)")
                    if (checkIdInputName) $("input[name='" + checkIdInputName + "']").remove();
                    if (nodes && nodes.length > 0) {
                        for (var i = 0; i < nodes.length; i++) {
                            if (!nodes[i].getCheckStatus().half && ((onlyCheckedChild && !nodes[i].isParent) || !onlyCheckedChild) && flag) {
                                showName = _checkedNode_(nodes[i], showInput, showName);
                            }
                        }
                    }
                }
                showInput.val(showName);
            };
        }
        var refreshTree = function () {
            $thiz.hide().mCustomScrollbar("destroy");
            $.get(url, function (rs) {
                if (rs && rs.status != 1) {
                    toastr.warning(rs.message);
                    return;
                }
                var zNodes = rs.data;
                tree = $.fn.zTree.init($thiz, setting, zNodes);
                if (nodesLevel) for (var i = 0; i < nodesLevel; i++) {
                    var nodes = tree.getNodesByParam("level", i);
                    for (var j = 0; j < nodes.length; j++) {
                        tree.expandNode(nodes[j], true, false, true);
                    }
                }
                if (!nodesLevel) tree.expandAll(true);
                if (checkIdInputName) $("input[name='" + checkIdInputName + "']").each(function () {
                    if ($(this).val()) {
                        var node = tree.getNodeByParam("id", $(this).val());
                        if (node) tree.checkNode(node, true, true);
                    }
                });
                var selectNodeId = $thiz.attr("_selectNodeId") ? $thiz.attr("_selectNodeId") : "",selectId;
                // try{
                //     eval("if("+selectNodeId+"){var selectId=" + selectNodeId+"}");
                // }catch(e){}
                if (selectNodeId) {
                    var node = (selectNodeId == 1 ? tree.getNodes()[0] : tree.getNodeByParam("id", selectNodeId));
                    tree.selectNode(node);
                }


                mApp.initScroller($thiz,{})
                $thiz.show()
            });

        }
        if(albedo.getToken()){
            refreshTree();
        }else{
            // while(!albedo.getToken()){
                setTimeout(function () {
                    // console.log(albedo.getToken())
                    albedo.getToken() && refreshTree()
                }, 1000)
            // }
        }
        $thiz.prev("div").find("input").off().on("focus", function () {
            _searchInputFocusKey($(this));
        }).on("blur", function () {
            _searchTreeInputBlurKey($(this), tree);
        });
        $thiz.prev("div").find("button.btn-search").off().on("click", function () {
            _searchTreeNode($thiz.prev("div").find("input"), tree);
        });
        var $portlet = $thiz.parents(".m-portlet");
        $portlet.find("a.tree-search").off().click(function () {
            $portlet.find(".tree-search-div").slideToggle(200);
            $portlet.find(".tree-search-input").focus();
        });
        $portlet.find("a.tree-refresh").off().click(function () {
            refreshTree();
        });
        $portlet.find("a.tree-expand").off().click(function () {
            var zTree = $.fn.zTree.getZTreeObj($thiz.attr("id"));
            var expand = ($(this).find("i").attr("class").indexOf("expand") == -1);
            $(this).find("i").attr("class", "fa fa-" + (expand == true ? "expand" : "compress"));
            zTree.expandAll(expand);
        });
        // mApp.initScroller($thiz,{})
    };
    var _icoObj ={
        html: '<div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-glass"></i></div><div class="m-demo-icon__class">fa-glass</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-music"></i></div><div class="m-demo-icon__class">fa-music</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-search"></i></div><div class="m-demo-icon__class">fa-search</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-envelope-o"></i></div><div class="m-demo-icon__class">fa-envelope-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-heart"></i></div><div class="m-demo-icon__class">fa-heart</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-star"></i></div><div class="m-demo-icon__class">fa-star</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-star-o"></i></div><div class="m-demo-icon__class">fa-star-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user"></i></div><div class="m-demo-icon__class">fa-user</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-film"></i></div><div class="m-demo-icon__class">fa-film</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-th-large"></i></div><div class="m-demo-icon__class">fa-th-large</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-th"></i></div><div class="m-demo-icon__class">fa-th</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-th-list"></i></div><div class="m-demo-icon__class">fa-th-list</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-check"></i></div><div class="m-demo-icon__class">fa-check</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-remove"></i></div><div class="m-demo-icon__class">fa-remove</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-close"></i></div><div class="m-demo-icon__class">fa-close</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-times"></i></div><div class="m-demo-icon__class">fa-times</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-search-plus"></i></div><div class="m-demo-icon__class">fa-search-plus</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-search-minus"></i></div><div class="m-demo-icon__class">fa-search-minus</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-power-off"></i></div><div class="m-demo-icon__class">fa-power-off</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-signal"></i></div><div class="m-demo-icon__class">fa-signal</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gear"></i></div><div class="m-demo-icon__class">fa-gear</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cog"></i></div><div class="m-demo-icon__class">fa-cog</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-trash-o"></i></div><div class="m-demo-icon__class">fa-trash-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-home"></i></div><div class="m-demo-icon__class">fa-home</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-o"></i></div><div class="m-demo-icon__class">fa-file-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-clock-o"></i></div><div class="m-demo-icon__class">fa-clock-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-road"></i></div><div class="m-demo-icon__class">fa-road</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-download"></i></div><div class="m-demo-icon__class">fa-download</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-o-down"></i></div><div class="m-demo-icon__class">fa-arrow-circle-o-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-o-up"></i></div><div class="m-demo-icon__class">fa-arrow-circle-o-up</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-inbox"></i></div><div class="m-demo-icon__class">fa-inbox</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-play-circle-o"></i></div><div class="m-demo-icon__class">fa-play-circle-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rotate-right"></i></div><div class="m-demo-icon__class">fa-rotate-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-repeat"></i></div><div class="m-demo-icon__class">fa-repeat</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-refresh"></i></div><div class="m-demo-icon__class">fa-refresh</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-list-alt"></i></div><div class="m-demo-icon__class">fa-list-alt</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-lock"></i></div><div class="m-demo-icon__class">fa-lock</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-flag"></i></div><div class="m-demo-icon__class">fa-flag</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-headphones"></i></div><div class="m-demo-icon__class">fa-headphones</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-volume-off"></i></div><div class="m-demo-icon__class">fa-volume-off</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-volume-down"></i></div><div class="m-demo-icon__class">fa-volume-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-volume-up"></i></div><div class="m-demo-icon__class">fa-volume-up</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-qrcode"></i></div><div class="m-demo-icon__class">fa-qrcode</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-barcode"></i></div><div class="m-demo-icon__class">fa-barcode</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tag"></i></div><div class="m-demo-icon__class">fa-tag</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tags"></i></div><div class="m-demo-icon__class">fa-tags</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-book"></i></div><div class="m-demo-icon__class">fa-book</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bookmark"></i></div><div class="m-demo-icon__class">fa-bookmark</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-print"></i></div><div class="m-demo-icon__class">fa-print</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-camera"></i></div><div class="m-demo-icon__class">fa-camera</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-font"></i></div><div class="m-demo-icon__class">fa-font</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bold"></i></div><div class="m-demo-icon__class">fa-bold</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-italic"></i></div><div class="m-demo-icon__class">fa-italic</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-text-height"></i></div><div class="m-demo-icon__class">fa-text-height</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-text-width"></i></div><div class="m-demo-icon__class">fa-text-width</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-align-left"></i></div><div class="m-demo-icon__class">fa-align-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-align-center"></i></div><div class="m-demo-icon__class">fa-align-center</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-align-right"></i></div><div class="m-demo-icon__class">fa-align-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-align-justify"></i></div><div class="m-demo-icon__class">fa-align-justify</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-list"></i></div><div class="m-demo-icon__class">fa-list</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dedent"></i></div><div class="m-demo-icon__class">fa-dedent</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-outdent"></i></div><div class="m-demo-icon__class">fa-outdent</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-indent"></i></div><div class="m-demo-icon__class">fa-indent</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-video-camera"></i></div><div class="m-demo-icon__class">fa-video-camera</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-photo"></i></div><div class="m-demo-icon__class">fa-photo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-image"></i></div><div class="m-demo-icon__class">fa-image</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-picture-o"></i></div><div class="m-demo-icon__class">fa-picture-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pencil"></i></div><div class="m-demo-icon__class">fa-pencil</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-map-marker"></i></div><div class="m-demo-icon__class">fa-map-marker</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-adjust"></i></div><div class="m-demo-icon__class">fa-adjust</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tint"></i></div><div class="m-demo-icon__class">fa-tint</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-edit"></i></div><div class="m-demo-icon__class">fa-edit</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pencil-square-o"></i></div><div class="m-demo-icon__class">fa-pencil-square-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-share-square-o"></i></div><div class="m-demo-icon__class">fa-share-square-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-check-square-o"></i></div><div class="m-demo-icon__class">fa-check-square-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrows"></i></div><div class="m-demo-icon__class">fa-arrows</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-step-backward"></i></div><div class="m-demo-icon__class">fa-step-backward</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fast-backward"></i></div><div class="m-demo-icon__class">fa-fast-backward</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-backward"></i></div><div class="m-demo-icon__class">fa-backward</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-play"></i></div><div class="m-demo-icon__class">fa-play</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pause"></i></div><div class="m-demo-icon__class">fa-pause</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stop"></i></div><div class="m-demo-icon__class">fa-stop</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-forward"></i></div><div class="m-demo-icon__class">fa-forward</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fast-forward"></i></div><div class="m-demo-icon__class">fa-fast-forward</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-step-forward"></i></div><div class="m-demo-icon__class">fa-step-forward</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eject"></i></div><div class="m-demo-icon__class">fa-eject</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-left"></i></div><div class="m-demo-icon__class">fa-chevron-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-right"></i></div><div class="m-demo-icon__class">fa-chevron-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-plus-circle"></i></div><div class="m-demo-icon__class">fa-plus-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-minus-circle"></i></div><div class="m-demo-icon__class">fa-minus-circle</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-times-circle"></i></div><div class="m-demo-icon__class">fa-times-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-check-circle"></i></div><div class="m-demo-icon__class">fa-check-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-question-circle"></i></div><div class="m-demo-icon__class">fa-question-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-info-circle"></i></div><div class="m-demo-icon__class">fa-info-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-crosshairs"></i></div><div class="m-demo-icon__class">fa-crosshairs</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-times-circle-o"></i></div><div class="m-demo-icon__class">fa-times-circle-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-check-circle-o"></i></div><div class="m-demo-icon__class">fa-check-circle-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ban"></i></div><div class="m-demo-icon__class">fa-ban</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-left"></i></div><div class="m-demo-icon__class">fa-arrow-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-right"></i></div><div class="m-demo-icon__class">fa-arrow-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-up"></i></div><div class="m-demo-icon__class">fa-arrow-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-down"></i></div><div class="m-demo-icon__class">fa-arrow-down</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mail-forward"></i></div><div class="m-demo-icon__class">fa-mail-forward</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-share"></i></div><div class="m-demo-icon__class">fa-share</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-expand"></i></div><div class="m-demo-icon__class">fa-expand</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-compress"></i></div><div class="m-demo-icon__class">fa-compress</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-plus"></i></div><div class="m-demo-icon__class">fa-plus</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-minus"></i></div><div class="m-demo-icon__class">fa-minus</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-asterisk"></i></div><div class="m-demo-icon__class">fa-asterisk</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-exclamation-circle"></i></div><div class="m-demo-icon__class">fa-exclamation-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gift"></i></div><div class="m-demo-icon__class">fa-gift</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-leaf"></i></div><div class="m-demo-icon__class">fa-leaf</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fire"></i></div><div class="m-demo-icon__class">fa-fire</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eye"></i></div><div class="m-demo-icon__class">fa-eye</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eye-slash"></i></div><div class="m-demo-icon__class">fa-eye-slash</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-warning"></i></div><div class="m-demo-icon__class">fa-warning</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-exclamation-triangle"></i></div><div class="m-demo-icon__class">fa-exclamation-triangle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-plane"></i></div><div class="m-demo-icon__class">fa-plane</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calendar"></i></div><div class="m-demo-icon__class">fa-calendar</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-random"></i></div><div class="m-demo-icon__class">fa-random</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-comment"></i></div><div class="m-demo-icon__class">fa-comment</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-magnet"></i></div><div class="m-demo-icon__class">fa-magnet</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-up"></i></div><div class="m-demo-icon__class">fa-chevron-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-down"></i></div><div class="m-demo-icon__class">fa-chevron-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-retweet"></i></div><div class="m-demo-icon__class">fa-retweet</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shopping-cart"></i></div><div class="m-demo-icon__class">fa-shopping-cart</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-folder"></i></div><div class="m-demo-icon__class">fa-folder</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-folder-open"></i></div><div class="m-demo-icon__class">fa-folder-open</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrows-v"></i></div><div class="m-demo-icon__class">fa-arrows-v</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrows-h"></i></div><div class="m-demo-icon__class">fa-arrows-h</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bar-chart-o"></i></div><div class="m-demo-icon__class">fa-bar-chart-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bar-chart"></i></div><div class="m-demo-icon__class">fa-bar-chart</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-twitter-square"></i></div><div class="m-demo-icon__class">fa-twitter-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-facebook-square"></i></div><div class="m-demo-icon__class">fa-facebook-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-camera-retro"></i></div><div class="m-demo-icon__class">fa-camera-retro</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-key"></i></div><div class="m-demo-icon__class">fa-key</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gears"></i></div><div class="m-demo-icon__class">fa-gears</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cogs"></i></div><div class="m-demo-icon__class">fa-cogs</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-comments"></i></div><div class="m-demo-icon__class">fa-comments</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thumbs-o-up"></i></div><div class="m-demo-icon__class">fa-thumbs-o-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thumbs-o-down"></i></div><div class="m-demo-icon__class">fa-thumbs-o-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-star-half"></i></div><div class="m-demo-icon__class">fa-star-half</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-heart-o"></i></div><div class="m-demo-icon__class">fa-heart-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sign-out"></i></div><div class="m-demo-icon__class">fa-sign-out</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-linkedin-square"></i></div><div class="m-demo-icon__class">fa-linkedin-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thumb-tack"></i></div><div class="m-demo-icon__class">fa-thumb-tack</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-external-link"></i></div><div class="m-demo-icon__class">fa-external-link</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sign-in"></i></div><div class="m-demo-icon__class">fa-sign-in</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-trophy"></i></div><div class="m-demo-icon__class">fa-trophy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-github-square"></i></div><div class="m-demo-icon__class">fa-github-square</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-upload"></i></div><div class="m-demo-icon__class">fa-upload</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-lemon-o"></i></div><div class="m-demo-icon__class">fa-lemon-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-phone"></i></div><div class="m-demo-icon__class">fa-phone</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-square-o"></i></div><div class="m-demo-icon__class">fa-square-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bookmark-o"></i></div><div class="m-demo-icon__class">fa-bookmark-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-phone-square"></i></div><div class="m-demo-icon__class">fa-phone-square</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-twitter"></i></div><div class="m-demo-icon__class">fa-twitter</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-facebook-f"></i></div><div class="m-demo-icon__class">fa-facebook-f</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-facebook"></i></div><div class="m-demo-icon__class">fa-facebook</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-github"></i></div><div class="m-demo-icon__class">fa-github</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-unlock"></i></div><div class="m-demo-icon__class">fa-unlock</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-credit-card"></i></div><div class="m-demo-icon__class">fa-credit-card</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-feed"></i></div><div class="m-demo-icon__class">fa-feed</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rss"></i></div><div class="m-demo-icon__class">fa-rss</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hdd-o"></i></div><div class="m-demo-icon__class">fa-hdd-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bullhorn"></i></div><div class="m-demo-icon__class">fa-bullhorn</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bell"></i></div><div class="m-demo-icon__class">fa-bell</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-certificate"></i></div><div class="m-demo-icon__class">fa-certificate</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-o-right"></i></div><div class="m-demo-icon__class">fa-hand-o-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-o-left"></i></div><div class="m-demo-icon__class">fa-hand-o-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-o-up"></i></div><div class="m-demo-icon__class">fa-hand-o-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-o-down"></i></div><div class="m-demo-icon__class">fa-hand-o-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-left"></i></div><div class="m-demo-icon__class">fa-arrow-circle-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-right"></i></div><div class="m-demo-icon__class">fa-arrow-circle-right</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-up"></i></div><div class="m-demo-icon__class">fa-arrow-circle-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-down"></i></div><div class="m-demo-icon__class">fa-arrow-circle-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-globe"></i></div><div class="m-demo-icon__class">fa-globe</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wrench"></i></div><div class="m-demo-icon__class">fa-wrench</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tasks"></i></div><div class="m-demo-icon__class">fa-tasks</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-filter"></i></div><div class="m-demo-icon__class">fa-filter</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-briefcase"></i></div><div class="m-demo-icon__class">fa-briefcase</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrows-alt"></i></div><div class="m-demo-icon__class">fa-arrows-alt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-group"></i></div><div class="m-demo-icon__class">fa-group</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-users"></i></div><div class="m-demo-icon__class">fa-users</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chain"></i></div><div class="m-demo-icon__class">fa-chain</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-link"></i></div><div class="m-demo-icon__class">fa-link</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cloud"></i></div><div class="m-demo-icon__class">fa-cloud</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-flask"></i></div><div class="m-demo-icon__class">fa-flask</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cut"></i></div><div class="m-demo-icon__class">fa-cut</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-scissors"></i></div><div class="m-demo-icon__class">fa-scissors</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-copy"></i></div><div class="m-demo-icon__class">fa-copy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-files-o"></i></div><div class="m-demo-icon__class">fa-files-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paperclip"></i></div><div class="m-demo-icon__class">fa-paperclip</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-save"></i></div><div class="m-demo-icon__class">fa-save</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-floppy-o"></i></div><div class="m-demo-icon__class">fa-floppy-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-square"></i></div><div class="m-demo-icon__class">fa-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-navicon"></i></div><div class="m-demo-icon__class">fa-navicon</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-reorder"></i></div><div class="m-demo-icon__class">fa-reorder</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bars"></i></div><div class="m-demo-icon__class">fa-bars</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-list-ul"></i></div><div class="m-demo-icon__class">fa-list-ul</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-list-ol"></i></div><div class="m-demo-icon__class">fa-list-ol</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-strikethrough"></i></div><div class="m-demo-icon__class">fa-strikethrough</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-underline"></i></div><div class="m-demo-icon__class">fa-underline</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-table"></i></div><div class="m-demo-icon__class">fa-table</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-magic"></i></div><div class="m-demo-icon__class">fa-magic</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-truck"></i></div><div class="m-demo-icon__class">fa-truck</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pinterest"></i></div><div class="m-demo-icon__class">fa-pinterest</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pinterest-square"></i></div><div class="m-demo-icon__class">fa-pinterest-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-google-plus-square"></i></div><div class="m-demo-icon__class">fa-google-plus-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-google-plus"></i></div><div class="m-demo-icon__class">fa-google-plus</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-money"></i></div><div class="m-demo-icon__class">fa-money</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-down"></i></div><div class="m-demo-icon__class">fa-caret-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-up"></i></div><div class="m-demo-icon__class">fa-caret-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-left"></i></div><div class="m-demo-icon__class">fa-caret-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-right"></i></div><div class="m-demo-icon__class">fa-caret-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-columns"></i></div><div class="m-demo-icon__class">fa-columns</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-unsorted"></i></div><div class="m-demo-icon__class">fa-unsorted</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort"></i></div><div class="m-demo-icon__class">fa-sort</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-down"></i></div><div class="m-demo-icon__class">fa-sort-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-desc"></i></div><div class="m-demo-icon__class">fa-sort-desc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-up"></i></div><div class="m-demo-icon__class">fa-sort-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-asc"></i></div><div class="m-demo-icon__class">fa-sort-asc</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-envelope"></i></div><div class="m-demo-icon__class">fa-envelope</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-linkedin"></i></div><div class="m-demo-icon__class">fa-linkedin</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rotate-left"></i></div><div class="m-demo-icon__class">fa-rotate-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-undo"></i></div><div class="m-demo-icon__class">fa-undo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-legal"></i></div><div class="m-demo-icon__class">fa-legal</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gavel"></i></div><div class="m-demo-icon__class">fa-gavel</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dashboard"></i></div><div class="m-demo-icon__class">fa-dashboard</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tachometer"></i></div><div class="m-demo-icon__class">fa-tachometer</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-comment-o"></i></div><div class="m-demo-icon__class">fa-comment-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-comments-o"></i></div><div class="m-demo-icon__class">fa-comments-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-flash"></i></div><div class="m-demo-icon__class">fa-flash</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bolt"></i></div><div class="m-demo-icon__class">fa-bolt</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sitemap"></i></div><div class="m-demo-icon__class">fa-sitemap</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-umbrella"></i></div><div class="m-demo-icon__class">fa-umbrella</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paste"></i></div><div class="m-demo-icon__class">fa-paste</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-clipboard"></i></div><div class="m-demo-icon__class">fa-clipboard</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-lightbulb-o"></i></div><div class="m-demo-icon__class">fa-lightbulb-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-exchange"></i></div><div class="m-demo-icon__class">fa-exchange</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cloud-download"></i></div><div class="m-demo-icon__class">fa-cloud-download</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cloud-upload"></i></div><div class="m-demo-icon__class">fa-cloud-upload</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-md"></i></div><div class="m-demo-icon__class">fa-user-md</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stethoscope"></i></div><div class="m-demo-icon__class">fa-stethoscope</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-suitcase"></i></div><div class="m-demo-icon__class">fa-suitcase</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bell-o"></i></div><div class="m-demo-icon__class">fa-bell-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-coffee"></i></div><div class="m-demo-icon__class">fa-coffee</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cutlery"></i></div><div class="m-demo-icon__class">fa-cutlery</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-text-o"></i></div><div class="m-demo-icon__class">fa-file-text-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-building-o"></i></div><div class="m-demo-icon__class">fa-building-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hospital-o"></i></div><div class="m-demo-icon__class">fa-hospital-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ambulance"></i></div><div class="m-demo-icon__class">fa-ambulance</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-medkit"></i></div><div class="m-demo-icon__class">fa-medkit</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fighter-jet"></i></div><div class="m-demo-icon__class">fa-fighter-jet</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-beer"></i></div><div class="m-demo-icon__class">fa-beer</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-h-square"></i></div><div class="m-demo-icon__class">fa-h-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-plus-square"></i></div><div class="m-demo-icon__class">fa-plus-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-double-left"></i></div><div class="m-demo-icon__class">fa-angle-double-left</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-double-right"></i></div><div class="m-demo-icon__class">fa-angle-double-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-double-up"></i></div><div class="m-demo-icon__class">fa-angle-double-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-double-down"></i></div><div class="m-demo-icon__class">fa-angle-double-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-left"></i></div><div class="m-demo-icon__class">fa-angle-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-right"></i></div><div class="m-demo-icon__class">fa-angle-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-up"></i></div><div class="m-demo-icon__class">fa-angle-up</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angle-down"></i></div><div class="m-demo-icon__class">fa-angle-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-desktop"></i></div><div class="m-demo-icon__class">fa-desktop</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-laptop"></i></div><div class="m-demo-icon__class">fa-laptop</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tablet"></i></div><div class="m-demo-icon__class">fa-tablet</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mobile-phone"></i></div><div class="m-demo-icon__class">fa-mobile-phone</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mobile"></i></div><div class="m-demo-icon__class">fa-mobile</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-circle-o"></i></div><div class="m-demo-icon__class">fa-circle-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-quote-left"></i></div><div class="m-demo-icon__class">fa-quote-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-quote-right"></i></div><div class="m-demo-icon__class">fa-quote-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-spinner"></i></div><div class="m-demo-icon__class">fa-spinner</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-circle"></i></div><div class="m-demo-icon__class">fa-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mail-reply"></i></div><div class="m-demo-icon__class">fa-mail-reply</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-reply"></i></div><div class="m-demo-icon__class">fa-reply</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-github-alt"></i></div><div class="m-demo-icon__class">fa-github-alt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-folder-o"></i></div><div class="m-demo-icon__class">fa-folder-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-folder-open-o"></i></div><div class="m-demo-icon__class">fa-folder-open-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-smile-o"></i></div><div class="m-demo-icon__class">fa-smile-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-frown-o"></i></div><div class="m-demo-icon__class">fa-frown-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-meh-o"></i></div><div class="m-demo-icon__class">fa-meh-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gamepad"></i></div><div class="m-demo-icon__class">fa-gamepad</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-keyboard-o"></i></div><div class="m-demo-icon__class">fa-keyboard-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-flag-o"></i></div><div class="m-demo-icon__class">fa-flag-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-flag-checkered"></i></div><div class="m-demo-icon__class">fa-flag-checkered</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-terminal"></i></div><div class="m-demo-icon__class">fa-terminal</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-code"></i></div><div class="m-demo-icon__class">fa-code</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mail-reply-all"></i></div><div class="m-demo-icon__class">fa-mail-reply-all</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-reply-all"></i></div><div class="m-demo-icon__class">fa-reply-all</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-star-half-empty"></i></div><div class="m-demo-icon__class">fa-star-half-empty</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-star-half-full"></i></div><div class="m-demo-icon__class">fa-star-half-full</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-star-half-o"></i></div><div class="m-demo-icon__class">fa-star-half-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-location-arrow"></i></div><div class="m-demo-icon__class">fa-location-arrow</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-crop"></i></div><div class="m-demo-icon__class">fa-crop</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-code-fork"></i></div><div class="m-demo-icon__class">fa-code-fork</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-unlink"></i></div><div class="m-demo-icon__class">fa-unlink</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chain-broken"></i></div><div class="m-demo-icon__class">fa-chain-broken</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-question"></i></div><div class="m-demo-icon__class">fa-question</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-info"></i></div><div class="m-demo-icon__class">fa-info</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-exclamation"></i></div><div class="m-demo-icon__class">fa-exclamation</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-superscript"></i></div><div class="m-demo-icon__class">fa-superscript</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-subscript"></i></div><div class="m-demo-icon__class">fa-subscript</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eraser"></i></div><div class="m-demo-icon__class">fa-eraser</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-puzzle-piece"></i></div><div class="m-demo-icon__class">fa-puzzle-piece</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-microphone"></i></div><div class="m-demo-icon__class">fa-microphone</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-microphone-slash"></i></div><div class="m-demo-icon__class">fa-microphone-slash</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shield"></i></div><div class="m-demo-icon__class">fa-shield</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calendar-o"></i></div><div class="m-demo-icon__class">fa-calendar-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fire-extinguisher"></i></div><div class="m-demo-icon__class">fa-fire-extinguisher</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rocket"></i></div><div class="m-demo-icon__class">fa-rocket</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-maxcdn"></i></div><div class="m-demo-icon__class">fa-maxcdn</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-circle-left"></i></div><div class="m-demo-icon__class">fa-chevron-circle-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-circle-right"></i></div><div class="m-demo-icon__class">fa-chevron-circle-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-circle-up"></i></div><div class="m-demo-icon__class">fa-chevron-circle-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chevron-circle-down"></i></div><div class="m-demo-icon__class">fa-chevron-circle-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-html5"></i></div><div class="m-demo-icon__class">fa-html5</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-css3"></i></div><div class="m-demo-icon__class">fa-css3</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-anchor"></i></div><div class="m-demo-icon__class">fa-anchor</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-unlock-alt"></i></div><div class="m-demo-icon__class">fa-unlock-alt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bullseye"></i></div><div class="m-demo-icon__class">fa-bullseye</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ellipsis-h"></i></div><div class="m-demo-icon__class">fa-ellipsis-h</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ellipsis-v"></i></div><div class="m-demo-icon__class">fa-ellipsis-v</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rss-square"></i></div><div class="m-demo-icon__class">fa-rss-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-play-circle"></i></div><div class="m-demo-icon__class">fa-play-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ticket"></i></div><div class="m-demo-icon__class">fa-ticket</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-minus-square"></i></div><div class="m-demo-icon__class">fa-minus-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-minus-square-o"></i></div><div class="m-demo-icon__class">fa-minus-square-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-level-up"></i></div><div class="m-demo-icon__class">fa-level-up</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-level-down"></i></div><div class="m-demo-icon__class">fa-level-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-check-square"></i></div><div class="m-demo-icon__class">fa-check-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pencil-square"></i></div><div class="m-demo-icon__class">fa-pencil-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-external-link-square"></i></div><div class="m-demo-icon__class">fa-external-link-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-share-square"></i></div><div class="m-demo-icon__class">fa-share-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-compass"></i></div><div class="m-demo-icon__class">fa-compass</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-toggle-down"></i></div><div class="m-demo-icon__class">fa-toggle-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-square-o-down"></i></div><div class="m-demo-icon__class">fa-caret-square-o-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-toggle-up"></i></div><div class="m-demo-icon__class">fa-toggle-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-square-o-up"></i></div><div class="m-demo-icon__class">fa-caret-square-o-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-toggle-right"></i></div><div class="m-demo-icon__class">fa-toggle-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-square-o-right"></i></div><div class="m-demo-icon__class">fa-caret-square-o-right</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-euro"></i></div><div class="m-demo-icon__class">fa-euro</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eur"></i></div><div class="m-demo-icon__class">fa-eur</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gbp"></i></div><div class="m-demo-icon__class">fa-gbp</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dollar"></i></div><div class="m-demo-icon__class">fa-dollar</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-usd"></i></div><div class="m-demo-icon__class">fa-usd</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rupee"></i></div><div class="m-demo-icon__class">fa-rupee</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-inr"></i></div><div class="m-demo-icon__class">fa-inr</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cny"></i></div><div class="m-demo-icon__class">fa-cny</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rmb"></i></div><div class="m-demo-icon__class">fa-rmb</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-yen"></i></div><div class="m-demo-icon__class">fa-yen</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-jpy"></i></div><div class="m-demo-icon__class">fa-jpy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ruble"></i></div><div class="m-demo-icon__class">fa-ruble</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rouble"></i></div><div class="m-demo-icon__class">fa-rouble</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rub"></i></div><div class="m-demo-icon__class">fa-rub</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-won"></i></div><div class="m-demo-icon__class">fa-won</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-krw"></i></div><div class="m-demo-icon__class">fa-krw</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bitcoin"></i></div><div class="m-demo-icon__class">fa-bitcoin</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-btc"></i></div><div class="m-demo-icon__class">fa-btc</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file"></i></div><div class="m-demo-icon__class">fa-file</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-text"></i></div><div class="m-demo-icon__class">fa-file-text</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-alpha-asc"></i></div><div class="m-demo-icon__class">fa-sort-alpha-asc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-alpha-desc"></i></div><div class="m-demo-icon__class">fa-sort-alpha-desc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-amount-asc"></i></div><div class="m-demo-icon__class">fa-sort-amount-asc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-amount-desc"></i></div><div class="m-demo-icon__class">fa-sort-amount-desc</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-numeric-asc"></i></div><div class="m-demo-icon__class">fa-sort-numeric-asc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sort-numeric-desc"></i></div><div class="m-demo-icon__class">fa-sort-numeric-desc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thumbs-up"></i></div><div class="m-demo-icon__class">fa-thumbs-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thumbs-down"></i></div><div class="m-demo-icon__class">fa-thumbs-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-youtube-square"></i></div><div class="m-demo-icon__class">fa-youtube-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-youtube"></i></div><div class="m-demo-icon__class">fa-youtube</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-xing"></i></div><div class="m-demo-icon__class">fa-xing</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-xing-square"></i></div><div class="m-demo-icon__class">fa-xing-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-youtube-play"></i></div><div class="m-demo-icon__class">fa-youtube-play</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dropbox"></i></div><div class="m-demo-icon__class">fa-dropbox</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stack-overflow"></i></div><div class="m-demo-icon__class">fa-stack-overflow</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-instagram"></i></div><div class="m-demo-icon__class">fa-instagram</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-flickr"></i></div><div class="m-demo-icon__class">fa-flickr</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-adn"></i></div><div class="m-demo-icon__class">fa-adn</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bitbucket"></i></div><div class="m-demo-icon__class">fa-bitbucket</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bitbucket-square"></i></div><div class="m-demo-icon__class">fa-bitbucket-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tumblr"></i></div><div class="m-demo-icon__class">fa-tumblr</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tumblr-square"></i></div><div class="m-demo-icon__class">fa-tumblr-square</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-long-arrow-down"></i></div><div class="m-demo-icon__class">fa-long-arrow-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-long-arrow-up"></i></div><div class="m-demo-icon__class">fa-long-arrow-up</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-long-arrow-left"></i></div><div class="m-demo-icon__class">fa-long-arrow-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-long-arrow-right"></i></div><div class="m-demo-icon__class">fa-long-arrow-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-apple"></i></div><div class="m-demo-icon__class">fa-apple</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-windows"></i></div><div class="m-demo-icon__class">fa-windows</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-android"></i></div><div class="m-demo-icon__class">fa-android</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-linux"></i></div><div class="m-demo-icon__class">fa-linux</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dribbble"></i></div><div class="m-demo-icon__class">fa-dribbble</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-skype"></i></div><div class="m-demo-icon__class">fa-skype</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-foursquare"></i></div><div class="m-demo-icon__class">fa-foursquare</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-trello"></i></div><div class="m-demo-icon__class">fa-trello</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-female"></i></div><div class="m-demo-icon__class">fa-female</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-male"></i></div><div class="m-demo-icon__class">fa-male</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gittip"></i></div><div class="m-demo-icon__class">fa-gittip</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gratipay"></i></div><div class="m-demo-icon__class">fa-gratipay</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sun-o"></i></div><div class="m-demo-icon__class">fa-sun-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-moon-o"></i></div><div class="m-demo-icon__class">fa-moon-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-archive"></i></div><div class="m-demo-icon__class">fa-archive</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bug"></i></div><div class="m-demo-icon__class">fa-bug</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-vk"></i></div><div class="m-demo-icon__class">fa-vk</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-weibo"></i></div><div class="m-demo-icon__class">fa-weibo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-renren"></i></div><div class="m-demo-icon__class">fa-renren</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pagelines"></i></div><div class="m-demo-icon__class">fa-pagelines</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stack-exchange"></i></div><div class="m-demo-icon__class">fa-stack-exchange</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-o-right"></i></div><div class="m-demo-icon__class">fa-arrow-circle-o-right</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-arrow-circle-o-left"></i></div><div class="m-demo-icon__class">fa-arrow-circle-o-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-toggle-left"></i></div><div class="m-demo-icon__class">fa-toggle-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-caret-square-o-left"></i></div><div class="m-demo-icon__class">fa-caret-square-o-left</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dot-circle-o"></i></div><div class="m-demo-icon__class">fa-dot-circle-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wheelchair"></i></div><div class="m-demo-icon__class">fa-wheelchair</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-vimeo-square"></i></div><div class="m-demo-icon__class">fa-vimeo-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-turkish-lira"></i></div><div class="m-demo-icon__class">fa-turkish-lira</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-try"></i></div><div class="m-demo-icon__class">fa-try</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-plus-square-o"></i></div><div class="m-demo-icon__class">fa-plus-square-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-space-shuttle"></i></div><div class="m-demo-icon__class">fa-space-shuttle</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-slack"></i></div><div class="m-demo-icon__class">fa-slack</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-envelope-square"></i></div><div class="m-demo-icon__class">fa-envelope-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wordpress"></i></div><div class="m-demo-icon__class">fa-wordpress</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-openid"></i></div><div class="m-demo-icon__class">fa-openid</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-institution"></i></div><div class="m-demo-icon__class">fa-institution</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bank"></i></div><div class="m-demo-icon__class">fa-bank</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-university"></i></div><div class="m-demo-icon__class">fa-university</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mortar-board"></i></div><div class="m-demo-icon__class">fa-mortar-board</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-graduation-cap"></i></div><div class="m-demo-icon__class">fa-graduation-cap</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-yahoo"></i></div><div class="m-demo-icon__class">fa-yahoo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-google"></i></div><div class="m-demo-icon__class">fa-google</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-reddit"></i></div><div class="m-demo-icon__class">fa-reddit</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-reddit-square"></i></div><div class="m-demo-icon__class">fa-reddit-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stumbleupon-circle"></i></div><div class="m-demo-icon__class">fa-stumbleupon-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stumbleupon"></i></div><div class="m-demo-icon__class">fa-stumbleupon</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-delicious"></i></div><div class="m-demo-icon__class">fa-delicious</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-digg"></i></div><div class="m-demo-icon__class">fa-digg</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pied-piper-pp"></i></div><div class="m-demo-icon__class">fa-pied-piper-pp</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pied-piper-alt"></i></div><div class="m-demo-icon__class">fa-pied-piper-alt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-drupal"></i></div><div class="m-demo-icon__class">fa-drupal</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-joomla"></i></div><div class="m-demo-icon__class">fa-joomla</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-language"></i></div><div class="m-demo-icon__class">fa-language</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fax"></i></div><div class="m-demo-icon__class">fa-fax</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-building"></i></div><div class="m-demo-icon__class">fa-building</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-child"></i></div><div class="m-demo-icon__class">fa-child</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paw"></i></div><div class="m-demo-icon__class">fa-paw</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-spoon"></i></div><div class="m-demo-icon__class">fa-spoon</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cube"></i></div><div class="m-demo-icon__class">fa-cube</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cubes"></i></div><div class="m-demo-icon__class">fa-cubes</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-behance"></i></div><div class="m-demo-icon__class">fa-behance</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-behance-square"></i></div><div class="m-demo-icon__class">fa-behance-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-steam"></i></div><div class="m-demo-icon__class">fa-steam</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-steam-square"></i></div><div class="m-demo-icon__class">fa-steam-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-recycle"></i></div><div class="m-demo-icon__class">fa-recycle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-automobile"></i></div><div class="m-demo-icon__class">fa-automobile</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-car"></i></div><div class="m-demo-icon__class">fa-car</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cab"></i></div><div class="m-demo-icon__class">fa-cab</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-taxi"></i></div><div class="m-demo-icon__class">fa-taxi</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tree"></i></div><div class="m-demo-icon__class">fa-tree</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-spotify"></i></div><div class="m-demo-icon__class">fa-spotify</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-deviantart"></i></div><div class="m-demo-icon__class">fa-deviantart</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-soundcloud"></i></div><div class="m-demo-icon__class">fa-soundcloud</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-database"></i></div><div class="m-demo-icon__class">fa-database</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-pdf-o"></i></div><div class="m-demo-icon__class">fa-file-pdf-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-word-o"></i></div><div class="m-demo-icon__class">fa-file-word-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-excel-o"></i></div><div class="m-demo-icon__class">fa-file-excel-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-powerpoint-o"></i></div><div class="m-demo-icon__class">fa-file-powerpoint-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-photo-o"></i></div><div class="m-demo-icon__class">fa-file-photo-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-picture-o"></i></div><div class="m-demo-icon__class">fa-file-picture-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-image-o"></i></div><div class="m-demo-icon__class">fa-file-image-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-zip-o"></i></div><div class="m-demo-icon__class">fa-file-zip-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-archive-o"></i></div><div class="m-demo-icon__class">fa-file-archive-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-sound-o"></i></div><div class="m-demo-icon__class">fa-file-sound-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-audio-o"></i></div><div class="m-demo-icon__class">fa-file-audio-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-movie-o"></i></div><div class="m-demo-icon__class">fa-file-movie-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-video-o"></i></div><div class="m-demo-icon__class">fa-file-video-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-file-code-o"></i></div><div class="m-demo-icon__class">fa-file-code-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-vine"></i></div><div class="m-demo-icon__class">fa-vine</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-codepen"></i></div><div class="m-demo-icon__class">fa-codepen</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-jsfiddle"></i></div><div class="m-demo-icon__class">fa-jsfiddle</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-life-bouy"></i></div><div class="m-demo-icon__class">fa-life-bouy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-life-buoy"></i></div><div class="m-demo-icon__class">fa-life-buoy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-life-saver"></i></div><div class="m-demo-icon__class">fa-life-saver</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-support"></i></div><div class="m-demo-icon__class">fa-support</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-life-ring"></i></div><div class="m-demo-icon__class">fa-life-ring</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-circle-o-notch"></i></div><div class="m-demo-icon__class">fa-circle-o-notch</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ra"></i></div><div class="m-demo-icon__class">fa-ra</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-resistance"></i></div><div class="m-demo-icon__class">fa-resistance</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-rebel"></i></div><div class="m-demo-icon__class">fa-rebel</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ge"></i></div><div class="m-demo-icon__class">fa-ge</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-empire"></i></div><div class="m-demo-icon__class">fa-empire</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-git-square"></i></div><div class="m-demo-icon__class">fa-git-square</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-git"></i></div><div class="m-demo-icon__class">fa-git</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-y-combinator-square"></i></div><div class="m-demo-icon__class">fa-y-combinator-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-yc-square"></i></div><div class="m-demo-icon__class">fa-yc-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hacker-news"></i></div><div class="m-demo-icon__class">fa-hacker-news</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tencent-weibo"></i></div><div class="m-demo-icon__class">fa-tencent-weibo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-qq"></i></div><div class="m-demo-icon__class">fa-qq</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wechat"></i></div><div class="m-demo-icon__class">fa-wechat</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-weixin"></i></div><div class="m-demo-icon__class">fa-weixin</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-send"></i></div><div class="m-demo-icon__class">fa-send</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paper-plane"></i></div><div class="m-demo-icon__class">fa-paper-plane</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-send-o"></i></div><div class="m-demo-icon__class">fa-send-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paper-plane-o"></i></div><div class="m-demo-icon__class">fa-paper-plane-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-history"></i></div><div class="m-demo-icon__class">fa-history</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-circle-thin"></i></div><div class="m-demo-icon__class">fa-circle-thin</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-header"></i></div><div class="m-demo-icon__class">fa-header</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paragraph"></i></div><div class="m-demo-icon__class">fa-paragraph</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sliders"></i></div><div class="m-demo-icon__class">fa-sliders</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-share-alt"></i></div><div class="m-demo-icon__class">fa-share-alt</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-share-alt-square"></i></div><div class="m-demo-icon__class">fa-share-alt-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bomb"></i></div><div class="m-demo-icon__class">fa-bomb</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-soccer-ball-o"></i></div><div class="m-demo-icon__class">fa-soccer-ball-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-futbol-o"></i></div><div class="m-demo-icon__class">fa-futbol-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tty"></i></div><div class="m-demo-icon__class">fa-tty</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-binoculars"></i></div><div class="m-demo-icon__class">fa-binoculars</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-plug"></i></div><div class="m-demo-icon__class">fa-plug</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-slideshare"></i></div><div class="m-demo-icon__class">fa-slideshare</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-twitch"></i></div><div class="m-demo-icon__class">fa-twitch</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-yelp"></i></div><div class="m-demo-icon__class">fa-yelp</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-newspaper-o"></i></div><div class="m-demo-icon__class">fa-newspaper-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wifi"></i></div><div class="m-demo-icon__class">fa-wifi</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calculator"></i></div><div class="m-demo-icon__class">fa-calculator</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paypal"></i></div><div class="m-demo-icon__class">fa-paypal</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-google-wallet"></i></div><div class="m-demo-icon__class">fa-google-wallet</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-visa"></i></div><div class="m-demo-icon__class">fa-cc-visa</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-mastercard"></i></div><div class="m-demo-icon__class">fa-cc-mastercard</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-discover"></i></div><div class="m-demo-icon__class">fa-cc-discover</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-amex"></i></div><div class="m-demo-icon__class">fa-cc-amex</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-paypal"></i></div><div class="m-demo-icon__class">fa-cc-paypal</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-stripe"></i></div><div class="m-demo-icon__class">fa-cc-stripe</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bell-slash"></i></div><div class="m-demo-icon__class">fa-bell-slash</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bell-slash-o"></i></div><div class="m-demo-icon__class">fa-bell-slash-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-trash"></i></div><div class="m-demo-icon__class">fa-trash</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-copyright"></i></div><div class="m-demo-icon__class">fa-copyright</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-at"></i></div><div class="m-demo-icon__class">fa-at</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eyedropper"></i></div><div class="m-demo-icon__class">fa-eyedropper</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-paint-brush"></i></div><div class="m-demo-icon__class">fa-paint-brush</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-birthday-cake"></i></div><div class="m-demo-icon__class">fa-birthday-cake</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-area-chart"></i></div><div class="m-demo-icon__class">fa-area-chart</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pie-chart"></i></div><div class="m-demo-icon__class">fa-pie-chart</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-line-chart"></i></div><div class="m-demo-icon__class">fa-line-chart</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-lastfm"></i></div><div class="m-demo-icon__class">fa-lastfm</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-lastfm-square"></i></div><div class="m-demo-icon__class">fa-lastfm-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-toggle-off"></i></div><div class="m-demo-icon__class">fa-toggle-off</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-toggle-on"></i></div><div class="m-demo-icon__class">fa-toggle-on</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bicycle"></i></div><div class="m-demo-icon__class">fa-bicycle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bus"></i></div><div class="m-demo-icon__class">fa-bus</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ioxhost"></i></div><div class="m-demo-icon__class">fa-ioxhost</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-angellist"></i></div><div class="m-demo-icon__class">fa-angellist</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc"></i></div><div class="m-demo-icon__class">fa-cc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shekel"></i></div><div class="m-demo-icon__class">fa-shekel</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sheqel"></i></div><div class="m-demo-icon__class">fa-sheqel</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ils"></i></div><div class="m-demo-icon__class">fa-ils</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-meanpath"></i></div><div class="m-demo-icon__class">fa-meanpath</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-buysellads"></i></div><div class="m-demo-icon__class">fa-buysellads</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-connectdevelop"></i></div><div class="m-demo-icon__class">fa-connectdevelop</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-dashcube"></i></div><div class="m-demo-icon__class">fa-dashcube</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-forumbee"></i></div><div class="m-demo-icon__class">fa-forumbee</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-leanpub"></i></div><div class="m-demo-icon__class">fa-leanpub</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sellsy"></i></div><div class="m-demo-icon__class">fa-sellsy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shirtsinbulk"></i></div><div class="m-demo-icon__class">fa-shirtsinbulk</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-simplybuilt"></i></div><div class="m-demo-icon__class">fa-simplybuilt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-skyatlas"></i></div><div class="m-demo-icon__class">fa-skyatlas</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cart-plus"></i></div><div class="m-demo-icon__class">fa-cart-plus</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cart-arrow-down"></i></div><div class="m-demo-icon__class">fa-cart-arrow-down</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-diamond"></i></div><div class="m-demo-icon__class">fa-diamond</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ship"></i></div><div class="m-demo-icon__class">fa-ship</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-secret"></i></div><div class="m-demo-icon__class">fa-user-secret</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-motorcycle"></i></div><div class="m-demo-icon__class">fa-motorcycle</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-street-view"></i></div><div class="m-demo-icon__class">fa-street-view</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-heartbeat"></i></div><div class="m-demo-icon__class">fa-heartbeat</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-venus"></i></div><div class="m-demo-icon__class">fa-venus</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mars"></i></div><div class="m-demo-icon__class">fa-mars</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mercury"></i></div><div class="m-demo-icon__class">fa-mercury</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-intersex"></i></div><div class="m-demo-icon__class">fa-intersex</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-transgender"></i></div><div class="m-demo-icon__class">fa-transgender</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-transgender-alt"></i></div><div class="m-demo-icon__class">fa-transgender-alt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-venus-double"></i></div><div class="m-demo-icon__class">fa-venus-double</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mars-double"></i></div><div class="m-demo-icon__class">fa-mars-double</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-venus-mars"></i></div><div class="m-demo-icon__class">fa-venus-mars</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mars-stroke"></i></div><div class="m-demo-icon__class">fa-mars-stroke</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mars-stroke-v"></i></div><div class="m-demo-icon__class">fa-mars-stroke-v</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mars-stroke-h"></i></div><div class="m-demo-icon__class">fa-mars-stroke-h</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-neuter"></i></div><div class="m-demo-icon__class">fa-neuter</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-genderless"></i></div><div class="m-demo-icon__class">fa-genderless</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-facebook-official"></i></div><div class="m-demo-icon__class">fa-facebook-official</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pinterest-p"></i></div><div class="m-demo-icon__class">fa-pinterest-p</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-whatsapp"></i></div><div class="m-demo-icon__class">fa-whatsapp</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-server"></i></div><div class="m-demo-icon__class">fa-server</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-plus"></i></div><div class="m-demo-icon__class">fa-user-plus</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-times"></i></div><div class="m-demo-icon__class">fa-user-times</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hotel"></i></div><div class="m-demo-icon__class">fa-hotel</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bed"></i></div><div class="m-demo-icon__class">fa-bed</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-viacoin"></i></div><div class="m-demo-icon__class">fa-viacoin</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-train"></i></div><div class="m-demo-icon__class">fa-train</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-subway"></i></div><div class="m-demo-icon__class">fa-subway</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-medium"></i></div><div class="m-demo-icon__class">fa-medium</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-yc"></i></div><div class="m-demo-icon__class">fa-yc</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-y-combinator"></i></div><div class="m-demo-icon__class">fa-y-combinator</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-optin-monster"></i></div><div class="m-demo-icon__class">fa-optin-monster</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-opencart"></i></div><div class="m-demo-icon__class">fa-opencart</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-expeditedssl"></i></div><div class="m-demo-icon__class">fa-expeditedssl</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-4"></i></div><div class="m-demo-icon__class">fa-battery-4</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery"></i></div><div class="m-demo-icon__class">fa-battery</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-full"></i></div><div class="m-demo-icon__class">fa-battery-full</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-3"></i></div><div class="m-demo-icon__class">fa-battery-3</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-three-quarters"></i></div><div class="m-demo-icon__class">fa-battery-three-quarters</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-2"></i></div><div class="m-demo-icon__class">fa-battery-2</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-half"></i></div><div class="m-demo-icon__class">fa-battery-half</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-1"></i></div><div class="m-demo-icon__class">fa-battery-1</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-quarter"></i></div><div class="m-demo-icon__class">fa-battery-quarter</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-0"></i></div><div class="m-demo-icon__class">fa-battery-0</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-battery-empty"></i></div><div class="m-demo-icon__class">fa-battery-empty</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mouse-pointer"></i></div><div class="m-demo-icon__class">fa-mouse-pointer</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-i-cursor"></i></div><div class="m-demo-icon__class">fa-i-cursor</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-object-group"></i></div><div class="m-demo-icon__class">fa-object-group</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-object-ungroup"></i></div><div class="m-demo-icon__class">fa-object-ungroup</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sticky-note"></i></div><div class="m-demo-icon__class">fa-sticky-note</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sticky-note-o"></i></div><div class="m-demo-icon__class">fa-sticky-note-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-jcb"></i></div><div class="m-demo-icon__class">fa-cc-jcb</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-cc-diners-club"></i></div><div class="m-demo-icon__class">fa-cc-diners-club</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-clone"></i></div><div class="m-demo-icon__class">fa-clone</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-balance-scale"></i></div><div class="m-demo-icon__class">fa-balance-scale</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-o"></i></div><div class="m-demo-icon__class">fa-hourglass-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-1"></i></div><div class="m-demo-icon__class">fa-hourglass-1</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-start"></i></div><div class="m-demo-icon__class">fa-hourglass-start</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-2"></i></div><div class="m-demo-icon__class">fa-hourglass-2</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-half"></i></div><div class="m-demo-icon__class">fa-hourglass-half</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-3"></i></div><div class="m-demo-icon__class">fa-hourglass-3</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass-end"></i></div><div class="m-demo-icon__class">fa-hourglass-end</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hourglass"></i></div><div class="m-demo-icon__class">fa-hourglass</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-grab-o"></i></div><div class="m-demo-icon__class">fa-hand-grab-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-rock-o"></i></div><div class="m-demo-icon__class">fa-hand-rock-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-stop-o"></i></div><div class="m-demo-icon__class">fa-hand-stop-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-paper-o"></i></div><div class="m-demo-icon__class">fa-hand-paper-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-scissors-o"></i></div><div class="m-demo-icon__class">fa-hand-scissors-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-lizard-o"></i></div><div class="m-demo-icon__class">fa-hand-lizard-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-spock-o"></i></div><div class="m-demo-icon__class">fa-hand-spock-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-pointer-o"></i></div><div class="m-demo-icon__class">fa-hand-pointer-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hand-peace-o"></i></div><div class="m-demo-icon__class">fa-hand-peace-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-trademark"></i></div><div class="m-demo-icon__class">fa-trademark</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-registered"></i></div><div class="m-demo-icon__class">fa-registered</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-creative-commons"></i></div><div class="m-demo-icon__class">fa-creative-commons</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gg"></i></div><div class="m-demo-icon__class">fa-gg</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gg-circle"></i></div><div class="m-demo-icon__class">fa-gg-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tripadvisor"></i></div><div class="m-demo-icon__class">fa-tripadvisor</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-odnoklassniki"></i></div><div class="m-demo-icon__class">fa-odnoklassniki</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-odnoklassniki-square"></i></div><div class="m-demo-icon__class">fa-odnoklassniki-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-get-pocket"></i></div><div class="m-demo-icon__class">fa-get-pocket</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wikipedia-w"></i></div><div class="m-demo-icon__class">fa-wikipedia-w</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-safari"></i></div><div class="m-demo-icon__class">fa-safari</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-chrome"></i></div><div class="m-demo-icon__class">fa-chrome</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-firefox"></i></div><div class="m-demo-icon__class">fa-firefox</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-opera"></i></div><div class="m-demo-icon__class">fa-opera</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-internet-explorer"></i></div><div class="m-demo-icon__class">fa-internet-explorer</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-tv"></i></div><div class="m-demo-icon__class">fa-tv</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-television"></i></div><div class="m-demo-icon__class">fa-television</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-contao"></i></div><div class="m-demo-icon__class">fa-contao</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-500px"></i></div><div class="m-demo-icon__class">fa-500px</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-amazon"></i></div><div class="m-demo-icon__class">fa-amazon</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calendar-plus-o"></i></div><div class="m-demo-icon__class">fa-calendar-plus-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calendar-minus-o"></i></div><div class="m-demo-icon__class">fa-calendar-minus-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calendar-times-o"></i></div><div class="m-demo-icon__class">fa-calendar-times-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-calendar-check-o"></i></div><div class="m-demo-icon__class">fa-calendar-check-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-industry"></i></div><div class="m-demo-icon__class">fa-industry</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-map-pin"></i></div><div class="m-demo-icon__class">fa-map-pin</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-map-signs"></i></div><div class="m-demo-icon__class">fa-map-signs</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-map-o"></i></div><div class="m-demo-icon__class">fa-map-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-map"></i></div><div class="m-demo-icon__class">fa-map</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-commenting"></i></div><div class="m-demo-icon__class">fa-commenting</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-commenting-o"></i></div><div class="m-demo-icon__class">fa-commenting-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-houzz"></i></div><div class="m-demo-icon__class">fa-houzz</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-vimeo"></i></div><div class="m-demo-icon__class">fa-vimeo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-black-tie"></i></div><div class="m-demo-icon__class">fa-black-tie</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fonticons"></i></div><div class="m-demo-icon__class">fa-fonticons</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-reddit-alien"></i></div><div class="m-demo-icon__class">fa-reddit-alien</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-edge"></i></div><div class="m-demo-icon__class">fa-edge</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-credit-card-alt"></i></div><div class="m-demo-icon__class">fa-credit-card-alt</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-codiepie"></i></div><div class="m-demo-icon__class">fa-codiepie</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-modx"></i></div><div class="m-demo-icon__class">fa-modx</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fort-awesome"></i></div><div class="m-demo-icon__class">fa-fort-awesome</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-usb"></i></div><div class="m-demo-icon__class">fa-usb</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-product-hunt"></i></div><div class="m-demo-icon__class">fa-product-hunt</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-mixcloud"></i></div><div class="m-demo-icon__class">fa-mixcloud</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-scribd"></i></div><div class="m-demo-icon__class">fa-scribd</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pause-circle"></i></div><div class="m-demo-icon__class">fa-pause-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pause-circle-o"></i></div><div class="m-demo-icon__class">fa-pause-circle-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stop-circle"></i></div><div class="m-demo-icon__class">fa-stop-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-stop-circle-o"></i></div><div class="m-demo-icon__class">fa-stop-circle-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shopping-bag"></i></div><div class="m-demo-icon__class">fa-shopping-bag</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shopping-basket"></i></div><div class="m-demo-icon__class">fa-shopping-basket</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hashtag"></i></div><div class="m-demo-icon__class">fa-hashtag</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bluetooth"></i></div><div class="m-demo-icon__class">fa-bluetooth</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bluetooth-b"></i></div><div class="m-demo-icon__class">fa-bluetooth-b</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-percent"></i></div><div class="m-demo-icon__class">fa-percent</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-gitlab"></i></div><div class="m-demo-icon__class">fa-gitlab</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wpbeginner"></i></div><div class="m-demo-icon__class">fa-wpbeginner</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wpforms"></i></div><div class="m-demo-icon__class">fa-wpforms</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-envira"></i></div><div class="m-demo-icon__class">fa-envira</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-universal-access"></i></div><div class="m-demo-icon__class">fa-universal-access</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wheelchair-alt"></i></div><div class="m-demo-icon__class">fa-wheelchair-alt</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-question-circle-o"></i></div><div class="m-demo-icon__class">fa-question-circle-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-blind"></i></div><div class="m-demo-icon__class">fa-blind</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-audio-description"></i></div><div class="m-demo-icon__class">fa-audio-description</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-volume-control-phone"></i></div><div class="m-demo-icon__class">fa-volume-control-phone</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-braille"></i></div><div class="m-demo-icon__class">fa-braille</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-assistive-listening-systems"></i></div><div class="m-demo-icon__class">fa-assistive-listening-systems</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-asl-interpreting"></i></div><div class="m-demo-icon__class">fa-asl-interpreting</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-american-sign-language-interpreting"></i></div><div class="m-demo-icon__class">fa-american-sign-language-interpreting</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-deafness"></i></div><div class="m-demo-icon__class">fa-deafness</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-hard-of-hearing"></i></div><div class="m-demo-icon__class">fa-hard-of-hearing</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-deaf"></i></div><div class="m-demo-icon__class">fa-deaf</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-glide"></i></div><div class="m-demo-icon__class">fa-glide</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-glide-g"></i></div><div class="m-demo-icon__class">fa-glide-g</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-signing"></i></div><div class="m-demo-icon__class">fa-signing</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-sign-language"></i></div><div class="m-demo-icon__class">fa-sign-language</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-low-vision"></i></div><div class="m-demo-icon__class">fa-low-vision</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-viadeo"></i></div><div class="m-demo-icon__class">fa-viadeo</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-viadeo-square"></i></div><div class="m-demo-icon__class">fa-viadeo-square</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-snapchat"></i></div><div class="m-demo-icon__class">fa-snapchat</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-snapchat-ghost"></i></div><div class="m-demo-icon__class">fa-snapchat-ghost</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-snapchat-square"></i></div><div class="m-demo-icon__class">fa-snapchat-square</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-pied-piper"></i></div><div class="m-demo-icon__class">fa-pied-piper</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-first-order"></i></div><div class="m-demo-icon__class">fa-first-order</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-yoast"></i></div><div class="m-demo-icon__class">fa-yoast</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-themeisle"></i></div><div class="m-demo-icon__class">fa-themeisle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-google-plus-circle"></i></div><div class="m-demo-icon__class">fa-google-plus-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-google-plus-official"></i></div><div class="m-demo-icon__class">fa-google-plus-official</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-fa"></i></div><div class="m-demo-icon__class">fa-fa</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-font-awesome"></i></div><div class="m-demo-icon__class">fa-font-awesome</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-handshake-o"></i></div><div class="m-demo-icon__class">fa-handshake-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-envelope-open"></i></div><div class="m-demo-icon__class">fa-envelope-open</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-envelope-open-o"></i></div><div class="m-demo-icon__class">fa-envelope-open-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-linode"></i></div><div class="m-demo-icon__class">fa-linode</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-address-book"></i></div><div class="m-demo-icon__class">fa-address-book</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-address-book-o"></i></div><div class="m-demo-icon__class">fa-address-book-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-vcard"></i></div><div class="m-demo-icon__class">fa-vcard</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-address-card"></i></div><div class="m-demo-icon__class">fa-address-card</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-vcard-o"></i></div><div class="m-demo-icon__class">fa-vcard-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-address-card-o"></i></div><div class="m-demo-icon__class">fa-address-card-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-circle"></i></div><div class="m-demo-icon__class">fa-user-circle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-circle-o"></i></div><div class="m-demo-icon__class">fa-user-circle-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-user-o"></i></div><div class="m-demo-icon__class">fa-user-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-id-badge"></i></div><div class="m-demo-icon__class">fa-id-badge</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-drivers-license"></i></div><div class="m-demo-icon__class">fa-drivers-license</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-id-card"></i></div><div class="m-demo-icon__class">fa-id-card</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-drivers-license-o"></i></div><div class="m-demo-icon__class">fa-drivers-license-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-id-card-o"></i></div><div class="m-demo-icon__class">fa-id-card-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-quora"></i></div><div class="m-demo-icon__class">fa-quora</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-free-code-camp"></i></div><div class="m-demo-icon__class">fa-free-code-camp</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-telegram"></i></div><div class="m-demo-icon__class">fa-telegram</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-4"></i></div><div class="m-demo-icon__class">fa-thermometer-4</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer"></i></div><div class="m-demo-icon__class">fa-thermometer</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-full"></i></div><div class="m-demo-icon__class">fa-thermometer-full</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-3"></i></div><div class="m-demo-icon__class">fa-thermometer-3</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-three-quarters"></i></div><div class="m-demo-icon__class">fa-thermometer-three-quarters</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-2"></i></div><div class="m-demo-icon__class">fa-thermometer-2</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-half"></i></div><div class="m-demo-icon__class">fa-thermometer-half</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-1"></i></div><div class="m-demo-icon__class">fa-thermometer-1</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-quarter"></i></div><div class="m-demo-icon__class">fa-thermometer-quarter</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-0"></i></div><div class="m-demo-icon__class">fa-thermometer-0</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-thermometer-empty"></i></div><div class="m-demo-icon__class">fa-thermometer-empty</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-shower"></i></div><div class="m-demo-icon__class">fa-shower</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bathtub"></i></div><div class="m-demo-icon__class">fa-bathtub</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-s15"></i></div><div class="m-demo-icon__class">fa-s15</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bath"></i></div><div class="m-demo-icon__class">fa-bath</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-podcast"></i></div><div class="m-demo-icon__class">fa-podcast</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-window-maximize"></i></div><div class="m-demo-icon__class">fa-window-maximize</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-window-minimize"></i></div><div class="m-demo-icon__class">fa-window-minimize</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-window-restore"></i></div><div class="m-demo-icon__class">fa-window-restore</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-times-rectangle"></i></div><div class="m-demo-icon__class">fa-times-rectangle</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-window-close"></i></div><div class="m-demo-icon__class">fa-window-close</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-times-rectangle-o"></i></div><div class="m-demo-icon__class">fa-times-rectangle-o</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-window-close-o"></i></div><div class="m-demo-icon__class">fa-window-close-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-bandcamp"></i></div><div class="m-demo-icon__class">fa-bandcamp</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-grav"></i></div><div class="m-demo-icon__class">fa-grav</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-etsy"></i></div><div class="m-demo-icon__class">fa-etsy</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-imdb"></i></div><div class="m-demo-icon__class">fa-imdb</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-ravelry"></i></div><div class="m-demo-icon__class">fa-ravelry</div></div></div></div><div class="row"><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-eercast"></i></div><div class="m-demo-icon__class">fa-eercast</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-microchip"></i></div><div class="m-demo-icon__class">fa-microchip</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-snowflake-o"></i></div><div class="m-demo-icon__class">fa-snowflake-o</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-superpowers"></i></div><div class="m-demo-icon__class">fa-superpowers</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-wpexplorer"></i></div><div class="m-demo-icon__class">fa-wpexplorer</div></div></div><div class="col-md-2"><div class="m-demo-icon"><div class="m-demo-icon__preview"><i class="fa fa-meetup"></i></div><div class="m-demo-icon__class">fa-meetup</div></div></div></div>'
    }
    var handleIcoSelect = function ($thiz, $thizVal) {
        // 是否限制选择，如果限制，设置为disabled
        if ($thizVal.attr("disabled")) {
            return true;
        }

        var name = $thiz.attr("name"), nameLevel = $thiz.attr("_nameLevel"), nameLevel = (nameLevel ? nameLevel : "1"),
            url = $thiz.attr("_url") ? $thiz.attr("_url") : "",
            module = $thiz.attr("_module") ? $thiz.attr("_module") : "",
            checked = $thiz.attr("_checked") == "true" ? $thiz.attr("_checked") : "",
            extId = $thiz.attr("_extId") ? $thiz.attr("_extId") : "",
            nodesLevel = $thiz.attr("_nodesLevel") ? $thiz.attr("_nodesLevel") : "",
            title = $thiz.attr("_title") ? $thiz.attr("_title") : "",
            value = $thizVal.val() ? $thizVal.val() : "",
            allowClear = $thiz.attr("_allowClear") ? $thiz.attr("_allowClear") : "",
            notAllowSelectParent = $thiz.attr("_notAllowSelectParent") ? $thiz.attr("_notAllowSelectParent") : "",
            dialogWidth = $thiz.attr("_dialogWidth") ? $thiz.attr("_dialogWidth") : 720,
            dialogHeight = $thiz.attr("_dialogHeight") ? $thiz.attr("_dialogHeight") : 460,
            notAllowSelectRoot = $thiz.attr("_notAllowSelectRoot") ? $thiz.attr("_notAllowSelectRoot") : "",
            selectScopeModule = $thiz.attr("_selectScopeModule") ? $thiz.attr("_selectScopeModule") : "",
            selectedValueFn = $thiz.attr("_selectedValueFn") ? $thiz.attr("_selectedValueFn") : "",
            saveHalfState = $thiz.attr("_saveHalfState") ? $thiz.attr("_saveHalfState") : "";

        if (name && name.indexOf(".") != -1) name = name.replace(".", "-");

        var html = '<div id="' + name + 'IcoModal" class="modal fade" tabindex="-1" data-focus-on="input:first">' +
            '<div class="modal-dialog modal-xxxlg" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
            '<h4 class="modal-title">' + (title ? title : "数据选择") + '</h4>' +
            '</div>' +
            '<div class="modal-body albedo-icoSelect-div albed-icoSelect-' + name + '">' +
            '<div class="search-item-div" style="position:absolute;right:15px;top:30px;cursor:pointer;z-index:22;">' +
            '<i class="fa fa-search icon-on-right fa-lg"></i><label id="txt">&nbsp;&nbsp;</label>' +
            '</div>' +
            '<div id="search" class="control-group" style="padding:0px 15px 15px;display: none;">' +
            '<div class="portlet-input input-inline">' +
            '<div class="input-icon right">' +
            '<i class="icon-magnifier"></i>' +
            '<input type="text" id="key" name="key" maxlength="50" class="form-control input-circle" placeholder="请输入..."> </div>' +
            '</div>' +
            '</div>' +
            '<div class="scrollable ico-select-div" style="height:' + (dialogHeight - 30) + 'px;">' +
            _icoObj.html +
            '</div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-sm btn-primary m-btn m-btn--custom confirm">确定</button>' +
            '<button type="button" class="btn btn-sm btn-secondary m-btn m-btn--custom" data-dismiss="modal">关闭</button>' +
            (allowClear ? '<button type="button" class="btn btn-sm btn-warning m-btn m-btn--custom clear">清除</button>' : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var isReload = $('#' + name + 'IcoModal').length>0;
        if(!isReload){
            $('body').append($(html));
        }
        var $modal = $('#' + name + 'IcoModal'), lastValue = "", nodeList = [], $container = $modal.find('.scrollable');
        var selectIconFn = function(){
            if(!$(this).attr("select")){
                if(!checked){
                    $modal.find(".m-demo-icon").removeAttr("select").find(".m-demo-icon__preview i").removeClass("active");
                    $modal.find(".m-demo-icon__class").removeClass("active");
                }
                $(this).attr("select", "select").find(".m-demo-icon__preview i").addClass("active");
                $(this).find(".m-demo-icon__class").addClass("active");
            }else{
                $(this).removeAttr("select").find(".m-demo-icon__preview i").removeClass("active");
                $(this).find(".m-demo-icon__class").removeClass("active");
            }
        };
        $modal.find('.m-demo-icon').off().click(selectIconFn);
        //, maxHeight: dialogHeight, height: dialogHeight
        console.log(dialogWidth)

        $modal.modal({width: dialogWidth}).off('click', '.confirm').on('click', '.confirm', function () {
            var vals = [];
            $modal.find('.m-demo-icon[select="select"]').each(function(){
                vals.push($(this).find('.m-demo-icon__class').text());
            })
            $thizVal.val(vals);
            var icons = "";
            vals.forEach(function(val, index){
                icons+=("<i class='fa "+val+"'/>");
            })
            $thiz.html(icons);
            if (albedo.isExitsVariable(selectedValueFn) && albedo.isExitsFunction(selectedValueFn)) {
                eval(selectedValueFn + "('" + vals + "')");
            }
            $modal.modal("hide");
        });

        $modal.find("#key").off().on('focus',function () {
            _searchInputFocusKey($(this));
        }).on('blur', function () {
            _searchInputBlurKey($(this));
        }).on('change keydown cut input propertychange', function () {
            var searchValue = _searchNode($(this), $container);
            if(searchValue){
                var $target = $modal.find('.m-demo-icon .m-demo-icon__class:contains("'+searchValue+'")');
                if($target&& $target.length>0){
                    $modal.find('.m-demo-icon .m-demo-icon__class').removeAttr("style");
                    $target.attr("style", "font-weight: bold;")
                    // var scorll = .offset().top - $modal.offset().top - 5;
                    $container.mCustomScrollbar('scrollTo', $target.get(0));
                }
            }
        });
        $modal.find(".search-item-div").off().click(function () {
            $modal.find("#search").slideToggle(200);
            $modal.find("#txt").toggle();
            $modal.find("#key").focus();
        });
        // App.initSlimScroll('.scroller');
        mApp.initScroller($modal.find('.scrollable'),{})
        if(value){
            var vals = value.split(",");
            vals.forEach(function(val, index){
                if(val){
                    var $icoTarget = $modal.find(".m-demo-icon .m-demo-icon__class:contains('"+val+"')");
                    $icoTarget.addClass("active").parents(".m-demo-icon").attr("select", "select").find(".m-demo-icon__preview i").addClass("active");
                    if(index==0)setTimeout(function(){$container.mCustomScrollbar('scrollTo', $icoTarget.parents(".m-demo-icon"))},500);
                }
            })
        }
        if (allowClear) {
            $modal.off('click', '.clear').on('click', '.clear', function () {
                $thizVal.val("");
                $thiz.val("");
                $modal.modal("hide");
            });
        }
    };
    var handleTreeSelect = function ($thiz, $thizVal) {
        // 是否限制选择，如果限制，设置为disabled
        if ($thizVal.attr("disabled")) {
            return true;
        }

        var name = $thiz.attr("name"), nameLevel = $thiz.attr("_nameLevel"), nameLevel = (nameLevel ? nameLevel : "1"),
            url = $thiz.attr("_url") ? $thiz.attr("_url") : "",
            module = $thiz.attr("_module") ? $thiz.attr("_module") : "",
            checked = $thiz.attr("_checked") == "true" ? $thiz.attr("_checked") : "",
            extId = $thiz.attr("_extId") ? $thiz.attr("_extId") : "",
            nodesLevel = $thiz.attr("_nodesLevel") ? $thiz.attr("_nodesLevel") : "",
            title = $thiz.attr("_title") ? $thiz.attr("_title") : "",
            value = $thizVal.val() ? $thizVal.val() : "",
            allowClear = $thiz.attr("_allowClear") ? $thiz.attr("_allowClear") : "",
            notAllowSelectParent = $thiz.attr("_notAllowSelectParent") ? $thiz.attr("_notAllowSelectParent") : "",
            dialogWidth = $thiz.attr("_dialogWidth") ? $thiz.attr("_dialogWidth") : 320,
            dialogHeight = $thiz.attr("_dialogHeight") ? $thiz.attr("_dialogHeight") : 360,
            notAllowSelectRoot = $thiz.attr("_notAllowSelectRoot") ? $thiz.attr("_notAllowSelectRoot") : "",
            selectScopeModule = $thiz.attr("_selectScopeModule") ? $thiz.attr("_selectScopeModule") : "",
            selectedValueFn = $thiz.attr("_selectedValueFn") ? $thiz.attr("_selectedValueFn") : "",
            saveHalfState = $thiz.attr("_saveHalfState") ? $thiz.attr("_saveHalfState") : "";

        if (name && name.indexOf(".") != -1) name = name.replace(".", "-");

        var html = '<div id="' + name + 'TreeModal" class="modal fade" tabindex="-1" data-focus-on="input:first">' +
            '<div class="modal-dialog modal-sm" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
            '<h4 class="modal-title">' + (title ? title : "数据选择") + '</h4>' +
            '</div>' +
            '<div class="modal-body albedo-treeSelect-div albed-treeSelect-' + name + '">' +
            '<div class="search-item-div" style="position:absolute;right:15px;top:30px;cursor:pointer;z-index:22;">' +
            '<i class="fa fa-search icon-on-right fa-lg"></i><label id="txt">&nbsp;&nbsp;</label>' +
            '</div>' +
            '<div id="search" class="control-group" style="padding:0 15px 15px;display: none;">' +
            '<div class="portlet-input input-inline">' +
            '<div class="input-group"> <input id="key" name="key" class="form-control input-circle tree-search-input" placeholder="请输入..." type="text"> <span class="input-group-btn"> <button class="btn btn-secondary btn-search" type="button"> 查询 </button> </span> </div>' +
            '</div>' +
            '</div>' +
            '<div id="tree-' + name + '" class="ztree scrollable" style="padding:0 15px 10px;height:' + (dialogHeight - 30) + 'px;"></div>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-sm btn-primary m-btn m-btn--custom confirm">确定</button>' +
            '<button type="button" class="btn btn-sm btn-secondary m-btn m-btn--custom" data-dismiss="modal">关闭</button>' +
            (allowClear ? '<button type="button" class="btn btn-sm btn-warning m-btn m-btn--custom clear">清除</button>' : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        var isReload = $('#' + name + 'TreeModal').length>0;
        if(!isReload){
            $('body').append($(html));
        }
        var $modal = $('#' + name + 'TreeModal'), lastValue = "", nodeList = [];
        if(isReload){
            $modal.find(".ztree").remove();
            $modal.find(".modal-body").append($('<div id="tree-' + name + '" class="ztree scrollable" style="padding:0 15px 10px;height:' + (dialogHeight - 30) + 'px;"></div>'))
        }
        var setting = {
            check: {enable: checked, nocheckInherit: true},
            data: {key: {name: 'label'}, simpleData: {enable: true, idKey: 'id', pIdKey: 'pid'}},
            view: {
                selectedMulti: false,
                fontCss: function (treeId, treeNode) {
                    return (!!treeNode.highlight) ? {"font-weight": "bold"} : {"font-weight": "normal"};
                }
            },
            callback: {
                beforeClick: function (id, node) {
                    if (checked == "true") {
                        tree.checkNode(node, !node.checked, true, true);
                        return false;
                    }
                }, onDblClick: function () {
                    $modal.find('.confirm').trigger("click");
                }
            }
        };
        $modal.modal({width: dialogWidth}).off('click', '.confirm').on('click', '.confirm', function () {
            var tree = $.fn.zTree.getZTreeObj("tree-" + name);
            var ids = [], names = [], nodes = [];
            if (checked == "true") {
                nodes = tree.getCheckedNodes(true);
            } else {
                nodes = tree.getSelectedNodes();
            }
            for (var i = 0; i < nodes.length; i++) {
                if (checked == "true") {
                    if (notAllowSelectParent && nodes[i].isParent) {
                        continue; // 如果为复选框选择，则过滤掉父节点
                    }
                    if (nodes[i].getCheckStatus().half) {
                        continue; // 过滤半选中状态
                    }
                }
                if (notAllowSelectRoot && nodes[i].level == 0) {
                    toastr.warning("不能选择根节点（" + nodes[i].name + "）请重新选择。");
                    return false;
                }
                if (notAllowSelectParent && nodes[i].isParent) {
                    toastr.warning("不能选择父节点（" + nodes[i].name + "）请重新选择。");
                    return false;
                }
                if (!module && selectScopeModule) {
                    if (nodes[i].module == "") {
                        toastr.warning("不能选择公共模型（" + nodes[i].name + "）请重新选择。");
                        return false;
                    } else if (nodes[i].module != module) {
                        toastr.warning("不能选择当前栏目以外的栏目模型，请重新选择。");
                        return false;
                    }
                }
                ids.push(nodes[i].id);
                var t_node = nodes[i];
                var t_name = "";
                var name_l = 0;
                do {
                    name_l++;
                    t_name = t_node.label + " " + t_name;
                    t_node = t_node.getParentNode();
                } while (name_l < nameLevel);
                names.push(t_name);
                if (checked != "true") break; // 如果为非复选框选择，则返回第一个选择
            }
            $thizVal.val(ids);
            $thiz.val(names);
            if (albedo.isExitsVariable(selectedValueFn) && albedo.isExitsFunction(selectedValueFn)) {
                eval(selectedValueFn + "('" + ids + "','" + names + "')");
            }
            $modal.modal("hide");
        });
        $.ajax({
            // async:false,
            url: url + (url.indexOf("?") == -1 ? "?" : "&") + "extId=" + extId + "&module=" + module + "&t=" + new Date().getTime(),
            type: "GET",
            success: function (rs) {
                if (rs && rs.status != 1) {
                    toastr.warning(rs.message);
                    return;
                }
                var zNodes = rs.data;
                // 初始化树结构
                var tree = $.fn.zTree.init($modal.find("#tree-" + name), setting, zNodes);
                // 默认指定层级节点
                if (nodesLevel) {
                    for (var i = 0; i < nodesLevel; i++) {
                        var nodes = tree.getNodesByParam("level", i);
                        for (var i = 0; i < nodes.length; i++) {
                            tree.expandNode(nodes[i], true, false, false);
                        }
                    }
                } else {
                    tree.expandAll(true);// 默认全部节点
                }
                // 默认选择节点
                var ids = value.split(",");
                for (var i = 0; i < ids.length; i++) {
                    var node = tree.getNodeByParam("id", ids[i]);
                    if (checked == "true") {
                        try {
                            tree.checkNode(node, true, true);
                        } catch (e) {
                        }
                        tree.selectNode(node, false);
                    } else {
                        tree.selectNode(node, true);
                    }
                }
                mApp.initScroller($modal.find('.scrollable'),{})
                setTimeout(function(){
                    var node = tree.getNodeByParam("id", ids[0]), $container = $modal.find('.scrollable');
                    node&&$container.mCustomScrollbar('scrollTo', $container.find(".node_name:contains('"+node.label+"')"))
                },500);
            }
        });
        $modal.find("#key").off().on('focus', function () {
            _searchInputFocusKey($(this));
        }).on('blur', function (e) {
            _searchTreeInputBlurKey($(this), $.fn.zTree.getZTreeObj("tree-" + name));
        });
        $modal.find("button.btn-search").off().on("click", function () {
            _searchTreeNode($modal.find("#key"), $.fn.zTree.getZTreeObj("tree-" + name));
        });
        $modal.off('click', '.search-item-div').on('click', '.search-item-div', function () {
            $modal.find("#search").slideToggle(200);
            $modal.find("#txt").toggle();
            $modal.find("#key").focus();
        });

        // $modal.find(".ztree").mCustomScrollbar();
        if (allowClear) {
            $modal.off('click', '.clear').on('click', '.clear', function () {
                $thizVal.val("");
                $thiz.val("");
                $modal.modal("hide");
            });
        }
    };

    var $tempStoreForm;

    var handleGridSelect = function ($thiz, $thizVal) {
        // 是否限制选择，如果限制，设置为disabled
        if ($thizVal.attr("disabled")) {
            return true;
        }

        var name = $thiz.attr("name"), id = $thizVal.attr("id"), colNames = $thiz.attr("_colNames"),
            gridOptions = $thiz.attr("_gridOptions"), colModel = $thiz.attr("_colModel"),
            searchFormId = $thiz.attr("_searchFormId"),
            url = $thiz.attr("_url") ? $thiz.attr("_url") : "",
            checked = $thiz.attr("_checked") == "true" ? true : false,
            disableDblClickRow = $thiz.attr("_disableDblClickRow") == "true" ? true : false,
            extId = $thiz.attr("_extId") ? $thiz.attr("_extId") : "",
            width = $thiz.attr("_width") ? $thiz.attr("_width") : 920,
            height = $thiz.attr("_height") ? $thiz.attr("_height") : 735,
            pageSize = $thiz.attr("_pageSize") ? $thiz.attr("_pageSize") : 10,
            title = $thiz.attr("_title") ? $thiz.attr("_title") : "",
            value = $thizVal.val() ? $thizVal.val() : "",
            allowClear = $thiz.attr("_allowClear") ? $thiz.attr("_allowClear") : "",
            showProperty = $thiz.attr("_showProperty") ? $thiz.attr("_showProperty") : "name",
            selectedValueFn = $thiz.attr("_selectedValueFn") ? $thiz.attr("_selectedValueFn") : "",
            grid_select_ = "#" + id + '-grid-table', pager_select_ = "#" + id + '-grid-pager';

        if (name && name.indexOf(".") != -1) name = name.replace(".", "-");

        var thStr = "";
        if (colNames) {
            var thOption = eval(colNames);
            for (var i = 0; i < thOption.length; i++) {
                var th = thOption[i];
                if (th && th.name) {
                    thStr += ("<th" + (th.width ? " width=" + th.width : "") + (th.cssClass ? " class=" + th.cssClass : "") + ">" + th.name + "</th>");
                } else if (th && typeof(th) == "string") {
                    thStr += ("<th>" + th + "</th>");
                }
            }
        }

        var html = '<div id="' + name + 'GridModal" class="modal modal-dialog fade" tabindex="-1" data-focus-on="input:first">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>' +
            '<h4 class="modal-title">' + (title ? title : "数据选择") + '</h4>' +
            '</div>' +
            '<div class="modal-body albedo-gridSelect-div albed-gridSelect-' + name + '">' +
            '<hr /><div id="bootstrap-alerts"></div>' +
            '<table class="table table-striped table-bordered table-hover dataTable no-footer dt-responsive" id="data-table-' + id + '"><thead>' +
            '<tr role="row" class="heading">' + thStr +
            '</tr></thead>' +
            '</table>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn blue confirm">确定</button>' +
            '<button type="button" class="btn default" data-dismiss="modal">关闭</button>' +
            (allowClear ? '<button type="button" class="btn blue clear">清除</button>' : '') +
            '</div>' +
            '</div>';
        var $modal = $(html);
        var ids = [], names = [], nodes = [];

        if ($(searchFormId).find("form") && $(searchFormId).find("form").length > 0) {
            $tempStoreForm = $(searchFormId).find("form").clone(true);
        }

        $modal.modal({width: width}).find(".albedo-gridSelect-div").prepend($tempStoreForm);

        // App.initUniform($modal.find(":radio, :checkbox"));

        var $tableTarget = $modal.find("#data-table-" + id);
        var gridSelect = new Datatable();
        try {
            eval("gridOptions=" + gridOptions);
        } catch (e) {
        }
        gridOptions = $.extend(true, {
            "formSearch": $modal.find(".form-search"),
            "ajax": {
                "url": url,
                type: 'GET',
                "dataType": 'json'
            },
            "dom": "<'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
            "columns": eval(colModel),
            "rowCallback": function (row, data) {
                if (value) {
                    var selected = value.split(",");
                    if ($.inArray(data.id, selected) !== -1) {
                        $(row).addClass('selected');
                        ids.push(data.id);
                        names.push(eval("data." + showProperty));
                        nodes.push(data);
                    }
                }
            }
        }, gridOptions);

        gridSelect.init({
            src: $tableTarget,
            dataTable: gridOptions
        });

        $tableTarget.on('xhr.dt', function (e, settings, rsData, xhr) {
            $modal.find("#data-table-" + id + ' tbody').off('click', 'tr').on('click', 'tr', function () {
                var id = this.id;
                if (!checked) {
                    ids = [], names = [], nodes = [];
                }
                if (checked && $(this).attr("class").indexOf("selected") != -1) { //取消 选择
                    ids.removeByValue(id);
                    for (var index = 0; index < rsData.data.length; index++) {
                        var item = rsData.data[index];
                        if (item.id == id) {
                            names.removeByValue(eval("item." + showProperty));
                            nodes.removeByValue(item);
                            break;
                        }
                    }
                } else {
                    ids.push(id);
                    for (var index = 0; index < rsData.data.length; index++) {
                        var item = rsData.data[index];
                        if (item.id == id) {
                            eval("names.push(item." + showProperty + ")");
                            nodes.push(item);
                        }
                    }
                }
                if (!checked) {
                    $(this).parents('tbody').find('tr').removeClass("selected");
                }
                $(this).toggleClass('selected');
            })
            $modal.find("#data-table-" + id + ' tbody').off('dblclick', 'tr').on('dblclick', 'tr', function () {
                var id = this.id;
                if (!checked && !disableDblClickRow && rsData) {
                    var ids = [], names = [], nodes = [];
                    ids.push(id);
                    for (var index = 0; index < rsData.data.length; index++) {
                        var item = rsData.data[index];
                        if (item.id == id) {
                            eval("names.push(item." + showProperty + ")");
                            nodes.push(item);
                        }
                    }
                    $thizVal.val(ids);
                    $thiz.val(names);
                    if (albedo.isExitsVariable(selectedValueFn) && albedo.isExitsFunction(selectedValueFn)) {
                        eval(selectedValueFn + "('" + ids + "','" + names + "',nodes)");
                    }
                    $modal.modal("hide");
                }
            });
            albedoForm.init($modal);
        })


        $modal.off('click', '.filter-submit-table').on('click', '.filter-submit-table', function () {
            gridSelect.submitFilter();
        }).off('click', '.confirm').on('click', '.confirm', function () {
            if (checked) {
                if (ids.length <= 0) {
                    toastr.warning("请至少选择一条数据");
                    return false;
                }
            } else {
                if (ids.length != 1) {
                    toastr.warning("请选择一条数据");
                    return false;
                }
            }
            $thizVal.val(ids);
            $thiz.val(names);
            if (albedo.isExitsVariable(selectedValueFn) && albedo.isExitsFunction(selectedValueFn)) {
                eval(selectedValueFn + "('" + ids + "','" + names + "',nodes)");
            }
            $modal.modal("hide");
        });
//		App.initSlimScroll('.scroller');
        if (allowClear) {
            $modal.off('click', '.clear').on('click', '.clear', function () {
                $thizVal.val("");
                $thiz.val("");
                $modal.modal("hide");
            });
        }
    };

    var handleDateTimePicker = function ($target) {
        if (!jQuery().datetimepicker) {
            return;
        }
        $target = ($target && $target.length > 0) ? $target.find('.m_datetimepicker') : $('.m_datetimepicker');
        $target.each(function () {
            var $tempInput = $(this).find("input"),$targeOptions = $tempInput && $tempInput.length > 0 ? $tempInput: $(this);
            // default settings
           var options = $.extend(true, {
                todayHighlight: true,
                autoclose: true,
                pickerPosition: 'bottom-left',
                todayBtn: true,
                format: 'yyyy-mm-dd hh:mm:ss'
            }, _getOptions($targeOptions));
            // $("div.datetimepicker.dropdown-menu").remove();
            $(this).off("click");
            // $(this).datetimepicker("remove").datepicker("remove");
            $(this).datetimepicker(options);
        });
    }

    var handleDateRangePicker = function ($target) {
        $target = ($target && $target.length > 0) ? $target.find('.m_daterangepicker') : $('.m_daterangepicker');
        // default settings
        var options = $.extend(true, {
            timePicker: true,
            timePicker24Hour: true,
            linkedCalendars: false,
            autoUpdateInput: false,
            locale: {
                format: 'YYYY-MM-DD hh:mm:ss',
                separator: ' ~ ',
                applyLabel: "应用",
                cancelLabel: "取消",
                resetLabel: "重置",
            }
        }, _getOptions($target));
        $target.daterangepicker(options, function(start, end, label) {

            var formatVal = '';
            if(this.startDate){
                formatVal=this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format);
            }
            if(this.element.is("input")){
                this.element.val(formatVal)
            }else{
                var $targetInput = this.element.find("input");
                if($targetInput.length>1){
                    $targetInput.get(0).val(this.startDate.format(this.locale.format))
                    $targetInput.get(1).val(this.endDate.format(this.locale.format))
                }else{
                    $targetInput.val(formatVal)
                }
            }
        });
    }

    var handleSummernote = function ($target) {
        $target = ($target && $target.length > 0) ? $target.find('.summernote') : $('.summernote');
        $target.each(function () {
            var $thiz = $(this),placeholder = $thiz.attr("placeholder") || '',url = $thiz.attr("action") || '',$tempInput = $(this).find("input"),$targeOptions = $tempInput && $tempInput.length > 0 ? $tempInput: $thiz;
            // default settings
            var options = $.extend(true, {
                lang : 'zh-CN',
                placeholder : placeholder,
                minHeight : 300,
                dialogsFade : true,// Add fade effect on dialogs
                dialogsInBody : true,// Dialogs can be placed in body, not in
                // summernote.
                disableDragAndDrop : false,// default false You can disable drag
                // and drop
                // callbacks : {
                //     onImageUpload : function(files) {
                //         var $files = $(files);
                //         $files.each(function() {
                //             var file = this;
                //             var data = new FormData();
                //             data.append("file", file);
                //
                //             $.ajax({
                //                 data : data,
                //                 type : "POST",
                //                 url : url,
                //                 cache : false,
                //                 contentType : false,
                //                 processData : false,
                //                 success : function(response) {
                //                     var json = YUNM.jsonEval(response);
                //                     YUNM.debug(json);
                //                     YUNM.ajaxDone(json);
                //
                //                     if (json[YUNM.keys.statusCode] == YUNM.statusCode.ok) {
                //                         // 文件不为空
                //                         if (json[YUNM.keys.result]) {
                //                             var imageUrl = json[YUNM.keys.result].completeSavePath;
                //                             $this.summernote('insertImage', imageUrl, function($image) {
                //
                //                             });
                //                         }
                //                     }
                //
                //                 },
                //                 error : YUNM.ajaxError
                //             });
                //         });
                //     }
                // }
            }, _getOptions($targeOptions));
            setTimeout(function () {
                $thiz.summernote(options);
            },100)
        });
    };
    var handleFormValueInit = function ($target) {
        $target = ($target && $target.length > 0) ? $target.find('alb-form') : $('alb-form');
        $target.each(function () {
            var $thiz = $(this);
            // $("div.datetimepicker.dropdown-menu").remove();
            var ngValue = $thiz.attr("ng-reflect-value"), boxtype=$thiz.attr("boxtype");
            console.log(ngValue);
            if(ngValue){
                if(boxtype=="checkbox" || boxtype == "radio"){
                    $thiz.find("input[type='"+boxtype+"']").removeAttr("checked");
                    $thiz.find("input[type='"+boxtype+"'][value='"+ngValue+"']").attr("checked", "checked")
                }else if(boxtype=="select"){
                    $thiz.find("select option").removeAttr("selected");
                    $thiz.find("select option[value='"+ngValue+"']").attr("selected", "selected");
                }
            }
        });
    };

    var handleFileUpload = function ($target) {
        $target = ($target && $target.length > 0) ? $target.find('input[type="file"]') : $('input[type="file"]');
        var clearVal = function () {
            var $parent = $(this).parents(".fileinput");
            var $file = $parent.find("input[type='hidden']");
            var tempVal = "," + $file.val() + ",";
            tempVal = tempVal.replace($(this).attr("img-value") + ",", "");
            tempVal = tempVal.length > 2 ? tempVal.substring(1, tempVal.length - 1) : "";
            $file.val(tempVal);
            $(this).parent(".fileinput-preview").remove();
            if (tempVal == "") {
                $parent.attr("class", "fileinput fileinput-new");
            }
        };


        $target.length > 0 && $target.fileupload && $target.each(function () {
            var options = $(this).attr("options"), $parent = $(this).parents(".fileinput"),
                multiple = $(this).attr("multiple"), showType = $(this).attr("showType");

            options = $.extend(true, {
                autoUpload: true,
                singleFileUploads: false,
                url: albedo.getCtx() + "/file/upload",
                type: "POST",
                dataType: 'json',
                done: function (e, data) {
                    if (data && data.result && data.result.status == 1) {
                        var files = data.result.data;
                        var $preview = $parent.find(".btn-img-div");
                        if ("image" == showType) {
                            $parent.find(".fileinput-exists.fileinput-preview").remove();
                            if (multiple) {
                                var fileVal = $parent.find("input[type='hidden']").val();
                                $parent.find("input[type='hidden']").val(fileVal && fileVal.length > 0 ? (fileVal + "," + files) : files);
                                fileVal = $parent.find("input[type='hidden']").val();
                                if (fileVal) {
                                    var fileArray = fileVal.split(',');
                                    for (var i = 0; i < fileArray.length; i++) {
                                        if (i < fileArray.length && fileArray[i] && typeof(fileArray[i]) == "string") $preview.before($("<div class=\"fileinput-preview fileinput-exists thumbnail\" ></div>").append(
                                            $("<img title='双击移除' src='" + App.getCtxPath() + "/file/get" + fileArray[i] + "' class=\"fileinput-img\" img-value=\"" + fileArray[i] + "\" />").dblclick(clearVal)));
                                    }
                                }
                            } else {
                                $preview.before($("<div class=\"fileinput-preview fileinput-exists thumbnail\" ></div>").append(
                                    $("<img title='双击移除' src='" + App.getCtxPath() + "/file/get" + files + "' class=\"fileinput-img\" img-value=\"" + files + "\" />").dblclick(clearVal)));
                                $parent.find("input[type='hidden']").val(files);
                            }
                        } else {
                            $parent.find(".form-control").attr("title", files).val(files);
                            $parent.find("input[type='hidden']").val(files);
                        }

                    } else {
                        toastr.warning(data.result.msg);
                    }
                }
            }, options);
            $(this).fileupload(options);
            var $parent = $(this).parents(".fileinput");
            $parent.find(".fileinput-remove").click(function () {
                $parent.find("input[type='hidden']").val('');
                if ("image" == showType) {
                    $parent.find(".fileinput-preview").remove();
                } else {
                    $parent.find(".form-control").attr("title", '').val('');
                }
            });
            $parent.find(".fileinput-img").dblclick(clearVal);

        });
    };

    var handleSave = function ($target, validateFun) {
        var $target = $target || $(".m-content");
        $target.off('click', '.save').on('click', '.save', function () {
            var el = $(this), $form = $target.find('.m-form'),
                flag = true;
            if(!validateFun) validateFun = $form.attr("validateFun")
            if (doValidation($form)) {
                albedo.isExitsFunction(validateFun) && eval("flag = " + validateFun + "()");
                if (flag) {
                    // $target.modal('loading');
                    var url = $form.attr("action");
                    $.ajax({
                        url: url,
                        type: $form.attr("method") || "POST",
                        data: JSON.stringify($form.serializeObject()),
                        // data: self.getValue($form.serialize()),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        timeout: 60000,
                        success: function (re) {
                            alertDialog($target, re, el);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(textStatus,errorThrown);
                            alertDialog($target, XMLHttpRequest.responseJSON, el);
                        }
                    });
                }
            }
        });
        $(document).off("keydown").keydown(function (e) {
            if (e.which == 13) {
                $form = $target.find('.m-form')
                if (doValidation($form)) {
                    mApp.confirm({
                        content: "您确定要提交表单数据吗？",
                        width: null, //
                        confirm: function () {
                            $target.find(".save").trigger("click");
                        }
                    });
                }
            }
        });
    }

    var alertDialog = function ($modal, re, el) {
        var alertType = "warning", icon = "warning", isModal = el && el.attr("data-is-modal") == "true";
        try {
            $modal.modal('removeLoading');
        } catch (e) {
        }
        var isForm = $modal.find('.m-form').length > 0;
        if (re && el) {
            var tableId = el.attr("data-table-id"), refresh = el.attr("data-refresh"), delay = el.attr("data-delay"),
                alertType = re.status == "0" ? "info" : re.status == "1" ? "success" : re.status == "-1" ? "danger" : "warning";
            icon = re.status == "0" ? "info" : re.status == "1" ? "check" : "warning";
            // && (tableId || refresh)
            if (re.status == "1") {
                if (refresh) {
                    window.location.reload();
                } else {
                    if (!isModal) {
                        $modal.find(".list i").trigger("click");
                    }
                    // clear form
                    if(isForm){
                        handleInitFormData($modal.find('.m-form'), null)
                    }
                    if(tableId){
                        var dataTables = albedoList.getData(tableId);
                        if(dataTables){
                            if (delay) {
                                // $modal.modal('loading');
                                setTimeout(function () {
                                    dataTables.loadFilterGird();
                                    // $modal.modal('removeLoading');
                                }, delay)
                            } else {
                                dataTables.loadFilterGird();
                            }
                        }
                    }
                    var ajaxReloadAfterFu = el.attr("data-reload-after");
                    if (albedo.isExitsFunction(ajaxReloadAfterFu)) {
                        eval(ajaxReloadAfterFu + "(re)");
                    }
                }
            }
        }
        if (isModal) $modal.modal('hide');
        setTimeout(function () {
            console.log($modal);
            mApp.alert({
                // container: $modal.find('#bootstrap-alerts'),
                close: true,
                focus: true,
                type: alertType,
                closeInSeconds: 8,
                message: (re && re.message) ? re.message : '网络异常，请检查您的网络!',
                icon: icon
            });
        },500)

    }


    var handleValidateConfig = function (config, form) {
        if (!config)
            config = {};
        config = $.extend(true, {
            // define validation rules
            rules: {},
            messages: {},
            //display error alert on form submit
            invalidHandler: function (event, validator) {
                // mApp.alert({
                //     container: '.m-form__content',
                //     type: 'warning',
                //     icon: 'warning',
                //     message: '验证失败'
                // });
            },
            submitHandler: function (form) {
                //form[0].submit(); // submit the form
            }
        }, config);
        return config;
    };
    // advance validation
    var handleValidation = function ($formTagert, options) {
        if ($formTagert && $formTagert.length > 0) {
            var $formValidate = $formTagert;
            var config;
            try {
                console.log($formValidate.attr("config"))
                eval("config = " + $formValidate.attr("config"));
                console.log(config)
            } catch (e) {
                console.log(e)

            }
            if (!config) config = {};

            config = $.extend(true, config, options);

            var formId  = $formValidate.attr("id");
            var validator =_getData(formId);
            if(validator){
                validator.destroy()
                var data = _getData("#"+formId);
                console.log(data)
                handleInitFormData($formValidate, data)
            }
            validator = $formValidate.validate(handleValidateConfig(config, $formValidate));
            _setData(formId, validator);
            return validator;
        }
    }
    var handleInitFormData = function ($form, data) {
        if ($form && $form.length > 0) {
            console.log(data)
            $form.find("[name]").each(function(){
                var $target = $(this);
                if($target && $target.length>0){
                    var val,isNullVal;
                    eval("val = data && data."+$target.attr("name")+", isNullVal = albedo.isNull(val);")
                    if(isNullVal){
                        $target.parents(".form-group").removeClass("has-danger").removeClass("has-success")
                    }
                    val = !isNullVal ? val.toString() : "";
                    if($target.is("input")){
                        var type = $target.attr("type");
                        if(type == "radio" || type == "checkbox"){
                            $target.removeAttr("checked").get(0).checked=false;
                            if(val){
                                if(val.indexOf(",")!=-1){val = val.split(",");}
                                if(val instanceof Array){
                                    for(var o in val){
                                        $target.filter("[value='"+val[o]+"']").attr("checked", "checked").trigger("click");
                                    }
                                }else{
                                    $target.filter("[value='"+val+"']").attr("checked", "checked").trigger("click");
                                }
                            }
                        }else{
                            if(type != "password") $target.val(val);
                        }
                    }else if($target.is("textarea")){
                        $target.val(val);
                        $target.hasClass('summernote')&&$target.summernote('code', val);;
                    }else if($target.is("select")){
                        $target.find("option").removeAttr("selected");
                        if(val){
                            if(val.indexOf(",")!=-1){val = val.split(",")};
                            if(val instanceof Array){
                                for(var o in val){
                                    $target.find("option[value='"+val[o]+"']").attr("selected", "selected");
                                }
                            }else{
                                $target.find("option[value='"+val+"']").attr("selected", "selected");
                            }
                        }
                        $target.selectpicker("val",val);
                    }
                }
            })
        }
    }

    var doValidation = function ($formTagert) {
        if ($formTagert && $formTagert.length > 0) {
            var validator =_getData($formTagert.attr("id"));
            return validator ? validator.form() : handleValidation($formTagert).form();
        }
        return false;
    }

    //* END:CORE HANDLERS *//

    return {
        initDateTimePicker: function ($target) {
            handleDateTimePicker($target);
        }, initDateRangePicker: function ($target) {
            handleDateRangePicker($target);
        }, gridSelect: function ($thiz, $thizVal) {
            handleGridSelect($thiz, $thizVal);
        }, treeSelect: function ($thiz, $thizVal) {
            handleTreeSelect($thiz, $thizVal);
        }, icoSelect: function ($thiz, $thizVal) {
            handleIcoSelect($thiz, $thizVal);
        },
        initTree: function ($targetShowTree) {
            $targetShowTree = ($targetShowTree && $targetShowTree.length > 0) ? $targetShowTree.find(".ztree-show") : $(".ztree-show");
            $targetShowTree.each(function () {
                treeShow($(this));
            });
        },

        initFileUpload: function ($target) {
            handleFileUpload($target);
        },

        initSave: function ($target, validateFun) {
            handleSave($target, validateFun)
        },
        setData: function (selector, data) {
            _setData(selector, data)
        },
        getData: function (selector) {
            return _getData(selector)
        },
        initFormData: function (selector, data) {
            _setData(selector, data)
            handleInitFormData($(selector), data)
        },
        resetForm: function (selector) {
            var data = _getData(selector);
            handleInitFormData($(selector), data)
        },
        alertDialog: function ($modal, re, el) {
            alertDialog($modal, re, el);
        },
        // main function to initiate the module
        initValidate: function ($formTagert, options) {
            handleValidation($formTagert, options);
        },
        validate: function ($formTagert) {
            return doValidation($formTagert);
        },
        clearDataBylikeKey: function(likeKey){
            handleClearDataBylikeKey(likeKey);
        },
        clearData: function(){
            handleClearData();
        },

        //main function to initiate the theme
        init: function ($target) {
            // $.datetimepicker.setLocale('ch');
            handleDateTimePicker($target);
            handleDateRangePicker($target);
            handleFileUpload($target);
            handleSummernote($target);
            albedoForm.initTree($target);
        }
    }
}();
// jQuery(document).ready(function () {
//     albedoForm.init(); // init core componets
// });

