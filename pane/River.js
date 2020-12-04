const RIVER = "river", STORM = "storm"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._main_river = can.user.Search(can, RIVER) || (can.user.isExtension || can.user.isMobile? "product": "project")
        can._main_storm = can.user.Search(can, STORM) || (can.user.isExtension || can.user.isMobile? "office": "studio")

        can._output.innerHTML = "", can.sublist = {}

        var select; msg.Table(function(value, index, array) {
            var view = can.onappend.item(can, can._output, "item", value, function(event, item) {
                // 左键点击
                can.onimport.storm(event, can, value.hash)
            }, function(event) {
                // 右键点击
                can.onappend.menu(can, msg, value)
            })

            if (index == 0 || [value.hash, value.name].indexOf(can._main_river) > -1) { select = view }
        }), select && select.click()

        typeof cb == "function" && cb(msg)
    },
    storm: function(event, can, river) {
        var list = can.sublist[river]; if (list) {
            return can.page.Modify(can, list, {style: {display: list.style.display == "none"? "": "none"}})
        }

        can.run({}, [river, "tool"], function(msg) {
            var select = 0; list = can.page.Append(can, can._output, [{view: "sublist", list: msg.Table(function(storm, index) {
                river == can._main_river && storm.hash == can._main_storm && (select = index)

                return {text: [storm.name, "div", "subitem"], onclick: function(event) {
                    // 左键点击
                    can.onimport.action(event, can, river, storm.hash)
                    storm.name != "main" && can.user.title(can.user.Search(can, "pod") || storm.name)
                }, oncontextmenu: function(event) {
                    // 右键点击
                    can.user.carte(can, {}, ["添加工具", "保存参数", "重命名应用", "删除应用"], function(ev, item, meta) {
                        can.ondetail[item](event, can, item, storm)
                    })
                }}
            }) }]).sublist, select < list.children.length && list.children[select].click()

            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
    action: function(event, can, river, storm) {
        var msg = can.request(event)
        msg.Option(RIVER, can.Conf(RIVER, river))
        msg.Option(STORM, can.Conf(STORM, storm))
        can.run(event, ["search", "Action.onaction._init"])

        can.page.Select(can, can._output, "div.subitem.select", function(item) {
            can.page.ClassList.del(can, item, "select")
        }), can.page.ClassList.add(can, event.target, "select")
    },
})
Volcanos("onaction", {help: "控件交互", list: ["创建", "刷新"], _init: function(can, msg, list, cb, target) {
        can.run({}, [], function(msg) {
            can.onimport._init(can, msg, list, cb, target)
        })
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
Volcanos("ondetail", {help: "菜单交互", list: ["添加用户", "添加设备", "添加应用", "重命名群组", "删除群组"],
    "添加用户": function(event, can, river, button) {
        can.run(event, ["search", "Search.onimport.select", "user", "", ""], function(list) {
            can.core.Next(list, function(item, next) {
                can.run({}, [can.Conf(RIVER), "user", "action", "insert", "username", item[5]], function(msg) {
                    next()
                })
            }, function() {
                can.user.toast(can, "添加成功")
            })
        })
    },
    "添加设备": function(event, can, value) {
        can.run(event, ["search", "Search.onimport.select", "space", "", ""], function(list) {
            can.core.Next(list, function(item, next) {
                can.run({}, [can.Conf(RIVER), "node", "action", "insert", "type", item[3], "name", item[4]], function(msg) {
                    next()
                })
            }, function() {
                can.user.toast(can, "添加成功")
            })
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
        })
    },
    "重命名群组": function(event, can, river, button) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event); msg.Option("hash", river.hash)
            can.run(event, ["action", "modify", "name", meta.name], function(msg) {
                can.user.Search(can, {river: can.Conf(RIVER)})
            })
        })
    },
    "删除群组": function(event, can, river, button) {
        can.run(event, ["remove", "hash", river.hash], function(msg) {
            can.user.Search(can, {})
        })
    },

    "添加工具": function(event, can, button, storm) {
        can.run(event, ["search", "Search.onimport.select", "command", "", ""], function(list) {
            can.core.Next(list, function(item, next) {
                can.run({}, [can.Conf(RIVER), "tool", "action", "insert", "hash", can.Conf(STORM)].concat(["pod", item[0], "ctx", item[5], "cmd", item[4]]), function(msg) {
                    next()
                })
            }, function() {
                // can.user.Search(can, {river: can.Conf(RIVER), storm: can.Conf(STORM)})
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
    "重命名应用": function(event, can, button, storm) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event); msg.Option("hash", storm.hash)
            can.run(event, [can.Conf(RIVER), "tool", "action", "modify", "name", meta.name], function(msg) {
                can.user.Search(can, {river: can.Conf(RIVER), storm: can.Conf(STORM)})
            })
        })
    },
    "删除应用": function(event, can, button, storm) {
        var msg = can.request(event); msg.Option("hash", storm.hash)
        can.run(event, [can.Conf(RIVER), "tool", "action", "remove"], function(msg) {
            can.user.Search(can, {river: can.Conf(RIVER)})
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
    "共享群组": function(event, can, value) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event)
            msg.Option()
            can.user.share(can, msg, [value.hash, "action", "share", "name", meta.name])
            return true
        })

    },
})
Volcanos("onexport", {help: "导出数据", list: []})

