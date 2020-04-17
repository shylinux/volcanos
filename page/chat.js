Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, conf, body) {
        window.onresize = function(event) {
            can.onlayout["刷新"](event, can, conf, null, body)
        }
    },
    layout: function(event, can, value, key, body) {var conf = can.Conf()
        can.onlayout["刷新"](event, can, conf, value? conf.layout.size[value]: null, body)
    },
    title: function(event, can, value, key, body) {var conf = can.Conf()
        can.user.title(value||conf.title)
    },
    login: function(event, can, value, key, body) {var conf = can.Conf()
        var list = location.pathname.split("/");
        can.Login? can.user.login(function(user) {
            can.River.Import(event, "update", "river")
        }): (
            can.Action.Import(event, list[2], "river"),
            can.Action.Import(event, "action", "storm")
        )
    }
})
Volcanos("onaction", {help: "组件交互", list: [],
    onkeydown: function(event, can) {var conf = can.Conf()
        if (event.target.tagName == "INPUT" || event.target.tagName == "TEXTAREA") {
            return
        }
        if (event.target.getAttribute("contenteditable")) {
            return
        }

        switch (event.key) {
            case "j":
                can.Report(event, {x: 0, y: conf.scroll.line}, "scroll")
                can.Report(event, event.key, "keydown")
                break
            case "k":
                can.Report(event, {x: 0, y: -conf.scroll.line}, "scroll")
                can.Report(event, event.key, "keydown")
                break
            case "Escape":
                can.Report(event, event.key, "escape")
                break
            case "Enter":
                can.Report(event, event.key, "enter")
                break
            case " ":
                can.Report(event, event.key, "space")
                break
            default:
                can.Report(event, event.key, "keydown")
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

        layout.left != 0 && can.left.target.dataset.width && (layout.left = can.left.target.dataset.width)
        layout.right != 0 && can.right.target.dataset.width && (layout.right = can.right.target.dataset.width)

        layout.left == undefined && (layout.left = can.left.target.clientWidth)
        layout.right == undefined && (layout.right = can.right.target.clientWidth)
        can.left.Size(event, layout.left, height)
        can.right.Size(event, layout.right, height)
        width -= can.left.target.offsetWidth+can.right.target.offsetWidth

        layout.bottom == -1 && (layout.bottom = can.user.isMobile? "": height, layout.top = 0, layout.center = 0)
        layout.bottom == undefined && (layout.bottom = can.bottom.target.offsetHeight-conf.layout.border)
        layout.center == undefined && (layout.center = can.center.target.clientHeight)
        layout.top == undefined && (layout.top = can.top.target.clientHeight)
        layout.center == 0 && layout.top == 0 && !can.user.isMobile && layout.bottom != -2 && (layout.bottom = height)
        can.bottom.Size(event, width, layout.bottom)
        can.center.Size(event, width, layout.center)

        height -= layout.top==0? height: can.center.target.offsetHeight+can.bottom.target.offsetHeight
        can.top.Size(event, width, height)
    },
})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

