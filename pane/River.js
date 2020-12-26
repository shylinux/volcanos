(function() { const RIVER = "river", STORM = "storm", POD = "pod"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._main_river = can.user.Search(can, RIVER) || (can.user.isMobile||can.user.isExtension? "product": "project")
        can._main_storm = can.user.Search(can, STORM) || (can.user.isMobile||can.user.isExtension? "office": "studio")

        can.run({}, ["search", "Header.onimport.menu", ["群组", "添加用户", "添加设备", "添加应用"], ["应用", "添加工具"]], function(event, item) {
            var cb = can.ondetail[item]; typeof cb == "function" && cb(event, can, item, can.Conf(RIVER), can.Conf(STORM))
        })

        can.onmotion.clear(can), can.sublist = {}
        var select; msg.Table(function(value, index, array) {
            var view = can.onappend.item(can, target, "item", value, function(event, item) {
                // 左键点击
                can.onaction.storm(event, can, value.hash)
            }, function(event) {
                // 右键点击
                var ui = can.user.carte(event, can, can.ondetail, can.ondetail.list, function(ev, item, meta) {
                    can.ondetail[item](event, can, item, value.hash)
                }); can.page.Modify(can, ui.first, {style: {left: can._target.offsetWidth}})
            })

            if (index == 0 || [value.hash, value.name].indexOf(can._main_river) > -1) { select = view }
        }), select && select.click()

        typeof cb == "function" && cb(msg)
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], engine: function(event, can, msg, pane, cmds, cb) {
        cmds.length == 0 && can.core.Item(can.onengine.river, function(key, value) {
            msg.Push({hash: key, name: value.name})
        }); if (cmds.length != 1 && cmds[1] != "tool") { return false }

        var river = can.onengine.river[cmds[0]]; if (!river) { return false }
        can.core.Item(river.storm, function(key, value) {
            msg.Push({hash: key, name: value.name})
        }), typeof cb == "function" && cb(msg); return true
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, msg, list, cb, target) {
        can.run({}, [], function(msg) {
            can.onimport._init(can, msg, list, cb, can._output)
        })
    },
    storm: function(event, can, river) {
        var list = can.sublist[river]; if (list) { return can.page.Toggle(can, list) }

        can.run({}, [river, "tool"], function(msg) {
            var select = 0; list = can.page.Append(can, can._output, [{view: "list", list: msg.Table(function(storm, index) {
                river == can._main_river && storm.hash == can._main_storm && (select = index)

                return {text: [storm.name, "div", "item"], onclick: function(event) {
                    // 左键点击
                    can.onaction.action(event, can, river, storm.hash)
                    can.user.title(can.user.Search(can, POD) || storm.name)
                }, oncontextmenu: function(event) {
                    can.onaction.action(event, can, river, storm.hash)
                    can.user.title(can.user.Search(can, POD) || storm.name)
                    // 右键点击
                    var ui = can.user.carte(event, can, can.ondetail, ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"], function(ev, item, meta) {
                        can.ondetail[item](event, can, item, storm.hash, river)
                    }); can.page.Modify(can, ui.first, {style: {left: can._target.offsetWidth}})
                }}
            }) }]).first, list.children.length > 0 && list.children[select].click()

            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
    action: function(event, can, river, storm) {
        var msg = can.request(event, {river: can.Conf(RIVER, river), storm: can.Conf(STORM, storm)})
        can.onengine.trigger(can, msg, "storm.select")

        can.page.Select(can, can._output, "div.item.select", function(item) {
            can.page.ClassList.del(can, item, "select")
        }), can.page.ClassList.add(can, event.target, "select")
    },
    create: function(event, can) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {_input: "text", name: "群名", value: "hi"},
            {_input: "text", name: "简介", value: "hello"},
        ], function(event, button, meta, list) {
            can.run(event, ["action", "create"].concat(["type", list[0], "name", list[1], "text", list[2]]), function(msg) {
                can.user.Search(can, {river: msg.Result()})
            })
        })
    },

    "创建": function(event, can) { can.onaction.create(event, can) },
    "刷新": function(event, can) { can.user.Search(can, {river: can.Conf(RIVER), storm: can.Conf(STORM)}) },
})
Volcanos("ondetail", {help: "菜单交互", list: ["共享群组", "添加用户", "添加设备", "添加应用", "重命名群组", "删除群组"],
    "共享群组": function(event, can, button, river) {
        can.user.input(event, can, [
            {_input: "text", name: "name", value: river},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [river, "action", "share", "type", "river", "name", meta.name])
            return true
        })
    },
    "添加用户": function(event, can, button, river) {
        can.user.select(event, can, "user", "pod,name,text", function(item, next) {
            can.run({}, [river, "user", "action", "insert", "username", item[2]], function(msg) {
                next()
            })
        })
    },
    "添加设备": function(event, can, button, river) {
        can.user.select(event, can, "space", "pod,type,name,text", function(item, next) {
            can.run({}, [river, "node", "action", "insert", "type", item[1], "name", item[2]], function(msg) {
                next()
            })
        })
    },
    "添加应用": function(event, can, button, river) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {_input: "text", name: "名称", value: "hi"},
            {_input: "text", name: "简介", value: "hello"},
        ], function(event, button, meta, list) {
            can.run({}, [river, "tool", "action", "create"].concat(["type", list[0], "name", list[1], "text", list[2]]), function(msg) {
                can.user.Search(can, {river: river, storm: msg.Result()})
            })
        })
    },
    "重命名群组": function(event, can, button, river) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event, {hash: river})
            can.run(event, ["action", "modify", "name", meta.name], function(msg) {
                can.user.Search(can, {river: river})
            })
        })
    },
    "删除群组": function(event, can, button, river) {
        can.run(event, ["remove", "hash", river], function(msg) {
            can.user.Search(can, {})
        })
    },

    "共享应用": function(event, can, button, storm, river) {
        can.user.input(event, can, [
            {_input: "text", name: "name", value: storm},
            {_input: "text", name: "username", value: "@key=hi"},
            {_input: "text", name: "userrole", value: "@key=void"},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [river, "action", "share", "type", "storm", "name", meta.name,
                "storm", storm, "username", meta.username, "userrole", meta.userrole,
            ])
            return true
        })
    },
    "添加工具": function(event, can, button, storm, river) {
        can.user.select(event, can, "command", "pod,name,text", function(item, next) {
            can.run({}, [river, "tool", "action", "insert", "hash", storm].concat(["pod", item[0], "ctx", item[2], "cmd", item[1]]), function(msg) {
                next()
            })
        }, function() {
            can.user.Search(can, {river: river, storm: storm})
        })
    },
    "保存参数": function(event, can, button, storm, river) {
        can.run(event, ["search", "Action.onexport.args"], function(item, next) {
            var msg = can.request({}, {hash: storm, id: item.dataset.id})
            can.run({}, [river, "tool", "action", "modify", "arg", item.dataset.args], function(msg) {
                next()
            })
        })
    },
    "重命名应用": function(event, can, button, storm, river) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event, {hash: storm})
            can.run(event, [river, "tool", "action", "modify", "name", meta.name], function(msg) {
                can.user.Search(can, {river: river, storm: storm})
            })
        })
    },
    "删除应用": function(event, can, button, storm, river) {
        var msg = can.request(event, {hash: storm})
        can.run(event, [river, "tool", "action", "remove"], function(msg) {
            can.user.Search(can, {river: river})
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: []})
})()
