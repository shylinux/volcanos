Volcanos("onengine", {help: "解析引擎", list: [], _init: function(can, meta, list, cb, target) {
        can.core.Next(meta.panes, function(item, next) { item.type = "pane"
            can.onappend._init(can, item, item.list, function(pane) {
                pane.onaction && pane.onappend._action(pane, pane._action, item._action||pane.onaction.list)
                pane.run = function(event, cmds, cb, silent) { var msg = pane.request(event); cmds = cmds || []
                    return (can.onengine[cmds[0]]||can.onengine[meta.main.engine])(event, can, msg, pane, cmds, function(msg) {
                        typeof cb == "function" && cb(msg)
                    })
                }, can[item.name] = pane, next()
            }, target)
        }, function() {
            can.onlayout._init(can, meta, list, function() {
                can.onkeypop._init(can)
            }, target)

            can.require(meta.main.list, function(can) {
                var pane = can[meta.main.name], msg = can.request({})
                pane.onengine._daemon(pane, pane.user.title())
                pane.onaction._init(pane, msg, [], function(msg) {
                    typeof cb == "function" && cb(msg)
                }, pane._target)
            })
        })
    },
    _daemon: function(can, name) {
        can.misc.WSS(can, "", {type: "chrome", name: name}, function(event, msg, cmd, arg) {
            if (msg.Option("_handle")) { return can.user.toast(can, msg.result.join("")) }
            can.user.toast(can, msg.detail.join(" "))

            switch (cmd) {
            case "pwd":
                msg.Echo("hello world")
                break
            default:
                can.run(event, ["search"].concat(msg.detail), function(msg) {
                    msg.Reply(msg)
                })
                return
            }
            msg.Reply(msg)
        }, function() { can.user.toast(can, "wss connect", "iceberg") })
    },

    search: function(event, can, msg, pane, cmds, cb) { var chain = cmds[1]
        var sub, mod = can, key, fun = can; can.core.List(chain.split("."), function(value, index, array) {
            fun && (sub = mod, mod = fun, key = value, fun = mod[value])
        }); if (!sub || !mod || !fun) { console.info("not found", chain); return }
        return typeof fun == "function" && fun(sub, msg, cmds.slice(2), cb, sub._target)
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        if (can.onengine.engine(event, can, msg, pane, cmds, cb)) { return }
        can.misc.Run(event, can, {names: pane._name}, cmds, cb)
        pane.run(event, ["search", "Footer.onimport.ncmd"])
    },
    engine: function(event, can, msg, pane, cmds, cb) {
        switch (pane._name) {
            case "River":
                cmds.length == 0 && can.core.Item(can.onengine.river, function(key, value) {
                    msg.Push("hash", key), msg.Push("name", value.name)
                }); if (cmds.length != 1 && cmds[1] != "tool") { return false }

                var river = can.onengine.river[cmds[0]]; if (!river) { return false }
                can.core.Item(river.storm, function(key, value) {
                    msg.Push("hash", key), msg.Push("name", value.name)
                }), typeof cb == "function" && cb(msg)
                return true

            case "Action":
                var river = can.onengine.river[cmds[0]]
                var storm = river && river.storm[cmds[1]]
                if (!storm || cmds.length != 2) { break }

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
        }
        return false
    },
    river: {
        "serivce": {name: "运营群", storm: {
            "wx": {name: "公众号 wx",  action: [
                {name: "微信公众号", help: "wx", index: "web.wiki.word", args: ["usr/icebergs/misc/wx/wx.shy"]},
            ]},
            "mp": {name: "小程序 mp",  action: [
                {name: "微信小程序", help: "mp", index: "web.wiki.word", args: ["usr/icebergs/misc/mp/mp.shy"]},
            ]},
            "lark": {name: "机器人 lark",  action: [
                {name: "飞书机器人", help: "lark", index: "web.wiki.word", args: ["usr/icebergs/misc/lark/lark.shy"]},
            ]},
            "share": {name: "上下文 share",  action: [
                {name: "系统上下文", help: "shylinux/contexts", index: "web.wiki.word", args: ["usr/learning/社会/管理/20200724.shy"]},
            ]},
        }},
        "product": {name: "产品群", storm: {
            "office": {name: "办公 office",  action: [
                {name: "feel", help: "影音", index: "web.wiki.feel"},
                {name: "draw", help: "绘图", index: "web.wiki.draw"},
                {name: "data", help: "数据", index: "web.wiki.data"},
                {name: "plan", help: "计划", index: "web.team.plan"},
                {name: "think", help: "智库", index: "web.wiki.word", args: ["usr/learning/"]},
                {name: "index", help: "索引", index: "web.wiki.word", args: ["usr/learning/index.shy"]},
                {name: "context", help: "编程", index: "web.wiki.word", args: ["usr/learning/自然/编程/context.shy"]},
            ]},
            "english": {name: "英汉 english",  action: [
                {name: "english", help: "英汉", index: "web.wiki.alpha.alpha", args: ["word", "hi"]},
                {name: "chinese", help: "汉英", index: "web.wiki.alpha.alpha", args: ["line", "你好"]},
                {name: "wubi", help: "五笔", index: "web.code.input.wubi", args: ["word", "wqvb"]},
                {name: "wubi", help: "五笔", index: "web.code.input.wubi", args: ["line", "你好"]},
            ]},
            "learning": {name: "学习 learning",  action: [
                {name: "golang", help: "编程", index: "web.wiki.word", args: ["usr/golang-story/src/main.shy"]},
                {name: "tmux", help: "粘贴", index: "web.code.tmux.text"},
                {name: "study", help: "学习", index: "web.wiki.word", args: ["usr/learning/study.shy"]},
            ]},
            "chrome": {name: "爬虫 chrome",  action: [
                {name: "feel", help: "网页爬虫", index: "web.wiki.feel", args: ["spide/"], feature: {
                    display: "/plugin/local/wiki/feel.js",
                    height: 200, limit: 3,
                }},
                {name: "cached", help: "爬虫缓存", index: "web.code.chrome.cache", args: []},
                {name: "spided", help: "网页爬虫", index: "web.code.chrome.spide", args: location && location.protocol && location.protocol=="chrome-extension:"? ["1", "", "spide"]: ["1"]},
            ]},
            "context": {name: "理念 context",  action: [
                {name: "contexts", help: "上下文", index: "web.wiki.word", args: ["src/task.shy"]},
            ]},
        }},
        "project": {name: "研发群", storm: {
            "studio": {name: "研发 studio", action: [
                {name: "route", help: "路由器", index: "web.route"},
                {name: "tmux", help: "命令行", index: "web.code.tmux.session"},
                {name: "vimer", help: "编辑器", index: "web.code.vimer", args: ["src/", "main.go"]},
                {name: "repos", help: "代码库", index: "web.code.git.status"},
                {name: "total", help: "统计量", index: "web.code.git.total"},
                {name: "plan", help: "任务表", index: "web.team.plan"},
                {name: "contexts", help: "上下文", index: "web.wiki.word", args: ["src/main.shy"]},
            ]},
            "cli": {name: "命令 cli",  action: [
                {name: "bash", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/bash/bash.shy"]},
                {name: "tmux", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/tmux/tmux.shy"]},
                {name: "git", help: "代码库", index: "web.wiki.word", args: ["usr/icebergs/misc/git/git.shy"]},
                {name: "vim", help: "编辑器", index: "web.wiki.word", args: ["usr/icebergs/misc/vim/vim.shy"]},
                {name: "ssh", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/base/ssh/ssh.shy"]},
                {name: "zsh", help: "命令行", index: "web.wiki.word", args: ["usr/icebergs/misc/bash/zsh.shy"]},
            ]},
            "web": {name: "网页 web",  action: [
                {name: "HTML5", help: "浏览器", index: "web.wiki.word", args: ["usr/icebergs/misc/chrome/chrome.shy"]},
            ]},
            "linux": {name: "系统 linux",  action: [
                {name: "idc", help: "平台", index: "web.wiki.word", args: ["usr/linux-story/idc/idc.shy"]},
                {name: "iso", help: "系统", index: "web.wiki.word", args: ["usr/linux-story/iso/iso.shy"]},
                {name: "iot", help: "设备", index: "web.wiki.word", args: ["usr/linux-story/iot/iot.shy"]},
                {name: "linux", help: "系统", index: "web.wiki.word", args: ["usr/linux-story/src/main.shy"]},
            ]},
            "nginx": {name: "代理 nginx",  action: [
                {name: "nginx", help: "代理", index: "web.wiki.word", args: ["usr/nginx-story/src/main.shy"]},
            ]},
            "golang": {name: "编程 golang",  action: [
                {name: "grafana", help: "可视化", index: "web.wiki.word", args: ["usr/golang-story/src/grafana/grafana.shy"]},
                {name: "gogs", help: "代码库", index: "web.wiki.word", args: ["usr/golang-story/src/gogs/gogs.shy"]},
                {name: "golang", help: "编程", index: "web.wiki.word", args: ["usr/golang-story/src/main.shy"]},
            ]},
            "redis": {name: "缓存 redis",  action: [
                {name: "redis", help: "缓存", index: "web.wiki.word", args: ["usr/redis-story/src/main.shy"]},
            ]},
            "mysql": {name: "数据 mysql",  action: [
                {name: "mysql", help: "数据存储", index: "web.wiki.word", args: ["usr/mysql-story/src/main.shy"]},
            ]},
        }},
        "profile": {name: "测试群", storm: {
            "pprof": {name: "pprof", index: [
                "web.code.bench",
                "web.code.pprof",
                "web.code.favor",
            ]},
        }},
        "operate": {name: "运维群", storm: {
            "relay": {name: "relay", index: [
                "aaa.totp",
                "web.route",
                "web.space",
                "web.dream",
                "web.code.tmux.session",
            ]},
            "os": {name: "os",  action: [
                {name: "操作系统", help: "os", index: "web.wiki.word", args: ["usr/learning/自然/编程/system.shy"]},
            ]},
        }},
    },
})
Volcanos("onappend", {help: "渲染引擎", list: [], _init: function(can, meta, list, cb, target, field) {
        meta.name = meta.name.split(" ")[0]
        field = field || can.onappend.field(can, target, meta.type, meta).first
        var legend = can.page.Select(can, field, "legend")[0]
        var option = can.page.Select(can, field, "form.option")[0]
        var action = can.page.Select(can, field, "div.action")[0]
        var output = can.page.Select(can, field, "div.output")[0]
        var status = can.page.Select(can, field, "div.status")[0]

        var sub = Volcanos(meta.name, { _help: meta.name, _follow: can._follow+"."+meta.name,
            _legend: legend, _option: option, _action: action, _output: output, _status: status,
            _target: field, _inputs: {}, _outputs: [], _history: [],
            Option: function(key, value) {
                if (key == undefined) { value = {}
                    sub.page.Select(sub, option, "textarea.args,input.args,select.args", function(item) {
                        item.name && item.value && (value[item.name] = item.value)
                    }); return value
                }

                if (typeof key == "object") { return sub.core.Item(key, sub.Option), key }
                sub.page.Select(sub, option, "textarea[name="+key+"],"+"input[name="+key+"],"+"select[name="+key+"]", function(item) {
                    value == undefined? (value = item.value): (item.value = value)
                }); return value
            },
            Action: function(key, value) {
                if (typeof key == "object") { return sub.core.Item(key, sub.Action), key }
                sub.page.Select(sub, action, "textarea[name="+key+"],"+"input[name="+key+"],"+"select[name="+key+"]", function(item) {
                    value == undefined? (value = item.value): (item.value = value)
                }); return value
            },
            Status: function(key, value) {
                if (typeof key == "object") { return sub.core.Item(key, sub.Status), key }
                sub.page.Select(sub, status, "div."+key+">span", function(item) {
                    value == undefined? (value = item.innerHTML): (item.innerHTML = value)
                }); return value
            },
            Clone: function() {
                meta.args = sub.page.Select(sub, option, "textarea.args,input.args,select.args", function(item) {
                    return item.name && item.value || ""
                })
                can.onappend._init(can, meta, list, function(sub) {
                    typeof cb == "function" && cb(sub)
                    can.core.Timer(10, function() {
                        for (var k in sub._inputs) { sub._inputs[k]._target.focus(); break }
                    })
                }, target)
            },
            Pack: function(cmds, slient) {
                cmds = cmds && cmds.length > 0? cmds: sub.page.Select(sub, option, "textarea.args,input.args,select.args", function(item) {
                    return item.name && item.value || ""
                }); for (var i = cmds.length-1; i >= 0; i--) {
                    if (!cmds[i]) { cmds.pop() } else { break }
                }

                var last = sub._history[sub._history.length-1]; !sub.core.Eq(last, cmds) && cmds[0] != "action" && !slient && sub._history.push(cmds)
                return cmds
            },
        }, Volcanos.meta.libs.concat(list.concat([Volcanos.meta.volcano])), function(sub) { sub.Conf(meta)
            meta.feature = sub.base.Obj(meta.feature, {})
            sub.page.ClassList.add(sub, field, meta.style||meta.feature.style||"")

            typeof cb == "function" && cb(sub)
            meta.inputs && sub.onappend._option(sub, meta, list, cb)
        })
    },
    _option: function(can, meta, list, cb) { var index = -1, args = can.base.Obj(meta.args||meta.arg, [])
        function add(item, next) { item._input != "button" && index++
            var input = Volcanos(item.name, { _help: item.name, _follow: can._follow+"."+item.name,
                _target: can.onappend.input(can, can._option, item.type, item, args[index]),
                _option: can._option, _action: can._action, _output: can._output,
                CloneInput: function() { add(item)._target.focus() },
                CloneField: function() { can.Clone() },
                Option: can.Option,
            }, Volcanos.meta.libs.concat([item.display||"/plugin/input.js", Volcanos.meta.volcano]), function(input) {
                input.Conf(item), input.sup = can
                input.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event, can.Conf("option"))
                    return can.onappend._output(can, meta, event, can.Pack(cmds), cb, silent)
                }

                input.onaction && input.onaction._init && input.onaction._init(input, item, [], next, input._target)
            }); return can._inputs[item.name] = input
        }; can.core.Next(can.base.Obj(meta.inputs, []), add)
    },
    _action: function(can, action, list) {
        can.onmotion.clear(can, action), can.core.List(list, function(item) {
            item === ""? /*空白*/ can.page.Append(can, action, [{view: "item space"}]):
                typeof item == "string"? /*按键*/ can.onappend.input(can, action, "input", {type: "button", value: item, onclick: function(event) {
                    var cb = can.onaction[item] || can.onaction["_engine"] || can.onkeymap && can.onkeymap._remote
                    cb? cb(event, can, item): can.run(event, ["action", item], function(msg) {}, true)
                }}): item.length > 0? /*列表*/ can.onappend.input(can, action, "input", {type: "select", name: item[0], values: item.slice(1), title: item[0], onchange: function(event) {
                    var which = item[event.target.selectedIndex+1]
                    var cb = can.onaction[which]
                    typeof cb == "function" && cb(event, can, which)
                    var cb = can.onaction[item[0]]
                    typeof cb == "function" && cb(event, can, item[0], which)
                }}): item.input? /*文本*/ can.page.Append(can, action, [{view: "item", list: [{type: "input", name: item.input[0], onkeydown: function(event) {
                    item.input[1](event, can)
                }}] }]): typeof item == "object" && /*其它*/ can.page.Append(can, action, [item])
        })
    },
    _output: function(can, meta, event, cmds, cb, silent) {
        var msg = can.request(event)
        can.page.Select(can, can._output, "div.control .args", function(item) {
            item.name && item.value && msg.Option(item.name, item.value)
        })

        can.run(event, cmds||[], function(msg) {
            if (can.onimport._process(can, msg, cmds, cb)) { return }

            typeof cb == "function" && cb(msg)
            if (silent) { return }

            var display = meta.feature.display || "table.js"
            display.indexOf("/") == 0 || (display = "/plugin/"+display)
            display.endsWith(".js") || (display += ".js")

            var output = Volcanos(display, { _help: display, _follow: can._follow+"."+display,
                _target: can._output, _fields: can._target,
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                Option: can.Option, Action: can.Action, Status: can.Status,
            }, Volcanos.meta.libs.concat([display, Volcanos.meta.volcano]), function(table) {
                table.Conf(can.Conf()), table.sup = can
                table.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event, can.Conf("option"))
                    return can.onappend._output(can, meta, event, can.Pack(cmds, silent), cb, silent)
                }, table._msg = msg

                table.onimport && table.onimport._init && table.onimport._init(table, msg, msg.result||[], function(msg) {
                    table.onaction && table.onappend._action(table, table._action, msg._action||meta._action||table.onaction.list)
                    table.ondetail && table.onappend._detail(table, table._output, msg._detail||meta._detail||table.ondetail.list)
                    table.onexport && table.onappend._status(table, table._status, msg._export||meta._export||table.onexport.list)
                }, can._output)
            }); can._outputs.push(output)
        }, silent)
    },
    _detail: function(can, target, list, cb) {
        list.length > 0 && (target.oncontextmenu = function(event) {
            can.user.carte(can, can.ondetail||{}, list, function(ev, item, meta) {
                (cb||can.ondetail[item]||can.onaction[item])(event, can, item)
            })
        })
    },
    _status: function(can, status, list) {
        can.onmotion.clear(can, status), can.core.List(list, function(item) {
            can.page.Append(can, status, [{view: "item "+item, title: item, list: [
                {text: [item, "label"]}, {text: [": ", "label"]}, {text: ["", "span"]},
            ], }])
        })
    },

    item: function(can, target, type, item, cb, cbs) {
        var ui = can.page.Append(can, target, [{view: [type, "div", item.nick||item.name],
            click: function(event) {
                can.page.Select(can, target, "div."+type, function(item) {
                    can.page.ClassList.del(can, item, "select")
                }), can.page.ClassList.add(can, ui.item, "select")
                cb(event, ui.item)
            }, oncontextmenu: function(event) { cbs(event, ui.item) },
        }])
        return ui.item
    },
    tree: function(can, msg, field, split, target, cb) {
        var list = {}; msg.Table(function(value) {
            value[field] && can.core.List(value[field].split(split), function(item, index, array) {
                var last = array.slice(0, index).join(split)
                var name = array.slice(0, index+1).join(split)
                list[name] || (list[name] = can.page.Append(can, list[last]||target, [{view: ["item", "div", item+(index==array.length-1?"":split)], onclick: function(event) {
                    can.page.Toggle(can, list[name])

                    index == array.length - 1 && typeof cb == "function" && cb(event, value)
                }}, {view: "list", style: {display: "none"}}]).last)
            })
        })
    },
    field: function(can, target, type, item) {
        return can.page.Append(can, target, [{view: [(type||"")+" "+(item.name||"")+" "+(item.pos||""), "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"").split(" ")[0]+"("+(item.help||"").split(" ")[0]+")", "legend"]},
            {view: ["option", "form"]}, {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}])
    },
    input: function(can, option, type, item, value) {
        item.name && item.name.indexOf("@") == 0 && (item.name = item.name.slice(1)) && (item.position = item.position || "opts")
        item.figure = item.figure || item.value || ""
        item.action = item.action || item.value || ""
        item.cb = item.cb || item.value || ""

        var input = {type: "input", name: item.name, data: item, dataset: {}}
        item.value == "auto" && (item.value = "", item.action = "auto")
        item.action == "auto" && (input.dataset.action = "auto")

        switch (item.type = item.type || item._type || item._input || "text") {
            case "upfile": item.type = "file"; break
            case "button": item.value = item.value || can.Conf("feature.trans."+item.name) || item.name || "查看"; break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values
                if (!item.values && item.value) {
                    item.values = item.value.split("|") 
                    item.value = item.values[0]
                    if (item.values[0] == "day") {
                        item.value = item.values[1]
                    }
                }
                item.value = value || item.value
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value}
                })
                item.className || can.page.ClassList.add(can, item, item.position||"args")
                break
            case "textarea":
                input.type = "textarea"
                item.value = can.Conf("content") || item.value
                // no break
            case "password":
                // no break
            case "text":
                item.value = value || item.value || ""
                item.className || can.page.ClassList.add(can, item, item.position||"args")
                item.autocomplete = "off"
                break
        }

        var target = can.page.Append(can, option, [{view: ["item "+item.type], list: [item.position && {text: item.name+": "}, input]}])[item.name]
        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}])
        return target
    },
    table: function(can, msg, target, type, cb) {
        return can.page.AppendTable(can, msg, target, msg.append, cb)
    },
    board: function(can, msg, target, type, text) { text = text || can.page.Display(msg.Result())
        return text && can.page.Append(can, target, [{view: ["code", "div", text]}]).code
    },

    plugin: function(can, value, cb, target) { value = value || {}
        can.run({}, ["action", "command", value.index], function(msg) {
            value.feature = can.base.Obj(msg.meta&&msg.meta[0] || "{}", {})
            value.inputs = can.base.Obj(msg.list&&msg.list[0] || "[]", [])

            value.name = value.name || msg.name&&msg.name[0] || "story"
            value.help = value.help || msg.help&&msg.help[0] || "story"
            value.width = can._target.offsetWidth
            value.type = "story"

            can.onappend._init(can, value, ["/plugin/state.js"], function(story) {
                story.page.Remove(story, story._legend)
                typeof cb == "function" && cb(story, value)
            }, target || can._output)
        }, true)
    },
}, [], function(can) {})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can, meta, list, cb, target) {
        if (can.user.Search(can, "share")) { return typeof cb == "function" && cb() }
        var width = can._width, height = can._height

        can.page.Select(can, target, "fieldset.head", function(field) {
            height -= field.offsetHeight + 15
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
    var list = ['q', 'a', 'z', 'w', 's', 'x', 'e', 'd', 'c', 'r', 'f', 'v', 't', 'g', 'b', 'y', 'h', 'n', 'u', 'j', 'm', 'i', 'k', 'o', 'l', 'p'];
    var ui = can.page.Append(can, document.body, [{view: "high", list: can.core.List(list, function(c, i) {
        return {view: "char "+c, style: {position: "fixed", "bottom": "0", 
            left: document.body.clientWidth/list.length*i+"px",
            width: document.body.clientWidth/list.length+"px",
            height: "10px", background: "red",
        }}
    })}])
    var iu = can.page.Append(can, document.body, [{view: "nice", style: {position: "fixed", top: 40, width: 0, height: 40}}])
    can.core.Timer({interval: 100}, function() {
        can.page.Select(can, ui.high, "div.char", function(item) {
            item.offsetHeight > -2 && can.page.Modify(can, item, {style: {
                height: item.offsetHeight-item.offsetHeight/200-1+"px",
            }})
        })
        can.page.Select(can, document.body, "div.nice", function(item) {
            item.offsetWidth > -2 && can.page.Modify(can, item, {style: {
                width: item.offsetWidth-1, left: (document.body.clientWidth-item.offsetWidth-1)/2,
            }})
        })
    })

    var count = 0, add = true
    can.core.Timer({interval: 100}, function() {
        if (add) {
            count++
            if (count > 100) {
                add = false
            }
        } else {
            count--
            if (count < 0) {
                add = true
            }
        }

        can.page.Select(can, document.body, "fieldset.Action fieldset", function(item) {
            can.page.Modify(can, item, {style: {
                "box-shadow": "40px 10px 10px "+(count/10+1)+"px #626bd0",
            }})
        })
    })


    document.body.onkeydown = function(event) { if (event.target != document.body) { return }
        if (can.onkeypop.action && can.onkeypop.action.onimport) {
            can.onkeypop.action.onimport.keydown(event, can.onkeypop.action, event.key)
            return
        }
        switch (event.key) {
            case " ":
                break
            case "g":
                can.page.Select(can, document.body, "fieldset.Action>div.output", function(item) {
                    item.scrollBy(0, -10000)
                })
                break
            case "j":
                can.page.Select(can, document.body, "fieldset.Action>div.output", function(item) {
                    item.scrollBy(0, 30)
                })
                break
            case "f":
                can.page.Select(can, document.body, "fieldset.Action>div.output", function(item) {
                    item.scrollBy(0, 300)
                })
                break
            case "e":
                can.page.Select(can, document.body, "fieldset.Action>div.output", function(item) {
                    item.scrollBy(0, -30)
                })
                break
            case "k":
                can.page.Select(can, document.body, "fieldset.Action>div.output", function(item) {
                    item.scrollBy(0, -30)
                })
                break
            default:
                return
        }
        event.stopPropagation()
        event.preventDefault()
    }
    document.body.onkeyup = function(event) {
    }
},
    oninput: function(event, can, local) {var target = event.target
        if (event.ctrlKey) {
            if (typeof local == "function" && local(event)) {
                event.stopPropagation()
                event.preventDefault()
                return true
            }

            var his = target.History || []
            var pos = target.Current || -1
            switch (event.key) {
                case "p":
                    pos = (pos-1+his.length+1) % (his.length+1)
                    target.value = pos < his.length? his[pos]: ""
                    target.Current = pos
                    break
                case "n":
                    pos = (pos+1) % (his.length+1)
                    target.value = pos < his.length? his[pos]: ""
                    target.Current = pos
                    break
                case "a":
                case "e":
                case "f":
                case "b":
                    break
                case "h":
                    can.page.DelText(target, target.selectionStart-1, target.selectionStart)
                    break
                case "d":
                    can.page.DelText(target, 0, target.selectionStart)
                    break
                case "k":
                    can.page.DelText(target, target.selectionStart)
                    break
                case "u":
                    can.page.DelText(target, 0, target.selectionEnd)
                    break
                case "w":
                    var start = target.selectionStart-2
                    var end = target.selectionEnd-1
                    for (var i = start; i >= 0; i--) {
                        if (target.value[end] == " " && target.value[i] != " ") {
                            break
                        }
                        if (target.value[end] != " " && target.value[i] == " ") {
                            break
                        }
                    }
                    can.page.DelText(target, i+1, end-i)
                    break
                default:
                    return false
            }
        } else {
            switch (event.key) {
                case " ":
                    event.stopPropagation()
                    return true
                default:
                    return false
            }
        }

        event.stopPropagation()
        event.preventDefault()
        return true
    },
    action: null, show: function(event, can) {
    var key = event.key, map = {
        "~": "q",
        "`": "q",
        "1": "q",
        "2": "w",
        "3": "e",
        "4": "r",
        "5": "t",
        "6": "y",
        "7": "u",
        "8": "i",
        "9": "o",
        "0": "p",
        "-": "o",
        "=": "p",
        "[": "i",
        "]": "o",
        "\\": "p",
        ";": "k",
        "'": "l",
        ",": "k",
        ".": "l",
        "/": "p",
    }; key = map[key]||key

    key = key >= 'a' && key <= 'z'? key: 'a' + parseInt(Math.random()*26)
    var some = 0.8
    can.page.Select(can, document.body, "div.char."+key, function(item) {
        can.page.Modify(can, item, {style: {
            background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
            height: item.offsetHeight+100+"px",
        }})
    })
    can.page.Select(can, document.body, "div.nice", function(item) {
        can.page.Modify(can, item, {style: {
            background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
            width: item.offsetWidth<document.body.clientWidth? item.offsetWidth+100: item.offsetWidth+10, left: (document.body.clientWidth-item.offsetWidth-10)/2,
        }})
    })

    switch (event.key) {
        case " ":
            can.page.Select(can, document.body, "div.char", function(item) {
                can.page.Modify(can, item, {style: {
                    background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
                    height: item.offsetHeight+100+"px",
                }})
            })
            can.page.Select(can, document.body, "div.nice", function(item) {
                can.page.Modify(can, item, {style: {
                    background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
                    width: item.offsetWidth+100, left: (document.body.clientWidth-item.offsetWidth-100)/2,
                }})
            })
            break
        case "Backspace":
            event.key !== " " && can.page.Select(can, document.body, "div.char", function(item) {
                can.page.Modify(can, item, {style: {
                    background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
                    height: "100px",
                }})
            })
            can.page.Select(can, document.body, "div.nice", function(item) {
                can.page.Modify(can, item, {style: {
                    background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
                    width: 300, left: (document.body.clientWidth-300)/2,
                }})
            })
            break
        case "Enter":
            event.key !== " " && can.page.Select(can, document.body, "div.char", function(item) {
                can.page.Modify(can, item, {style: {
                    background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
                    height: "100px",
                }})
            })
            can.page.Select(can, document.body, "div.nice", function(item) {
                can.page.Modify(can, item, {style: {
                    background: "rgba("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+some+")",
                    width: 600, left: (document.body.clientWidth-600)/2,
                }})
            })
            break
    }
}})
Volcanos("onmotion", {help: "动态交互", list: [], _init: function(can) {
    },
    modifys: function(can, target, cb) { var back = target.innerHTML
        var ui = can.page.Appends(can, target, [{type: "textarea", value: back, style: {height: "80px"}, onkeydown: function(event) {
            switch (event.key) {
                case "Enter":
                    if (event.ctrlKey) { target.innerHTML = event.target.value
                        if (event.target.value != back) {
                            cb(event, event.target.value, back)
                        }
                    }
                    break
                case "Escape":
                    td.innerHTML = back
                    break
            }
        }, onkeyup: function(event) {

        }}]); ui.first.focus(), ui.first.setSelectionRange(0, -1)
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

        }}]); ui.first.focus(), ui.first.setSelectionRange(0, -1)
    },
    clear: function(can, target) { target = target || can._output
        target.innerHTML = ""
    },
    show: function(can, time, cb, target) { target = target || can._target
        time = typeof time == "object"? time: {value: 10, length: time||20}

        can.page.Modify(can, target, {style: {opacity: 0, display: "block"}})
        can.core.Timer(time, function(event, value, index) {
            can.page.Modify(can, target, {style: {opacity: (index+1)/time.length}})
        }, cb)
    },
    hide: function(can, time, cb, target) { target = target || can._target
        time = typeof time == "object"? time: {value: 10, length: time||20}

        can.page.Modify(can, target, {style: {opacity: 1}})
        can.core.Timer(time, function(event, value, index) {
            can.page.Modify(can, target, {style: {opacity: 1-(index+1)/time.length}})
        }, cb)
    },

    move: function(can, target, layout) { var begin
        target.onmousedown = function(event) {
            begin = {x: event.x, y: event.y, left: layout.left, top: layout.top, width: layout.width, height: layout.height}
        }, target.onmouseup = function(event) { begin = null }

        target.onmousemove = function(event) {
            if (!begin || !event.ctrlKey) { return }
            if (event.shiftKey) {
                layout.width = layout.width + event.x - begin.x 
                layout.height = layout.height + event.y - begin.y
                can.page.Modify(can, target, {style: {width: layout.width, height: layout.height}})
            } else {
                layout.top = begin.top + event.y - begin.y
                layout.left = begin.left + event.x - begin.x 
                can.page.Modify(can, target, {style: {left: layout.left, top: layout.top}})
            }
        }
    },

    toggle: function(can, msg, list, cb, target) {
        can.page.Toggle(can, target)
    },
    autosize: function(can, msg, list, cb, target) {
        can.page.Select(can, target, "div.output", function(item, index) {
            index == 0 && (item.style.height = "")
        })
        target.style.height = ""
    },
})

