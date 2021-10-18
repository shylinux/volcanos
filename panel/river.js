Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        if (msg.Option(ice.MSG_RIVER) == "_share") { return can.onmotion.hidden(can) }
        can.onmotion.clear(can), can.river_list = {}, can.storm_list = {}

        can.onimport._main(can, msg), can.onimport._menu(can, msg)
        var select; can.page.Append(can, can._output, msg.Table(function(item, index) {
            return can.onimport._river(can, item, function(target) {
                (index == 0 || item.hash == can._main_river) && (select = target)
            })
        })), select && select.click()
    },
    _main: function(can, msg) { can._main_river = "project", can._main_storm = "studio"
        if (can.user.isExtension) { var args = Volcanos.meta.args
            can._main_river = args.river||"product", can._main_storm = args.storm||"chrome"
        }
        if (can.user.isMobile) { can._main_river = "product", can._main_storm = "office" }
        if (can.user.isWeiXin) { can._main_river = "service", can._main_storm = "wx" }

        can._main_title = can.user.Search(can, chat.TITLE)||msg.Option(ice.MSG_TITLE)||Volcanos.meta.args.title||can.user.mod.isPod||can._main_title
        can._main_river = can.user.Search(can, chat.RIVER)||msg.Option(ice.MSG_RIVER)||Volcanos.meta.args.river||can._main_river
        can._main_storm = can.user.Search(can, chat.STORM)||msg.Option(ice.MSG_STORM)||Volcanos.meta.args.storm||can._main_storm
    },
    _menu: function(can, msg) { if (can.user.mod.isPod) { return }
        can.search({}, ["Header.onimport.menu"].concat(can.base.Obj(msg.Option(chat.MENUS), can.ondetail.menus)), function(event, button) {
            can.core.CallFunc([can.ondetail, button], [event, can, button, can.Conf(chat.RIVER), can.Conf(chat.STORM)])
        })
    },
    _carte: function(can, list, river, storm) { if (can.user.mod.isPod||can.user.isMobile) { return }
        can.onaction.carte(event, can, list, function(event, button, module) {
            module[button](event, can, button, river, storm)
        })
    },
    _river: function(can, meta, cb) {
        return {text: [meta.name, html.DIV, html.ITEM], onclick: function(event) {
            can.onaction.storm(event, can, meta.hash)

        }, onmouseenter: function(event) {
            can.onimport._carte(can, can.ondetail.list, meta.hash)

        }, _init: function(target) { cb(target)
            can.river_list[meta.hash] = target
        }}
    },
    _storm: function(can, meta, river) {
        return {text: [meta.name, html.DIV, html.ITEM], onclick: function(event) {
            can.onaction.action(event, can, river, meta.hash)
            can.user.title(can._main_title||meta.name)

        }, onmouseenter: function(event) {
            can.onimport._carte(can, can.ondetail.sublist, river, meta.hash)

        }, _init: function(target) {
            can.storm_list[can.core.Keys(river, meta.hash)] = target
        }}
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, can, msg, panel, cmds, cb) {
        var list = can._root.river
        cmds.length == 0 && can.core.Item(list, function(key, value) {
            msg.Push({hash: key, name: can.user.language(can) == "en"? key: value.name}) // 群组列表
        }); if (cmds.length != 1 && cmds[1] != chat.TOOL) { return false }

        var river = list[cmds[0]]; if (!river) { return false }
        can.core.Item(river.storm, function(key, value) {
            msg.Push({hash: key, name: can.user.language(can) == "en"? key: value.name}) // 应用列表
        }), can.base.isFunc(cb) && cb(msg); return true
    },
})
Volcanos("onaction", {help: "控件交互", list: [], _init: function(can, msg, list, cb, target) {
        can.base.isFunc(cb) && cb()
    },
    onlogin: function(can, msg) {
        can.onappend._action(can, can.Conf(ctx.ACTION)||can.onaction.list)
        can.run({}, [], function(msg) { can.onimport._init(can, msg, [], null, can._output) })
    },
    onsearch: function(can, msg, word) {
        if (word[0] == "*" || word[0] == chat.STORM) { can.onexport.storm(can, msg, word) }
    },
    onstorm_select: function(can, msg, river, storm) {
        var args = {river: river, storm: storm}
        if (can.user.isExtension) { localStorage.setItem("args", JSON.stringify(args)) }
    },
    onaction_touch: function(can, msg) {
        can.onmotion.float.del(can, chat.CARTE)
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
        var list = can.sublist[river]; if (list) { return can.onmotion.toggle(can, list) }

        can.run({}, [river, chat.TOOL], function(msg) {
            var select = 0; list = can.page.Append(can, can._output, [{view: html.LIST, list: msg.Table(function(item, index) {
                river == can._main_river && item.hash == can._main_storm && (select = index)
                return can.onimport._storm(can, item, river)
            }) }]).first, list.children.length > 0 && list.children[select].click()

            event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling)
            can.sublist[river] = list
        })
    },
    action: function(event, can, river, storm) {
        can.page.Modify(can, can.sublist[river], {style: {display: html.BLOCK}})
        can.onmotion.select(can, can._output, "div.item", can.river_list[river])
        can.onmotion.select(can, can._output, "div.list div.item", can.storm_list[can.core.Keys(river, storm)])

        can.onengine.signal(can, "onstorm_select", can.request(event, {
            river: can.Conf(chat.RIVER, river), storm: can.Conf(chat.STORM, storm),
        }))
    },

    create: function(event, can) {
        can.user.trans(can, {"public": "公开群", "protected": "内部群", "private": "私有群"})
        can.user.input(event, can, [
            {name: kit.MDB_TYPE, values: [chat.PUBLIC, chat.PROTECTED, chat.PRIVATE], _trans: "类型"},
            {name: kit.MDB_NAME, value: "hi", _trans: "群名"}, {name: kit.MDB_TEXT, value: "hello", _trans: "简介"},
        ], function(event, button, meta, list, args) {
            can.run(event, [ctx.ACTION, mdb.CREATE].concat(args), function(msg) {
                can.user.Search(can, {river: msg.Result()})
            })
        })
    },
    refresh: function(event, can) {
        var args = {
            river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM),
            topic: can.search(event, ["Header.onexport.topic"]),
            layout: can.search(event, ["Action.onexport.layout"]),
        }
        if (can.user.isExtension) { localStorage.setItem("args", JSON.stringify(args)) }
        can.user.Search(can, args)
    },
})
Volcanos("ondetail", {help: "菜单交互",
    list: ["共享群组", "添加应用", "添加设备", "添加用户", "重命名群组", "删除群组"],
    sublist: ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"],
    menus: [chat.RIVER,
        ["create", "创建群组", "添加应用", "添加工具", "添加设备", "创建空间"],
        ["share", "共享群组", "共享应用", "共享工具", "共享主机", "访问空间"],
    ],

    "创建群组": function(event, can) { can.onaction.create(event, can) },
    "共享群组": function(event, can, button, river) {
        can.user.input(event, can, [{name: chat.TILTE, value: river, _trans: "标题"}], function(event, button, meta, list) {
            can.user.share(can, can.request(event), [river, ctx.ACTION, chat.SHARE, kit.MDB_TYPE, chat.RIVER, kit.MDB_NAME, list[0]])
        })
    },
    "添加应用": function(event, can, button, river) { can.ondetail.create(event, can, button, river) },
    "共享应用": function(event, can, button, river, storm) {
        can.user.input(event, can, [{name: chat.TILTE, value: storm, _trans: "标题"}], function(event, button, meta, list) {
            can.user.share(can, can.request(event), [river, ctx.ACTION, chat.SHARE, kit.MDB_TYPE, chat.STORM, kit.MDB_NAME, list[0],
                chat.STORM, storm, chat.RIVER, river,
            ])
        })
    },
    "添加工具": function(event, can, button, river, storm) {
        can.user.select(event, can, ctx.COMMAND, "context,command", function(item, next) {
            can.run({}, [river, chat.TOOL, ctx.ACTION, mdb.INSERT, kit.MDB_HASH, storm].concat([ice.POD, "", ice.CTX, item[0], ice.CMD, item[1]]), function(msg) {
                next()
            })
        }, function() {
            can.user.Search(can, {river: river, storm: storm})
        })
    },
    "共享工具": function(event, can, button, river, storm) {
        can.user.select(event, can, mdb.PLUGIN, "name,context,command,argument", function(item, next) {
            can.user.share(can, can.request(event), [river, ctx.ACTION, chat.SHARE, kit.MDB_TYPE, chat.FIELD,
                kit.MDB_NAME, item[0], kit.MDB_TEXT, item[3], chat.RIVER, item[1], chat.STORM, item[2],
            ])
        })
    },

    "添加设备": function(event, can, button, river) {
        can.user.select(event, can, web.SPACE, "type,name,text", function(item, next) {
            can.run({}, [river, chat.NODE, ctx.ACTION, mdb.INSERT, kit.MDB_TYPE, item[0], kit.MDB_NAME, item[1]], function(msg) {
                next()
            })
        })
    },
    "共享主机": function(event, can, button, river, storm) {
        can.run(event, [ctx.ACTION, aaa.INVITE], function(msg) {
            can.user.toast(can, {
                title: "共享主机", duration: -1, width: -300,
                content: msg.Result(), action: [cli.CLOSE],
            })
        })
    },
    "创建空间": function(event, can, button, river, storm) {
        can.user.input(event, can, [{name: "name", value: "hi"}, {name: "repos"}, {name: "template"}], function(event, button, data, list, args) {
            can.run(event, [ctx.ACTION, cli.START].concat(args, chat.RIVER, river), function(msg) {
                var link = can.user.MergeURL(can, {_path: "/chat/pod/"+can.core.Keys(can.user.Search(can, ice.POD), msg.Option(kit.MDB_NAME))})
                can.user.toast(can, link), can.user.open(link)
            })
        })
    },
    "访问空间": function(event, can, button, river, storm) {
        can.user.select({river: river}, can, web.SPACE, "time,type,name,text")
    },


    "添加用户": function(event, can, button, river) {
        can.user.select(event, can, chat.USER, "usernick,username", function(item, next) {
            can.run({}, [river, chat.USER, ctx.ACTION, mdb.INSERT, aaa.USERNAME, item[0]], function(msg) {
                next()
            })
        })
    },
    "重命名群组": function(event, can, button, river) {
        can.user.input(event, can, [kit.MDB_NAME], function(event, button, meta, list) {
            can.run(can.request(event, {hash: river})._event, [ctx.ACTION, mdb.MODIFY, kit.MDB_NAME, meta.name], function(msg) {
                can.user.Search(can, {river: river})
            })
        })
    },
    "删除群组": function(event, can, button, river) {
        can.run(can.request(event, {hash: river})._event, [ctx.ACTION, mdb.REMOVE], function(msg) { can.user.Search(can, {}) })
    },

    "保存参数": function(event, can, button, river, storm) {
        can.search(event, ["Action.onexport.args"], function(item, next, index, array) {
            var msg = can.request({}, {hash: storm, id: item.dataset.id})
            var toast = can.user.toast(can, (index+1)+"/"+array.length, "保存参数", 10000, (index+1)/array.length)
            can.run(msg._event, [river, chat.TOOL, ctx.ACTION, mdb.MODIFY, ice.ARG, item.dataset.args], function(msg) {
                toast.close(), next()
            })
        })
    },
    "重命名应用": function(event, can, button, river, storm) {
        can.user.input(event, can, [kit.MDB_NAME], function(ev, button, meta, list, args) {
            can.run(can.request(event, {hash: storm})._event, [river, chat.TOOL, ctx.ACTION, mdb.MODIFY].concat(args), function(msg) {
                can.user.Search(can, {river: river, storm: storm})
            })
        })
    },
    "删除应用": function(event, can, button, river, storm) {
        can.run(can.request(event, {hash: storm})._event, [river, chat.TOOL, ctx.ACTION, mdb.REMOVE], function(msg) {
            can.user.Search(can, {river: river})
        })
    },


    create: function(event, can, button, river) {
        can.user.trans(can, {"public": "公开应用", "protected": "群组应用", "private": "个人应用"})
        can.user.input(event, can, [
            {name: kit.MDB_TYPE, values: [chat.PUBLIC, chat.PROTECTED, chat.PRIVATE], _trans: "类型"},
            {name: kit.MDB_NAME, value: "hi", _trans: "名称"}, {name: kit.MDB_TEXT, value: "hello", _trans: "简介"},
        ], function(event, button, meta, list, args) {
            can.run({}, [river, chat.TOOL, ctx.ACTION, mdb.CREATE].concat(args), function(msg) {
                can.user.Search(can, {river: river, storm: msg.Result()})
            })
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    width: function(can) { return can._target.offsetWidth },
    storm: function(can, msg, word) {
        var fields = (msg.Option(ice.MSG_FIELDS)||"ctx,cmd,type,name,text").split(",")
        can.core.Item(can._root.river, function(river, value) {
            can.core.Item(value.storm, function(storm, item) {
                if (word[1] != "" && word[1] != storm && word[1] != item.name) { return }

                var data = {ctx: "web.chat", cmd: chat.STORM,
                    type: river, name: storm, text: shy("跳转", function(event) {
                        can.onaction.action(event, can, river, storm)
                    }),
                }; can.core.List(fields, function(key) { msg.Push(key, data[key]||"") })
            })
        })
    },
})

