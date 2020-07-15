Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
        can.sublist = {}
    },
    storm: function(event, can, river) {
        var list = can.sublist[river]; if (list) { var hide = list.style.display == "none"
            return can.page.Modify(can, list, {style: {display: hide? "": "none"}})
        }

        can.run(event, [river], function(msg) { var which = 0
            list = can.page.Append(can, can._output, [{view: "sublist", list: msg.Table(function(value, index) {
                river == can.user.Search(can, "river") && value.name == can.user.Search(can, "storm") && (which = index)
                return {text: [value.name, "div", "subitem"], onclick: function(event) {
                    var msg = can.request(event)
                    msg.Option("river", can.Conf("river", river))
                    msg.Option("storm", can.Conf("storm", value.key))
                    can.run(event, ["search", "Action.onaction._init"])

                    can.page.Select(can, can._output, "div.subitem.select", function(item) {
                        can.page.ClassList.del(can, item, "select")
                    })
                    can.page.ClassList.add(can, event.target, "select")
                }}
            })}]).sublist
            list.children[which].click()
            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
})
Volcanos("onaction", {help: "控件交互", list: ["创建", "刷新"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    create: function(can) {
        can.user.input(event, can, [["type", "public", "protected", "private"], "name", "text"], function(event, button, meta, list) {
            can.run(event, ["action", "create"].concat(list), function(msg) {
                can.user.Search(can, {"river": msg.Result()})
            })
            return true
        })
    },
    "创建": function(event, can) {
        can.onaction.create(can)
    },
    "刷新": function(event, can) {
        can.user.Search(can, {"river": can.Conf("river")})
    },
})
Volcanos("ondetail", {help: "菜单交互", list: ["添加用户", "重命名", "共享", "删除"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    _show: function(event, can) {

    },
    "添加用户": function(event, can, river, button) {
        can.run(event, ["search", "Search.onimport.select", "user", "", ""], function(list) {
            var args = []; can.core.List(list, function(item) {
                args = args.concat([item[4]])
            })
            can.run(event, [can.Conf("river"), "action", "user"].concat(args), function(msg) {
                can.user.Search(can, {"river": can.Conf("river")})
            })
        })
    },
    "重命名": function(event, can, river, button) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            can.run(event, [river.key, "action", "rename", meta.name], function(msg) {
                can.user.Search(can, {"river": can.Conf("river")})
            })
            return true
        })
    },
    "共享": function(event, can, value) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [value.key, "action", "share", meta.name])
            return true
        })

    },
    "删除": function(event, can, river, button) {
        can.run(event, [river.key, "action", "remove"], function(msg) {
            can.user.Search(can, {})
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [], _init: function(can, msg, list, cb, target) { var key = "river"
        can.run({}, [], function(sup) { can._output.innerHTML = ""; var select; sup.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) { var msg = can.request(event, {_msg: sup})
                can.onimport.storm(event, can, value.key)
                return
                // 左键点击
                msg.Option(key, can.Conf(key, value.key)), can.run(event, ["search", "Storm.onaction._init"])
            }, function(event) {
                // 右键点击
                can.onappend.menu(can, msg, value)
            })

            if (index == 0 || [value.key, value.name].indexOf(can.user.Search(can, key)) > -1) { select = view }
        }); select && select.click(), typeof cb == "function" && cb(sup) })
    },
    key: function(can, msg) {
        msg.Option("river", can.Conf("river"))
        msg.Option("storm", can.Conf("storm"))
    },
})

