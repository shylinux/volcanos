Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg) {
        var river = can.Conf("river"), storm = can.Conf("storm")
        can.onmotion.clear(can), can.core.Next(msg.Table(), function(item, next) {
            item.width = parseInt(can.Conf("width")), item.height = parseInt(can.Conf("height"))
            item.feature = can.base.Obj(item.feature||item.meta)
            item.inputs = can.base.Obj(item.inputs||item.list)
            item.type = "plugin"

            can.onappend.plugin(can, item, function(sub, meta) {
                can.onimport._plugin(can, river, storm, sub, meta), next()
                sub._option.dataset.id = item.id
            })
        })
    },
    _plugin: function(can, river, storm, sub, item) {
        sub.run = function(event, cmds, cb) { var msg = sub.request(event)
            var toast = msg.Option("_toast") && can.user.toast(can, msg.Option("_toast"), "", 1000000)
            return can.run(event, (can.onengine[cmds[0]]? []: [river, storm, item.id||item.index||item.key+"."+item.name]).concat(cmds), function(msg) {
                console.log(sub)
                console.log(item)
                toast && toast.Close(), typeof cb == "function" && cb(msg)
            })
        }, can._plugins = (can._plugins||[]).concat([sub])

        can.page.Modify(can, sub._output, {style: {"max-width": item.width-40}})
        can.onengine.listen(can, "action.resize", function(width, height) {
            can.page.Modify(can, sub._output, {style: {"max-width": item.width = width-40}})
        })

        can.page.Append(can, can._action, [{view: ["item", "div", item.name], onclick: function(event) {
            can.onmotion.select(can, can._output, "fieldset.plugin", sub._target)
            can.onmotion.select(can, can._action, "div.item", event.target)
        }}])
    },
    _share: function(can, msg, share) {
        can.user.topic(can, can.user.Search(can, "topic")||msg.Option("topic")||"white")
        can.user.title(can.user.Search(can, "title")||msg.Option("title"))
        can.Conf("river", "_share"), can.Conf("storm", share)
        can.onimport._init(can, msg)
    },
})
Volcanos("onengine", {help: "解析引擎", list: [],
    engine: function(event, can, msg, pane, cmds, cb) {
        var river = can.onengine.river[cmds[0]]
        var storm = river && river.storm[cmds[1]]
        if (!storm || cmds.length != 2) { return false }

        if (storm.index) { cmds = ["action", "command"].concat(storm.index)
            can.misc.Runs(event, can, {names: pane._name}, cmds, cb)
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
            can.run({}, ["_share", share], function(msg) { msg.Length()>0? can.onimport._share(can, msg, share):
                can.onengine.engine({}, can, msg, can, [msg.Option("sess.river"), msg.Option("sess.storm")], function(msg) {
                    can.onimport._share(can, msg, share)
                })
            })
        }

        can.onengine.listen(can, "storm.select", function(msg, river, storm) {
            can.onaction._select(can, msg, river, storm)
        })

        can.onengine.listen(can, "search", function(msg, word) {
            if (word[0] == "*" || word[0] == "plugin") { can.onexport.plugin(can, msg, word) }
        })

        can._target.ontouchstart = function(event) {
            can.onengine.signal(can, "action.touch", can.request(event))
        }

        var list = []; can.onengine.listen(can, "resize", function(width, height) {
            can.Conf({width: width, height: height}), can.core.Delay(list, 1000, function() {
                can.onengine.signal(can, "action.resize", can.request({}, {
                    width: can.Conf("width"), height: can.Conf("height"),
                }))
            })
        })

        can.run({}, ["search", "Header.onimport.menu", "action",
            ["布局", "默认布局", "流动布局", "网格布局", "标签布局", "自由布局"],
        ], function(event, key) { can.onaction._layout(can, key) })
    },
    _layout: function(can, key) {
        var trans = {
            "默认布局": "auto",
            "流动布局": "flow",
            "网格布局": "grid",
            "标签布局": "tabs",
            "自由布局": "free",
        }
        can.page.Modify(can, can._action, {className: "action "+trans[key]})
        can.page.Modify(can, can._output, {className: "output "+trans[key]})

        if (key == "标签布局") {
            can.onmotion.select(can, can._output, "fieldset.plugin", 0)
            can.onmotion.select(can, can._action, "div.item", 0)
        }
    },
    _select: function(can, msg, river, storm) {
        function key(name) { return can.Conf("river")+"."+can.Conf("storm")+"."+name}
        can.page.Cache(key("action"), can._action, can._output.scrollTop+1)
        can.page.Cache(key("output"), can._output, can._output.scrollTop+1)

        can.Conf("river", river), can.Conf("storm", storm) // 转场
        var position = can.page.Cache(key("output"), can._output)
        var position = can.page.Cache(key("action"), can._action)
        if (position) { can._output.scrollTo(0, position-1); return }

        can.run({}, [river, storm], function(msg) {
            if (msg.Length() > 0) {
                can.onimport._init(can, msg)
            } else {
                var msg = can.request({}, {river: river, storm: storm})
                can.run(msg._event, ["search", "River.ondetail.添加工具"])
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
    plugin: function(can, msg, word) {
        var fields = (msg.Option("fields")||"ctx,cmd,type,name,text").split(",")
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
    },
})
