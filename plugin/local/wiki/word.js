Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
        if (msg.Length() > 0) { return can.onappend.table(can, msg) }

        can.page.Modify(can, target, msg.Result())
        can.page.Select(can, target, ".story", function(item) { var data = item.dataset||{}
            can.core.CallFunc([can.onimport, data.type], [can, data, item])
            can.page.Modify(can, item, {style: can.base.Obj(data.style)})
            // delete(data.meta)
        })

        if (can.user.mod.isCmd) {
            can.page.ClassList.add(can, can._fields, "cmd")
            can.page.Modify(can, can.sup._navmenu, {style: {height: window.innerHeight}})
            if (can.sup._navmenu) {
                can.Conf("width", can.Conf("width")-can.sup._navmenu.offsetWidth-10)
                can.page.Modify(can, can._output, {style: {"max-width": can.Conf("width")}})
                can.page.Modify(can, can._output, {style: {height: window.innerHeight}})
            }
        } else {
            if (can.sup._navmenu) {
                can.Conf("width", can.Conf("width")-can.sup._navmenu.offsetWidth-20)
                can.page.Modify(can, can.sup._navmenu, {style: {height: window.innerHeight-240}})
                can.page.Modify(can, can._output, {style: {height: window.innerHeight-240}})
            }
        }
    },
    navmenu: function(can, data, target) { var nav = can.sup._navmenu
        nav = nav || can.page.Append(can, can._fields, [{view: "navmenu"}]).first
        can.sup._navmenu = nav, can._fields.insertBefore(nav, can._output)
        can.onmotion.clear(can, nav)
        can.page.Modify(can, can._output, {style: {float: "left", clear: "none"}})

        can.onappend.list(can, can.base.Obj(data.data), function(event, item) {
            var link = item.meta.link, cmd = link.split(ice.PS).pop()

            can.onmotion.select(can, nav, "div.item", event.target)
            if (can.onaction[cmd]) { return can.onaction[cmd](event, can) }
            if (!link || link == can.Option("path")) { return }

            can.page.Cache(can.Option("path"), can._output, "some")
            can.Option("path", link)
            var some = can.page.Cache(can.Option("path"), can._output)
            can.user.title(item.meta.name)

            if (!some) { can.sup.Update(event, [link]) }
            return true
        }, nav)
    },

    premenu: function(can, data, target) {
        can.page.Select(can, can._output, "h2.story, h3.story", function(item) {
            can.page.Append(can, target, [{text: [item.innerHTML, "li", item.tagName], onclick: function() {
                item.scrollIntoView()
            }}])
            item.onclick = function(event) { target.scrollIntoView() }
        })
    },
    title: function(can, data, target) {
        can.user.mod.isCmd && can.user.title(data.text)
    },
    spark: function(can, data, target) {
        if (data["name"] == "inner") {
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
      can.page.Select(can, target, "a", function(item) {
        can.page.Modify(can, item, {target: "_blank"})
        if (item.innerText == "") {
          item.innerText = item.href
        }
      })
    },
    table: function(can, data, target) {
        can.page.OrderTable(can, target)
        can.page.ClassList.add(can, target, "content")
        can.page.Select(can, target, "td", function(item) {
            item.title = "点击复制", item.onclick = function(event) {
                can.user.copy(event, can, item.innerText)
            }
        })
    },
    json: function(can, data, target) {
        can.page.Select(can, target, "span.toggle", function(item) {
            item.onclick = function(event) { can.onmotion.toggle(can, item.nextSibling) }
        })
        can.page.Select(can, target, "span.value", function(item) {
            item.onclick = function(event) { can.user.copy(event, can, item.innerText) }
        })
    },
    field: function(can, data, target) { var item = can.base.Obj(data.meta)
        item.width = parseInt(can.Conf("width")||window.innerWidth-20), item.height = parseInt(can.Conf("height")||window.innerHeight)
        item.type = chat.PLUGIN
        can.onappend._init(can, item, ["/plugin/state.js"], function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, can.misc.concat([ctx.ACTION, "story", data.type, data.name, data.text], cmds), cb, true)
            }

            sub.Conf("width", item.width=can.Conf("width")-20)
            can.onengine.listen(can, "onaction_resize", function(width, height) {
                can.page.Modify(can, sub._output, {style: {"max-width": sub.Conf("width", item.width=width-80)}})
            })
            if (can.core.Value(item, "auto.cmd")) {
                can.core.Timer(100, function() {
                    var msg = sub.request({}, can.core.Value(item, "opts")); msg.Option("_handle", "true")
                    sub.Update(msg._event, [ctx.ACTION, can.core.Value(item, "auto.cmd")])
                })
            }
        }, can._output, target)
    },
    chart: function(can, data, target) {
        target.oncontextmenu = function(event) {
            var ui = can.user.carte(event, can, {"导出": function(event, can, button) {
                can.user.toPNG(can, "hi.png", target.outerHTML, parseInt(target.getAttribute(html.HEIGHT)), parseInt(target.getAttribute(html.WIDTH)))
            }}, ["导出"])
            can.page.Modify(can, ui._target, {style: {left: event.clientX, top: event.clientY}})
        }
    },

    iframe: function(can, data, target) { var meta = can.base.Obj(data.meta)
        can.page.Modify(can, target, {width: can.Conf("width")-200})
    },
}, ["/plugin/local/wiki/word.css"])
Volcanos("onkeypop", {help: "键盘交互", list: [],
    _mode: {
        normal: {
            "n": function(event, can) { can.onaction.next(can.sub) },
            "j": function(event, can) { can.onaction.next(can.sub) },
            "ArrowRight": function(event, can) { can.onaction.next(can.sub) },
            "ArrowLeft": function(event, can) { can.onaction.prev(can.sub) },
            "k": function(event, can) { can.onaction.prev(can.sub) },
            "p": function(event, can) { can.onaction.prev(can.sub) },

            "q": function(event, can) { can.onaction["结束"](event, can.sub) },
            "h": function(event, can) { can.onaction["隐藏"](event, can.sub) },
        },
    }, _engine: {},
})
Volcanos("onaction", {help: "控件交互", list: [],
    home: function(event, can) {
        location.href = ice.PS
    },

    show: function(event, can) { var list = [], current = []
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

        can.onappend._init(can, {type: "story word float"}, [], function(sub) { sub.sup = can
            can.page.Modify(can, sub._target, {style: {"background": document.body.style.background}})
            can.onappend._action(sub, [
                ["布局", "开讲", "快闪", "网格"],
                "大纲", "首页", "上一页",
                ["菜单"].concat(can.core.List(list, function(page) { return page[0].innerHTML })),
                "下一页", "隐藏", "结束",
            ], sub._action, can.onaction)

            can.sub = sub, can.onkeypop._build(can)
            can.onengine.signal(can, "keymap.focus", can.request(event, {cb: function(event) {
                can.keylist = can.onkeypop._parse(event, can, "normal", can.keylist)
            }}))

            sub.onappend._status(sub, ["page", "from", "cost"])
            sub.list = list
            sub.page.Modify(sub, sub._output, {style: {"width": window.innerWidth-40}})
            sub.page.Modify(sub, sub._output, {style: {"height": window.innerHeight-93}})
            sub.ui = sub.page.Append(sub, sub._output, [{view: "project"}, {view: "content"}])
            can.core.List(list, function(page, index) {
                can.onappend.item(can, "item", {name: page[0].innerHTML}, function(event) {
                    can.onaction.show(sub, index) 
                }, function(event) {}, sub.ui.project)

                sub.page.Append(sub, sub.ui.content, [{view: "page"+(index==0? " first": ""), list: can.core.List(page, function(item) { var data = item.dataset||{}
                    switch (data.type) {
                        case "premenu": item = item.cloneNode(false); break
                        case "field": item = can.onappend.field(can, "story", can.base.Obj(data.meta), sub.ui.content).first; break
                        default: item = item.cloneNode(true)
                    }
                    return can.core.CallFunc([can.onimport, data.type], [can, data, item]), item
                }), }])
            }), can.onmotion.hidden(can, sub.ui.project)
            can.onaction.show(sub, 0) 

            sub.Status("from", can.base.Time(null, "%H:%M:%S"))
            var from = new Date(); can.core.Timer({interval: 100}, function() { var now = new Date()
                sub.Status("cost", can.base.Duration(now-from))
            })
        }, document.body)
    },

    "开讲": function(event, can) { can.sup.onaction.show(can, 0) },
    "快闪": function(event, can) { can.sup.onaction.flash(can) },
    "网格": function(event, can) { can.sup.onaction.grid(can) },

    "大纲": function(event, can) { can.onmotion.toggle(can, can.ui.project) },
    "首页": function(event, can) { can.sup.onaction.show(can, 0) },
    "上一页": function(event, can) { can.sup.onaction.prev(can, can.ui.content) },
    "菜单": function(event, can) { can.sup.onaction.show(can, event.target.selectedIndex) },
    "下一页": function(event, can) { can.sup.onaction.next(can, can.ui.content) },
    "隐藏": function(event, can) { can.onmotion.toggle(can, can._output) },
    "结束": function(event, can) { can.page.Remove(can, can._target)
        can.onengine.signal(can, "keymap.focus", can.request(event, {cb: null}))
    },

    show: function(sub, which) { sub.page.Modify(sub, sub.ui.content, {className: "content"})
        sub.page.Select(sub, sub.ui.content, "div.page", function(page, index) {
            if (index == which || page == which) {
                sub.page.Select(sub, page, "h1,h2,h3", function(item) { sub.Action("菜单", item.innerHTML) })
                sub.onmotion.select(sub, sub.ui.project, "div.item", index)
                sub.page.ClassList.add(sub, page, "select")
                sub.Status("page", index+1+ice.PS+sub.list.length)
            } else {
                sub.page.ClassList.del(sub, page, "select")
            }
        })
    },
    next: function(sub) {
        sub.page.Select(sub, sub.ui.content, "div.page.select", function(page) {
            page.nextSibling? sub.sup.onaction.show(sub, page.nextSibling):
                sub.user.toast(sub, "end")
        })
    },
    prev: function(sub) {
        sub.page.Select(sub, sub.ui.content, "div.page.select", function(page) {
            page.previousSibling? sub.sup.onaction.show(sub, page.previousSibling):
                sub.user.toast(sub, "end")
        })
    },
    flash: function(sub) {
        sub.core.Next(sub.page.Select(sub, sub.ui.content, "div.page"), function(page, next) {
            sub.core.Timer(500, function() { next() })
            sub.sup.onaction.show(sub, page)
        })
    },
    grid: function(sub) { sub.page.Modify(sub, sub.ui.content, {className: "content grid"}) },
})
Volcanos("ondetail", {help: "交互操作", list: ["删除"], _init: function(can, msg, list, cb, target) {
    },
    "删除": function(event, sub) {
        sub.page.Remove(sub, sub._target)
    },
})

