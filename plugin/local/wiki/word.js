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
    iframe: function(can, list, target) { var meta = can.base.Obj(list.meta)
        can.page.Modify(can, target, {width: can.Conf("width")-200})
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

    keydown: function(event, can, key) {
        switch (key) {
            case "g":
                can.ui["布局"].value = "网格"
                can.onaction.grid(can)
                break
            case "f":
                can.ui["布局"].value = "快闪"
                can.onaction.flash(can)
                break
            case "s":
                can.ui["布局"].value = "层叠"
                can.onaction.spring(can)
                break
            case "n":
            case "j":
            case "ArrowRight":
                can.onaction.next(can)
                break
            case "k":
            case "p":
            case "ArrowLeft":
                can.onaction.prev(can)
                break
            case "t":
                can.page.Toggle(can, can.ui.content)
                break
            case "q":
                can.ui && can.page.Remove(can, can.ui.show)
        }
    },
}, ["/plugin/local/wiki/word.css"])
Volcanos("onaction", {help: "控件交互", list: ["演示"],
    show: function(can, which) {
        can.page.Select(can, can.ui.content, "div.page.show", function(page) {
            can.page.ClassList.del(can, page, "show")
        })
        can.page.Select(can, can.ui.content, "div.page", function(page, index) {
            index == which && can.page.ClassList.add(can, page, "show"), can.page.Modify(can, page, {style: {
                "position": "absolute", "float": "none",
                "margin-left": 20, "margin-top": 40,
                "width": document.body.offsetWidth, "height": document.body.offsetHeight,
                "overflow": "auto",
                "border": "",
            }, })
        })
        can.page.Select(can, can.ui.content, "h1,h2,h3", function(item) {
            item.innerHTML == which && can.page.ClassList.add(can, item.parentNode, "show")
        })
    },
    next: function(can) {
        can.page.Select(can, can.ui.content, "div.page.show", function(page) {
            if (page.nextSibling) {
                can.page.ClassList.del(can, page, "show")
                can.page.ClassList.add(can, page.nextSibling, "show")
                can.page.Select(can, page.nextSibling, "h2,h3", function(item) {
                    can.ui.menu.value = item.innerHTML
                })
            } else {
                can.user.toast(can, "end")
            }
        })
    },
    prev: function(can) {
        can.page.Select(can, can.ui.content, "div.page.show", function(page) {
            if (page.previousSibling) {
                can.page.ClassList.del(can, page, "show")
                can.page.ClassList.add(can, page.previousSibling, "show")
                can.page.Select(can, page.nextSibling, "h2,h3", function(item) {
                    can.ui.menu.value = item.innerHTML
                })
            } else {
                can.user.toast(can, "end")
            }
        })
    },
    grid: function(can) {
        can.page.Select(can, can.ui.content, "div.page.show", function(page) {
            can.page.ClassList.del(can, page, "show")
        })
        can.core.Next(can.page.Select(can, can.ui.content, "div.page"), function(page, next, index) {
            can.page.ClassList.add(can, page, "show"), can.page.Modify(can, page, {style: {
                "position": "relative", "float": "left",
                "margin-left": 0, "margin-top": 0,
                "width": 200, "height": 200,
                "border": "solid 2px red",
                "overflow": "auto",
            }, onclick: function(event) {
                page.style.position == "absolute"? can.page.Modify(can, page, {style: {
                    "position": "relative", "float": "left",
                    "margin-left": 0, "margin-top": 0,
                    "width": 200, "height": 200,
                    "border": "solid 2px red",
                    "overflow": "auto",
                    "z-index": 0,
                }}): can.page.Modify(can, page, {style: {
                    "position": "absolute", "float": "none",
                    "margin-left": 20, "margin-top": 40,
                    "width": document.body.offsetWidth, "height": document.body.offsetHeight,
                    "overflow": "auto",
                    "border": "",
                    "z-index": 10,
                }})
            }, })
            can.onmotion.show(can, page, {value: 10, length: 20}, next)
        })
    },
    flash: function(can) {
        can.page.Select(can, can.ui.content, "div.page.show", function(page) {
            can.page.ClassList.del(can, page, "show")
        })
        can.core.Next(can.page.Select(can, can.ui.content, "div.page"), function(page, next, index) {
            can.page.ClassList.add(can, page, "show"), can.page.Modify(can, page, {style: {
                "position": "absolute", "float": "none",
                "margin-left": 20, "margin-top": 40,
                "width": document.body.offsetWidth, "height": document.body.offsetHeight,
                "border": "none",
                "overflow": "auto",
            }, ondblclick: function(event) {
                can.onaction.show(can, index)
                can.ui["布局"].value = "开讲"
            }, onclick: function(event) {
                can.onaction.show(can, index)
                can.ui["布局"].value = "开讲"
            }, })
            can.onmotion.show(can, page, {value: 10, length: 20}, next)
        })
    },
    spring: function(can) {
        can.page.Select(can, can.ui.content, "div.page.show", function(page) {
            can.page.ClassList.del(can, page, "show")
        })
        can.core.Next(can.page.Select(can, can.ui.content, "div.page"), function(page, next, index) {
            can.page.ClassList.add(can, page, "show"), can.page.Modify(can, page, {style: {
                "position": "absolute", "float": "none",
                "margin-left": 10*(index+1), "margin-top": 60*(index+1),
                "height": document.body.offsetHeight,
                "width": document.body.offsetWidth,
                "border": "solid 2px red",
                "overflow": "auto",
            }, onclick: function(event) {
                page.style["margin-left"] == "0px"? can.page.Modify(can, page, {style: {
                    "margin-left": 10*(index+1), "margin-top": 60*(index+1),
                    "z-index": 0,
                }}): can.page.Modify(can, page, {style: {
                    "margin-left": 0, "margin-top": 60*(index+1),
                    "z-index": 10,
                }})
            }, })
            can.onmotion.show(can, page, {value: 10, length: 20}, next)
        })
    },

    "演示": function(event, can) {
        can.onkeypop.action = can
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

        },list: [{view: "control", list: [
            {select: [["布局", "开讲", "快闪", "网格", "层叠"], function(event, value) {
                switch (value) {
                    case "开讲":
                        can.onaction.show(can, 0)
                        break
                    case "网格":
                        can.onaction.grid(can)
                        break
                    case "快闪":
                        can.onaction.flash(can)
                        break
                    case "层叠":
                        can.onaction.spring(can)
                        break
                }
            }]},
            {button: ["大纲", function(event) {
                can.page.Toggle(can, can.ui.project)
            }]},
            {button: ["首页", function(event) {
                can.onaction.show(can, 0)
                can.onkeypop.action = can
            }]},
            {button: ["上一页", function(event) {
                can.onaction.prev(can)
                can.onkeypop.action = can
            }]},
            {select: [["menu"].concat(can.page.Select(can, can._output, "h1,h2,h3", function(item) { return item.innerHTML })), function(event, value) {
                can.onaction.show(can, value)
                can.onkeypop.action = can
            }]},
            {button: ["下一页", function(event) {
                can.onaction.next(can)
                can.onkeypop.action = can
            }]},
            {button: ["隐藏", function(event) {
                can.page.Toggle(can, can.ui.content)
                can.onkeypop.action = can
            }]},
            {button: ["结束", function(event) {
                can.ui && can.page.Remove(can, can.ui.show)
            }]},
        ]}, {view: "project", style: {display: "none"}, list: can.page.Select(can, can._output, "h1.story,h2.story,h3.story", function(item) {
            return {text: [item.innerHTML, "div", "item"], onclick: function(event) {
                can.onaction.show(can, item.innerHTML)
            }}
        })}, {view: "content", style: {
            width: document.body.offsetWidth-40+"px", height: document.body.offsetHeight-25+"px",
        }, list: can.core.List(list, function(page, index) {
            return {view: "page "+(index==0?"show": "")+(index==0? " first": ""), style: {
                width: document.body.offsetWidth-40+"px",
            }, list: can.core.List(page, function(item) {
                switch (item.tagName) {
                    case "FIELDSET":
                        var field = document.createElement("fieldset"); can.page.Append(can, field, [
                            {view: ["", "legend"]},
                            {view: ["option", "form"]},
                            {view: ["action", "div"]},
                            {view: ["output", "div"]},
                            {view: ["status", "div"]},
                        ])
                        var meta = can.base.Obj(item.dataset.meta)
                        meta.width = document.body.offsetWidth, meta.height = document.body.offsetHeight
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
