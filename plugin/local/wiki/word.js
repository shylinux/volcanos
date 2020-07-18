Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) { target.innerHTML = ""
        if (msg.Option("_display") == "table") {
            return can.onappend.table(can, target, "table", msg)
        } target.innerHTML = msg.Result()

        can.page.Select(can, target, ".story", function(item) { var data = item.dataset
            can.page.Modify(can, item, {style: can.base.Obj(data.style)})
            var cb = can.onimport[data.type]; typeof cb == "function" && cb(can, data, item)
        })
        return typeof cb == "function" && cb(msg)
    },
    premenu: function(can, list, target) { var meta = can.base.Obj(list.meta)
        can.page.Select(can, can._output, "h2.story, h3.story", function(item) {
            can.page.Append(can, target, [{text: [item.innerHTML, "li", item.tagName]}])
        })
    },
    field: function(can, item, target) { var meta = can.base.Obj(item.meta)
        meta.width = can.Conf("width"), meta.height = can.Conf("height")
        can.onappend._init(can, meta, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, (cmds[0] == "search"? []: ["action", "story", item.type, item.name, item.text]).concat(cmds), cb, true)
            }
        }, can._output, target)
    },
}, ["/plugin/local/wiki/word.css"])
Volcanos("onaction", {help: "控件交互", list: ["演示"],
    "演示": function(event, can) {
        var current = []; var list = []
        can.page.Select(can, can._output, ".story", function(item) {
            switch (item.tagName) {
                case "H1":
                case "H2":
                case "H3":
                    list.push(current = [])
                    break
            }
            current.push(item)
        })

        can.ui && can.page.Remove(can, can.ui.show)
        can.ui = can.page.Append(can, document.body, [{view: "show", style: {
            width: document.body.offsetWidth+"px", height: document.body.offsetHeight+"px",
        },list: [{view: "control", list: [
            {select: [["布局", "播放", "层叠", "网格"], function(event, value) {
                switch (value) {
                    case "播放":
                        can.page.Select(can, can.ui.content, "div.page", function(page, index) {
                            can.page.ClassList.del(can, page, "show")
                            index == 0 && can.page.ClassList.add(can, page, "show")
                            can.page.Modify(can, page, {style: {
                                "position": "absolute",
                                "margin-left": 20, "margin-top": 40,
                                "width": document.body.offsetWidth, "height": document.body.offsetHeight,
                                "overflow": "auto",
                                "float": "none",
                                "border": "",
                            }})
                        })
                        break
                    case "层叠":
                        function show(which) { which = which || 0
                            can.page.Select(can, can.ui.content, "div.page", function(page, index) {
                                can.page.ClassList.add(can, page, "show")
                                can.page.Modify(can, page, {style: {
                                    "position": "absolute",
                                    "margin-left": (which==index||which==page? 100: 40)*(index+1),
                                    "margin-top": (which==index||which==page? 100: 40)*(index+1),
                                    "width": document.body.offsetWidth, "height": document.body.offsetHeight,
                                    "overflow": "auto",
                                    "float": "none",
                                    "border": "solid 2px red",
                                },
                                    onclick: function(event) {
                                        event.target == page && show(page.nextSibling)
                                    },
                                })
                            })
                        }
                        show()
                        break
                    case "网格":
                        can.page.Select(can, can.ui.content, "div.page", function(page, index) {
                            can.page.ClassList.add(can, page, "show")
                            can.page.Modify(can, page, {style: {
                                "border": "solid 2px red",
                                "position": "relative",
                                "margin-left": 0,
                                "margin-top": 0,
                                "width": 200, "height": 200,
                                "overflow": "auto",
                                "float": "left",
                            }})
                        })
                        break
                }
            }]},
            {button: ["首页", function(event) {
                can.page.Select(can, can.ui.content, "div.page.show", function(page) {
                    can.page.ClassList.del(can, page, "show")
                })
                can.page.Select(can, can.ui.content, "div.page", function(page, index) {
                    if (index == 0) {
                        can.page.ClassList.add(can, page, "show")
                    }
                })
            }]},
            {button: ["上一页", function(event) {
                can.page.Select(can, can.ui.content, "div.page.show", function(page) {
                    if (page.previousSibling) {
                        can.page.ClassList.del(can, page, "show")
                        can.page.ClassList.add(can, page.previousSibling, "show")
                    }
                })
            }]},
            {select: [["page"].concat(can.core.List(list, function(item, index) { return index+1 })), function(event, value) {
                can.page.Select(can, can.ui.content, "div.page", function(page, index) {
                    can.page.ClassList.del(can, page, "show")
                    index+1 == parseInt(value) && can.page.ClassList.add(can, page, "show")
                })
            }]},
            {button: ["下一页", function(event) {
                can.page.Select(can, can.ui.content, "div.page.show", function(page) {
                    if (page.nextSibling) {
                        can.page.ClassList.del(can, page, "show")
                        can.page.ClassList.add(can, page.nextSibling, "show")
                    } else {
                        can.ui && can.page.Remove(can, can.ui.show)
                    }
                })
            }]},
            {button: ["结束", function(event) {
                can.ui && can.page.Remove(can, can.ui.show)
            }]},
        ]}, {view: "content", style: {
            width: document.body.offsetWidth+"px", height: document.body.offsetHeight-45+"px",
        }, list: can.core.List(list, function(page, index) {
            return {view: "page "+(index==0?"show": "")+(index==0? " first": ""), style: {
                width: document.body.offsetWidth+"px",
            }, list: can.core.List(page, function(item) {
                switch (item.tagName) {
                    case "FIELDSET":
                        var field = document.createElement("fieldset")
                        can.page.Append(can, field, [
                            {view: ["", "legend"]},
                            {view: ["option", "form"]},
                            {view: ["action", "div"]},
                            {view: ["output", "div"]},
                            {view: ["status", "div"]},
                        ])
                        var meta = can.base.Obj(item.dataset.meta)
                        meta.width = document.body.offsetWidth
                        meta.height = document.body.offsetHeight
                        can.onappend._init(can, meta, Volcanos.meta.libs.concat(["/plugin/state.js"]), function(sub) {
                            sub.run = function(event, cmds, cb, silent) {
                                can.run(event, (cmds[0] == "search"? []: ["action", "story", item.dataset.type, item.dataset.name, item.dataset.text]).concat(cmds), cb, true)
                            }
                        }, can._output, field)
                        return field
                    default:
                        return item.cloneNode(true)
                }
            })}
        })}, ] }])
    },
})
Volcanos("ondetail", {help: "菜单交互", list: [], _init: function(can, msg, list, cb, target) {
}})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) {
}})
