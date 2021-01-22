Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can._main_river = can.user.Search(can, "river") || (can.user.isMobile||can.user.isExtension? "product": "project")
        can._main_storm = can.user.Search(can, "storm") || (can.user.isMobile? "office": can.user.isExtension? "chrome": "studio")

        can.onmotion.clear(can), can.sublist = {}
        var select; msg.Table(function(value, index, array) {
            var view = can.onappend.item(can, "item", value, function(event, item) {
                // 左键选中
                can.onaction.storm(event, can, value.hash)
            }, function(event) {
                // 右键菜单
                can.user.carte(event, can, can.ondetail, can.ondetail.list, function(ev, item, meta) {
                    can.ondetail[item](event, can, item, value.hash)
                }, {style: {left: can._target.offsetWidth}})
            }, target)

            if (index == 0 || [value.hash, value.name].indexOf(can._main_river) > -1) { select = view }
        }), select && select.click(), typeof cb == "function" && cb(msg)
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
        can.run({}, [], function(msg) { can.onimport._init(can, msg, list, cb, can._output) })

        can.onengine.listen(can, "search", function(msg, word) {
            if (word[0] == "*" || word[0] == "storm") { can.onexport.storm(can, msg, word) }
        })

        can.onengine.listen(can, "action.touch", function() {
            can.page.Select(can, document.body, "div.carte", function(item) {
                can.page.Remove(can, item)
            })
        })

        can.run({}, ["search", "Header.onimport.menu", "river",
            ["添加", "创建群组", "添加应用", "添加工具", "添加用户", "添加设备"],
            ["访问", "访问研发", "访问应用", "访问工具", "访问用户", "访问设备", "访问任务"],
            ["共享", "共享群组", "共享应用", "共享工具", "邀请用户", "邀请设备"],
        ], function(event, item) {
            can.core.CallFunc([can.ondetail, item], [event, can, item, can.Conf("river"), can.Conf("storm")])
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
                    can.user.title(can.user.Search(can, "pod") || storm.name)
                }, oncontextmenu: function(event) {
                    can.onaction.action(event, can, river, storm.hash)
                    can.user.title(can.user.Search(can, "pod") || storm.name)

                    // 右键点击
                    can.user.carte(event, can, can.ondetail, ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"], function(ev, item, meta) {
                        can.ondetail[item](event, can, item, river, storm.hash)
                    }, {style: {left: can._target.offsetWidth}})
                }}
            }) }]).first, list.children.length > 0 && list.children[select].click()

            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
    action: function(event, can, river, storm) {
        can.onengine.signal(can, "storm.select", can.request(event, {
            river: can.Conf("river", river), storm: can.Conf("storm", storm),
        }))

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
    "刷新": function(event, can) { can.user.Search(can, {river: can.Conf("river"), storm: can.Conf("storm")}) },
})
Volcanos("ondetail", {help: "菜单交互", list: ["共享群组", "添加用户", "添加设备", "添加应用", "重命名群组", "删除群组"],
    "创建群组": function(event, can) { can.onaction.create(event, can) },

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

    "共享应用": function(event, can, button, river, storm) {
        can.user.input(event, can, [
            {_input: "text", name: "name", value: storm},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [river, "action", "share", "type", "storm", "name", meta.name,
                "storm", storm,
            ])
            return true
        })
    },
    "添加工具": function(event, can, button, river, storm) {
        can.user.select(event, can, "command", "pod,name,text", function(item, next) {
            can.run({}, [river, "tool", "action", "insert", "hash", storm].concat(["pod", item[0], "ctx", item[2], "cmd", item[1]]), function(msg) {
                next()
            })
        }, function() {
            can.user.Search(can, {river: river, storm: storm})
        })
    },
    "保存参数": function(event, can, button, river, storm) {
        can.run(event, ["search", "Action.onexport.args"], function(item, next) {
            var msg = can.request({}, {hash: storm, id: item.dataset.id})
            can.run(msg._event, [river, "tool", "action", "modify", "arg", item.dataset.args], function(msg) {
                next()
            })
        })
    },
    "重命名应用": function(event, can, button, river, storm) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event, {hash: storm})
            can.run(event, [river, "tool", "action", "modify", "name", meta.name], function(msg) {
                can.user.Search(can, {river: river, storm: storm})
            })
        })
    },
    "删除应用": function(event, can, button, river, storm) {
        var msg = can.request(event, {hash: storm})
        can.run(event, [river, "tool", "action", "remove"], function(msg) {
            can.user.Search(can, {river: river})
        })
    },

    "访问研发": function(event, can, button, river, storm) {
        can.user.select(event, can, "github", "time,type,name,text")
    },
    "访问应用": function(event, can, button, river, storm) {
        can.user.select(event, can, "storm", "type,name,text")
    },
    "访问工具": function(event, can, button, river, storm) {
        can.user.select(event, can, "plugin", "type,name,text")
    },
    "访问用户": function(event, can, button, river, storm) {
        can.user.select(event, can, "user", "time,type,name,text")
    },
    "访问设备": function(event, can, button, river, storm) {
        can.user.select(event, can, "space", "time,type,name,text")
    },
    "访问任务": function(event, can, button, river, storm) {
        var msg = can.request(event, {index: "web.team.task"})
        can.user.select(event, can, "task", "time,zone,id,type,name,text")
    },
    "邀请用户": function(event, can, button, river, storm) {
        can.user.toast(can, "what", "邀请用户")
    },
    "邀请设备": function(event, can, button, river, storm) {
        can.run(event, ["action", "invite"], function(msg) {
            var toast = can.user.toast(can, {
                text: msg.Result(), title: "邀请设备",
                width: -100, duration: -1, button: [
                    {button: ["关闭", function() { toast.Close() }]},
                ]
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    width: function(can) { return can._target.offsetWidth },
    height: function(can) { return can._target.offsetHeight },
    storm: function(can, msg, word) {
        var fields = (msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")
        can.core.Item(can.onengine.river, function(river, value) {
            can.core.Item(value.storm, function(storm, item) {
                if (word[1] != "" && word[1] != storm && word[1] != item.name) { return }

                can.core.List(fields, function(key) {
                    switch (key) {
                        case "ctx": msg.Push(key, "web.chat"); break
                        case "cmd": msg.Push(key, "storm"); break
                        case "type": msg.Push(key, river); break
                        case "name": msg.Push(key, storm); break
                        case "text":
                            // msg.Push(key, can.user.MergeURL(can, {river: river, storm: storm}))
                            // break
                            msg.Push(key, shy("跳转", function(event) {
                                can.onaction.action(event, can, river, storm)
                            })); break
                        default: msg.Push(key, "")
                    }
                })
            })
        })
    },
})
