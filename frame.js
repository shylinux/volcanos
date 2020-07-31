// volcanos: 前端 火山架 我看不行
// FMS: a fieldset manager system

Volcanos("onengine", { _init: function(can, meta, list, cb, target) {
        can.run = function(event, cmds, cb) {
            return (can.onengine[cmds[0]]||can.onengine[meta.main.engine])(event, can, can.request(event), can, cmds, cb)
        }
        can.core.Next(meta.panes, function(item, next) {
            can.onappend._init(can, item, meta.libs.concat(item.list), function(pane) {
                pane.Conf(item), pane.run = function(event, cmds, cb) {
                    return (can.onengine[cmds[0]]||can.onengine[meta.main.engine])(event, can, pane.request(event), pane, cmds, cb)
                }, can[item.name] = pane, next()
            }, can._target)
        }, function() { can.onlayout._init(can, meta, list, function() {
            can.require(meta.main.list, function(can) {
                function getAction() {}
                function getStorm(storm) { can.core.Item(storm, function(key, value) {
                    value._link? can.require([value._link], function(can) {
                    }, function(can, name, sub) {
                        getAction(value.action = sub.action)
                        return true
                    }): getAction(value.action)
                }) }
                function getRiver(river) { can.core.Item(river, function(key, value) {
                    value._link? can.require([value._link], function(can) {
                    }, function(can, name, sub) {
                        getStorm(value.storm = sub.storm)
                        return true
                    }): getStorm(value.storm)
                }) }
                can.onengine && getRiver(can.onengine.river)

                // 应用入口
                can.onappend.daemon(can, can.user.title())
                can.user.title(can.user.Search(can, "title"))
                var pane = can[meta.main.name], msg = can.request({})
                pane.onaction && pane.onaction._init(pane, msg, msg.option||[], cb, target)
                can.page.Modify(can, document.body, {className: can.user.Search(can, "topic")||(can.user.Search(can, "pod")? "black": "white")})
            })
            can.onkeypop._init(can)
        }, target) })
    },
    _merge: function(can, sub) { can.core.Item(sub, function(key, value) {
        if (sub.hasOwnProperty(key)) { can.onengine[key] = value }
    }); return true },
    _topic: function(can) {
    },

    river: {
        "serivce": {name: "运营群", storm: {
            "wx": {name: "wx",  action: [
                {name: "微信公众号", help: "wx", inputs: [
                    {type: "text", name: "path", value: "icebergs/misc/wx/wx.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "mp": {name: "mp",  action: [
                {name: "微信小程序", help: "mp", inputs: [
                    {type: "text", name: "path", value: "icebergs/misc/mp/mp.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "lark": {name: "lark",  action: [
                {name: "飞书机器人", help: "lark", inputs: [
                    {type: "text", name: "path", value: "icebergs/misc/lark/lark.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js", style: "word"}},
            ]},
            "share": {name: "share",  action: [
                {name: "contexts", help: "shylinux/contexts", inputs: [
                    {type: "text", name: "path", value: "learning/speak/20200724.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js", style: "word"}},
            ]},
            // "company": {name: "company",  action: [
            //     {name: "公司", help: "company", inputs: [
            //         {type: "text", name: "path", value: "learning/社会/管理/company.shy"},
            //         {type: "button", name: "查看", value: "auto"},
            //     ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            // ]},
        }},
        "product": {name: "产品群", storm: {
            "office": {name: "office", index: [
                "web.wiki.feel",
                "web.wiki.draw.draw",
                "web.team.plan",
                "web.wiki.word",
                "web.wiki.data",
            ]},
            "chrome": {name: "chrome", index: [
                "web.code.chrome.chrome",
                "web.code.chrome.bookmark",
            ]},
            "english": {name: "english",  action: [
                {name: "english", help: "英汉", inputs: [
                    {type: "text", name: "word", value: "hi"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.alpha.find", feature: {}},
                {name: "chinese", help: "汉英", inputs: [
                    {type: "text", name: "word", value: "你好"},
                    {type: "text", name: "method", value: "line"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.alpha.find", feature: {}},
                {name: "wubi", help: "五笔", inputs: [
                    {type: "text", name: "word", value: "wqvb"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.code.input.find", feature: {}},
                {name: "wubi", help: "五笔", inputs: [
                    {type: "text", name: "word", value: "你好"},
                    {type: "text", name: "method", value: "line"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.code.input.find", feature: {}},
            ]},
            "context": {name: "context",  action: [
                {name: "knowledge", help: "智库", inputs: [
                    {type: "text", name: "path", value: "learning/", action: "auto"},
                    {type: "button", name: "查看", value: "auto"},
                    {type: "button", name: "返回"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
                {name: "index", help: "索引", inputs: [
                    {type: "text", name: "path", value: "learning/index.shy", action: "auto"},
                    {type: "button", name: "查看", value: "auto"},
                    {type: "button", name: "返回"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
                {name: "context", help: "编程", inputs: [
                    {type: "text", name: "path", value: "learning/自然/编程/hi.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
        }},
        "project": {name: "研发群", storm: {
            "inner": {name: "inner", index: [
                "web.code.inner",
                "web.code.git.status",
                "web.code.git.total",
            ]},
            "relay": {name: "relay", index: [
                "aaa.totp.get",
                "web.route",
                "web.space",
                "web.dream",
                "web.code.docker.container",
                "web.code.tmux.session",
            ]},
            "tmux": {name: "tmux", index: [
                "web.code.tmux.text",
                "web.code.tmux.buffer",
                "web.code.tmux.session",
            ]},
            "vim": {name: "vim",  action: [
                {name: "git", help: "git", inputs: [
                    {type: "text", name: "path", value: "icebergs/misc/git/git.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
                {name: "vim", help: "vim", inputs: [
                    {type: "text", name: "path", value: "icebergs/misc/vim/vim.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "html": {name: "html",  action: [
                {name: "spide", help: "爬虫", inputs: [
                    {type: "text", name: "name", value: "icebergs"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.code.git.spide", feature: {display: "/plugin/story/spide.js"}},
                {name: "trend", help: "趋势", inputs: [
                    {type: "text", name: "name", value: "icebergs"},
                    {type: "text", name: "begin_time", value: "@date"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.code.git.trend", feature: {display: "/plugin/story/trend.js"}},
                {name: "draw", help: "绘图", inputs: [
                    {type: "text", name: "path", value: "hi.svg"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.draw.draw", feature: {display: "/plugin/local/wiki/draw.js"}},
                {name: "HTML5", help: "网页", inputs: [
                    {type: "text", name: "path", value: "icebergs/misc/chrome/chrome.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "nginx": {name: "nginx",  action: [
                {name: "nginx", help: "代理", inputs: [
                    {type: "text", name: "path", value: "nginx-story/src/main.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "golang": {name: "golang",  action: [
                {name: "golang", help: "编程", inputs: [
                    {type: "text", name: "path", value: "golang-story/src/main.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "redis": {name: "redis",  action: [
                {name: "redis", help: "缓存", inputs: [
                    {type: "text", name: "path", value: "redis-story/src/main.shy", action: "auto"},
                    {type: "button", name: "查看", value: "auto"},
                    {type: "button", name: "返回"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
            "context": {name: "context",  action: [
                {name: "context", help: "编程", inputs: [
                    {type: "text", name: "path", value: "learning/自然/编程/context.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
        }},
        "profile": {name: "测试群", storm: {
            "pprof": {name: "pprof", index: [
                "web.code.pprof",
                "web.code.bench",
                "web.favor",
                "web.cache",
                "web.share",
            ]},
            "docker": {name: "docker", index: [
                "web.code.docker.image",
                "web.code.docker.container",
                "web.code.docker.command",
            ]},
        }},
        "operate": {name: "运维群", storm: {
            "os": {name: "os",  action: [
                {name: "操作系统", help: "os", inputs: [
                    {type: "text", name: "path", value: "learning/自然/编程/system.shy"},
                    {type: "button", name: "查看", value: "auto"},
                ], index: "web.wiki.word", feature: {display: "/plugin/local/wiki/word.js"}},
            ]},
        }},
    },
    search: function(event, can, msg, pane, cmds, cb) { var chain = cmds[1]
        var sub, mod = can, key, fun = can; can.core.List(chain.split("."), function(value, index, array) {
            fun && (sub = mod, mod = fun, key = value, fun = mod[value])
        }); if (!sub || !mod || !fun) { console.info("not found", chain); return }

        return typeof fun == "function" && fun(sub, msg, cmds.slice(2), cb, sub._target)
    },
    engine: function(event, can, msg, pane, cmds, cb) { if (!can.onengine) { return false }
        switch (pane._name) {
            case "River":
                if (cmds.length == 0) {
                    can.core.Item(can.onengine.river, function(key, value) {
                        msg.Push("key", key)
                        msg.Push("name", value.name)
                    })
                }
                if (cmds.length != 1 && cmds[1] != "storm") {
                    break
                }
            case "Storm":
                var river = can.onengine.river[cmds[0]]; if (!river) { break }
                can.core.Item(river.storm, function(key, value) {
                    msg.Push("key", key)
                    msg.Push("name", value.name)
                    msg.Push("count", (value.index||value.action).length)
                })
                typeof cb == "function" && cb(msg)
                return true
            case "Action":
                var river = can.onengine.river[cmds[0]||"main"]
                var storm = river && river.storm[cmds[1]]
                var action = storm && storm.action && storm.action[cmds[2]]
                if (!storm) { break } if (cmds.length == 2) {
                    if (storm.index) {
                        can.misc.Run(event, can, {names: pane._name}, [river.name, storm.name, "order"].concat(storm.index), cb)
                        return true
                    }
                    if (location.pathname == "/share") {
                        return false
                    }

                    can.core.List(storm.action, function(value) {
                        msg.Push("name", value.name||"")
                        msg.Push("help", value.help||"")
                        msg.Push("pod", value.pod||"")
                        msg.Push("group", value.group||"")
                        msg.Push("index", value.index||"")
                        msg.Push("args", value.args||"[]")
                        msg.Push("action", value.action||value.index||"")
                        msg.Push("inputs", JSON.stringify(value.inputs||[]))
                        msg.Push("feature", JSON.stringify(value.feature||{}))
                    })
                    typeof cb == "function" && cb(msg)
                } else if (action && action.engine) {
                    action.engine(event, can, msg, pane, cmds, cb)
                } else if (action) {
                    msg.Option("group", action.group)
                    msg.Option("index", action.index)
                    return false
                } else {
                    return false
                }
                return true
        }
        return false
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        if (can.onengine.engine(event, can, msg, pane, cmds, cb)) { return }
        if (location.protocol == "file:") { typeof cb == "function" && cb(msg); return }
        can.misc.Run(event, can, {names: pane._name}, cmds, cb)
    },
})
Volcanos("onappend", { _init: function(can, meta, list, cb, target, field) { meta.name = meta.name.split(" ")[0]
        field = field || can.onappend.field(can, target, meta.type||"plugin", meta).first
        var legend = can.page.Select(can, field, "legend")[0]
        var option = can.page.Select(can, field, "form.option")[0]
        var action = can.page.Select(can, field, "div.action")[0]
        var output = can.page.Select(can, field, "div.output")[0]
        var status = can.page.Select(can, field, "div.status")[0]

        // 添加插件
        var sub = Volcanos(meta.name, { _help: meta.name, _follow: can._follow+"."+meta.name,
            _legend: legend, _option: option, _action: action, _output: output, _status: status,
            _target: field, _inputs: {}, _outputs: [], _history: [],
            Option: function(key, value) {
                if (typeof key == "object") { return sub.core.Item(key, sub.Option), key }
                if (key == undefined) { value = {}
                    sub.page.Select(sub, option, "select.args,input.args", function(item) {
                        value[item.name] = item.value
                    })
                    return value
                }
                sub.page.Select(sub, option, "select[name="+key+"],input[name="+key+"]", function(item) {
                    value == undefined? (value = item.value): (item.value = value)
                })
                return value
            },
            Action: function(key, value) {
                sub.page.Select(sub, action, "select[name="+key+"],input[name="+key+"]", function(item) {
                    value == undefined? (value = item.value): (item.value = value)
                })
                return value
            },
            Status: function(key, value) {
                if (typeof key == "object") { return sub.core.Item(key, sub.Status), key }
                sub.page.Select(sub, status, "div."+key+">span", function(item) {
                    value == undefined? (value = item.innerHTML): (item.innerHTML = value)
                })
                return value
            },
        }, [Volcanos.meta.volcano].concat(list), function(sub) {
            meta.feature = can.base.Obj(meta.feature, {})
            can.page.ClassList.add(can, field, meta.feature.style||"")

            can.onappend._legend(sub, legend)
            if (can.user.Search(can, "share") && can.user.Search(can, "title")) {
                can.page.Select(can, field, "legend", function(item) { can.page.Remove(can, item) })
            }
            sub.onaction && can.onappend._action(sub, sub._action, sub.onaction.list)

            meta.detail = meta.feature["detail"] || {}
            sub.onimport._init(sub, sub.Conf(meta), list, function() {}, field)
            sub.onappend._status(sub, status)

            // 添加控件
            var index = -1
            function add(item, next) { item._input == "text" && index++
                return sub._inputs[item.name] = Volcanos(item.name, { _help: item.name, _follow: can._follow+"."+meta.name+"."+item.name,
                    _target: can.onappend.input(sub, option, item.type, item, args[index]),
                    _option: option, _action: action, _output: output,
                    CloneInput: function() { add(item, function() {}, index)._target.focus() },
                    CloneField: function() {
                        meta.args = can.page.Select(can, option, "textarea.args,input.args,select.args", function(item) {
                            return item.value || ""
                        })
                        can.onappend._init(can, meta, list, function(sub) {
                        cb(sub), sub.Timer(10, function() {
                            for (var k in sub._inputs) { sub._inputs[k]._target.focus(); break }
                        })
                    }, target) },
                }, Volcanos.meta.libs.concat([item.display||"/plugin/input.js"]), function(input) { input.sup = sub
                    input.onimport._init(input, input.Conf(item), item.list||[], function() {}, input._target)

                    if (location.protocol == "chrome-extension:") {
                        var p = sub.user.Cookie(can, item.name)
                        item.type != "button" && p != undefined && (input._target.value = p)
                    }
                    if (can.user.Search(can, "active") == meta.name || can.user.Search(can, "title") == meta.name) {
                        var p = sub.user.Search(can, item.name)
                        p != undefined && (input._target.value = p)
                    }

                    input.run = function(event, cmds, cb, silent) { var msg = sub.request(event)
                        sub.core.Item(sub.Conf("option"), msg.Option)

                        // 控件回调
                        switch (item.name) {
                        case "打开":
                        case "查看":
                                break
                        case "返回":
                            // 历史命令
                            sub._history.pop(); var his = sub._history.pop(); if (his) {
                                can.page.Select(can, option, "input.args", function(item, index) {
                                    item.value = his[index] || ""
                                })
                            }
                            break
                        default:
                            cmds && cmds[0] == "action" || msg.Option("_action", item.name||item.value)
                        }

                        // 解析参数
                        cmds = cmds && cmds.length > 0? cmds: can.page.Select(can, option, "textarea.args,input.args,select.args", function(item) {
                            return item.name && item.value || ""
                        }); for (var i = cmds.length-1; i >= 0; i--) {
                            if (!cmds[i]) { cmds.pop() } else { break }
                        }

                        var last = sub._history[sub._history.length-1]; !can.core.Eq(last, cmds) && cmds[0] != "action" && sub._history.push(cmds)
                        return run(event, cmds, cb, silent)
                    }

                    can.core.Item(input.onaction, function(key, value) {
                        input._target && key.indexOf("on") == 0 && (input._target[key] = input._target[key] || function(event) {
                            value(event, input)
                        })
                    }), next()

                    // 自动执行
                    item.type == "button" && item.action == "auto" && input._target.click()
                })
            }

            var args = can.base.Obj(meta.args, []); can.core.Next(can.base.Obj(meta.inputs, []), add)
            var count = 0; function run(event, cmds, cb, silent) { return sub.run(event, cmds||[], function(msg) {
                sub.Status("ncmd", sub._history.length+"/"+count++)
                if (silent) { typeof cb == "function" && cb(msg); return }

                // 添加组件
                var display = (msg.Option("_plugin")||msg.Option("_display")||meta.feature.plugin||meta.feature.display||"table.js")
                display.indexOf("/") == 0 || (display = "/plugin/"+display)

                var table = Volcanos(display, { _help: display, _follow: can._follow+"."+meta.name+"."+display,
                    _target: output, Option: sub.Option, Action: sub.Action, Status: sub.Status,
                    _option: option, _action: action, _output: output,
                }, Volcanos.meta.libs.concat(["/frame.js", display]), function(table) { table.Conf(sub.Conf()), table._msg = msg
                    table.onimport && table.onimport._init && table.onimport._init(table, msg, msg.result||[], function() {}, output)
                    table.run = function(event, cmds, cb, silent) {
                        cmds = cmds? cmds: sub.page.Select(sub, option, "textarea.args,input.args,select.args", function(item) {
                            return item.name && item.value || ""
                        }); for (var i = cmds.length-1; i >= 0; i--) {
                            if (!cmds[i]) { cmds.pop() } else { break }
                        }

                        var last = sub._history[sub._history.length-1]; !can.core.Eq(last, cmds) && cmds[0] != "action" && sub._history.push(cmds)
                        return run(event, cmds, cb, silent)
                    }

                    // 交互控件
                    can.onappend._action(table, action)
                    can.onappend._detail(table, msg, msg["_detail"] || sub.Conf("detail"), output)
                    can.onappend._status(table, status)
                    sub.Status("ncmd", sub._history.length+"/"+count)
                }); sub._outputs.push(table)
            }, silent) }
        }); cb(sub)
        return sub
    },
    _legend: function(can, legend) {
        legend && (legend.onclick = function(event) { var msg = can.request(event)
            can.core.List(["share", "pod"], function(key) { var value = can.user.Search(can, key)
                value != undefined && msg.Option(key, can.user.Search(can, key))
            })
            can.core.List(["River", "Storm", "Action"], function(item) {
                can.run(event, ["search", item+".onexport.key"])
            })
            var args = {}; can.core.List(msg.option, function(key) { args[key] = msg.Option(key) })
            // can.core.Item(can.Option(), function(key, value) { args[key] = value })
            //

            location.protocol == "chrome:" && can.user.locals(can, args)
            location.href = can.user.Share(can, args, true)
        })
    },
    _action: function(can, action, list) { // [string [class item...] {}]
        action && (action.innerHTML = ""), can.onaction && can.core.List(list||can.onaction.list, function(item) {
            item === ""? /*空白*/ can.page.Append(can, action, [{view: "item space"}]):
                typeof item == "string"? /*按键*/ can.onappend.input(can, action, "input", {type: "button", value: item, onclick: function(event) {
                    var cb = can.onaction[item] ||  can.onaction["_engine"] || can.onkeymap && can.onkeymap._remote
                    cb? cb(event, can, item): can.run(event, ["action", item], function(msg) {}, true)
                }}): item.length > 0? /*列表*/ can.onappend.input(can, action, "input", {type: "select", values: item.slice(1), title: item[0], name: item[0], onchange: function(event) {
                    var which = item[event.target.selectedIndex+1]
                    var cb = can.onaction[which]
                    cb && cb(event, can, which)
                    var cb = can.onaction[item[0]]
                    cb && cb(event, can, item[0], which)
                }}): item.input? /*文本*/ can.page.Append(can, action, [{view: "item", list: [{type: "input", name: item.input[0], onkeydown: function(event) {
                    item.input[1](event, can)
                }}] }]): typeof item == "object" && /*其它*/ can.page.Append(can, action, [item])
        })
    },
    _detail: function(can, msg, list, target) {
        can.ondetail && can.ondetail.list && can.ondetail.list.length > 0 && (target.oncontextmenu = function(event) {
            can.user.carte(can, can.ondetail||{}, list, function(ev, item, meta) {
                (can.ondetail[item] || can.onaction[item] || can.onkeymap && can.onkeymap._remote)(event, can, item)
            })
        })
    },
    _status: function(can, status) {
        status.innerHTML = "", can.onexport && can.core.List(can.onexport.list, function(item) {
            can.page.Append(can, status, [{view: "item "+item, title: item, list: [{text: [item+": ", "label"]}, {text: ["", "span"]}]}])
        })
    },
    item: function(can, target, type, item, cb, cbs) {
        var ui = can.page.Append(can, target, [{view: [type, "div", item.nick||item.name],
            oncontextmenu: function(event) { cbs(event, ui.item) }, click: function(event) {
                can.page.Select(can, target, "div."+type, function(item) {
                    can.page.ClassList.del(can, item, "select")
                }); can.page.ClassList.add(can, ui.item, "select")
                cb(event, ui.item)
            },
        }])
        return ui.item.Meta = item, ui.item
    },
    tree: function(can, msg, target, cb) {
        var list = {}; msg.Table(function(value) {
            can.core.List(value.path.split("/"), function(item, index, array) {
                var last = array.slice(0, index).join("/")
                var name = array.slice(0, index+1).join("/")
                list[name] || (list[name] = can.page.Append(can, list[last]||target, [{view: ["item", "div", item+(index==array.length-1?"":"/")], onclick: function(event) {
                    var hide = list[name].style.display == "none"
                    can.page.Modify(can, list[name], {style: {display: hide? "": "none"}})
                    index == array.length - 1 && typeof cb == "function" && cb(event, value)
                }}, {view: "list", style: {display: "none"}}]).last)
            })
        })
    },
    menu: function(can, msg, value) {
        can.ondetail && can.ondetail.list && can.ondetail.list.length > 0 && (can._target.oncontextmenu = function(event) {
            can.user.carte(can, can.ondetail||{}, msg["_detail"] || can.Conf("detail"), function(ev, item, meta) {
                (can.ondetail[item]||can.onaction[item])(event, can, value, item)
            })
        })
    },
    field: function(can, target, type, item) { var dataset = {}; item && item.name && (dataset.names = item.name)
        item.help = typeof item.help == "string" && item.help.startsWith("[") && (item.help = can.base.Obj(item.help, [""])[0]) || item.help || ""
        var field = can.page.Append(can, target, [{view: [(type||"")+" "+(item.name||"")+" "+(item.pos||""), "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"")+"("+(item.help||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: []},
            {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}])
        return field.first.Meta = item, field
    },
    input: function(can, option, type, item, value) {
        item.name && item.name.indexOf("@") == 0 && (item.name = item.name.slice(1)) && (item.position = item.position || "opts")
        item.figure = item.figure || item.value || ""
        item.action = item.action || item.value || ""
        item.cb = item.cb || item.value || ""

        var input = {type: "input", name: item.name, data: item, dataset: {}}
        switch (item.type = item.type || item._type || item._input || "text") {
            case "upfile": item.type = "file"; break
            case "button": item.value = item.name || item.value || "查看"; break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values
                if (!item.values && item.value) {
                    item.values = item.value.split("|") 
                    item.value = item.values[0]
                    if (item.values[0] == "day") {
                        item.value = item.values[1]
                    }
                }
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value}
                })
                item.className || can.page.ClassList.add(can, item, item.position||"args")
                break
            case "textarea":
                input.type = "textarea"
                // no break
            case "password":
                // no break
            case "text":
                item.value = value || item.value || ""
                item.className || can.page.ClassList.add(can, item, item.position||"args")
                item.autocomplete = "off"
                break
        }

        item.value == "auto" && (item.value = "")
        item.action == "auto" && (input.dataset.action = "auto")
        var target = can.page.Append(can, option, [{view: ["item "+item.type], list: [item.position && {text: item.name+": "}, input]}])[item.name]
        item.figure && item.figure.indexOf("@") == 0 && (item.figure = item.figure.slice(1)) && can.require(["/plugin/input/"+item.figure], function(can) {
            can.core.Item(can.onfigure[item.figure], function(key, value) { if (key.startsWith("on")) {
                target[key] = function(event) { value(event, can, item, target) }
            } })
            target.type != "button" && (target.value = "")
        })

        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}])
        item.type == "text" && !target.placeholder && (target.placeholder = item.name || "")
        item.type == "text" && !target.title && (target.title = target.placeholder)
        // item.type == "button" && item.action == "auto" && can.run && can.run({})
        item.type == "select" && item.value && (target.value = item.value)
        return target
    },
    table: function(can, target, type, msg, cb) {
        var table = can.page.AppendTables(can, target, msg, msg.append, cb || function(value, key, index, line) {
            function run(event, item, value) {
                var msg = can.request(event)
                msg.Option(can.Option()), msg.Option(line)
                var cb = can.onaction[item] || can.onaction["运行"]
                cb? cb(event, can, item): can.run(event, ["action", item, key=="value"? line.key: key, value.trim()], function(res) {
                    can.ui.display.innerHTML = ""
                    can.onappend.table(can, can.ui.display, "table", res)
                    can.onappend.board(can, can.ui.display, "board", res)
                }, true)
            }
            return {type: "td", inner: value, click: function(event) {
                var target = event.target; if (target.tagName == "INPUT" && target.type == "button") {
                    switch (target.value) {
                        case "复制":
                            navigator.clipboard.writeText(line.text).then(function() {
                                can.user.toast(can, "复制成功", "paste")
                            })
                            return
                    }
                    return run(event, event.target.value, value)
                }
                can.page.Select(can, can._option, "input.args", function(input) { if (input.name == key) { var data = input.dataset || {}
                    input.value = value; typeof cb == "function" && cb(event, value); if (data.action == "auto") {
                        var sub = can.request(event)
                        can.core.Item(can.Option(), sub.Option)
                        sub.Option("_action", msg.Option("_action"))
                        can.run(event, can.page.Select(can, can._option, "input.args", function(item) {
                            return item.name && item.value || ""
                        }))
                    }
                } })
            }, ondblclick: function(event) {
                can.onappend.modify(can, event.target, function(event, value, old) {
                    run(event, "编辑", value)
                })
            }, oncontextmenu: function(event) {
                can.user.carte(can, can.ondetail||{}, msg["_detail"] || can.Conf("detail") || can.ondetail.list, function(event, item, meta) {
                    switch (item) {
                        case "编辑":
                            can.onappend.modify(can, event.target, function(event, value, old) {
                                run(event, "编辑", value)
                            })
                            break
                        default:
                            run(event, item, value)
                    }
                })
            }, }
        })
        return table
    },
    board: function(can, target, type, msg) {
        msg.result && can.page.AppendBoard(can, target, can.page.Display(msg.Result()))
    },

    modify: function(can, target, cb) { var back = target.innerHTML
        var ui = can.page.Appends(can, target, [{type: "input", value: back, onkeydown: function(event) {
            switch (event.key) {
                case "Enter":
                    target.innerHTML = event.target.value
                    if (event.target.value != back) {
                        cb(event, event.target.value, back)
                    }
                    break
                case "Escape":
                    td.innerHTML = back
                    break
            }
        }, onkeyup: function(event) {

        }}]); ui.input.focus(), ui.input.setSelectionRange(0, -1)
    },
    daemon: function(can, name) {
        can.misc.WSS(can, "", {name: name, type: "chrome"}, function(event, msg) {
            if (msg.Option("_handle")) {return can.user.toast(can, msg.result.join(""))}

            can.user.toast(can, msg.detail.join(" ")); switch (msg.detail[0]) {
                case "pwd": msg.Echo("hello world"); break
                default:
                    can.run(event, ["search"].concat(msg.detail), function(msg) {
                        msg.Reply(msg)
                    }); return

                msg.Reply(msg)
            }
        }, function() {can.user.toast(can, "wss connect", "iceberg")})
    },
}, [], function(can) {})
Volcanos("onlayout", { _init: function(can, meta, list, cb, target) {
        if (can.user.Search(can, "share")) { return typeof cb == "function" && cb() }
        var width = can._width, height = can._height

        can.page.Select(can, target, "fieldset.head", function(field) {
            height -= field.offsetHeight
        })
        can.page.Select(can, target, "fieldset.foot", function(field) {
            height -= field.offsetHeight
        })

        can.page.Select(can, target, ["fieldset.middle"], function(field, index) {
            var border = field.offsetHeight - field.clientHeight
            can.page.Modify(can, field, { style: {
                height: height-border*2+"px",
            } })
            can.page.Select(can, field, "div.output", function(output) {
                var border = output.offsetHeight - output.clientHeight
                can.page.Modify(can, output, { style: {
                    height: height-border*2-14+"px",
                } })
            })
        })

        can.page.Select(can, target, ["fieldset.left", "fieldset.right"], function(field, index) {
            var border = field.offsetHeight - field.clientHeight
            can.page.Modify(can, field, { style: {
                height: height-border*2+"px",
            } })

            can.page.Select(can, field, "div.output", function(output) {
                var border = output.offsetHeight - output.clientHeight
                can.page.Modify(can, output, { style: {
                    height: height-border*2-40+"px",
                } })
            })
        })
        typeof cb == "function" && cb()
    },
})
Volcanos("onkeypop", {help: "键盘交互", list: [], _init: function(can) {
    document.body.onkeydown = function(event) { if (event.target != document.body) { return }
        if (can.onkeypop.action && can.onkeypop.action.onimport) {
            can.onkeypop.action.onimport.keydown(event, can.onkeypop.action, event.key)
            return
        }
        switch (event.key) {
            case "n":
                can.run(event, ["search", "River.onaction.create"])
                break
            case "m":
                can.run(event, ["search", "Storm.onaction.create"])
                break
            case " ":
                can.search.focus()
                can.search.setSelectionRange(0, -1)
                break
            default:
                return
        }
        event.stopPropagation()
        event.preventDefault()
    }
    document.body.onkeyup = function(event) {
        console.log(event)
    }
},
    action: null,
})
Volcanos("onmotion", {help: "动态交互", list: [], _init: function(can) {
},
    show: function(can, target, time, cb) { time = time || {value: 100, length: 30}
        can.page.Modify(can, target, {style: {opacity: 0}})
        can.Timer(time, function(event, value, index) {
            can.page.Modify(can, target, {style: {opacity: (index+1)/time.length}})
        }, cb)
    },
    hide: function(can, target, time) { time = time || {value: 100, length: 30}
        can.page.Modify(can, target, {style: {opacity: 1}})
        can.Timer(time, function(event, value, index) {
            console.log(arguments)
            can.page.Modify(can, target, {style: {opacity: 1-(index+1)/time.length}})
        }, function() {
        })
    },
})
