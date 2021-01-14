(function() { const RIVER = "river", STORM = "storm", ACTION = "action"
Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        var river = can.Conf(RIVER), storm = can.Conf(STORM)
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(value, next) {
            value.feature = can.base.Obj(value.feature||value.meta||"{}", {})
            value.inputs = can.base.Obj(value.inputs||value.list||"[]", [])

            value.inputs.length == 0? can.run({}, ["action", "command", value.index || value.ctx+"."+value.cmd], function(msg) {
                value.feature = can.base.Obj(msg.meta&&msg.meta[0]||"{}", {})
                value.inputs = can.base.Obj(msg.list&&msg.list[0]||"[]", [])

                can.onimport._plugin(can, target, river, storm, value), next()
            }): (can.onimport._plugin(can, target, river, storm, value), next())
        })
    },
    _plugin: function(can, target, river, storm, value) { value.name = value.name.split(" ")[0]
        value.width = parseInt(can.Conf("width")), value.height = parseInt(can.Conf("height"))
        value.action = value.id || value.index || value.key+"."+value.name
        value.type = "plugin"

        // 添加插件
        can.onappend._init(can, value, ["/plugin/state.js"], function(plugin) {
            plugin._option.dataset.id = value.action, value.target = plugin._target
            plugin.run = function(event, cmds, cb, silent) { var msg = plugin.request(event); cmds = cmds || []
                return can.run(event, can.onengine[cmds[0]]? cmds: [river, storm, value.action].concat(cmds), function(msg) {
                    typeof cb == "function" && cb(msg)
                }, silent)
            }

            can.page.Modify(can, plugin._target, {style: {"max-width": value.width}})
            can.onengine.listen(can, "action.resize", function(width, height) {
                can.page.Modify(can, plugin._target, {style: {"max-width": value.width = width}})
            })

            can._plugins = (can._plugins||[]).concat([plugin])
            can.page.Append(can, can._action, [{view: ["item", "div", value.name], onclick: function(event) {
                can.onmotion.select(can, can._output, "fieldset.plugin", value.target)
                can.onmotion.select(can, can._action, "div.item", event.target)
            }}])
        }, target)
    },
    _share: function(can, msg, share, cb) {
        can.user.title(msg.Option("title"))
        can.user.topic(can, can.user.Search(can, "topic")||msg.Option("topic")||"white")
        can.Conf(RIVER, "_share"), can.Conf(STORM, share)
        can.onimport._init(can, msg, [], cb, can._output)
    },
})
Volcanos("onengine", {help: "解析引擎", list: [],
    engine: function(event, can, msg, pane, cmds, cb) {
        var river = can.onengine.river[cmds[0]]
        var storm = river && river.storm[cmds[1]]
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) {
            can.misc.Run(event, can, {names: pane._name}, ["action", "command"].concat(storm.index), cb)
        } else {
            can.core.List(storm.action, function(value) {
                msg.Push("name", value.name||"")
                msg.Push("help", value.help||"")
                msg.Push("inputs", JSON.stringify(value.inputs||[]))
                msg.Push("feature", JSON.stringify(value.feature||{}))
                msg.Push("index", value.index||"")
                msg.Push("args", value.args||"[]")
            }), typeof cb == "function" && cb(msg)
        }
        return true
    },
})
Volcanos("onaction", {help: "交互操作", list: [], _init: function(can, msg, list, cb, target) {
        var share = can.user.Search(can, "share"); if (share) {
            can.run({}, ["_share", share], function(msg) { msg.append && msg[msg.append[0]]? can.onimport._share(can, msg, share, cb):
                can.onengine.engine({}, can, msg, can, [msg.Option("sess.river"), msg.Option("sess.storm")], function(msg) {
                    can.onimport._share(can, msg, share, cb)
                })
            })
        }

        can.onengine.listen(can, "storm.select", function(msg, river, storm) {
            can.page.Cache(can.Conf(RIVER)+"."+can.Conf(STORM), can._action, can._output.scrollTop+1)
            can.page.Cache(can.Conf(RIVER)+"."+can.Conf(STORM), can._output, can._output.scrollTop+1)
            can.Conf(RIVER, river), can.Conf(STORM, storm) // 转场
            var position = can.page.Cache(river+"."+storm, can._action)
            var position = can.page.Cache(river+"."+storm, can._output)
            if (position) { can._output.scrollTo(0, position-1); return }

            can.run({}, [river, storm], function(msg) {
                if (msg.append && msg[msg.append[0]] && msg[msg.append[0]].length > 0) {
                    can.onimport._init(can, msg, list, cb, can._output)
                } else {
                    var msg = can.request({}, {river: river, storm: storm})
                    can.run(msg._event, ["search", "River.ondetail.添加工具"])
                }
            })
        })

        can.run({}, ["search", "Header.onimport.menu", "action",
            ["布局", "默认布局", "流动布局", "网格布局", "标签布局", "自由布局"],
        ], function(event, key) {
            can.core.CallFunc(can.onaction[key], {event: event, can: can, key: key})
        })

        can._target.ontouchstart = function(event) { can.onengine.signal(can, "action.touch", {}) }
        can.Conf({width: can._output.offsetWidth-33, height: window.innerHeight})
        can.onengine.listen(can, "resize", function(width, height) { can.Conf({width: width, height: height})
            can.onengine.signal(can, "action.resize", can.request({}, {width: width, height: height}))
        })

        can.onengine.listen(can, "search", function(msg, word) {
            if (word[0] != "*" && word[0] != "plugin") { return }

            var fields = (msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")
            can.page.Select(can, can._output, "fieldset.plugin>legend", function(item) {
                if (item.innerHTML.indexOf(word[1]) == -1) { return }

                can.core.List(fields, function(key) {
                    switch (key) {
                        case "ctx": msg.Push(key, "web.chat"); break
                        case "cmd": msg.Push(key, "action"); break
                        case "type": msg.Push(key, "plugin"); break
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
        })
    },

    "默认布局": function(event, can) {
        can.page.Modify(can, can._action, {className: "action auto"})
        can.page.Modify(can, can._output, {className: "output auto"})
    },
    "流动布局": function(event, can) {
        can.page.Modify(can, can._action, {className: "action flow"})
        can.page.Modify(can, can._output, {className: "output flow"})
    },
    "网格布局": function(event, can) {
        can.page.Modify(can, can._action, {className: "action grid"})
        can.page.Modify(can, can._output, {className: "output grid"})
    },
    "标签布局": function(event, can) {
        can.page.Modify(can, can._action, {className: "action tabs"})
        can.page.Modify(can, can._output, {className: "output tabs"})
        can.onmotion.select(can, can._output, "fieldset.plugin", 0)
        can.onmotion.select(can, can._action, "div.item", 0)
    },
    "自由布局": function(event, can) {
        can.page.Modify(can, can._action, {className: "action free"})
        can.page.Modify(can, can._output, {className: "output free"})
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    args: function(can, msg, list, cb, target) {
        can.core.Next(can.page.Select(can, target, "fieldset.plugin>form.option"), function(item, next) {
            var list = can.page.Select(can, item, '.args', function(item) { return item.value||"" })
            item.dataset.args = JSON.stringify(list), cb(item, next)
        })
    },
})
})()
