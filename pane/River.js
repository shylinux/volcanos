const RIVER = "river", STORM = "storm"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, meta, list, cb, target) {
        can.sublist = {}
    },
    river: function(can) {
        can._main_river = can.user.Search(can, RIVER) || (can.user.isMobile? "product": "project")
        can._main_storm = can.user.Search(can, STORM) || (can.user.isMobile? "office": "studio")

        can._main_river = can.user.Search(can, RIVER) || (can.user.isExtension? "product": "project")
        can._main_storm = can.user.Search(can, STORM) || (can.user.isExtension? "chrome": "studio")

        can.run({}, [], function(sup) {
            can._output.innerHTML = ""; var select;
            sup.Table(function(value, index, array) {
                var view = can.onappend.item(can, can._output, "item", value, function(event, item) { var msg = can.request(event, {_msg: sup})
                    // 左键点击
                    can.onimport.storm(event, can, value.hash)
                }, function(event) {
                    // 右键点击
                    can.onappend.menu(can, sup, value)
                })

                if (index == 0 || [value.hash, value.name].indexOf(can._main_river) > -1) { select = view }
            });
            select && select.click(), typeof cb == "function" && cb(sup)
        })
    },
    storm: function(event, can, river) {
        var list = can.sublist[river]; if (list) { var hide = list.style.display == "none"
            return can.page.Modify(can, list, {style: {display: hide? "": "none"}})
        }

        can.run({}, [river, "tool"], function(msg) { var which = 0
            list = can.page.Append(can, can._output, [{view: "sublist", list: msg.Table(function(storm, index) {
                river == can._main_river && storm.hash == can._main_storm && (which = index)
                return {text: [storm.name, "div", "subitem"], onclick: function(event) {
                    // 左键点击
                    var msg = can.request(event)
                    msg.Option(RIVER, can.Conf(RIVER, river))
                    msg.Option(STORM, can.Conf(STORM, storm.hash))
                    can.run(event, ["search", "Action.onaction._init"])

                    storm.name != "main" && can.user.title(can.user.Search(can, "pod") || storm.name)
                    can.page.Select(can, can._output, "div.subitem.select", function(item) {
                        can.page.ClassList.del(can, item, "select")
                    }), can.page.ClassList.add(can, event.target, "select")
                }, oncontextmenu: function(event) {
                    // 右键点击
                    can.user.carte(can, {}, ["添加工具", "重命名", "保存参数", "共享应用", "删除应用"], function(ev, item, meta) {
                        switch (item) {
                            case "重命名":
                                can.user.input(event, can, ["name"], function(event, button, meta, list) {
                                    var msg = can.request(event); msg.Option("hash", storm.hash)
                                    can.run(event, [river, "tool", "action", "modify", "name", meta.name], function(msg) {
                                        can.user.Search(can, {river: can.Conf(RIVER), storm: can.Conf(STORM)})
                                    })
                                    return true
                                })
                                break
                            default:
                                can.ondetail[item](event, can, item, storm)
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
            can.run(event, ["action", "create"].concat(["type", list[0], "name", list[1], "text", list[2]]), function(msg) {
                can.user.Search(can, {river: msg.Result()})
            })
            return true
        })
    },
    "创建": function(event, can) { can.onaction.create(can) },
    "刷新": function(event, can) { can.user.Search(can, {river: can.Conf(RIVER), storm: can.Conf(STORM)}) },
})
Volcanos("ondetail", {help: "菜单交互", list: ["添加应用", "添加设备", "添加用户", "重命名", "共享群组", "删除群组"], _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
    },
    "添加工具": function(event, can, button, storm) {
        can.run(event, ["search", "Search.onimport.select", "command", "", ""], function(list) {
            can.core.Next(list, function(item, next) {
                can.run({}, [can.Conf(RIVER), "tool", "action", "insert", "hash", can.Conf(STORM)].concat(["pod", item[0], "ctx", item[5], "cmd", item[4]]), function(msg) {
                    next()
                })
            }, function() {
                can.user.Search(can, {river: can.Conf(RIVER), storm: can.Conf(STORM)})
            })
        })
    },
    "保存参数": function(event, can, button, storm) {
        can.core.Next(can.page.Select(can, document.body, "fieldset.Action>div.output>fieldset.plugin>form.option"), function(item, next) {
            var list = can.page.Select(can, item, '.args', function(item) { return item.value||"" })

            var msg = can.request({}); msg.Option("hash", storm.hash), msg.Option("id", item.dataset.id)
            can.run(msg._event, [can.Conf(RIVER), "tool", "action", "modify", "arg", JSON.stringify(list)], function(msg) {
                next()
            })
        }, function() {
            can.user.toast(can, "保存成功", STORM)
        })
    },
    "共享应用": function(event, can, button, storm) {
        can.user.input(event, can, [
            {_input: "text", name: "username", value: "@key=hi"},
            {_input: "text", name: "userrole", value: "@key=void"},
            {_input: "text", name: "title", value: storm.name},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [can.Conf(RIVER), "action", "share",
                "username", meta.username, "userrole", meta.userrole, "title", meta.title, "storm", storm.hash])
            return true
        })
    },
    "删除应用": function(event, can, button, storm) {
        var msg = can.request(event); msg.Option("hash", storm.hash)
        can.run(event, [can.Conf(RIVER), "tool", "action", "remove"], function(msg) {
            can.user.Search(can, {river: can.Conf(RIVER)})
        })
    },

    "添加应用": function(event, can, river, button) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {_input: "text", name: "名称", value: "hi"},
            {_input: "text", name: "简介", value: "hello"},
        ], function(event, button, meta, list) {
            can.run(event, [can.Conf(RIVER), "tool", "action", "create"].concat(["type", list[0], "name", list[1], "text", list[2]]), function(msg) {
                can.user.Search(can, {river: can.Conf(RIVER), storm: msg.Result()})
            })
            return true
        })
    },
    "添加设备": function(event, can, value) {
        can.run(event, ["search", "Search.onimport.select", "space", "", ""], function(list) {
            can.core.Next(list, function(item, next) {
                can.run({}, [can.Conf(RIVER), "node", "action", "insert", "type", item[3], "name", item[4]], function(msg) {
                    // can.user.Search(can, {river: can.Conf(RIVER)})
                    next()
                })
            }, function() {
            })
        })
    },
    "添加用户": function(event, can, river, button) {
        can.run(event, ["search", "Search.onimport.select", "user", "", ""], function(list) {
            can.core.Next(list, function(item, next) {
                can.run({}, [can.Conf(RIVER), "user", "action", "insert", "username", item[5]], function(msg) {
                    // can.user.Search(can, {river: can.Conf(RIVER)})
                    next()
                })
            }, function() {
            })
        })
    },
    "重命名": function(event, can, river, button) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event); msg.Option("hash", river.hash)
            can.run(event, ["action", "modify", "name", meta.name], function(msg) {
                can.user.Search(can, {river: can.Conf(RIVER)})
            })
            return true
        })
    },
    "共享群组": function(event, can, value) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event)
            msg.Option()
            can.user.share(can, msg, [value.hash, "action", "share", "name", meta.name])
            return true
        })

    },
    "删除群组": function(event, can, river, button) {
        can.run(event, ["remove", "hash", river.hash], function(msg) {
            can.user.Search(can, {})
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})

