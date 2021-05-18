Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.base.isFunc(cb) && cb(msg)
        can.onmotion.clear(can), can.sublist = {}
        if (msg.Option("sess.river") == "_share") { return can.onmotion.hide(can) }

        can.onimport._main(can, msg)
        can.onimport._menu(can, msg)

        var select; msg.Table(function(value, index, array) {
            var item = can.onimport._river(can, value)
            if (index == 0 || [value.hash, value.name].indexOf(can._main_river) > -1) { select = item }
        })

        select && select.click()

        can.onlayout._init(can)
        can.onmotion.float.auto(can, can._output, "carte", "input")
    },
    _main: function(can, msg) {
        can._main_river = "project", can._main_storm = "studio"
        if (can.user.isExtension) { can._main_river = "product", can._main_storm = "chrome" }
        if (can.user.isMobile) { can._main_river = "product", can._main_storm = "office" }
        if (can.user.isWeiXin) { can._main_river = "service", can._main_storm = "wx" }

        can._main_river = can.user.Search(can, can._RIVER) || msg.Option("sess.river") || Volcanos.meta.args.river || can._main_river
        can._main_storm = can.user.Search(can, can._STORM) || msg.Option("sess.storm") || Volcanos.meta.args.storm || can._main_storm
        can._main_title = can.user.Search(can, can._TITLE) || msg.Option("sess.title") || Volcanos.meta.args.title || can.user.Search(can, "pod") || can._main_title
    },
    _menu: function(can, msg) {
        can.search({}, ["Header.onimport.menu", can._RIVER,
            ["添加", "创建群组", "添加应用", "添加工具", "添加用户", "添加设备", "创建空间"],
            !can.user.isMobile && ["访问", "内部系统", "访问应用", "访问工具", "访问用户", "访问设备", "工作任务"],
            ["共享", "共享群组", "共享应用", "共享工具", "共享主机"],
        ], function(event, item) {
            can.core.CallFunc([can.ondetail, item], [event, can, item, can.Conf(can._RIVER), can.Conf(can._STORM)])
        })

        can.page.Modify(can, can._output, {onmouseover: function(event) {
            can.menu && can.page.Remove(can, can.menu.first)
        }})
    },

    _river: function(can, meta) {
        var item = can.onappend.item(can, "item", meta, function(event) {
            // 左键选中
            can.onaction.storm(event, can, meta.hash)
        }, function(event) {
            // 右键菜单
            can.onaction.carte(event, can, can.ondetail.list, function(event, button, module) {
                module[button](event, can, button, meta.hash)
            })
        })

        !can.user.isMobile && can.page.Modify(can, item, {onmouseenter: function(event) {
            can.onaction.carte(event, can, can.ondetail.list, function(event, button, module) {
                module[button](event, can, item, meta.hash)
            })
        }})
        return item
    },
    _storm: function(can, meta, river) {
        return {text: [meta.name, "div", "item"], onclick: function(event) {
            // 左键点击
            can.onaction.action(event, can, river, meta.hash)
            can.user.title(can._main_title || meta.name)

            can.onmotion.select(can, event.target.parentNode, "div.item", event.target)
        }, onmouseenter: function(event) {
            can.onaction.carte(event, can, ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"], function(event, button, module) {
                module[button](event, can, button, river, meta.hash)
            })
        }, oncontextmenu: function(event) {
            can.onaction.action(event, can, river, meta.hash)
            can.user.title(can._main_title || meta.name)

            // 右键点击
            can.onaction.carte(event, can, ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"], function(event, button, module) {
                module[button](event, can, button, river, meta.hash)
            })
        }}
    },

    height: function(can, height) {
        can.page.Modify(can, can._target, {style: {
            height: can.Conf(can._HEIGHT, height),
        }})
        can.page.Modify(can, can._output, {style: {
            height: can.Conf(can._HEIGHT, height-10),
        }})
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, can, msg, panel, cmds, cb) {
        cmds.length == 0 && can.core.Item(can.onengine.river, function(key, value) {
            msg.Push({hash: key, name: value.name})
        }); if (cmds.length != 1 && cmds[1] != "tool") { return false }

        var river = can.onengine.river[cmds[0]]; if (!river) { return false }
        can.core.Item(river.storm, function(key, value) {
            msg.Push({hash: key, name: value.name})
        }), can.base.isFunc(cb) && cb(msg); return true
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, msg, list, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    _const: ["title", "river", "storm"],
    onlogin: function(can, msg) {
        can.onappend._action(can, can.Conf("action")||can.onaction.list)
        can.run({}, [], function(msg) { can.onimport._init(can, msg, [], null, can._output) })
    },
    onsearch: function(can, msg, word) {
        if (word[0] == "*" || word[0] == can._STORM) { can.onexport.storm(can, msg, word) }
    },
    onaction_touch: function(can, msg) {
        can.user.isMobile && can.onmotion.hidden(can)
    },

    storm: function(event, can, river) {
        var list = can.sublist[river]; if (list) { return can.onmotion.Toggle(can, list) }

        can.run({}, [river, "tool"], function(msg) {
            var select = 0; list = can.page.Append(can, can._output, [{view: "list", list: msg.Table(function(meta, index) {
                river == can._main_river && meta.hash == can._main_storm && (select = index)
                return can.onimport._storm(can, meta, river)
            }) }]).first, list.children.length > 0 && list.children[select].click()

            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
    action: function(event, can, river, storm) {
        // can.onlayout._init(can)
        can.onengine.signal(can, "onstorm_select", can.request(event, {
            river: can.Conf(can._RIVER, river), storm: can.Conf(can._STORM, storm),
        }))

        can.page.Select(can, can._output, "div.item.select", function(item) {
            can.page.ClassList.del(can, item, "select")
        }), can.page.ClassList.add(can, event.target, "select")
    },
    create: function(event, can) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {name: "群名", value: "hi"},
            {name: "简介", value: "hello"},
        ], function(event, button, meta, list) {
            can.run(event, ["action", "create"].concat(["type", list[0], "name", list[1], "text", list[2]]), function(msg) {
                can.user.Search(can, {river: msg.Result()})
            })
        })
    },
    carte: function(event, can, list, cb) {
        var carte = can.user.carte(event, can, can.ondetail, list, cb)
        can.page.Modify(can, carte._target, {style: {
            left: event.clientX-event.offsetX+event.target.offsetWidth-3,
            top: carte._target.offsetTop-event.target.offsetHeight,
        }})
    },

    "创建": function(event, can) { can.onaction.create(event, can) },
    "刷新": function(event, can) {
        can.user.Search(can, {
            river: can.Conf(can._RIVER), storm: can.Conf(can._STORM),
            topic: can.search(event, ["Header.onexport.topic"]),
            layout: can.search(event, ["Action.onexport.layout"]),
        })
    },
})
Volcanos("ondetail", {help: "菜单交互", list: ["共享群组", "添加用户", "添加设备", "添加应用", "重命名群组", "删除群组"],
    "创建群组": function(event, can) { can.onaction.create(event, can) },

    "共享群组": function(event, can, button, river) {
        can.user.input(event, can, [
            {name: "name", value: river},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [river, "action", "share", "type", can._RIVER, "name", meta.name])
        })
    },
    "添加用户": function(event, can, button, river) {
        can.user.select(event, can, "user", "usernick,username", function(item, next) {
            can.run({}, [river, "user", "action", "insert", "username", item[0]], function(msg) {
                next()
            })
        })
    },
    "添加设备": function(event, can, button, river) {
        can.user.select(event, can, "space", "type,name,text", function(item, next) {
            can.run({}, [river, "node", "action", "insert", "type", item[0], "name", item[1]], function(msg) {
                next()
            })
        })
    },
    "添加应用": function(event, can, button, river) {
        can.user.input(event, can, [
            ["类型", "public", "protected", "private"],
            {name: "名称", value: "hi"},
            {name: "简介", value: "hello"},
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
            {name: "name", value: storm},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [river, "action", "share", "type", can._STORM, "name", meta.name,
                can._STORM, storm, can._RIVER, river,
            ])
        })
    },
    "添加工具": function(event, can, button, river, storm) {
        can.user.select(event, can, "command", "context,command", function(item, next) {
            can.run({}, [river, "tool", "action", "insert", "hash", storm].concat(["pod", "", "ctx", item[0], "cmd", item[1]]), function(msg) {
                next()
            })
        }, function() {
            can.user.Search(can, {river: river, storm: storm})
        })
    },
    "保存参数": function(event, can, button, river, storm) {
        can.search(event, ["Action.onexport.args"], function(item, next, index, array) {
            var msg = can.request({}, {hash: storm, id: item.dataset.id})
            can.run(msg._event, [river, "tool", "action", "modify", "arg", item.dataset.args], function(msg) {
                can.user.toast(can, (index+1)+"/"+array.length, "保存参数", 10000, (index+1)/array.length)
                next()
            })
        })
    },
    "重命名应用": function(event, can, button, river, storm) {
        var msg = can.request(event, {hash: storm})
        can.user.input(event, can, ["name"], function(ev, button, meta, list, args) {
            can.run(event, [river, "tool", "action", "modify"].concat(args), function(msg) {
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

    "内部系统": function(event, can, button, river, storm) {
        can.user.select(event, can, "github", "time,type,name,text")
    },
    "访问应用": function(event, can, button, river, storm) {
        var msg = can.request(event, {sort: ","})
        can.user.select(event, can, can._STORM, "type,name,text")
    },
    "访问工具": function(event, can, button, river, storm) {
        var msg = can.request(event, {sort: ","})
        can.user.select(event, can, "plugin", "type,name,text")
    },
    "访问用户": function(event, can, button, river, storm) {
        can.user.select(event, can, "user", "time,type,name,text")
    },
    "访问设备": function(event, can, button, river, storm) {
        can.user.select(event, can, "space", "time,type,name,text")
    },
    "工作任务": function(event, can, button, river, storm) {
        var msg = can.request(event, {index: "web.team.task"})
        can.user.select(event, can, "task", "time,zone,id,type,name,text")
    },

    "共享主机": function(event, can, button, river, storm) {
        can.run(event, ["action", "invite"], function(msg) {
            can.user.toast(can, {
                title: "共享主机", content: msg.Result(),
                button: ["close"], duration: -1, width: -100,
            })
        })
    },
    "共享工具": function(event, can, button, river, storm) {
        can.user.select(event, can, "plugin", "name,context,command,argument", function(item, next) {
            can.user.share(can, can.request(event), [river, "action", "share", "type", "field",
                can._RIVER, item[1], can._STORM, item[2],
                "name", item[0], "text", item[3],
            ])
        })
    },

    "创建空间": function(event, can, button, river, storm) {
        can.user.input(event, {__proto__: can, run: function(event, cmds, cb, silent) {
            var msg = can.request(event, {action: "start"})
            can.run(event, cmds, cb, silent)
        }}, [
            {name: "name", value: "@key"},
            {name: "repos", value: "@key"},
            {name: "template", value: "@key"},
        ], function(event, button, data, list, args) {
            can.run(event, ["action", "start"].concat(args), function(msg) {
                can.user.open(can.user.MergeURL(can, {pod: can.core.Keys(can.user.Search(can, "pod"), msg.Option("name"))}))
                can.user.toast(can, can.user.MergeURL(can, {pod: msg.Option("name")}))
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    width: function(can) { return can._target.offsetWidth },
    height: function(can) { return can._target.offsetHeight },
    storm: function(can, msg, word) {
        var fields = (msg.Option("fields")||"ctx,cmd,type,name,text").split(",")
        can.core.Item(can.onengine.river, function(river, value) {
            can.core.Item(value.storm, function(storm, item) {
                if (word[1] != "" && word[1] != storm && word[1] != item.name) { return }

                can.core.List(fields, function(key) {
                    switch (key) {
                        case "ctx": msg.Push(key, "web.chat"); break
                        case "cmd": msg.Push(key, can._STORM); break
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
