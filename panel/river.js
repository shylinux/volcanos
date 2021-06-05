Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (msg.Option("sess.river") == "_share") { return can.onmotion.hidden(can) }
        can.onmotion.clear(can), can.river_list = {}, can.storm_list = {}

        can.onimport._main(can, msg), can.onimport._menu(can, msg)
        var select; can.page.Append(can, can._output, msg.Table(function(item, index) {
            return can.onimport._river(can, item, function(target) {
                (index == 0 || item.hash == can._main_river) && (select = target)
            })
        })), select && select.click()

        can.onmotion.float.auto(can, target, "carte", "input")
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
    },
    _river: function(can, meta, cb) {
        return {text: [meta.name, "div", "item"], onclick: function(event) {
            can.onaction.storm(event, can, meta.hash)

        }, onmouseenter: function(event) {
            can.onaction.carte(event, can, can.ondetail.list, function(event, button, module) {
                module[button](event, can, button, meta.hash)
            })
        }, _init: function(target) { cb(target)
            can.river_list[meta.hash] = target
        }}
    },
    _storm: function(can, meta, river) {
        return {text: [meta.name, "div", "item"], onclick: function(event) {
            can.onaction.action(event, can, river, meta.hash)
            can.user.title(can._main_title || meta.name)

        }, onmouseenter: function(event) {
            can.onaction.carte(event, can, ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"], function(event, button, module) {
                module[button](event, can, button, river, meta.hash)
            })
        }, _init: function(target) {
            can.storm_list[can.core.Keys(river, meta.hash)] = target
        }}
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, can, msg, panel, cmds, cb) {
        cmds.length == 0 && can.core.Item(can.onengine.river, function(key, value) {
            msg.Push({hash: key, name: value.name}) // 群组列表
        }); if (cmds.length != 1 && cmds[1] != "tool") { return false }

        var river = can.onengine.river[cmds[0]]; if (!river) { return false }
        can.core.Item(river.storm, function(key, value) {
            msg.Push({hash: key, name: value.name}) // 应用列表
        }), can.base.isFunc(cb) && cb(msg); return true
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, msg, list, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    _const: ["title", "river", "storm", "action"],
    _trans: {create: "创建", refresh: "刷新"},
    onlogin: function(can, msg) {
        can.onappend._action(can, can.Conf("action")||can.onaction.list)
        can.run({}, [], function(msg) { can.onimport._init(can, msg, [], null, can._output) })
    },
    onsearch: function(can, msg, word) {
        if (word[0] == "*" || word[0] == can._STORM) { can.onexport.storm(can, msg, word) }
    },
    onaction_touch: function(can, msg) {
        can.onmotion.float.del(can, "carte")
        can.user.isMobile && can.onmotion.hidden(can)
    },
    onaction_notool: function(can, msg, river, storm) {
        can.ondetail["添加工具"](msg._event, can, "添加工具", river, storm)
    },

    carte: function(event, can, list, cb) {
        var carte = can.user.carte(event, can, can.ondetail, list, cb)
        can.page.Modify(can, carte._target, {style: {
            left: event.clientX-event.offsetX+event.target.offsetWidth-3,
            top: carte._target.offsetTop-event.target.offsetHeight,
        }})
    },
    storm: function(event, can, river) { can.sublist = can.sublist||{}
        can.onmotion.select(can, can._output, "div.item", can.river_list[river])
        var list = can.sublist[river]; if (list) { return can.onmotion.Toggle(can, list) }

        can.run({}, [river, "tool"], function(msg) {
            var select = 0; list = can.page.Append(can, can._output, [{view: "list", list: msg.Table(function(item, index) {
                river == can._main_river && item.hash == can._main_storm && (select = index)
                return can.onimport._storm(can, item, river)
            }) }]).first, list.children.length > 0 && list.children[select].click()

            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
    action: function(event, can, river, storm) {
        can.page.Modify(can, can.sublist[river], {style: {display: "block"}})
        can.onmotion.select(can, can._output, "div.item", can.river_list[river])
        can.onmotion.select(can, can._output, "div.list div.item", can.storm_list[can.core.Keys(river, storm)])

        can.onengine.signal(can, "onstorm_select", can.request(event, {
            river: can.Conf(can._RIVER, river), storm: can.Conf(can._STORM, storm),
        }))
    },

    create: function(event, can) {
        can.user.trans(can, {"public": "公开群", "protected": "内部群", "private": "私有群"})
        can.user.input(event, can, [
            {name: "type", values: ["public", "protected", "private"], _trans: "类型"},
            {name: "name", value: "hi", _trans: "群名"}, {type: "textarea", name: "text", value: "hello", _trans: "简介"},
        ], function(event, button, meta, list, args) {
            can.run(event, [can._ACTION, "create"].concat(args), function(msg) {
                can.user.Search(can, {river: msg.Result()})
            })
        })
    },
    refresh: function(event, can) {
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
            {name: "name", value: river, _trans: "标题"},
        ], function(event, button, meta, list) {
            can.user.share(can, can.request(event), [river, can._ACTION, "share", "type", can._RIVER, "name", meta.name])
        })
    },
    "添加用户": function(event, can, button, river) {
        can.user.select(event, can, "user", "usernick,username", function(item, next) {
            can.run({}, [river, "user", can._ACTION, "insert", "username", item[0]], function(msg) {
                next()
            })
        })
    },
    "添加设备": function(event, can, button, river) {
        can.user.select(event, can, "space", "type,name,text", function(item, next) {
            can.run({}, [river, "node", can._ACTION, "insert", "type", item[0], "name", item[1]], function(msg) {
                next()
            })
        })
    },
    "添加应用": function(event, can, button, river) {
        can.user.trans(can, {"public": "公开应用", "protected": "群组应用", "private": "个人应用"})
        can.user.input(event, can, [
            {name: "type", values: ["public", "protected", "private"], _trans: "类型"},
            {name: "name", value: "hi", _trans: "名称"}, {type: "textarea", name: "text", value: "hello", _trans: "简介"},
        ], function(event, button, meta, list, args) {
            can.run({}, [river, "tool", can._ACTION, "create"].concat(args), function(msg) {
                can.user.Search(can, {river: river, storm: msg.Result()})
            })
        })
    },
    "重命名群组": function(event, can, button, river) {
        can.user.input(event, can, ["name"], function(event, button, meta, list) {
            var msg = can.request(event, {hash: river})
            can.run(event, [can._ACTION, "modify", "name", meta.name], function(msg) {
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
            {name: "name", value: storm, _trans: "标题"},
        ], function(event, button, meta, list) {
            var msg = can.request(event)
            can.user.share(can, msg, [river, can._ACTION, "share", "type", can._STORM, "name", meta.name,
                can._STORM, storm, can._RIVER, river,
            ])
        })
    },
    "添加工具": function(event, can, button, river, storm) {
        can.user.select(event, can, "command", "context,command", function(item, next) {
            can.run({}, [river, "tool", can._ACTION, "insert", "hash", storm].concat(["pod", "", "ctx", item[0], "cmd", item[1]]), function(msg) {
                next()
            })
        }, function() {
            can.user.Search(can, {river: river, storm: storm})
        })
    },
    "保存参数": function(event, can, button, river, storm) {
        can.search(event, ["Action.onexport.args"], function(item, next, index, array) {
            var msg = can.request({}, {hash: storm, id: item.dataset.id})
            can.run(msg._event, [river, "tool", can._ACTION, "modify", "arg", item.dataset.args], function(msg) {
                can.user.toast(can, (index+1)+"/"+array.length, "保存参数", 10000, (index+1)/array.length)
                next()
            })
        })
    },
    "重命名应用": function(event, can, button, river, storm) {
        var msg = can.request(event, {hash: storm})
        can.user.input(event, can, ["name"], function(ev, button, meta, list, args) {
            can.run(event, [river, "tool", can._ACTION, "modify"].concat(args), function(msg) {
                can.user.Search(can, {river: river, storm: storm})
            })
        })
    },
    "删除应用": function(event, can, button, river, storm) {
        var msg = can.request(event, {hash: storm})
        can.run(event, [river, "tool", can._ACTION, "remove"], function(msg) {
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
        can.run(event, [can._ACTION, "invite"], function(msg) {
            can.user.toast(can, {
                title: "共享主机", duration: -1, width: -100,
                content: msg.Result(), action: ["close"],
            })
        })
    },
    "共享工具": function(event, can, button, river, storm) {
        can.user.select(event, can, "plugin", "name,context,command,argument", function(item, next) {
            can.user.share(can, can.request(event), [river, can._ACTION, "share", "type", "field",
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
            can.run(event, [can._ACTION, "start"].concat(args), function(msg) {
                can.user.open(can.user.MergeURL(can, {pod: can.core.Keys(can.user.Search(can, "pod"), msg.Option("name"))}))
                can.user.toast(can, can.user.MergeURL(can, {pod: msg.Option("name")}))
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    width: function(can) { return can._target.offsetWidth },
    storm: function(can, msg, word) {
        var fields = (msg.Option("fields")||"ctx,cmd,type,name,text").split(",")
        can.core.Item(can.onengine.river, function(river, value) {
            can.core.Item(value.storm, function(storm, item) {
                if (word[1] != "" && word[1] != storm && word[1] != item.name) { return }

                var data = {ctx: "web.chat", cmd: can._STORM,
                    type: river, name: storm, text: shy("跳转", function(event) {
                        can.onaction.action(event, can, river, storm)
                    }),
                }; can.core.List(fields, function(key) { msg.Push(key, data[key]||"") })
            })
        })
    },
})
