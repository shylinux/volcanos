Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
        can.sublist = {}
    },
    river: function(can) { var key = "river"
        can._main_river = can.user.Search(can, "river") || (can.user.isMobile? "product": "project")
        can._main_storm = can.user.Search(can, "storm") || (can.user.isMobile? "office": "studio")

        can._main_river = can.user.Search(can, "river") || (can.user.isExtension? "product": "project")
        can._main_storm = can.user.Search(can, "storm") || (can.user.isExtension? "chrome": "studio")

        can.run({}, [], function(sup) { can._output.innerHTML = ""; var select; sup.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) { var msg = can.request(event, {_msg: sup})
                // 左键点击
                can.onimport.storm(event, can, value.key)
            }, function(event) {
                // 右键点击
                can.onappend.menu(can, sup, value)
            })

            if (index == 0 || [value.key, value.name].indexOf(can._main_river) > -1) { select = view }
        }); select && select.click(), typeof cb == "function" && cb(sup) })
    },
    storm: function(event, can, river) {
        var list = can.sublist[river]; if (list) { var hide = list.style.display == "none"
            return can.page.Modify(can, list, {style: {display: hide? "": "none"}})
        }

        can.run({}, [river, "storm"], function(msg) { var which = 0
            list = can.page.Append(can, can._output, [{view: "sublist", list: msg.Table(function(value, index) {
                river == can._main_river && value.key == can._main_storm && (which = index)
                return {text: [value.name, "div", "subitem"], onclick: function(event) {
                    // 左键点击
                    var msg = can.request(event)
                    msg.Option("river", can.Conf("river", river))
                    msg.Option("storm", can.Conf("storm", value.key))
                    can.run(event, ["search", "Action.onaction._init"])

                    value.name != "main" && can.user.title(value.name)
                    can.page.Select(can, can._output, "div.subitem.select", function(item) {
                        can.page.ClassList.del(can, item, "select")
                    }), can.page.ClassList.add(can, event.target, "select")
                }, oncontextmenu: function(event) {
                    // 右键点击
                    can.user.carte(can, {}, ["添加工具", "保存", "删除"], function(ev, item, meta) {
                        switch (item) {
                            case "保存":
                                var list = can.page.Select(can, document.body, "fieldset.Action>div.output>fieldset.plugin>form.option", function(item) {
                                    return JSON.stringify(can.page.Select(can, item, 'input[type="text"],select', function(item) {
                                        return item.value||""
                                    }))
                                })

                                can.run(event, [can.Conf("river"), value.key, "storm", "action", "save"].concat(list), function(msg) {
                                    can.user.toast(can, "保存成功", "storm")
                                })
                                break
                            case "删除":
                                can.run(event, [can.Conf("river"), value.key, "storm", "action", "remove"], function(msg) {
                                    can.user.Search(can, {"river": can.Conf("river")})
                                }) || can.ondetail[item](event, can, value)
                                break
                            default:
                                can.ondetail[item](event, can, item)
                        }
                    })
                }}
            })}]).sublist
            which < list.children.length && list.children[which].click()
            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
})
Volcanos("onaction", {help: "控件交互", list: ["创建", "刷新"], _init: function(can, msg, list, cb, target) {
        can.onimport.river(can)
    },
    create: function(can) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {_input: "text", name: "群名", value: "hi"},
            {_input: "text", name: "简介", value: "hello"},
        ], function(event, button, meta, list) {
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
Volcanos("ondetail", {help: "菜单交互", list: ["添加应用", "添加设备", "添加用户", "重命名", "共享", "删除"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    "添加工具": function(event, can, value) {
        can.run(event, ["search", "Search.onimport.select", "command", "", ""], function(list) {
            var args = []; can.core.List(list, function(item) {
                args = args.concat([item[0], item[5], item[4], ""])
            })
            can.run(event, [can.Conf("river"), can.Conf("storm"), "storm", "action", "tool"].concat(args), function(msg) {
                can.user.Search(can, {"river": can.Conf("river"), "storm": can.Conf("storm")})
            })
        })
    },

    "添加应用": function(event, can, river, button) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {_input: "text", name: "名称", value: "hi"},
            {_input: "text", name: "简介", value: "hello"},
        ], function(event, button, meta, list) {
            can.run(event, [can.Conf("river"), "storm", "action", "create"].concat(list), function(msg) {
                can.user.Search(can, {"river": can.Conf("river"), "storm": msg.Result()})
            })
            return true
        })
    },
    "添加设备": function(event, can, value) {
        can.run(event, ["search", "Search.onimport.select", "space", "", ""], function(list) {
            var args = []; can.core.List(list, function(item) {
                args = args.concat([item[4]])
            })
            var toast = can.user.toast(can, "执行中...", "添加设备", 100000)
            can.run(event, [can.Conf("river"), "action", "node"].concat(args), function(msg) {
                toast.Close(), can.user.toast(can, "执行完成...", "添加设备", 1000)
                // can.user.Search(can, {"river": can.Conf("river")})
            })
        })
    },
    "添加用户": function(event, can, river, button) {
        can.run(event, ["search", "Search.onimport.select", "user", "", ""], function(list) {
            var args = []; can.core.List(list, function(item) {
                args = args.concat([item[5]])
            })
            can.run(event, [can.Conf("river"), "action", "user"].concat(args), function(msg) {
                // can.user.Search(can, {"river": can.Conf("river")})
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
Volcanos("onexport", {help: "导出数据", list: []})

