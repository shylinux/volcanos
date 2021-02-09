 var _can_name = "/frame.js"
Volcanos("onengine", {help: "解析引擎", list: [], _init: function(can, meta, list, cb, target) {
        can.core.Next(list, function(item, next) { item.type = "pane"
            can.onappend._init(can, item, item.list, function(pane) {
                pane.onaction && pane.onappend._action(pane, item.action||pane.onaction.list)
                pane.Status = pane.Status || function(key, value) { pane.run({}, ["search", "Footer.onimport."+key, value]) }

                pane.run = function(event, cmds, cb) { var msg = pane.request(event); cmds = cmds || []
                    return (can.onengine[cmds[0]]||can.onengine[meta.main.engine]||can.onengine.remote)(event, can, msg, pane, cmds, cb)
                }, can[item.name] = pane, next()
            }, target)
        }, function() {
            var pane = can[meta.main.name], msg = can.request()
            pane.onmotion._init(pane, target), pane.onkeypop._init(pane, target)
            pane.onaction._init(pane, msg, [], cb, pane._target)
        })
    },
    search: function(event, can, msg, pane, cmds, cb) {
        var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split("."), function(value) {
            fun && (sub = mod, mod = fun, fun = mod[value], key = value)
        }); if (!sub || !mod || !fun) { can.base.Warn("not found", cmds[1]); return }

        return can.core.CallFunc(fun, {
            "event": event, "can": sub, "msg": msg,
            "button": key, "cmd": key, "cmds": cmds.slice(2),
            "list": cmds.slice(2), "cb": cb, "target": sub._target,
        }, mod)
    },
    remote: function(event, can, msg, pane, cmds, cb) { msg.Option("_handle", "false")
        if (pane.onengine.engine(event, can, msg, pane, cmds, cb)) { return }
        can.misc.Runs(event, can, {names: pane._name}, cmds, cb)
        pane.run(event, ["search", "Footer.onimport.ncmd"])
    }, engine: function(event, can, msg, pane, cmds, cb) { return false },
    listen: shy("事件回调", {}, [], function(can, name, cb) {
        arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb)
    }),
    signal: shy("事件触发", function(can, name, msg) { msg = msg || can.request()
        can.core.List(can.onengine.listen.meta[name], function(cb) {
            can.core.CallFunc(cb, {msg: msg})
        })
    }),
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
                {name: "feel", help: "影音媒体", index: "web.wiki.feel"},
                {name: "draw", help: "思维导图", index: "web.wiki.draw"},
                {name: "data", help: "数据表格", index: "web.wiki.data"},
                {name: "plan", help: "计划任务", index: "web.team.plan"},
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
            "auto": {name: "智能 auto", index: [
                "web.code.autogen",
                "web.code.compile",
                "web.code.publish",
            ]},
            "code": {name: "性能 code", index: [
                "web.code.favor",
                "web.code.bench",
                "web.code.pprof",
            ]},
            "pack": {name: "功能 pack", index: [
                "web.code.webpack",
                "web.code.binpack",
                "web.code.install",
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
                "nfs.dir", "nfs.file",
            ]},
        }},
    },
})
Volcanos("onappend", {help: "渲染引擎", list: [], _init: function(can, meta, list, cb, target, field) {
        meta.name = meta.name || "", meta.name = meta.name.split(" ")[0]
        field = field || can.onappend.field(can, meta.type, meta, target).first
        var legend = can.page.Select(can, field, "legend")[0]
        var option = can.page.Select(can, field, "form.option")[0]
        var action = can.page.Select(can, field, "div.action")[0]
        var output = can.page.Select(can, field, "div.output")[0]
        var status = can.page.Select(can, field, "div.status")[0]

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
                    can.core.Timer(10, function() { for (var k in sub._inputs) { sub._inputs[k]._target.focus(); break } })
                    typeof cb == "function" && cb(sub)
                }, target)
            },
            Pack: function(cmds, slient) {
                cmds = cmds && cmds.length > 0? cmds: sub.page.Select(sub, option, "textarea.args,input.args,select.args", function(item) {
                    return item.name && item.value || ""
                }); for (var i = cmds.length-1; i >= 0; i--) {
                    if (!cmds[i]) { cmds.pop() } else { break }
                }

                var last = sub._history[sub._history.length-1]; !sub.base.Eq(last, cmds) && cmds[0] != "action" && !slient && sub._history.push(cmds)
                return cmds
            },
        }, list.concat(Volcanos.meta.volcano, Volcanos.meta.libs), function(sub) { sub.Conf(meta)
            meta.feature = sub.base.Obj(meta.feature, {})
            sub.page.ClassList.add(sub, field, meta.style||meta.feature.style||"")

            typeof cb == "function" && cb(sub)
            meta.option = can.base.Obj(meta.option||"{}", {})
            meta.inputs && sub.onappend._option(sub, meta, sub._option)
        }); return sub
    },
    _option: function(can, meta, option) { var index = -1, args = can.base.Obj(meta.args||meta.arg, [])
        function add(item, next) { item._input != "button" && item.type != "button" && index++
            Volcanos(item.name, {_follow: can._follow+"."+item.name,
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                _target: can.onappend.input(can, item, args[index]||meta.option[item.name], option),
                Option: can.Option, Action: can.Action, Status: can.Status,
                CloneInput: function() { add(item)._target.focus() },
                CloneField: function() { can.Clone() },
            }, [item.display||"/plugin/input.js"].concat(Volcanos.meta.volcano, Volcanos.meta.libs), function(input) {
                input.Conf(item), input.sup = can, input.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event)
                    var sub = can.core.Value(can, "_outputs.-1")
                    if (msg.Option("_handle") != "true" && sub && cmds && cmds[0] == "action" && sub.onaction[cmds[1]]) {
                        msg.Option("_handle", "true")
                        return sub.onaction[cmds[1]](event, sub)
                    }

                    if (msg.Option("_handle") != "true" && cmds && cmds[0] == "action" && input.onaction[cmds[1]]) {
                        msg.Option("_handle", "true")
                        return input.onaction[cmds[1]](event, input)
                    }

                    return can.onappend._output(can, meta, event, can.Pack(cmds, silent), cb, silent)
                }, can._inputs[item.name] = input

                can.core.Item(input.onaction, function(key, value) {
                    key.indexOf("on") == 0 && !input._target[key] && (input._target[key] = function(event) {
                        value(event, input)
                    })
                }), can.onappend.figure(input, item, item.value, input._target)

                can.core.CallFunc([input.onaction, "_init"], [input, item, [], next, input._target])
            })
        }; can.core.Next(can.base.Obj(meta.inputs, []), add)
    },
    _action: function(can, list, action, meta) { action = action || can._action, meta = meta || can.onaction
        can.core.List(list, function(item) { can.onappend.input(can, item == ""? /*空白*/ {type: "space"}:
            typeof item == "string"? /*按键*/ {type: "button", value: item, onclick: function(event) {
                var cb = meta[item]||meta["_engine"]
                cb? can.core.CallFunc(cb, [event, can, item]): can.run(event, ["action",item])

            }}: item.length > 0? /*列表*/ {type: "select", name: item[0], values: item.slice(1), onchange: function(event) {
                var which = item[event.target.selectedIndex+1]
                can.core.CallFunc(meta[which], [event, can, which])
                can.core.CallFunc(meta[item[0]], [event, can, item[0], which])

            }}: item.input? /*文本*/ {type: "input", name: item.input[0], onkeydown: function(event) {
                can.core.CallFunc(item.input[1], [event, can])

            }}: typeof item == "object" && /*其它*/ item
        , "", action)})
    },
    _output: function(can, meta, event, cmds, cb, silent) {
        var msg = can.request(event); can.page.Select(can, can._output, "div.control .args", function(item) {
            item.name && item.value && msg.Option(item.name, item.value)
        })

        if (msg.Option("_handle") != "true" && cmds && cmds[0] == "action" && can.onaction[cmds[1]]) {
            return can.onaction[cmds[1]](event, can, cmds[1])
        }

        var feature = can.Conf("feature")
        var input = msg.Option("_handle") != "true" && cmds && cmds[0] == "action" && feature && feature[cmds[1]]; if (input) {
            can.user.input(event, can, input, function(ev, button, data, list) {
                cmds = cmds.slice(0, 2), can.core.Item(data, function(key, value) {
                    key && value && cmds.push(key, value)
                })

                var msg = can.request(event, can.Option()); msg.Option("_handle", "true")
                can.run(event, cmds, function(msg) { var sub = can.core.Value(can, "_outputs.-1")
                    if (can.core.CallFunc([sub, "onimport._process"], [sub, msg, cmds, cb])) { return }
                    if (can.core.CallFunc([can, "onimport._process"], [can, msg, cmds, cb])) { return }
                    typeof cb == "function" && cb(msg)
                })
            })
            return
        }

        return can.run(event, cmds, function(msg) { var sub = can.core.Value(can, "_outputs.-1")
            if (can.core.CallFunc([sub, "onimport._process"], [sub, msg, cmds, cb])) { return }
            if (can.core.CallFunc([can, "onimport._process"], [can, msg, cmds, cb])) { return }
            typeof cb == "function" && cb(msg)
            if (silent) { return }

            var display = msg.Option("_display") || meta.display || meta.feature.display || "/plugin/table.js"

            Volcanos(display, {_follow: can._follow+"."+display,
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                _target: can._output, _fields: can._target,
                Option: can.Option, Action: can.Action, Status: can.Status,
            }, [display].concat(Volcanos.meta.volcano, Volcanos.meta.libs), function(table) {
                table.Conf(can.Conf()), table.sup = can, table.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event)
                    if (msg.Option("_handle") != "true" && cmds && cmds[0] == "action" && table.onaction[cmds[1]]) {
                        msg.Option("_handle", "true")
                        return table.onaction[cmds[1]](event, table)
                    }

                    return can.onappend._output(can, meta, event, can.Pack(cmds, silent), cb, silent)
                }, can._outputs.push(table), table._msg = msg

                table.onimport && table.onimport._init && table.onimport._init(table, msg, msg.result||[], function(msg) {
                    can.page.Modify(can, can._action, ""), can.page.Modify(can, can._status, "")
                    table.onaction && table.onappend._action(table, msg._action||meta._action||table.onaction.list)
                    table.ondetail && table.onappend._detail(table, msg._detail||meta._detail||table.ondetail.list)
                    table.onexport && table.onappend._status(table, msg._export||meta._export||table.onexport.list)
                }, can._output)
            })
        })
    },
    _detail: function(can, list, target) { target = target || can._output
        list.length > 0 && (target.oncontextmenu = function(event) {
            can.user.carte(event, can, can.ondetail||can.onaction||{}, list, function(ev, item, meta) {
                (can.ondetail[item]||can.onaction[item])(event, can, item)
            })
        })
    },
    _status: function(can, list, status) { status = status || can._status
        can.core.List(list, function(item) { item = typeof item == "object"? item: {name: item}
            can.page.Append(can, status, [{view: "item "+item.name, title: item.name, list: [
                {text: [item.name, "label"]}, {text: [": ", "label"]}, {text: [(item.value||"")+"", "span", item.name]},
            ], }])
        })
    },

    item: function(can, type, item, cb, cbs, target) {
        var ui = can.page.Append(can, target, [{view: [type, "div", item.nick||item.name],
            onclick: function(event) { cb(event, ui.first)
                can.onmotion.select(can, target, "div."+type, ui.first)
            }, oncontextmenu: function(event) { cbs(event, ui.first) },
        }]); return ui.first
    },
    tree: function(can, list, field, split, cb, target, node) {
        node = node || {"": target}; can.core.List(list, function(item) {
            item[field] && can.core.List(item[field].split(split), function(value, index, array) {
                var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split)

                node[name] || (node[name] = can.page.Append(can, node[last], [{view: ["item", "div", value+(index==array.length-1?"":split)], onclick: function(event) {
                    index < array.length - 1? can.onmotion.toggle(can, node[name]): typeof cb == "function" && cb(event, item)
                }}, {view: "list", style: {display: "none"}}]).last)
            })
        }); return node
    },
    field: function(can, type, item, target) { type = type || "input", item = item || {}
        return can.page.Append(can, target||can._output, [{view: [(type||"")+" "+(item.name||"")+" "+(item.pos||""), "fieldset"], list: [
            {text: [(item.nick||item.name||"").split(" ")[0]+"("+(item.help||"").split(" ")[0]+")", "legend"]},
            {view: ["option", "form"]}, {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}])
    },
    input: function(can, item, value, target) {
        switch (item.type) {
            case "space": return can.page.Append(can, target, [{view: "item space"}])
            case "": return can.page.Append(can, target, [item])
        }

        var input = {type: "input", name: item.name, data: item, dataset: {}}
        item.value == "auto" && (item.value = "", item.action = "auto")
        item.action == "auto" && (input.dataset.action = "auto")

        switch (item.type = item.type||item._input||"text") {
            case "textarea": input.type = "textarea"
                item.style.width = item.style.width || can.Conf(["feature", "textarea", item.name, "width"].join(".")) || can.Conf(["feature", "textarea", "width"].join(".")) || 400
                item.style.height = item.style.height || can.Conf(["feature", "textarea", item.name, "height"].join(".")) || can.Conf(["feature", "textarea", "height"].join(".")) || 30
                // no break
            case "password":
                // no break
            case "text":
                item.autocomplete = "off"
                item.value = value || item.value || ""
                item.className || can.page.ClassList.add(can, item, "args")
                break
            case "select": input.type = "select"
                item.values = typeof item.values == "string"? can.core.Split(item.values): item.values
                if (!item.values && item.value) {
                    item.values = can.core.Split(item.value), item.value = item.values[0]
                    if (item.values[0] == "day") { item.value = item.values[1] }
                }

                item.value = value||item.value, input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value}
                }), item.className || can.page.ClassList.add(can, item, "args")
                break
            case "button": item.value = item.value||item.name||"查看"; break
            case "upfile": item.type = "file"; break
        }

        return can.page.Append(can, target, [{view: ["item "+item.type], list: [input]}])[item.name]
    },
    table: function(can, msg, cb, target, sort) {
        var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key) {
            return {text: [value, "td"], onclick: function(event) {
                can.sup.onaction.change(event, can.sup, key, value, function(msg) {
                    can.onimport._init(can, msg, [], cb, can._output)
                })
            }}
        }); table && can.page.Modify(can, table, {className: "content"})
        sort && can.page.RangeTable(can, table, sort)
        return table
    },
    board: function(can, text, target) { text = can.page.Display(text || "")
        return text && can.page.Append(can, target||can._output, [{view: ["code", "div", text]}]).code
    },

    figure: function(can, meta, key, target) {
        if (!key || key.indexOf("@") != 0) { return }
        var list = can.core.Split(key, "@=", "@=")
        var pkey = list[0], pval = list[1]||""

        target.type != "button" && target.value && target.value.indexOf("@") == 0 && (target.value = pval||"")
        pkey && can.require(["/plugin/input/"+pkey+".js"], function(can) {
            can.onfigure && can.core.Item(can.onfigure[pkey], function(key, cb) { if (key.indexOf("on") == 0) {
                target[key] = function(event) { can._figure && can.page.Remove(can, can._figure._target)
                    can.onappend._init(can, {type: "input", name: pkey, pos: "float"}, [], function(sub) {
                        sub.Conf(meta), sub.run = function(event, cmds, cb) {
                            var msg = sub.request(event, can.Option());
                            (meta.run||can.run)(event, cmds, cb, true)
                        }, can._figure = sub

                        meta.style && sub.page.Modify(sub, sub._target, {style: meta.style})
                        cb(event, sub, meta, target)
                    }, document.body)
                }
            } })
        })
    },
    _plugin: function(can, value, meta, cb, target) {
        meta.feature = can.base.Obj(value.meta||"{}", {})
        meta.inputs = can.base.Obj(value.list||"[]", [])

        meta.name = meta.name||value.name||"story"
        meta.help = meta.help||value.help||"story"
        meta.width = meta.width||can.Conf("width")
        meta.height = meta.height||can.Conf("height")
        meta.type = meta.type||"story"

        can.onappend._init(can, meta, ["/plugin/state.js"], function(sub) {
            meta.type == "story" && sub.page.Remove(sub, sub._legend)
            typeof cb == "function" && cb(sub, meta)
        }, target||can._output)
    },
    plugin: function(can, meta, cb, target) { meta = meta || {}
        meta.inputs && meta.inputs.length > 0? can.onappend._plugin(can, {meta: meta.meta, list: meta.list}, meta, cb, target):
            can.run({}, ["action", "command", meta.index||meta.ctx+"."+meta.cmd], function(msg) { msg.Table(function(value) {
                can.onappend._plugin(can, value, meta, cb, target)
            }) }, true)
    },
    plugins: function(can, meta, cb, target) {
        can.onappend.plugin(can, meta, function(sub) {
            sub.onmotion.hidden(sub, sub._legend)
            sub.onmotion.hidden(sub, sub._option)
            sub.onmotion.hidden(sub, sub._action)
            sub.onmotion.hidden(sub, sub._status)
            typeof cb == "function" && cb(sub)
        }, target)
    },
}, [], function(can) {})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can) {
        var target = document.body, width = window.innerWidth, height = window.innerHeight
        can.user.isMobile && can.page.ClassList.add(can, document.body, "mobile")
        can.user.isMobile && can.page.ClassList.set(can, document.body, "landscape", width > height)

        can.page.Select(can, target, ["fieldset.head", "fieldset.foot"], function(field) {
            height -= field.offsetHeight
        })

        can.page.Select(can, target, "fieldset.left", function(field, index) {
            can.page.Modify(can, field, {style: {height: height}})
            can.user.isMobile || (width -= field.offsetWidth)
        })
        can.page.Select(can, target, "fieldset.left>div.output", function(output) {
            can.page.Modify(can, output, {style: {height: height-32}})
        })

        if (can.user.isMobile) {
            can.page.Select(can, target, "fieldset.main", function(field, index) {
                can.user.isMobile && can.page.Modify(can, field, {style: {"padding-top": width > height? "0px": ""}})
            })
        } else {
            can.page.Select(can, target, "fieldset.main", function(field, index) {
                can.page.Modify(can, field, {style: {height: height}})
            })
            can.page.Select(can, target, "fieldset.main>div.output", function(output) {
                can.page.Modify(can, output, {style: {height: height}})
            })
        }
        can.onengine.signal(can, "resize", can.request({}, {width: width, height: height}))
    },
    topic: function(can, topic) { topic && (can._topic = topic)
        can.user.topic(can, can._topic || can.user.Search(can, "topic") || ((can.user.Search(can, "pod")||can.base.isNight())? "black": "white"))
    },
    figure: function(can, event) { var p = can._target
        var layout = {left: event.clientX, top: event.clientY+10}
        can.page.Modify(can, p, {style: layout})
        can.onmotion.move(can, p, layout)

        var left = p.offsetLeft; if (p.offsetLeft+p.offsetWidth > window.innerWidth) {
            left = window.innerWidth - p.offsetWidth
        } if (left < 120) { left = 120 }

        var top = p.offsetTop; if (p.offsetTop+p.offsetHeight > window.innerHeight) {
            top = window.innerHeight - p.offsetHeight
        } if (top < 32) { top = 32 }

        can.page.Modify(can, p, {style: {left: left, top: top}})
    },
    resize: function(can, name, cb) {
        var list = []; can.onengine.listen(can, name, function(width, height) {
            can.Conf({width: width, height: height}), can.core.Delay(list, 100, function() {
                typeof cb == "function" && cb(event)
            })
        })
    },
    background: function(can, url, target) { target = target || document.body
        can.page.Modify(can, target, {style: {background: url == "" || url == "void"? "": 'url("'+url+'")'}})
    },

    profile: function(can, target) { target = target || can._output
        return can.page.Append(can, target, [{view: ["layout", "table"], list: [
            {view: ["project", "td"], list: [{view: ["project"]}]},
            {type: "td", list: [
                {type: "tr", list: [{type: "tr", list: [
                    {view: ["content", "td"], list: [{view: ["content"]}]},
                    {view: ["profile", "td"], list: [{view: ["profile"], style: {display: "none"}}]},
                ]}]},
                {view: ["display", "tr"], list: [{view: ["display"], style: {display: "none"}}]}
            ]}
        ] }])
    },
    project: function(can, target) { target = target || can._target
        return can.page.Append(can, target, [{view: ["layout", "table"], list: [{type: "tr", list: [
            {type: "td", list: [{view: "project", style: {display: "none"}}]}, {type: "td", list: [
                {view: ["layout", "table"], list: [
                    {type: "tr", list: [{view: "content"}]},
                    {type: "tr", list: [{view: "display"}]},
                ]}
            ]}
        ]}] }])
    },
    display: function(can, target) { target = target || can._target
        return can.page.Appends(can, target, [{view: ["layout", "table"], list: [
            {type: "tr", list: [{view: "content"}]},
            {type: "tr", list: [{view: "display"}]},
        ]}])
    },
})
Volcanos("onkeypop", {help: "键盘交互", list: [], _init: function(can, target) {
        var focus = []; can.onengine.listen(can, "keymap.focus", function(cb) {
            cb? focus.push(cb): focus.pop()
        })
        can.onkeypop._build(can)
        target.onkeydown = function(event) {
            if (focus.length > 0) { return focus[focus.length-1](event) }
            if (event.target != target) { return }
            can.page.Select(can, target, "fieldset.Action>div.output", function(item) {
                target._keys = can.onkeypop._parse(event, can, "normal", target._keys||[], item)
            })
        }
    },
    _build: function(can) {
        can.core.Item(can.onkeypop._mode, function(item, value) { var engine = {}
            can.core.Item(value, function(key, cb) { var map = engine
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{})
                }
            }), can.onkeypop._engine[item] = engine
        })
    },
    _parse: function(event, can, mode, list, target) { list = list||[], list.push(event.key)
        can.Status("按键", list.join(""))
        for (var pre = 0; pre < list.length; pre++) {
            if ("0" <= list[pre] && list[pre] <= "9") { continue } break
        }; var count = parseInt(list.slice(0, pre).join(""))||1

        function repeat(cb, count) { list = []
            for (var i = 1; i <= count; i++) { if (cb(event, can, target, count)) { break } }
            event.stopPropagation(), event.preventDefault()
            can.Status("按键", list.join(""))
        }

        var map = can.onkeypop._mode[mode]
        var cb = map && map[event.key]; if (typeof cb == "function" && event.key.length > 1) {
            repeat(cb, count); return list
        }
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
        target._keys = can.onkeypop._parse(event, can, event.ctrlKey? "insert_ctrl": "insert", target._keys||[], target)
        if (target._keys.length == 0)  { event.stopPropagation(), event.preventDefault() }
    },
})
Volcanos("onmotion", {help: "动态交互", list: [], _init: function(can, target) {
        if ((can.user.Search(can, "topic")||"").indexOf("print") > -1) { return }
        return

        var count = 0, add = true
        can.user.isMobile || can.user.Search(can, "share") || can.core.Timer({interval: 100}, function() {
            if (target.className.indexOf("print") > -1) { return }

            add? count++: count--
            count < 0 && (add = true)
            count > 50 && (add = false)

            can.page.Select(can, target, "fieldset.story", function(item) {
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
    hidden: function(can, target) {
        can.page.Modify(can, target||can._target, {style: {display: "none"}})
    },
    toggle: function(can, target) {
        can.page.Toggle(can, target||can._target)
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
    modify: function(can, target, cb) { var back = target.innerHTML
        if (back.length > 120 || back.indexOf("\n") > -1) {
            return can.onmotion.modifys(can, target, cb)
        }
        var ui = can.page.Appends(can, target, [{type: "input", value: back, style: {width: target.offsetWidth > 400? 400: target.offsetWidth-20}, onkeydown: function(event) {
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
        var ui = can.page.Appends(can, target, [{type: "textarea", value: back, style: {height: "80px", width: target.offsetWidth > 400? 400: target.offsetWidth-20}, onkeydown: function(event) {
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
})

