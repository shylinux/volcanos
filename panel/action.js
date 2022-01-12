Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg) {
        var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM)
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) { item.type = chat.PLUGIN
            item.height = parseInt(can.Conf(html.HEIGHT))-can.Conf(html.MARGIN_Y)
            item.width = parseInt(can.Conf(html.WIDTH))-can.Conf(html.MARGIN_X)
            item.feature = can.base.Obj(item.feature||item.meta)
            item.inputs = can.base.Obj(item.inputs||item.list)

            can.onappend.plugin(can, item, function(sub, meta, skip) {
                can.onimport._plugin(can, river, storm, sub, meta), skip || next()
            })
        }, function() { can.onimport._menu(can, msg), can.onkeypop._init(can)
            can.onaction.layout(can, can.misc.Search(can, chat.LAYOUT)||can.Conf(chat.LAYOUT))
        })
    },
    _plugin: function(can, river, storm, sub, meta) { sub._target._meta = meta
        sub.run = function(event, cmds, cb) { var msg = sub.request(event)
            return can.run(event, can.misc.concat([river, storm, meta.id||meta.index||can.core.Keys(meta.key, meta.name)], cmds||[]), cb)
        }, can._plugins = (can._plugins||[]).concat([sub])

        meta.id && (sub._option.dataset = sub._option.dataset||{}, sub._option.dataset.id = meta.id)

        can.page.Modify(can, sub._output, {style: kit.Dict(html.MAX_WIDTH, meta.width)})
        can.page.Append(can, can._action, [{view: [html.ITEM, html.DIV, meta.name], onclick: function(event) {
            can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, sub._target)
            can.onmotion.select(can, can._action, html.DIV_ITEM, event.target)
        }}])
    },
    _menu: function(can, msg) { if (can.user.mod.isPod||can.user.isMobile) { return }
        can.setHeaderMenu(can.base.Obj(msg.Option(chat.MENUS), [
            [chat.LAYOUT, "auto", "flow", "grid", "tabs", "free"],
            [ice.HELP, "tutor", "manual", "service", "devops", "refer"],
        ]), function(event, button, list) { can.core.CallFunc([can.onaction, list[0]], [can, button]) })
    },

    _share: function(can, share) { share && can.run({}, ["_share", share], function(msg) {
        can.user.topic(can, can.misc.Search(can, chat.TOPIC)||msg.Option(chat.TOPIC))
        can.user.title(can.misc.Search(can, chat.TITLE)||msg.Option(chat.TITLE))
        can.page.Select(can, document.body, html.FIELDSET_PANEL, function(item) {
            item != can._target && can.onmotion.hidden(can, item)
        })

        can.Conf(html.MARGIN_X, 0, html.MARGIN_Y, 2*html.ACTION_HEIGHT)
        can.page.ClassList.add(can, can._target, ice.CMD)
        can.onlayout._init(can)

        can.Conf(chat.RIVER, "_share", chat.STORM, share)
        can.onimport._init(can, msg)
    }) },
    _cmd: function(can, item, next) {
        can.base.Copy(item, {
            height: can.Conf(html.HEIGHT)-can.Conf(html.MARGIN_Y),
            width: can.Conf(html.WIDTH)-can.Conf(html.MARGIN_X),
            opts: can.misc.Search(can),
        })
        can.onappend.plugin(can, item, function(sub, meta, skip) {
            can.user.title(meta.name), skip || next()
        })
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, page, msg, can, cmds, cb) {
        var storm = can.core.Value(can._root, can.core.Keys(chat.RIVER, cmds[0], chat.STORM, cmds[1]))
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) { // 命令索引
            can.run(event, [ctx.ACTION, ctx.COMMAND].concat(storm.index), cb)
        } else { // 命令列表
            can.core.List(storm.list, function(value) {
                msg.Push(mdb.NAME, value.name||"")
                msg.Push(mdb.HELP, value.help||"")
                msg.Push(ctx.INPUTS, JSON.stringify(value.inputs))
                msg.Push(ctx.FEATURE, JSON.stringify(value.feature))
                msg.Push(ctx.INDEX, value.index||"")
                msg.Push(ctx.ARGS, value.args||"[]")
                msg.Push(ice.MSG_ACTION, value._action||"")
            }), can.base.isFunc(cb) && cb(msg)
        }
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, cb, target) {
        can.Conf(html.MARGIN_Y, 4*html.PLUGIN_MARGIN+2*html.ACTION_HEIGHT+html.ACTION_MARGIN)
        can.Conf(html.MARGIN_X, 4*html.PLUGIN_MARGIN)
        target.ontouchstart = function(event) {
            can.onengine.signal(can, "onaction_touch", can.request(event))
        }, can.base.isFunc(cb) && cb()
    },
    _trans: {
        "layout": "布局",
        "auto": "默认布局",
        "flow": "流动布局",
        "grid": "网格布局",
        "tabs": "标签布局",
        "free": "自由布局",

        "help": "帮助",
        "tutor": "入门简介",
        "manual": "使用手册",
        "service": "服务手册",
        "devops": "编程手册",
        "refer": "参考手册",
    },
    onmain: function(can) {
        can.onimport._share(can, can.misc.Search(can, web.SHARE))
    },
    onlogin: function(can) { if (!can.user.mod.isCmd) { return }
        can.Conf(html.MARGIN_X, 0, html.MARGIN_Y, 2*html.ACTION_HEIGHT)
        can.page.ClassList.add(can, can._target, ice.CMD)
        can.onlayout._init(can)

        can._names = location.pathname
        can.Conf(chat.TOOL)? can.core.Next(can.Conf(chat.TOOL), function(item, next) {
            can.onimport._cmd(can, item, next)

        }): can.run(can.request()._event, [ctx.ACTION, ctx.COMMAND], function(msg) {
            can.core.Next(msg.Table(), function(item, next) {
                can.onimport._cmd(can, item, next)
            })
        })
    },
    onstorm_select: function(can, msg, river, storm) { can.onlayout._init(can)
        function key(name) { return can.core.Keys(can.Conf(chat.RIVER), can.Conf(chat.STORM), name) }
        can.page.Cache(key(html.ACTION), can._action, can._output.scrollTop+1)
        can.page.Cache(key(html.OUTPUT), can._output, can._output.scrollTop+1)

        can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm)
        var position = can.page.Cache(key(html.ACTION), can._action)
        var position = can.page.Cache(key(html.OUTPUT), can._output)
        if (position) { can._output.scrollTo(0, position-1); return }

        can.run({}, [river, storm], function(msg) { if (msg.Length() > 0) { return can.onimport._init(can, msg) }
            can.onengine.signal(can, "onaction_notool", can.request({}, {river: river, storm: storm}))
        })
    },
    onsearch: function(can, msg, word) {
        if (word[0] == "*" || word[0] == mdb.PLUGIN) { can.onexport.plugin(can, msg, word) }
    },
    onsize: function(can, msg, height, width) { can.Conf({height: height, width: width}) },

    help: function(can, button) { can.user.open("/help/"+button+".shy") },
    layout: function(can, button) { can.Conf(chat.LAYOUT, button)
        can.page.Modify(can, can._action, {className: chat.ACTION+ice.SP+button})
        can.page.Modify(can, can._output, {className: chat.OUTPUT+ice.SP+button})

        if (button == "tabs" && !can.tabs) { can.tabs = true
            can.onmotion.select(can, can._output, html.FIELDSET_PLUGIN, 0)
            can.onmotion.select(can, can._action, html.DIV_ITEM, 0)
        }
        if (button == "free" && !can.free) { can.free = true
            can.page.Select(can, can._target, html.DIV_OUTPUT+ice.GT+html.FIELDSET_PLUGIN, function(item, index) {
                can.page.Modify(can, item, {style: {left: 40*index, top: 40*index}})
                can.onmotion.move(can, item, {left: 40*index, top: 40*index})
            })
        }
        can.onlayout._init(can)
    },
})
Volcanos("onkeypop", {help: "键盘交互", list: [], _focus: [], _init: function(can, target) {
        can.onkeypop._build(can), can.onengine.listen(can, "onkeydown", function(msg, model) {
            can._keylist = can.onkeypop._parse(msg._event, can, model, can._keylist||[], can._output)
        })
    },
    _mode: {
        normal: {
            j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
            k: function(event, can, target) { target.scrollBy(0, event.ctrlKey? -300: -30) },

            b: function(event, can, target) { can.search(event, ["Header.onaction.black"]) },
            w: function(event, can, target) { can.search(event, ["Header.onaction.white"]) },

            s: function(event, can, target) { can.search(event, ["River.ondetail.添加应用"]) },
            t: function(event, can, target) { can.search(event, ["River.ondetail.添加工具"]) },

            ":": function(event, can, target) {
                can.onengine.signal(can, "oncommandfocus")
            },
            " ": function(event, can, target) {
                can.onengine.signal(can, "onsearchfocus")
            },
            enter: function(event, can, target) { can.misc.Log("enter") },
            escape: function(event, can, target) {
                can.page.Select(can, document.body, "fieldset.float,div.float", function(item) {
                    can.page.Remove(can, item)
                })
                can.page.Select(can, document.body, "fieldset.auto", function(item) {
                    can.onmotion.hidden(can, item)
                })
                can.search(event, ["Search.onaction.hide"])
                can.misc.Log("enter")
            },
        },
    }, _engine: {},
})
Volcanos("onexport", {help: "导出数据", list: [],
    args: function(can, cb, target) {
        can.core.Next(can.page.Select(can, target, html.FIELDSET_PLUGIN+ice.GT+html.FORM_OPTION), function(item, next, index, array) {
            item.dataset.args = JSON.stringify(can.page.Select(can, item, html.OPTION_ARGS, function(item) { return item.value||"" }))
            cb(item, next, index, array)
        })
    },
    size: function(can, msg) {
        msg.Option(html.TOP, can._target.offsetTop)
        msg.Option(html.LEFT, can._target.offsetLeft)
        msg.Option(html.WIDTH, can._target.offsetWidth)
        msg.Option(html.HEIGHT, can._target.offsetHeight-can._action.offsetHeight)
        msg.Option(html.SCROLL, can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)
        msg.Option(html.MARGIN_X, can.Conf(html.MARGIN_X))
        msg.Option(html.MARGIN_Y, can.Conf(html.MARGIN_Y))
    },
    layout: function(can, msg) { return can.Conf(chat.LAYOUT) },
    plugin: function(can, msg, word) { var fields = can.core.Split(msg.Option(ice.MSG_FIELDS))
        can.page.Select(can, can._output, html.FIELDSET_PLUGIN+ice.GT+html.LEGEND, function(item) {
            if (item.innerHTML.indexOf(word[1]) == -1) { return }

            var meta = item.parentNode._meta
            var list = can.page.Select(can, item.nextSibling, html.OPTION_ARGS, function(item) { return item.value||"" })

            var data = {ctx: "web.chat", cmd: ctx.ACTION,
                type: mdb.PLUGIN, name: item.innerHTML, text: shy("跳转", function(event) {
                    var input = can.page.Select(can, item.parentNode, html.INPUT_ARGS)[0]
                    input && input.focus()
                }), argument: JSON.stringify(list),
            }
            if (meta.index) {
                data.context = "", data.command = meta.index
            } else if (meta.cmd) {
                data.context = meta.ctx, data.command = meta.cmd
            } else {
                return
            }
            msg.Push(data, fields)
        })
    },
})

