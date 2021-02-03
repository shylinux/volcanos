Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        typeof cb == "function" && cb(msg)
        if (msg.Length() > 0) { return can.onappend.table(can, msg) }

        can.page.Modify(can, target, msg.Result())
        can.page.Select(can, target, ".story", function(item) { var data = item.dataset||{}
            can.core.CallFunc([can.onimport, data.type], [can, data, item])
            can.page.Modify(can, item, {style: can.base.Obj(data.style)})
        })
    },

    premenu: function(can, list, target) { var meta = can.base.Obj(list.meta)
        can.page.Select(can, can._output, "h2.story, h3.story", function(item) {
            can.page.Append(can, target, [{text: [item.innerHTML, "li", item.tagName], onclick: function() {
                item.scrollIntoView()
            }}]), item.onclick = function(event) { target.scrollIntoView() }
        })
    },
    spark: function(can, item, target) {
        if (item["name"] == "inner") {
            target.title = "点击复制", target.onclick = function(event) {
                can.user.copy(event, can, target.innerText)
            }
            return
        }
        can.page.Select(can, target, "span", function(item) {
            item.title = "点击复制", item.onclick = function(event) {
                can.user.copy(event, can, item.innerText)
            }
        })
    },
    field: function(can, item, target) { var meta = can.base.Obj(item.meta)
        meta.width = can.Conf("width"), meta.height = can.Conf("height")
        can.onappend._init(can, meta, ["/plugin/state.js"], function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, (cmds[0] == "search"? []: ["action", "story", item.type, item.name, item.text]).concat(cmds), cb, true)
            }
            delete(target.dataset.meta)
        }, can._output, target)
    },

    table: function(can, list, target) {
        can.page.Select(can, target, "td", function(item) {
            item.title = "点击复制"
            item.onclick = function(event) {
                can.user.copy(event, can, item.innerText)
            }
        })
    },
    iframe: function(can, list, target) { var meta = can.base.Obj(list.meta)
        can.page.Modify(can, target, {width: can.Conf("width")-200})
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
Volcanos("onaction", {help: "控件交互", list: [],
    "演示": function(event, can) {
        var current = [], list = []
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

        can.onappend._init(can, {type: "story word float"}, [], function(sub) {
            sub.run = function(event, cmds, cb) { can.run(event, cmds, cb, true) }
            sub.ui = sub.onlayout.profile(sub)

            sub.onappend._action(sub, [
                ["布局", "开讲", "快闪", "网格", "层叠"],
                "大纲", "首页", "上一页",
                ["菜单"].concat(can.page.Select(can, can._output, "h1,h2,h3", function(item) { return item.innerHTML })),
                "下一页", "隐藏", "结束",
            ], sub._action, {
                "开讲": function(event) { sub.onaction.show(sub, 0) },
                "网格": function(event) { sub.onaction.grid(sub) },
                "快闪": function(event) { sub.onaction.flash(sub) },
                "层叠": function(event) { sub.onaction.spring(sub) },

                "大纲": function(event) { sub.page.Toggle(sub, sub.ui.project) },
                "首页": function(event) { can.onaction.show(can, 0) },

                "上一页": function(event) { can.onaction.prev(can) },
                "菜单": function(event) { can.onaction.prev(can) },
                "下一页": function(event) { can.onaction.next(can) },
                "隐藏": function(event) { can.page.Toggle(can, sub.ui.content) },
                "结束": function(event) { can.page.Remove(can, sub._target) },
            })

            can.page.Select(can, can._output, "h1.story,h2.story,h3.story", function(item) {
                can.onappend.item(can, "item", {name: item.innerHTML}, function(event) {

                }, function(event) {

                }, sub.ui.project)
            })

            can.core.List(list, function(page, index) {
                var items = can.core.List(page, function(item) {
                    switch (item.tagName) {
                        case "FIELDSET":
                            return can.onappend._init(can, can.base.Obj(item.dataset.meta), ["/plugin/state.js"], function(sub) {
                                sub.run = function(event, cmds, cb) {
                                    can.run(event, (cmds[0] == "search"? []: ["action", "story", item.dataset.type, item.dataset.name, item.dataset.text]).concat(cmds), cb, true)
                                }
                            }, sub.ui.content)._target
                        default: return item.cloneNode(true)
                    }
                })

                sub.page.Append(sub, sub.ui.content, {view: "page "+(index==0?"show": "")+(index==0? " first": ""), list: items})
            })
        }, document.body)
    },

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
            can.onmotion.show(can, {value: 10, length: 20}, next, page)
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
            can.onmotion.show(can, {value: 10, length: 20}, next, page)
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
            can.onmotion.show(can, {value: 10, length: 20}, next, page)
        })
    },
})

Volcanos("onfigure", {help: "控件交互", list: [],

})
