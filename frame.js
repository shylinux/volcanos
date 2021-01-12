 var _can_name = "/frame.js"
Volcanos("onengine", {help: "解析引擎", list: [], _init: function(can, meta, list, cb, target) {
        can.core.Next(list, function(item, next) { item.type = "pane"
            can.onappend._init(can, item, item.list, function(pane) {
                pane.Status = pane.Status || function(key, value) { pane.run({}, ["search", "Footer.onimport."+key, value]) }
                pane.onaction && pane.onappend._action(pane, item.action||pane.onaction.list)

                pane.run = function(event, cmds, cb, silent) { var msg = pane.request(event); cmds = cmds || []
                    return (can.onengine[cmds[0]]||can.onengine[meta.main.engine]||can.onengine.remote)(event, can, msg, pane, cmds, cb)
                }, can[item.name] = pane, next()
            }, target)
        }, function() {
            var pane = can[meta.main.name], msg = can.request({})
            pane.onkeypop._init(pane, target), pane.onmotion._init(pane)
            pane.onaction._init(pane, msg, [], cb, pane._target)
        })
    },
    _daemon: function(can, name, cb) {
        can.misc.WSS(can, {type: "chrome", name: name}, cb||function(event, msg, cmd, arg) {
            msg && can.run(event, ["search"].concat(msg["detail"]||[]), function(msg) {
                msg.Reply()
            })
        })
    },

    listen: shy("", {}, [], function(can, name, cb) {
        arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb)
    }),
    trigger: function(can, msg, name) {
        can.core.List(can.onengine.listen.meta[name], function(cb) {
            can.core.CallFunc(cb, {"msg": msg})
        })
    },

    search: function(event, can, msg, pane, cmds, cb) {
        var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split("."), function(value) {
            fun && (sub = mod, mod = fun, fun = mod[value], key = value)
        }); if (!sub || !mod || !fun) { can.base.Warn("not found", cmds[1]); return }

        return can.core.CallFunc(fun, {
            "event": event, "can": sub, "msg": msg,
            "cmd": key, "button": key, "cmds": cmds.slice(2),
            "list": cmds.slice(2), "cb": cb, "target": sub._target,
        }, mod)
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        if (pane.onengine.engine(event, can, msg, pane, cmds, cb)) { return }
        can.misc.Run(event, can, {names: pane._name}, cmds, cb)
        // pane.run(event, ["search", "Footer.onimport.ncmd"])
    }, engine: function(event, can, msg, pane, cmds, cb) { return false },

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
        }},
        "project": {name: "研发群", storm: {
            "studio": {name: "研发 studio", action: [
                {name: "vimer", help: "编辑器", index: "web.code.vimer", args: ["src/", "main.go"]},
                {name: "repos", help: "代码库", index: "web.code.git.status"},
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
            "context": {name: "编程 context",  action: [
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
            "cli": {name: "系统 cli", index: [
                "system", "daemon", "python", "output",
                "runtime", "process",
            ]},
            "web": {name: "网络 web", index: [
                "route", "serve", "space", "dream",
                "spide", "share", "cache", "story",
            ]},
            "ssh": {name: "脚本 ssh", index: [
                "aaa.totp", "web.code.tmux.session",
                "connect", "session", "service", "channel",
            ]},
            "nfs": {name: "文件 nfs", index: [
                "dir", "file",
            ]},
        }},
    },
})
Volcanos("onappend", {help: "渲染引擎", list: [], _init: function(can, meta, list, cb, target, field) {
        meta.name = meta.name || "", meta.name = meta.name.split(" ")[0]
        field = field || can.onappend.field(can, target, meta.type, meta).first
        var legend = can.page.Select(can, field, "legend")[0]
        var option = can.page.Select(can, field, "form.option")[0]
        var action = can.page.Select(can, field, "div.action")[0]
        var output = can.page.Select(can, field, "div.output")[0]
        var status = can.page.Select(can, field, "div.status")[0]
        can.core.Value(meta, {"width": can._width, "height": can._height})

        var sub = Volcanos(meta.name, {_follow: can._follow+"."+meta.name,
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
                    return value == undefined? (value = item.innerHTML): (item.innerHTML = value)
                }).length == 0 && value != undefined && sub.page.Append(sub, status, [{view: "item "+key, list: [
                    {text: [key, "label"]}, {text: [": ", "label"]}, {text: [value+"", "span", key]},
                ]}]); return value
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
        }, list.concat(Volcanos.meta.volcano).concat(Volcanos.meta.libs), function(sub) { sub.Conf(meta)
            meta.feature = sub.base.Obj(meta.feature, {})
            sub.page.ClassList.add(sub, field, meta.style||meta.feature.style||"")

            typeof cb == "function" && cb(sub)
            meta.inputs && sub.onappend._option(sub, meta, list, cb)
        })
    },
    _option: function(can, meta, list, cb) { var index = -1, args = can.base.Obj(meta.args||meta.arg, [])
        function add(item, next) { item._input != "button" && index++
            var input = Volcanos(item.name, {_follow: can._follow+"."+item.name,
                _target: can.onappend.input(can, can._option, item.type, item, args[index]),
                _option: can._option, _action: can._action, _output: can._output,
                CloneInput: function() { add(item)._target.focus() },
                CloneField: function() { can.Clone() },
                Option: can.Option,
            }, [item.display||"/plugin/input.js"].concat(Volcanos.meta.volcano).concat(Volcanos.meta.libs), function(input) {
                input.Conf(item), input.sup = can
                input.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event, can.Conf("option"))
                    return can.onappend._output(can, meta, event, can.Pack(cmds), cb, silent)
                }

                input.onaction && input.onaction._init && input.onaction._init(input, item, [], next, input._target)
            }); return can._inputs[item.name] = input
        }; can.core.Next(can.base.Obj(meta.inputs, []), add)
    },
    _action: function(can, list, action, meta) { action = action || can._action, meta = meta || can.onaction
        can.onmotion.clear(can, action), can.core.List(list, function(item) {
            item === ""? /*空白*/ can.page.Append(can, action, [{view: "item space"}]):
                typeof item == "string"? /*按键*/ can.onappend.input(can, action, "input", {type: "button", value: item, onclick: function(event) {
                    var cb = meta[item] || meta["_engine"] || can.onkeymap && can.onkeymap._remote
                    typeof cb == "function"? cb(event, can, item): can.run(event, ["action", item], function(msg) {}, true)
                }}): item.length > 0? /*列表*/ can.onappend.input(can, action, "input", {type: "select", name: item[0], values: item.slice(1), title: item[0], onchange: function(event) {
                    var which = item[event.target.selectedIndex+1]
                    var cb = meta[which]
                    typeof cb == "function" && cb(event, can, which)
                    var cb = meta[item[0]]
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

        return can.run(event, cmds||[], function(msg) {
            if (can.onimport._process(can, msg, cmds, cb)) { return }
            typeof cb == "function" && cb(msg)
            if (silent) { return }

            var display = meta.feature.display || "table"
            display.indexOf("/") == 0 || (display = "/plugin/"+display)
            display.endsWith(".js") || (display += ".js")

            var output = Volcanos(display, {_follow: can._follow+"."+display,
                _target: can._output, _fields: can._target,
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                Option: can.Option, Action: can.Action, Status: can.Status,
            }, [display].concat(Volcanos.meta.volcano).concat(Volcanos.meta.libs), function(table) {
                table.Conf(can.Conf()), table.sup = can
                table.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event, can.Conf("option"))
                    return can.onappend._output(can, meta, event, can.Pack(cmds, silent), cb, silent)
                }, table._msg = msg

                msg && table.onimport && table.onimport._init && table.onimport._init(table, msg, msg.result||[], function(msg) {
                    table.onaction && table.onappend._action(table, msg._action||meta._action||table.onaction.list, table._action)
                    table.ondetail && table.onappend._detail(table, table._output, msg._detail||meta._detail||table.ondetail.list)
                    table.onexport && table.onappend._status(table, msg._export||meta._export||table.onexport.list, table._status)
                }, can._output)
            }); can._outputs.push(output)
        }, silent)
    },
    _detail: function(can, target, list, cb) {
        list.length > 0 && (target.oncontextmenu = function(event) {
            can.user.carte(event, can, can.ondetail||{}, list, function(ev, item, meta) {
                (cb||can.ondetail[item]||can.onaction[item])(event, can, item)
            })
        })
    },
    _status: function(can, list, status) { status = status || can._status
        can.onmotion.clear(can, status), can.core.List(list, function(item) {
            can.page.Append(can, status, [{view: "item "+item, title: item, list: [
                {text: [item, "label"]}, {text: [": ", "label"]}, {text: ["", "span"]},
            ], }])
        })
    },

    item: function(can, target, type, item, cb, cbs) {
        var ui = can.page.Append(can, target, [{view: [type, "div", item.nick||item.name],
            onclick: function(event) {
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
    field: function(can, target, type, item) { type = type || "input", item = item || {}
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
                item.style.width = can.Conf(["feature", "textarea", item.name, "width"].join(".")) || can.Conf(["feature", "textarea", "width"].join(".")) || item.style.width
                item.style.height = can.Conf(["feature", "textarea", item.name, "height"].join(".")) || can.Conf(["feature", "textarea", "height"].join(".")) || item.style.height
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

    plugin: function(can, meta, cb, target) { meta = meta || {}
        can.run({}, ["action", "command", meta.index], function(msg) {
            meta.feature = can.base.Obj(msg.meta&&msg.meta[0] || "{}", {})
            meta.inputs = can.base.Obj(msg.list&&msg.list[0] || "[]", [])

            meta.name = meta.name || msg.name&&msg.name[0] || "story"
            meta.help = meta.help || msg.help&&msg.help[0] || "story"
            meta.width = can._target.offsetWidth
            meta.type = "story"

            can.onappend._init(can, meta, ["/plugin/state.js"], function(story) {
                typeof cb == "function" && cb(story, meta)
                story.page.Remove(story, story._legend)
            }, target || can._output)
        }, true)
    },
}, [], function(can) {})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can, target, width, height) {
        can.page.Select(can, target, ["fieldset.head", "fieldset.foot"], function(field) {
            can.page.Modify(can, field, {style: {display: can.user.isMobile && width > height? "none": ""}})
            height -= field.offsetHeight
        })

        can.page.Select(can, target, ["fieldset.left", "fieldset.right"], function(field, index) {
            can.page.Modify(can, field, {style: {height: height}})
            width -= field.offsetWidth

            can.page.Select(can, field, "div.output", function(output) {
                can.page.Modify(can, output, {style: {height: height-32}})
            })
        })

        if (can.user.isMobile || can.user.Search(can, "share")) { return }
        can.onengine.trigger(can, can.request(event, {width: width, height: height}), "resize")

        can.page.Select(can, target, ["fieldset.main"], function(field, index) {
            can.page.Modify(can, field, {style: {height: height}})
        })
        can.page.Select(can, target, ["fieldset.main>div.output"], function(output) {
            can.page.Modify(can, output, {style: {height: height}})
        })
    },
    resize: shy("", {}, [], function(cb) { arguments.callee.list.push(cb) }),
    topic: function(can, topic) { topic && (can._topic = topic)
        can.user.topic(can, can._topic || can.user.Search(can, "topic") || ((can.user.Search(can, "pod")||can.base.isNight())? "black": "white"))
    },

    profile: function(can, target) {
        can.ui = can.page.Append(can, target, [{type: "table", list: [{type: "tr", list: [
            {type: "td", list: [{view: ["project", "div", "project"]}]},
            {type: "td", list: [{type: "tr", list: [{type: "table", list: [
                {type: "td", list: [{view: ["content", "div", "content"]}]},
                {type: "td", list: [{view: ["profile", "div", "profile"]}]},
            ]}]}, {type: "tr", list: [
                {type: "td", list: [{view: ["display", "div", "display"]}]}
            ]}]}
        ]}] }])
    },
    project: function(can, target) {
        can.ui = can.page.Append(can, target, [{type: "table", list: [{type: "tr", list: [
            {type: "td", list: [{view: "project"}]}, {type: "td", list: [
                {type: "tr", list: [{view: "content"}]},
                {type: "tr", list: [{view: "display"}]},
            ]}
        ]}] }])
    },
    display: function(can, target) { target = target || can._target
        return can.page.Appends(can, target, [{type: "table", list: [
            {type: "tr", list: [{view: "content"}]},
            {type: "tr", list: [{view: "display"}]},
        ]}])
    },
})
Volcanos("onkeypop", {help: "键盘交互", list: [], _init: function(can, target) {
        can.core.Item(can.onkeypop._mode, function(item, value) { var engine = {}
            can.core.Item(value, function(key, cb) { var map = engine
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{})
                }
            }), can.onkeypop._engine[item] = engine
        })

        target.onkeydown = function(event) { if (event.target != target) { return }
            can.page.Select(can, target, "fieldset.Action>div.output", function(item) {
                target._keys = can.onkeypop._parse(event, can, item, "normal", target._keys||[])
            })
        }
        target.onkeyup = function(event) {
        }
    },
    _parse: function(event, can, target, mode, list) {
        // event.key.length == 1 && 
            list.push(event.key)
        can.Status && can.Status("keys", list.join(""))

        for (var pre = 0; pre < list.length; pre++) {
            if ("0" <= list[pre] && list[pre] <= "9") { continue } break
        }; var count = parseInt(list.slice(0, pre).join(""))||1

        function repeat(cb, count) { list = []
            for (var i = 1; i <= count; i++) { if (cb(event, can, target, count)) { break } }
            event.stopPropagation(), event.preventDefault()
            can.Status && can.Status("keys", list.join(""))
        }

        var map = can.onkeypop._mode[mode]
        var cb = map && map[event.key.toLowerCase()]; if (typeof cb == "function" && event.key.length > 1) {
            repeat(cb, count); return list
        }

        var map = can.onkeypop._engine[mode]; for (var i = list.length-1; i > pre-1; i--) {
            var cb = map[list[i]]; switch (typeof cb) {
                case "function": repeat(cb, count); return list
                case "object": map = cb; continue
                case "string": 
                default: return list
            }
        }
        return list
    },
    _mode: {
        normal: {
            j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
            k: function(event, can, target) { target.scrollBy(0, -30) },

            b: function(event, can, target) { can.run(event, ["search", "Header.onaction.black"]) },
            w: function(event, can, target) { can.run(event, ["search", "Header.onaction.white"]) },

            s: function(event, can, target) { can.run(event, ["search", "River.ondetail.添加应用"]) },
            t: function(event, can, target) { can.run(event, ["search", "River.ondetail.添加工具"]) },

            " ": function(event, can, target) {
                can.page.Select(can, document.body, "fieldset.pane.Header div.search input", function(target) {
                    target.focus()
                })
            },
            enter: function(event, can, target) { can.base.Log("enter") },
            escape: function(event, can, target) {
                can.run(event, ["search", "Search.onaction.hide"])
                can.base.Log("enter")
            },
        },
        insert: {
            escape: function(event, can, target) {
                target.blur()
            },
            jk: function(event, can, target) {
                can.page.DelText(target, target.selectionStart-1, target.selectionStart)
                target.blur()
            },
            enter: function(event, can, target) {
                var his = target._history || []
                his.push(target.value)

                can.base.Log("input", target, his)
                target.setSelectionRange(0, -1)
                target._current = his.length
                target._history = his
            },
        },
        insert_ctrl: {
            p: function(event, can, target) {
                var his = target._history||[]
                var pos = target._current||0

                pos = --pos % (his.length+1)
                if (pos < 0) { pos = his.length}
                target.value = his[pos]||""
                can.base.Log(pos, his)

                target._current = pos
            },
            n: function(event, can, target) {
                var his = target._history||[]
                var pos = target._current||0

                pos = ++pos % (his.length+1)
                target.value = his[pos]||""
                can.base.Log(pos, his)

                target._current = pos
            },

            u: function(event, can, target) {
                can.page.DelText(target, 0, target.selectionEnd)
            },
            k: function(event, can, target) {
                can.page.DelText(target, target.selectionStart)
            },
            h: function(event, can, target) {
                can.page.DelText(target, target.selectionStart-1, target.selectionStart)
            },
            d: function(event, can, target) {
                can.page.DelText(target, 0, target.selectionStart)
            },
            w: function(event, can, target) {
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
            },
        },
    }, _engine: {},

    input: function(event, can) { var target = event.target
        target._keys = can.onkeypop._parse(event, can, target, event.ctrlKey? "insert_ctrl": "insert", target._keys||[])
        if (target._keys.length == 0)  { event.stopPropagation(), event.preventDefault() }
    },
})
Volcanos("onmotion", {help: "动态交互", list: [], _init: function(can) {
        if ((can.user.Search(can, "topic")||"").indexOf("print") > -1) { return }

        var count = 0, add = true
        can.user.isMobile || can.user.Search(can, "share") || can.core.Timer({interval: 100}, function() {
            if (document.body.className.indexOf("print") > -1) { return }

            add? count++: count--
            count < 0 && (add = true)
            count > 100 && (add = false)

            can.page.Select(can, document.body, "fieldset.story", function(item) {
                can.page.Modify(can, item, {style: {
                    "box-shadow": "40px 10px 10px "+(count/10+1)+"px #626bd0",
                }})
            })
        })
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
        }, function() {
            can.page.Modify(can, target, {style: {display: "none"}})
            typeof cb == "function" && cb
        })
    },
    clear: function(can, target) {
        can.page.Modify(can, target||can._output, "")
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
                    target.innerHTML = back
                    break
                default:
                    can.onkeypop.input(event, can)
            }
        }}]); ui.first.focus(), ui.first.setSelectionRange(0, -1)
    },
    modifys: function(can, target, cb) { var back = target.innerHTML
        var ui = can.page.Appends(can, target, [{type: "textarea", value: back, style: {height: "80px"}, onkeydown: function(event) {
            switch (event.key) {
                case "Enter":
                    if (event.ctrlKey) {
                        target.innerHTML = event.target.value
                        if (event.target.value != back) {
                            cb(event, event.target.value, back)
                        }
                    }
                    break
                case "Escape":
                    target.innerHTML = back
                    break
                default:
                    can.onkeypop.input(event, can)
            }
        }}]); ui.first.focus(), ui.first.setSelectionRange(0, -1)
    },
    autosize: function(can, msg, list, cb, target) {
        can.page.Select(can, target, "div.output", function(item, index) {
            index == 0 && (item.style.height = "")
        }), target.style.height = ""
        typeof cb == "function" && cb(msg)
    },

    hidden: function(can, msg, list, cb, target) {
        can.page.Modify(can, target, {style: {display: "none"}})
    },
    toggle: function(can, msg, list, cb, target) {
        can.page.Toggle(can, target)
    },
    move: function(can, target, layout) { var begin
        target.onmousedown = function(event) {
            begin = {x: event.x, y: event.y, left: layout.left, top: layout.top, width: layout.width, height: layout.height}
        }, target.onmouseup = function(event) { begin = null }

        target.onmousemove = function(event) { if (!begin || !event.ctrlKey) { return }
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
    select: function(can, target, name, which) {
        can.page.Select(can, target, name, function(item, index) {
            if (item == which || which == index) {
                can.page.ClassList.add(can, item, "select")
            } else {
                can.page.ClassList.del(can, item, "select")
            }
        })
    },
})

