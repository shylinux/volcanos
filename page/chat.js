Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, body) {
        window.onresize = function(event) {
            can.onlayout["刷新"](event, can, conf, null, body)
        }
    },
    layout: function(event, can, value, key, body) {var conf = can.Conf()
        can.onlayout["刷新"](event, can, conf, conf.layout.size[value], body)
    }
})
Volcanos("onaction", {help: "组件交互", list: [],
    onkeydown: function(event, can) {
        if (event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") {
            return
        }
        if (event.target.getAttribute("contenteditable")) {
            return
        }
        switch (event.key) {
            case "k":
                can.Report(event, {x: 0, y: -30}, "scroll")
                break
            case "j":
                can.Report(event, {x: 0, y: 30}, "scroll")
                break
            case "Escape":
                can.Action.escape && can.Action.escape(event)
                break
            case " ":
                can.Favor && can.page.Select(can, can.Favor.Show(), "input.cmd", function(item) {
                    item.focus()
                })

                event.stopPropagation()
                event.preventDefault()
        }
    },
})
Volcanos("onlayout", {help: "组件布局", list: ["刷新"], 
    "刷新": function(event, can, conf, layout, body) {layout = layout || {};
        var height = body.clientHeight-conf.layout.border;
        var width = body.clientWidth-conf.layout.border;
        can.user.isWindows && (body.style.overflow = "hidden");

        layout.head == undefined && (layout.head = can.head.target.clientHeight)
        layout.foot == undefined && (layout.foot = can.foot.target.clientHeight)
        can.head.Size(event, width, layout.head)
        can.foot.Size(event, width, layout.foot)
        height -= can.head.target.offsetHeight+can.foot.target.offsetHeight

        layout.left == undefined && (layout.left = can.left.target.clientWidth)
        layout.right == undefined && (layout.right = can.right.target.clientWidth)
        can.left.Size(event, layout.left, height)
        can.right.Size(event, layout.right, height)
        width -= can.left.target.offsetWidth+can.right.target.offsetWidth

        layout.bottom == -1 && (layout.bottom = can.user.isMobile? "": height, layout.top = 0, layout.center = 0)
        layout.bottom == undefined && (layout.bottom = can.bottom.target.offsetHeight-conf.layout.border)
        layout.center == undefined && (layout.center = can.center.target.clientHeight)
        layout.top == undefined && (layout.top = can.top.target.clientHeight)
        layout.center == 0 && layout.top == 0 && !can.user.isMobile && (layout.bottom = height)
        can.bottom.Size(event, width, layout.bottom)
        can.center.Size(event, width, layout.center)

        height -= layout.top==0? height: can.center.target.offsetHeight+can.bottom.target.offsetHeight
        can.top.Size(event, width, height)
    },
})
Volcanos("onchoice", {help: "组件菜单", list: ["刷新", "登出"],
    "刷新": function(event, can, conf, key, body) {
    },
    "登出": function(event, can, conf, value, target) {
        can.target.innerHTML = "";
    },
})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

