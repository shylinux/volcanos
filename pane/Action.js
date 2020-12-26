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
        typeof cb == "function" && cb(msg)
    },
    _plugin: function(can, target, river, storm, value) { value.name = value.name.split(" ")[0]
        value.action = value.id || value.index || value.key+"."+value.name
        value.type = "plugin"

        // 添加插件
        value.width = parseInt(can.Conf("width")), value.height = parseInt(can.Conf("height"))
        can.onappend._init(can, value, ["/plugin/state.js"], function(plugin) {
            can._plugins = (can._plugins||[]).concat([plugin])
            plugin.run = function(event, cmds, cb, silent) { var msg = plugin.request(event); cmds = cmds || []
                can.run(event, can.onengine[cmds[0]]? cmds: [river, storm, value.action].concat(cmds), function(msg) {
                    typeof cb == "function" && cb(msg)
                }, silent)
            }
        }, target)
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
            can.run({}, ["_share", share], function(msg) {
                can.user.title(msg.Option("title"))
                can.Conf(RIVER, "_share"), can.Conf(STORM, share)
                can.onimport._init(can, msg, [], cb, can._output)
            })
        }

        can.Conf({width: can._output.offsetWidth-32, height: window.innerHeight})
        can.onengine.listen(can, "resize", function(width, height) {
            can.Conf({width: width, height: height})
        })


        can._target.ontouchstart = function(event) {
            can.run({}, ["search", "River.onmotion.hidden"])
            can.page.Select(can, document.body, "div.carte", function(item) {
                can.page.Remove(can, item)
            })
        }

        can.onengine.listen(can, "storm.select", function(msg, river, storm) {
            can.page.Cache(can.Conf(RIVER)+"."+can.Conf(STORM), can._output, can._output.scrollTop+1)
            can.Conf(RIVER, river), can.Conf(STORM, storm)

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

        can.onengine.listen(can, "search", function(msg, word) {
            if (word[0] != "*" && word[0] != "fieldset") { return }

            var fields = (msg.Option("fields")||"pod,ctx,cmd,type,name,text").split(",")
            can.page.Select(can, can._output, "fieldset.plugin>legend", function(item) {
                if (item.innerHTML.indexOf(word[1]) == -1) { return }

                can.core.List(fields, function(key) {
                    switch (key) {
                        case "type":
                            msg.Push(key, "fieldset")
                            break
                        case "name":
                            msg.Push(key, item.innerHTML)
                            break
                        case "text":
                            msg.Push(key, function() {
                                var input = can.page.Select(can, item.parentNode, "input.args")[0]
                                input && input.focus()
                            })
                            break
                        default:
                            msg.Push(key, "")
                    }
                })
            })
        })
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
