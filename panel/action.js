Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg) {
        var river = can.Conf(chat.RIVER), storm = can.Conf(chat.STORM)
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) { item.type = chat.PLUGIN
            item.height = parseInt(can.Conf(html.HEIGHT))-40, item.width = parseInt(can.Conf(html.WIDTH))-40
            item.feature = can.base.Obj(item.feature||item.meta)
            item.inputs = can.base.Obj(item.inputs||item.list)

            can.onappend.plugin(can, item, function(sub, meta, skip) {
                can.onimport._plugin(can, river, storm, sub, meta), skip || next()
            })
        }, function() {
            can.onaction.layout(can, can.misc.Search(can, chat.LAYOUT)||can.Conf(chat.LAYOUT))
            !can.user.isMobile && can.onimport._menu(can, msg)
        })

        can.onmotion.float.auto(can, can._output, chat.CARTE)
    },
    _plugin: function(can, river, storm, sub, meta) {
        sub.run = function(event, cmds, cb) { var msg = sub.request(event); cmds = cmds||[]
            var toast = msg.Option("_toast") && can.user.toast(can, msg.Option("_toast"), "", -1)
            return can.run(event, can.misc.concat([river, storm, meta.id||meta.index||can.core.Keys(meta.key, meta.name)], cmds), function(msg) {
                toast && toast.close(), can.base.isFunc(cb) && cb(msg)
            })
        }, can._plugins = (can._plugins||[]).concat([sub])

        can.page.Append(can, can._action, [{view: [html.ITEM, html.DIV, meta.name], onclick: function(event) {
            can.onmotion.select(can, can._output, "fieldset.plugin", sub._target)
            can.onmotion.select(can, can._action, "div.item", event.target)
        }}])

        can.page.Modify(can, sub._output, {style: {"max-width": meta.width}})

        sub._option.dataset = sub._option.dataset||{}
        meta.id && (sub._option.dataset.id = meta.id)
        sub._target.Meta = meta
    },
    _menu: function(can, msg) {
        if (can.user.mod.isPod||can.user.isMobile) { return }

        can._menu && can.page.Remove(can, can._menu)
        can._menu = can.search({}, ["Header.onimport.menu", ctx.ACTION].concat(
            can.base.Obj(msg.Option("menus"), [
                // ["布局", "默认布局", "流动布局", "网格布局", "标签布局", "自由布局"],
                ["help", "tutor", "manual", "service", "devops", "refer"],
            ])
        ), function(event, button, list) {
            list[0] == "help"? can.user.open("/help/"+button+".shy"): can.onaction.layout(can, button)
        })
    },
    _share: function(can, share) { if (!share) { return }
        can.run({}, ["_share", share], function(msg) {
            can.user.topic(can, can.misc.Search(can, chat.TOPIC)||msg.Option(chat.TOPIC))
            can.user.title(can.misc.Search(can, chat.TITLE)||msg.Option(chat.TITLE))
            can.onaction.layout(can, "auto")

            if (msg[kit.MDB_INDEX].length == 1) { can.require(["/panel/cmd.css"])
                can.user.mod.isCmd = true, can.page.ClassList.add(can, can._target, "cmd")
                can.page.Select(can, document.body, "fieldset.panel", function(item) {
                    item != can._target && can.onmotion.hidden(can, item)
                })
                can.Conf({height: window.innerHeight, width: window.innerWidth+40})
            } else {
                can.Conf({height: window.innerHeight, width: window.innerWidth})
            }
            can.Conf(chat.RIVER, "_share"), can.Conf(chat.STORM, share)
            can.onimport._init(can, msg)
        })
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, page, msg, can, cmds, cb) {
        var list = can._root.river
        var river = list[cmds[0]]
        var storm = river && river.storm[cmds[1]]
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) { cmds = [ctx.ACTION, ctx.COMMAND].concat(storm.index)
            can.run(event, cmds, cb)
        } else {
            can.core.List(storm.action, function(value) {
                msg.Push("name", value.name||"")
                msg.Push("help", value.help||"")
                msg.Push("inputs", JSON.stringify(value.inputs))
                msg.Push("feature", JSON.stringify(value.feature))
                msg.Push("index", value.index||"")
                msg.Push("args", value.args||"[]")
                msg.Push("_action", value._action||"")
            }), can.base.isFunc(cb) && cb(msg)
        }
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        can._target.ontouchstart = function(event) {
            can.onengine.signal(can, "onaction_touch", can.request(event))
        }
        can.base.isFunc(cb) && cb()
    },
    onmain: function(can, msg) { can.onimport._share(can, can.misc.Search(can, web.SHARE)) },
    onsize: function(can, msg, width, height) { can.Conf({width: width, height: height}) },
    onsearch: function(can, msg, word) {
        if (word[0] == "*" || word[0] == mdb.PLUGIN) { can.onexport.plugin(can, msg, word) }
    },
    onstorm_select: function(can, msg, river, storm) { can.onlayout._init(can)
        function key(name) { return can.core.Keys(can.Conf(chat.RIVER), can.Conf(chat.STORM), name) }
        can.page.Cache(key(html.ACTION), can._action, can._output.scrollTop+1)
        can.page.Cache(key(html.OUTPUT), can._output, can._output.scrollTop+1)

        can.Conf(chat.RIVER, river), can.Conf(chat.STORM, storm) // 转场
        var position = can.page.Cache(key(html.ACTION), can._action)
        var position = can.page.Cache(key(html.OUTPUT), can._output)
        if (position) { can._output.scrollTo(0, position-1); return }

        can.run({}, [river, storm], function(msg) {
            if (msg.Length() == 0) { // 添加工具
                can.onengine.signal(can, "onaction_nostorm", can.request({}, {river: river, storm: storm}))
            } else {
                can.onimport._init(can, msg)
            }
        })
    },

    layout: function(can, layout) { if (!layout) { return }
        var trans = {
            "默认布局": "auto",
            "流动布局": "flow",
            "网格布局": "grid",
            "标签布局": "tabs",
            "自由布局": "free",
        }

        layout = trans[layout]||layout, can.Conf(chat.LAYOUT, layout)
        can.page.Modify(can, can._action, {className: "action "+layout})
        can.page.Modify(can, can._output, {className: "output "+layout})

        if (layout == "tabs" && !can.tabs) {
            can.onmotion.select(can, can._output, "fieldset.plugin", 0)
            can.onmotion.select(can, can._action, "div.item", 0)
            can.tabs = true
        }
        if (layout == "free" && !can.free) {
            can.page.Select(can, can._target, "div.output>fieldset.plugin", function(item, index) {
                can.page.Modify(can, item, {style: {left: 20*index, top: 20*index}})
                can.onmotion.move(can, item, {left: 20*index, top: 20*index})
            }), can.free = true
        }

        can.onlayout._init(can)
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    args: function(can, msg, list, cb, target) {
        can.core.Next(can.page.Select(can, target, "fieldset.plugin>form.option"), function(item, next, index, array) {
            var list = can.page.Select(can, item, '.args', function(item) { return item.value||"" })
            item.dataset.args = JSON.stringify(list), cb(item, next, index, array)
        })
    },
    size: function(can, msg) {
        msg.Option(chat.TOP, can._target.offsetTop)
        msg.Option(chat.LEFT, can._target.offsetLeft)
        msg.Option(html.WIDTH, can._target.offsetWidth)
        msg.Option(html.HEIGHT, can._target.offsetHeight)
        msg.Option(chat.SCROLL, can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)
    },
    layout: function(can, msg) { return can.Conf(chat.LAYOUT) },
    plugin: function(can, msg, word) {
        var fields = (msg.Option(ice.MSG_FIELDS)||"ctx,cmd,type,name,text").split(",")
        can.page.Select(can, can._output, "fieldset.plugin>legend", function(item) {
            if (item.innerHTML.indexOf(word[1]) == -1) { return }

            var meta = item.parentNode.Meta
            var list = can.page.Select(can, item.nextSibling, '.args', function(item) { return item.value||"" })

            var data = {ctx: "web.chat", cmd: ctx.ACTION,
                type: mdb.PLUGIN, name: item.innerHTML, text: shy("跳转", function(event) {
                    var input = can.page.Select(can, item.parentNode, "input.args")[0]
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
            can.core.List(fields, function(key) { msg.Push(key, data[key]||"") })
        })
    },
})

