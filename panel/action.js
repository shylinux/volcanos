Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg) {
        var river = can.Conf(can._RIVER), storm = can.Conf(can._STORM)
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) {
            item.width = parseInt(can.Conf(can._WIDTH))-40, item.height = parseInt(can.Conf(can._HEIGHT))-40
            item.feature = can.base.Obj(item.feature||item.meta)
            item.inputs = can.base.Obj(item.inputs||item.list)
            item.type = can._PLUGIN

            can.onappend.plugin(can, item, function(sub, meta) {
                can.onimport._plugin(can, river, storm, sub, meta), next()
            })
        }, function() {
            can.onaction.layout(can, can.user.Search(can, can._LAYOUT)||can.Conf(can._LAYOUT))
            !can.user.isMobile && can.onimport._menu(can)
        })

        can.onmotion.float.auto(can, can._output, "carte")
    },
    _plugin: function(can, river, storm, sub, meta) {
        sub.run = function(event, cmds, cb) { var msg = sub.request(event); cmds = cmds || [];
            var toast = msg.Option("_toast") && can.user.toast(can, msg.Option("_toast"), "", -1)
            return can.run(event, (can.onengine[cmds[0]]? []: [river, storm, meta.id||meta.index||can.core.Keys(meta.key, meta.name)]).concat(cmds), function(msg) {
                toast && toast.close(), can.base.isFunc(cb) && cb(msg)
            })
        }, can._plugins = (can._plugins||[]).concat([sub])

        can.page.Append(can, can._action, [{view: ["item", "div", meta.name], onclick: function(event) {
            can.onmotion.select(can, can._output, "fieldset.plugin", sub._target)
            can.onmotion.select(can, can._action, "div.item", event.target)
        }}])

        can.page.Modify(can, sub._output, {style: {"max-width": meta.width}})
        can.onengine.listen(can, "onaction_resize", function(width, height) {
            can.page.Modify(can, sub._output, {style: {"max-width": meta.width = width-40}})
        })

        sub._option.dataset = sub._option.dataset || {}
        meta.id && (sub._option.dataset.id = meta.id)
        sub._target.Meta = meta
    },
    _menu: function(can) {
        can._menu && can.page.Remove(can, can._menu)
        can._menu = can.search({}, ["Header.onimport.menu", can._ACTION,
            ["布局", "默认布局", "流动布局", "网格布局", "标签布局", "自由布局"],
        ], function(event, layout) { can.onaction.layout(can, layout) })
    },
    _share: function(can, share) {
        share && can.run({}, ["_share", share], function(msg) {
            can.user.topic(can, can.user.Search(can, can._TOPIC)||msg.Option(can._TOPIC)||"white")
            can.user.title(can.user.Search(can, can._TITLE)||msg.Option(can._TITLE))
            can.onaction.layout(can, "auto")

            can.Conf({width: window.innerWidth, height: window.innerHeight})
            can.Conf(can._RIVER, "_share"), can.Conf(can._STORM, share)
            can.onimport._init(can, msg)
        })
    },
})
Volcanos("onengine", {help: "解析引擎", list: [], _engine: function(event, page, msg, can, cmds, cb) {
        var river = can.onengine.river[cmds[0]]
        var storm = river && river.storm[cmds[1]]
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) { cmds = [can._ACTION, ctx.COMMAND].concat(storm.index)
            can.run(event, cmds, cb)
        } else {
            can.core.List(storm.action, function(value) {
                msg.Push("name", value.name||"")
                msg.Push("help", value.help||"")
                msg.Push("inputs", JSON.stringify(value.inputs||[]))
                msg.Push("feature", JSON.stringify(value.feature||{}))
                msg.Push("index", value.index||"")
                msg.Push("args", value.args||"[]")
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
    _const: [
        "output", "fields",
        "action", "share", "river", "storm",
        "title", "topic", "layout", "width", "height", "top", "left", "scroll",
        "plugin",
    ],
    onmain: function(can, msg) {
        var cmds = location.pathname.split("/").slice(1)
        if (cmds[0] == cli.CMD) {
            can.onappend.plugin(can, {index: cmds[1]}, function(sub, meta) {
                sub.run = function(event, cmds, cb) {}
            })
        }

        var ls = location.pathname.split("/")
        can.onimport._share(can, can.user.Search(can, can._SHARE) || ls[1]=="share" && ls[2])
    },
    onresize: function(can, msg, width, height) { var args = {width: width, height: height} 
        can.Conf(args), can.onengine.signal(can, "onaction_resize", can.request({}, args))
    },
    onsearch: function(can, msg, word) {
        if (word[0] == "*" || word[0] == can._PLUGIN) { can.onexport.plugin(can, msg, word) }
    },
    onstorm_select: function(can, msg, river, storm) { can.onlayout._init(can)
        function key(name) { return can.core.Keys(can.Conf(can._RIVER), can.Conf(can._STORM), name) }
        can.page.Cache(key(can._ACTION), can._action, can._output.scrollTop+1)
        can.page.Cache(key(can._OUTPUT), can._output, can._output.scrollTop+1)

        can.Conf(can._RIVER, river), can.Conf(can._STORM, storm) // 转场
        var position = can.page.Cache(key(can._ACTION), can._action)
        var position = can.page.Cache(key(can._OUTPUT), can._output)
        if (position) { can._output.scrollTo(0, position-1); return }

        can.run({}, [river, storm], function(msg) {
            if (msg.Length() == 0) { // 添加工具
                can.onengine.signal(can, "onaction_notool", can.request({}, {river: river, storm: storm}))
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

        layout = trans[layout]||layout, can.Conf(can._LAYOUT, layout)
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
        msg.Option(can._TOP, can._target.offsetTop)
        msg.Option(can._LEFT, can._target.offsetLeft)
        msg.Option(can._WIDTH, can._target.offsetWidth)
        msg.Option(can._HEIGHT, can._target.offsetHeight)
        msg.Option(can._SCROLL, can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)
    },
    layout: function(can, msg) { return can.Conf(can._LAYOUT) },
    plugin: function(can, msg, word) {
        var fields = (msg.Option(can._FIELDS)||"ctx,cmd,type,name,text").split(",")
        can.page.Select(can, can._output, "fieldset.plugin>legend", function(item) {
            if (item.innerHTML.indexOf(word[1]) == -1) { return }

            var meta = item.parentNode.Meta
            var list = can.page.Select(can, item.nextSibling, '.args', function(item) { return item.value||"" })

            var data = {ctx: "web.chat", cmd: can._ACTION,
                type: can._PLUGIN, name: item.innerHTML, text: shy("跳转", function(event) {
                    var input = can.page.Select(can, item.parentNode, "input.args")[0]
                    input && input.focus()
                }),
                context: meta.ctx||meta.key||"", command: meta.index||meta.cmd||meta.name, argument: JSON.stringify(list),
            }; can.core.List(fields, function(key) { msg.Push(key, data[key]||"") })
        })
    },
})
