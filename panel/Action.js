Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg) {
        var river = can.Conf(can._RIVER), storm = can.Conf(can._STORM)
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) {
            item.width = parseInt(can.Conf(can._WIDTH)), item.height = parseInt(can.Conf(can._HEIGHT))
            item.feature = can.base.Obj(item.feature||item.meta)
            item.inputs = can.base.Obj(item.inputs||item.list)
            item.type = can._PLUGIN

            can.onappend.plugin(can, item, function(sub, meta) {
                can.onimport._plugin(can, river, storm, sub, meta), next()
                sub._option.dataset = sub._option.dataset || {}
                item.id && (sub._option.dataset.id = item.id)
                sub._target.Meta = item
            })
        }, function() {
            can.onaction._layout(can, can.Conf(can._LAYOUT)||can.user.Search(can, can._LAYOUT))
        })
    },
    _plugin: function(can, river, storm, sub, item) {
        sub.run = function(event, cmds, cb) { var msg = sub.request(event)
            var toast = msg.Option("_toast") && can.user.toast(can, msg.Option("_toast"), "", 1000000)
            return can.run(event, (can.onengine[cmds[0]]? []: [river, storm, item.id||item.index||item.key+"."+item.name]).concat(cmds), function(msg) {
                toast && toast.Close(), can.base.isFunc(cb) && cb(msg)
            })
        }, can._plugins = (can._plugins||[]).concat([sub])

        can.page.Modify(can, sub._output, {style: {"max-width": item.width-40}})
        can.onengine.listen(can, "action.resize", function(width, height) {
            can.page.Modify(can, sub._output, {style: {"max-width": width-40}})
            item.width = width
        })

        can.page.Append(can, can._action, [{view: ["item", "div", item.name], onclick: function(event) {
            can.onmotion.select(can, can._output, "fieldset.plugin", sub._target)
            can.onmotion.select(can, can._action, "div.item", event.target)
        }}])

        sub.page.Modify(sub, sub._legend, {
            onmouseenter: function(event) {
                Volcanos.meta.data.menu && sub.page.Remove(sub, Volcanos.meta.data.menu.first)
                Volcanos.meta.data.menu = sub.user.carte(event, sub, sub.onaction, sub.onaction.list)

                sub.page.Modify(sub, Volcanos.meta.data.menu.first, {style: {
                    left: event.target.offsetLeft+can.run(event, ["search", "River.onexport.width"]),
                    top: event.target.offsetTop-(can.user.isMobile? can._target.parentNode.parentNode.scrollTop: can._output.scrollTop)+event.target.offsetHeight+can.run(event, ["search", "Header.onexport.height"]),
                }})
            },
        })
    },
    _share: function(can, msg, share) {
        can.Conf(can._WIDTH, window.innerWidth)
        can.Conf(can._HEIGHT, window.innerHeight)
        can.user.topic(can, can.user.Search(can, can._TOPIC)||msg.Option(can._TOPIC)||"white")
        can.user.title(can.user.Search(can, can._TITLE)||msg.Option(can._TITLE))
        can.Conf(can._RIVER, "_share"), can.Conf(can._STORM, share)
        can.onimport._init(can, msg)
        can.onaction._layout(can, "flow")
    },
    _menu: function(can) {
        !can.user.isMobile && can.run({}, [can._SEARCH, "Header.onimport.menu", can._ACTION,
            ["布局", "默认布局", "流动布局", "网格布局", "标签布局", "自由布局"],
        ], function(event, key) { can.onaction._layout(can, key) })
    },

    height: function(can, height) {
        can.page.Modify(can, can._target, {style: {
            height: can.Conf(can._HEIGHT, height),
        }})
        can.page.Modify(can, can._output, {style: {
            height: can.Conf(can._HEIGHT, height-(can.Conf(can._LAYOUT)=="tabs"? 28: 10)),
        }})
    },
})
Volcanos("onengine", {help: "解析引擎", list: [],
    engine: function(event, page, msg, can, cmds, cb) {
        var river = can.onengine.river[cmds[0]]
        var storm = river && river.storm[cmds[1]]
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) { cmds = [can._ACTION, "command"].concat(storm.index)
            can.misc.Runs(event, can, {names: can._name}, cmds, cb)
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
        can.const(
            "output", "fields",
            "search", "action", "share", "river", "storm",
            "title", "topic", "layout", "width", "height", "top", "left",
            "plugin",
        )

        var share = can.user.Search(can, can._SHARE); if (share) {
            can.run({}, ["_share", share], function(msg) { msg.Length()>0? can.onimport._share(can, msg, share):
                can.onengine.engine({}, can, msg, can, [msg.Option("sess.river"), msg.Option("sess.storm")], function(msg) {
                    can.onimport._share(can, msg, share)
                })
            })
        }

        can.onengine.listen(can, "storm.select", function(msg, river, storm) {
            can.onaction._select(can, msg, river, storm)
        })

        can.onengine.listen(can, can._SEARCH, function(msg, word) {
            if (word[0] == "*" || word[0] == can._PLUGIN) { can.onexport.plugin(can, msg, word) }
        })

        can._target.ontouchstart = function(event) {
            can.onengine.signal(can, "action.touch", can.request(event))
        }

        var list = []; can.onengine.listen(can, "resize", function(width, height) {
            can.Conf({width: width, height: height}), can.core.Delay(list, 1000, function() {
                can.onengine.signal(can, "action.resize", can.request({}, {
                    width: can.Conf(can._WIDTH), height: can.Conf(can._HEIGHT),
                }))
            })
        })
        can.onimport._menu(can)
    },
    _layout: function(can, key) { if (!key) { return }
        var trans = {
            "默认布局": "auto",
            "流动布局": "flow",
            "网格布局": "grid",
            "标签布局": "tabs",
            "自由布局": "free",
        }

        key = trans[key]||key, can.Conf(can._LAYOUT, key)
        can.page.Modify(can, can._action, {className: "action "+key})
        can.page.Modify(can, can._output, {className: "output "+key})

        if (key == "tabs") {
            can.onmotion.select(can, can._output, "fieldset.plugin", 0)
            can.onmotion.select(can, can._action, "div.item", 0)
        }


        var header = can.get("Header", "height")
        var footer = can.get("Footer", "height")
        can.set("Action", "height", window.innerHeight-header-footer)
    },
    _select: function(can, msg, river, storm) {
        function key(name) { return can.Conf(can._RIVER)+"."+can.Conf(can._STORM)+"."+name}
        can.page.Cache(key(can._ACTION), can._action, can._output.scrollTop+1)
        can.page.Cache(key(can._OUTPUT), can._output, can._output.scrollTop+1)

        can.Conf(can._RIVER, river), can.Conf(can._STORM, storm) // 转场
        var position = can.page.Cache(key(can._OUTPUT), can._output)
        var position = can.page.Cache(key(can._ACTION), can._action)
        if (position) { can._output.scrollTo(0, position-1); return }

        can.run({}, [river, storm], function(msg) {
            if (msg.Length() > 0) {
                can.onimport._init(can, msg)
            } else {
                var msg = can.request({}, {river: river, storm: storm})
                can.run(msg._event, [can._SEARCH, "River.ondetail.添加工具"])
            }
        })
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
    },
    layout: function(can, msg) { return can.Conf(can._LAYOUT) },
    plugin: function(can, msg, word) {
        var fields = (msg.Option(can._FIELDS)||"ctx,cmd,type,name,text").split(",")
        can.page.Select(can, can._output, "fieldset.plugin>legend", function(item) {
            if (item.innerHTML.indexOf(word[1]) == -1) { return }

            var meta = item.parentNode.Meta
            can.core.List(fields, function(key) {
                switch (key) {
                    case "context": 
                        msg.Push(key, meta.ctx||meta.key||"")
                        break
                    case "command": 
                        msg.Push(key, meta.index||meta.cmd||meta.name)
                        break
                    case "argument": 
                        var list = can.page.Select(can, item.nextSibling, '.args', function(item) { return item.value||"" })
                        msg.Push(key, JSON.stringify(list))
                        break
                    case "ctx": msg.Push(key, "web.chat"); break
                    case "cmd": msg.Push(key, can._ACTION); break
                    case "type": msg.Push(key, can._PLUGIN); break
                    case "name": msg.Push(key, item.innerHTML); break
                    case "text":
                        msg.Push(key, shy("跳转", function() {
                            var input = can.page.Select(can, item.parentNode, "input.args")[0]
                            input && input.focus()
                        })); break
                    default: msg.Push(key, "")
                }
            })
        })
    },
})
