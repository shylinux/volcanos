_can_name = "/frame.js"
Volcanos("onengine", {help: "搜索引擎", list: [], _init: function(can, meta, list, cb, target) {
        can.run = function(event, cmds, cb) { var msg = can.request(event); cmds = cmds||[]
            return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, can, cmds, cb)
        }, can.river = can.Conf(chat.RIVER)||{}

        if (can.user.isExtension) { Volcanos.meta.args = JSON.parse(localStorage.getItem("args"))||{} }

        can.core.Next(list, function(item, next) { item.type = chat.PANEL
            can.onappend._init(can, item, item.list, function(panel) {
                panel.run = function(event, cmds, cb) { var msg = panel.request(event); cmds = cmds||[]
                    return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, panel, cmds, cb)
                }, can[item.name] = panel, panel._root = can, panel._trans = panel.onaction && panel.onaction._trans||{}

                can.core.ItemCB(panel.onaction, function(key, cb) {
                    can.onengine.listen(can, key, function(msg) { can.core.CallFunc(cb, {can: panel, msg: msg}) })
                }), panel.onaction._init(panel, item, item.list, next, panel._target)

                can.onmotion.float.auto(can, panel._output)
                // panel.onkeypop._build(panel)
            }, target)
        }, function() { can.misc.Log(can.user.title(), cli.RUN, can)
            can.ondaemon._init(can), can.onmotion._init(can, target), can.onkeypop._init(can, target)
            can.onlayout.topic(can), can.onengine.signal(can, chat.ONMAIN, can.request())
            can.base.isFunc(cb) && cb()
        })
    },
    _search: function(event, can, msg, panel, cmds, cb) {
        var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split(ice.PT), function(value) {
            fun && (sub = mod, mod = fun, fun = mod[value], key = value)
        }); if (!sub || !mod || !fun) { can.misc.Warn("not found", cmds)
            return can.base.isFunc(cb) && cb(msg.Echo("warn: ", "not found: ", cmds))
        }

        return can.core.CallFunc(fun, {
            "event": event, "can": sub, "msg": msg,
            "button": key, "cmd": key, "cmds": cmds.slice(2),
            "list": cmds.slice(2), "cb": cb, "target": sub._target,
        }, mod)
    },
    _engine: function(event, can, msg, panel, cmds, cb) { return false },
    _remote: function(event, can, msg, panel, cmds, cb) {
        if (panel.onengine._engine(event, can, msg, panel, cmds, cb)) { return }
        can.onengine.signal(can, "onremote", can.request({}, {_follow: panel._follow, _msg: msg, _cmds: cmds}))

        var key = can.core.Keys(panel._name, cmds.join(","))
        if (can.user.isLocalFile) { var msg = can.request(event); msg.Clear(ice.MSG_APPEND)
            var res = Volcanos.meta.pack[key]; res? msg.Copy(res): can.user.toast(can, "缺失数据")
            return can.base.isFunc(cb) && cb(msg)
        }

        var names = msg.Option("_names")||panel._names||((can.Conf("iceberg")||"/chat/")+panel._name)
        can.misc.Run(event, can, {names: names, daemon: can.core.Keys(can.ondaemon._list[0], msg._daemon)}, cmds, function(msg) {
            Volcanos.meta.pack[key] = msg, delete(msg._handle), delete(msg._toast)
            if (msg.result && msg.result[0] == "warn: ") { can.user.toast(can, msg.Result(), "", 10000); return }
            can.base.isFunc(cb) && cb(msg)
        })
    },

    listen: shy("监听事件", {}, [], function(can, name, cb) {
        arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb)
    }),
    signal: shy("触发事件", function(can, name, msg) { msg = msg||can.request()
        can.misc.Log("signal", name, msg)
        can.core.List(can.onengine.listen.meta[name], function(cb) {
            can.core.CallFunc(cb, {msg: msg})
        })
    }),
})
Volcanos("ondaemon", {help: "推荐引擎", list: [], _init: function(can, name) { if (can.user.isLocalFile) { return }
        can.misc.WSS(can, {type: "chrome", name: can.user.Search(can, "daemon")||name||""}, function(event, msg, cmd, arg) { if (!msg) { return }
            can.base.isFunc(can.ondaemon[cmd])? can.core.CallFunc(can.ondaemon[cmd], {
                "can": can, "msg": msg, "cmd": cmd, "arg": arg, "cb": function() { msg.Reply() },
            }): can.onengine._search({}, can, msg, can, ["_search", cmd].concat(arg), function() {
                msg.Reply()
            })
        })
    }, _list: [""],
    pwd: function(can, msg, arg) { 
        can.ondaemon._list[0] = arg[0]
    },
    grow: function(can, msg, arg) {
        var sub = can.ondaemon._list[msg.Option(ice.MSG_TARGET)]
        sub.onimport._grow(sub, can.page.Color(arg.join("")))
    },
    toast: function(can, msg, arg) {
        can.onmotion.float.add(can, chat.FLOAT, can.core.CallFunc(can.user.toast, {can: can, msg: msg, cmds: arg}))
    },
    confirm: function(can, msg, arg) { 
        if (can.user.confirm(arg[0])) { msg.Echo("true") }
    },
})
Volcanos("onappend", {help: "渲染引擎", list: [], _init: function(can, meta, list, cb, target, field) {
        meta.name = meta.name||"", meta.name = meta.name.split(ice.SP)[0].split(ice.PT).pop()
        field = field||can.onappend.field(can, meta.type, meta, target).first
        var legend = can.page.Select(can, field, ice.PT+html.LEGEND)[0]||can.page.Select(can, field, html.LEGEND)[0]
        var option = can.page.Select(can, field, html.FORM_OPTION)[0]
        var action = can.page.Select(can, field, html.DIV_ACTION)[0]
        var output = can.page.Select(can, field, html.DIV_OUTPUT)[0]
        var status = can.page.Select(can, field, html.DIV_STATUS)[0]

        var sub = Volcanos(meta.name, {_follow: can.core.Keys(can._follow, meta.name), _target: field,
            _legend: legend, _option: option, _action: action, _output: output, _status: status,
            _inputs: {}, _outputs: [], _history: [],

            Status: function(key, value) {
                if (sub.base.isObject(key)) { return sub.core.Item(key, sub.Status), key }

                sub.page.Select(sub, status, "div."+key+">span", function(item) {
                    return value == undefined? (value = item.innerHTML): (item.innerHTML = value)
                }); return value
            },
            Action: function(key, value) { return sub.page.SelectArgs(sub, action, key, value)[0] },
            Option: function(key, value) { return sub.page.SelectArgs(sub, option, key, value)[0] },
            Update: function(event, cmds, cb, silent) { sub.onappend._output(sub, sub.Conf(), event||{}, cmds||sub.Input(), cb, silent) },
            Input: function(cmds, silent) {
                cmds = cmds && cmds.length > 0? cmds: sub.page.SelectArgs(sub, option, ""), cmds = can.base.trim(cmds)
                silent || cmds[0] == ctx.ACTION || sub.base.Eq(sub._history[sub._history.length-1], cmds) || sub._history.push(cmds)
                return cmds
            },
            Clone: function() {
                meta.args = sub.page.SelectArgs(sub, option, "")
                can.onappend._init(can, meta, list, function(sub) {
                    can.core.Timer(10, function() { for (var k in sub._inputs) { can.onmotion.focus(can, sub._inputs[k]._target); break } })
                    can.base.isFunc(cb) && cb(sub, true)
                }, target)
            },
        }, list, function(sub) { sub.Conf(meta), meta.feature = sub.base.Obj(meta.feature, {})
            sub.page.ClassList.add(sub, field, meta.index? meta.index.split(ice.PT).pop(): meta.name)
            sub.page.ClassList.add(sub, field, meta.style||meta.feature.style||"")

            sub.page.Modify(sub, sub._legend, {onmouseenter: function(event) {
                sub.user.carte(event, sub, sub.onaction, sub.onaction.list.concat([["所有 ->"].concat(can.core.Item(meta.feature._trans))]))
            }})

            meta.inputs && sub.onappend._option(sub, meta, sub._option)
            can.base.isFunc(cb) && cb(sub)
        }); return sub
    },
    _option: function(can, meta, option) { var index = -1, args = can.base.Obj(meta.args||meta.arg, []), opts = can.base.Obj(meta.opts, {})
        function add(item, next) { item.type != html.BUTTON && index++
            return Volcanos(item.name, {_follow: can.core.Keys(can._follow, item.name),
                _target: can.onappend.input(can, item, args[index]||opts[item.name], option),
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                Option: can.Option, Action: can.Action, Status: can.Status,
                CloneInput: function() { can.onmotion.focus(can, add(item)._target) }, CloneField: function() { can.Clone() },
            }, [item.display||"/plugin/input.js"], function(input) { input.Conf(item)
                input.run = function(event, cmds, cb, silent) { var msg = can.request(event)
                    if (msg.RunAction(event, input, cmds)) { return }
                    if (msg.RunAction(event, can.core.Value(can, "_outputs.-1"), cmds)) { return }
                    return can.Update(event, can.Input(cmds, silent), cb, silent)
                }, can._inputs[item.name] = input, input.sup = can

                can.core.ItemCB(input.onaction, function(key, cb) {
                    input._target[key] = function(event) { cb(event, input) }
                }), can.core.CallFunc([input.onaction, "_init"], [input, item, [], next, input._target]);

                (item.action||meta.feature["inputs"]) && can.onappend.figure(input, item, input._target)
            })
        }; can.core.Next(can.base.Obj(meta.inputs, []), add)
    },
    _action: function(can, list, action, meta) { action = action||can._action, meta = meta||can.onaction
        can.core.List(list||can.onaction.list, function(item) { can.onappend.input(can, item == ""? /*空白*/ {type: html.SPACE}:
            can.base.isString(item)? /*按键*/ {type: html.BUTTON, value: item, onclick: function(event) {
                var cb = meta[item]||meta["_engine"]
                cb? can.core.CallFunc(cb, {event: event, can: can, button: item}): can.run(event, [ctx.ACTION, item].concat(can.sup.Input()))

            }}: item.length > 0? /*列表*/ {type: html.SELECT, name: item[0], values: item.slice(1), onchange: function(event) {
                var which = item[event.target.selectedIndex+1]
                can.core.CallFunc(meta[which], [event, can, which])
                can.core.CallFunc(meta[item[0]], [event, can, item[0], which])

            }}: /*其它*/ item
        , "", action)})
        return meta
    },
    _output: function(can, meta, event, cmds, cb, silent) { var msg = can.request(event)
        if (msg.RunAction(event, can, cmds)) { return }

        if (msg.Option(ice.MSG_HANDLE) != ice.TRUE && cmds && cmds[0] == ctx.ACTION && meta.feature[cmds[1]]) { can.request(event, {action: cmds[1]})
            return can.user.input(event, can, meta.feature[cmds[1]], function(ev, button, data, list, args) { var msg = can.request(event, {_handle: ice.TRUE}, can.Option())
                can.Update(event, cmds.slice(0, 2).concat(args), function(msg) { can.Update({}, can.Input(), cb) }, true)
            })
        }

        can.base.isUndefined(can._daemon) && (can._daemon = can.ondaemon._list.push(can)-1), msg._daemon = msg._daemon||can._daemon

        return can.run(event, cmds, function(msg) { var sub = can.core.Value(can, "_outputs.-1")||{}; can._msg = msg, sub._msg = msg
            var process = msg._can == can || msg._can == sub
            if (process && can.core.CallFunc([sub, "onimport._process"], [sub, msg, cmds, cb])) { return }
            if (process && can.core.CallFunc([can, "onimport._process"], [can, msg, cmds, cb])) { return }
            if (can.base.isFunc(cb) && can.core.CallFunc(cb, {can: can, msg: msg})) { return }
            if (silent) { return }

            var display = msg.Option(ice.MSG_DISPLAY)||meta.display||meta.feature.display||"/plugin/table.js"

            Volcanos(display, {_follow: can.core.Keys(can._follow, display), _display: display, _target: can._output, _fields: can._target,
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                Update: can.Update, Option: can.Option, Action: can.Action, Status: can.Status,
            }, [display, "/plugin/table.js"], function(table) { table.Conf(can.Conf())
                table.run = function(event, cmds, cb, silent) { var msg = can.request(event)
                    if (msg.RunAction(event, table, cmds)) { return }
                    return can.Update(event, can.Input(cmds, silent), cb, silent)
                }, can._outputs.push(table), table.sup = can, table._msg = msg

                table.onimport && table.onimport._init && table.onimport._init(table, msg, msg.result||[], function(msg) {
                    can.page.Modify(can, can._action, ""), can.page.Modify(can, can._status, "")
                    table.onaction && table.onappend._action(table, can.base.Obj(msg.Option(ice.MSG_ACTION)||can.Conf(ice.MSG_ACTION), table.onaction.list))
                    table.onexport && table.onappend._status(table, can.base.Obj(msg.Option(ice.MSG_STATUS), table.onexport.list))
                }, can._output)
            })
        })
    },
    _status: function(can, list, status) { status = status||can._status, can.onmotion.clear(can, status)
        can.core.List(list, function(item) { item = can.base.isObject(item)? item: {name: item}
            can.page.Append(can, status, [{view: can.base.join([html.ITEM, item.name]), title: item.name, list: [
                {text: [item.name, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [(item.value||"")+"", html.SPAN, item.name]},
            ], }])
        })
    },

    list: function(can, root, cb, target) {
        can.core.List(root.list, function(item) {
            var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name], onclick: function(event) {
                can.base.isFunc(cb) && cb(event, item) || can.onmotion.toggle(can, ui.list)
            }}, {view: html.LIST}]); can.onappend.list(can, item, cb, ui.list)
        })
    },
    item: function(can, type, item, cb, cbs, target) { target = target||can._output
        var ui = can.page.Append(can, target, [{view: [type, html.DIV, item.nick||item.name],
            onclick: function(event) { cb(event, ui.first)
                can.onmotion.select(can, target, can.core.Keys(html.DIV, type), ui.first)
            }, onmouseenter: function(event) { cbs(event, ui.first) },
        }]); return ui.first
    },
    tree: function(can, list, field, split, cb, target, node) {
        node = node || {"": target}; can.core.List(list, function(item) {
            item[field] && can.core.List(item[field].split(split), function(value, index, array) { if (!value) { return }
                var last = array.slice(0, index).join(split), name = array.slice(0, index+1).join(split)

                node[name] || (node[name] = can.page.Append(can, node[last], [{view: [html.ITEM, html.DIV, value+(index==array.length-1?"":split)], onclick: function(event) {
                    index < array.length - 1? can.onmotion.toggle(can, node[name]): can.base.isFunc(cb) && cb(event, item)
                }}, {view: html.LIST, style: {display: html.NONE}}]).last)
            })
        }); return node
    },
    field: function(can, type, item, target) { type = type||html.PLUGIN, item = item||{}
        var name = (item.nick||item.name||"").split(ice.SP)[0]
        var title = !item.help || can.user.language(can) == "en"? name: name+"("+item.help.split(ice.SP)[0]+")"
        return can.page.Append(can, target||can._output, [{view: [can.base.join([type||"", item.name||"", item.pos||""]), html.FIELDSET], list: [
            name && {text: [title, html.LEGEND]},
            can.user.mod.isCmd && type == chat.PLUGIN && {view: [html.LEGEND, html.DIV, title]},
            {view: [html.OPTION, html.FORM]}, {view: [html.ACTION]}, {view: [html.OUTPUT]}, {view: [html.STATUS]},
        ]}])
    },
    input: function(can, item, value, target, style) {
        switch (item.type) {
            case "": return can.page.Append(can, target, [item])
            case html.SPACE: return can.page.Append(can, target, [{view: can.base.join([html.ITEM, html.SPACE])}])
        }

        var input = can.page.input(can, item, value)
        var br = input.type == html.TEXTAREA? [{type: html.BR, style: {clear: "both"}}]: []
        var title = can.Conf(["feature", chat.TITLE, item.name].join(ice.PT))||""; title && (input.title = title)
        return can.page.Append(can, target, ([{view: style||can.base.join([html.ITEM, item.type]), list: [input]}]).concat(br))[item.name]
    },
    table: function(can, msg, cb, target, sort) {
        var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key, index, line, array) {
            if (msg.append.length == 2 && msg.append[0] == kit.MDB_KEY && msg.append[1] == kit.MDB_VALUE) {
                if (key == kit.MDB_VALUE) { key = line.key }
                line = {}, can.core.List(array, function(item) { line[item.key] = item.value })
            }

            if (key == "extra.cmd") {
                can.onappend.plugin(can, {ctx: line["extra.ctx"], cmd: line["extra.cmd"], arg: line["extra.arg"]}, function(sub) {
                    sub.run = function(event, cmds, cb) { var msg = can.request(event, line, can.Option())
                        can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, can.core.Keys(line["extra.ctx"], line["extra.cmd"])], cmds), cb, true)
                    }
                }, target)
            }

            return {text: [value, html.TD], onclick: function(event) { var target = event.target
                if (target.tagName == "INPUT" && target.type == html.BUTTON) { var msg = can.sup.request(event, line, can.Option())
                    return can.run(event, [ctx.ACTION, target.name], function(msg) { can.run() }, true)
                }

                if (key == "hash" && can.user.mod.isDiv) {
                    can.user.jumps("/chat/div/"+value)
                    return
                }
                can.sup.onaction.change(event, can.sup, key, value)
            }, ondblclick: function(event) { if ([kit.MDB_KEY].indexOf(key) > -1) { return }
                var item = can.core.List(can.Conf("feature.insert"), function(item) {
                    if (item.name == key) { return item }
                })[0]||{name: key, value: value}

                item.run = function(event, cmds, cb) { can.run(can.request(event, line)._event, cmds, cb, true) }

                can.onmotion.modifys(can, event.target, function(event, value, old) { var msg = can.sup.request(event, line, can.Option())
                    can.run(event, [ctx.ACTION, mdb.MODIFY, key, value], function(msg) { can.run() }, true)
                }, item)
            }}
        }); table && can.page.Modify(can, table, {className: chat.CONTENT})

        return sort && can.page.RangeTable(can, table, sort), table
    },
    board: function(can, text, target) { text && text.Result && (text = text.Result()); if (!text) { return }
        var code = can.page.Append(can, target||can._output, [{text: [can.page.Color(text), html.DIV, html.CODE]}]).code
        can.page.Select(can, code, "input[type=button]", function(target) {
            target.onclick = function(event) { var msg = can.sup.request(event, can.Option())
                return can.run(event, [ctx.ACTION, target.name], function(msg) { can.run() }, true)
            }
        })
        return code.scrollBy(0, 10000), code
    },

    figure: function(can, meta, target, cb) { if ([html.BUTTON, html.SELECT].indexOf(meta.type) > -1) { return }
        var input = meta.action||kit.MDB_KEY; input != "auto" && can.require(["/plugin/input/"+input+".js"], function(can) {
            can.core.ItemCB(can.onfigure[input], function(key, on) {
                target[key] = function(event) {
                    can.onappend._init(can, {type: html.INPUT, name: input, pos: chat.FLOAT}, [], function(sub) { sub.Conf(meta)
                        sub.run = function(event, cmds, cb) { var msg = sub.request(event, can.Option());
                            (meta.run||can.run)(event, cmds, cb, true)
                        }

                        meta.style && sub.page.Modify(sub, sub._target, {style: meta.style})
                        can.onmotion.float.add(can, chat.INPUT, sub)
                        on(event, sub, meta, cb, target)
                    }, document.body)
                }
            })
        })
    },
    plugin: function(can, meta, cb, target) { meta = meta||{}, meta.index = meta.index||can.core.Keys(meta.ctx, meta.cmd)
        meta.inputs && meta.inputs.length > 0? can.onappend._plugin(can, {meta: meta.meta, list: meta.list}, meta, cb, target):
            can.run({}, [ctx.ACTION, ctx.COMMAND, meta.index], function(msg) { msg.Table(function(value) {
                can.onappend._plugin(can, value, meta, cb, target)
            }) }, true)
    },
    _plugin: function(can, value, meta, cb, target) {
        meta.feature = meta.feature||can.base.Obj(value.meta, {})
        meta.inputs = meta.inputs||can.base.Obj(value.list, [])

        meta.height = meta.height||can.Conf(html.HEIGHT)
        meta.width = meta.width||can.Conf(html.WIDTH)

        meta.name = meta.name||value.name||chat.PLUGIN
        meta.help = meta.help||value.help||chat.PLUGIN
        meta.type = meta.type||chat.PLUGIN

        can.onappend._init(can, meta, ["/plugin/state.js"], function(sub, skip) {
            sub.run = function(event, cmds, cb) { can.run(event, can.misc.Concat([ctx.ACTION, cli.RUN, meta.index], cmds), cb) }
            can.base.isFunc(cb) && cb(sub, meta, skip)
        }, target||can._output)
    },

    float: function(can, msg, cb) {
        var ui = can.onappend.field(can, "story toast float", {}, document.body)
        ui.close = function() { can.page.Remove(can, ui.first), can.onengine.signal(can, "keymap.focus") }
        can.onmotion.float.auto(can, ui.output, chat.CARTE, chat.INPUT)

        can.search({}, ["Action.onexport.size"], function(msg, top, left, width, height) {
            can.page.Modify(can, ui.output, {style: {"max-width": width, "max-height": height-28}})
            can.page.Modify(can, ui.first, {style: {top: top, left: left}})
        })

        can.onappend._action(can, ["close", "refresh", {input: "text", placeholder: "filter", style: {position: ""}, _init: function(input) {
            can.onengine.signal(can, "keymap.focus", can.request({}, {cb: function(event) {
                if (event.target.tagName == "INPUT") { return }
                if (event.key == "Escape") { ui.close(); return }
                if (event.key == " ") { input.focus(), event.stopPropagation(), event.preventDefault() }
            }}))
        }, onkeydown: function(event) {
            can.onkeypop.input(event, can)
            if (event.key != "Enter") { return }
            event.target.setSelectionRange(0, -1)

            can.page.Select(can, ui.output, html.TR, function(tr, index) { if (index == 0) { return }
                can.page.Modify(can, tr, {style: {display: html.NONE}})
                can.page.Select(can, tr, html.TD, function(td) {
                    if (td.innerText.indexOf(event.target.value) > -1) {
                        can.page.Modify(can, tr, {style: {display: ""}})
                    }
                })
            })
        }}], ui.action, { "close": ui.close,
            "refresh": function(event) { ui.close(), can.toast.click() },
        })
        can.onappend.table(can, msg, function(value, key, index, line, list) {
            return {text: [value, html.TD], onclick: function(event) {
                can.base.isFunc(cb) && cb(value, key, index, line, list)
            }}
        }, ui.output)
        can.onappend.board(can, msg.Result(), ui.output)
        return ui
    },
}, [], function(can) {})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can, target) { target = target||document.body
        var list = []; document.body.onresize = function() {
            can.core.Delay(list, 1000, function() { can.onlayout._init(can, target) })
        }

        var width = window.innerWidth, height = window.innerHeight
        can.page.Select(can, target, [can.core.Keys(html.FIELDSET, chat.HEAD), can.core.Keys(html.FIELDSET, chat.FOOT)], function(field) {
            height -= field.offsetHeight
        })

        can.page.Select(can, target, can.core.Keys(html.FIELDSET, chat.LEFT), function(field, index) {
            can.user.isMobile || (width -= field.offsetWidth)

            can.page.Modify(can, field, {style: {height: height}})
            can.page.Select(can, target, "fieldset.left>div.output", function(output) {
                can.page.Modify(can, output, {style: {height: height-32}})
            })
        })

        can.page.Select(can, target, can.core.Keys(html.FIELDSET, chat.MAIN), function(field, index) {
            if (can.user.isMobile) {
                can.page.Modify(can, field, {style: {"padding-top": can.user.isLandscape()? "0px": ""}})
            } else {
                height -= can.page.Select(can, field, can.core.Keys(html.DIV, html.ACTION))[0].offsetHeight

                can.page.Modify(can, field, {style: {height: height}})
                can.page.Select(can, target, "fieldset.main>div.output", function(output) {
                    can.page.Modify(can, output, {style: {height: height}})
                })
            }
        })

        can.onengine.signal(can, chat.ONSIZE, can.request({}, {width: width, height: height}))
    },
    topic: function(can, topic) { topic && (can._topic = topic)
        can.user.topic(can, can._topic || can.user.Search(can, chat.TOPIC) || ((can.base.isNight()||can.user.mod.isPod)? chat.BLACK: chat.WHITE))
        can.page.ClassList.add(can, document.body, can.user.language(can))
    },
    background: function(can, url, target) {
        can.page.Modify(can, target||document.body, {style: {background: url == "" || url == "void"? "": 'url("'+url+'")'}})
    },
    figure: function(event, can, target, right) { target = target||can._target; if (!event || !event.target) { return }
        var left = event.clientX-event.offsetX, top = event.clientY-event.offsetY+event.target.offsetHeight-5; if (right) {
            var left = event.clientX-event.offsetX+event.target.offsetWidth, top = event.clientY-event.offsetY
        }

        if (left+target.offsetWidth>window.innerWidth) { left = window.innerWidth - target.offsetWidth }
        if (top+target.offsetHeight>window.innerHeight-100) { top = window.innerHeight - target.offsetHeight - 100 }

        var layout = {left: left, top: top}
        if (layout.left < 0) { layout.left = 0 }
        if (layout.top < 0) { layout.top = 0 }

        can.page.Modify(can, target, {style: layout})
        can.onmotion.move(can, target, layout)
    },

    display: function(can, target) { target = target||can._target
        return can.page.Appends(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [
            {type: html.TR, list: [{view: chat.CONTENT}]},
            {type: html.TR, list: [{view: chat.DISPLAY}]},
        ]}])
    },
    project: function(can, target) { target = target||can._target
        return can.page.Append(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [{type: html.TR, list: [
            {type: html.TD, list: [{view: chat.PROJECT, style: {display: html.NONE}}]}, {type: html.TD, list: [
                {view: [chat.LAYOUT, html.TABLE], list: [
                    {type: html.TR, list: [{view: chat.CONTENT}]},
                    {type: html.TR, list: [{view: chat.DISPLAY}]},
                ]}
            ]}
        ]}] }])
    },
    profile: function(can, target) { target = target||can._output
        return can.page.Append(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [
            {view: [chat.PROJECT, html.TD], list: [{view: [chat.PROJECT]}]},
            {type: html.TD, list: [
                {type: html.TR, list: [{type: html.TR, list: [
                    {view: [chat.CONTENT, html.TD], list: [{view: [chat.CONTENT]}]},
                    {view: [chat.PROFILE, html.TD], list: [{view: [chat.PROFILE], style: {display: html.NONE}}]},
                ]}]},
                {view: [chat.DISPLAY, html.TR], list: [{view: [chat.DISPLAY], style: {display: html.NONE}}]}
            ]}
        ] }])
    },
})
Volcanos("onmotion", {help: "动态特效", list: [], _init: function(can, target) {
    },
    focus: function(can, target) {
        target.setSelectionRange(0, -1), target.focus()
    },
    clear: function(can, target) {
        return can.page.Modify(can, target||can._output, ""), true
    },
    story: {
        _hash: {
            spark: function(can, meta, target) {
                if (meta[kit.MDB_NAME] == "inner") {
                    target.title = "点击复制", target.onclick = function(event) {
                        can.user.copy(event, can, target.innerText)
                    }
                } else {
                    can.page.Select(can, target, html.SPAN, function(item) {
                        item.title = "点击复制", item.onclick = function(event) {
                            can.user.copy(event, can, item.innerText)
                        }
                    })
                }
            },
        },
        auto: function(can, target) { var that = this
            can.page.Select(can, target||can._output, ".story", function(item) { var meta = item.dataset
                can.page.Modify(can, item, {style: can.base.Obj(meta.style)})
                can.core.CallFunc(that._hash[meta.type], [can, meta, target||can._output])
            })
        },
    },
    float: {_hash: {},
        del: function(can, key) {
            if (key == chat.CARTE) {
                can.page.Select(can, document.body, can.core.Keys(html.DIV, chat.CARTE), function(item) {
                    can.page.Remove(can, item)
                })
            }
            this._hash[key] && can.page.Remove(can, this._hash[key]._target)
        },
        add: function(can, key, value) {
            this.del(can, key), this._hash[key] = value
        },

        auto: function(can, target, key) { var that = this
            var list = can.core.List(arguments).slice(2)
            if (list.length == 0) { list = [chat.CARTE, chat.INPUT] }
            can.page.Modify(can, target, {onmouseover: function(event) { 
                if (event.target.tagName == "IMG") { return }
                can.core.List(list, function(key, index) { that.del(can, key) })
            }})
        },
    },

    hidden: function(can, target, show) {
        can.page.Modify(can, target||can._target, {style: {display: show? "": html.NONE}})
    },
    toggle: function(can, target, show, hide) { target = target||can._target
        var status = target.style.display == html.NONE
        can.page.Modify(can, target, {style: {display: status? "": html.NONE}})
        status? can.base.isFunc(show) && show(): can.base.isFunc(hide) && hide()
        return status
    },
    select: function(can, target, name, which) {
        can.page.Select(can, target, name, function(item, index) {
            if (item == which || which == index) {
                can.page.ClassList.add(can, item, html.SELECT)
            } else {
                can.page.ClassList.del(can, item, html.SELECT)
            }
        })
    },
    modify: function(can, target, cb, item) { var back = target.innerHTML, text = target.innerText
        if (back.length > 120 || back.indexOf(ice.NL) > -1) {
            return can.onmotion.modifys(can, target, cb)
        }
        var ui = can.page.Appends(can, target, [{type: html.INPUT, value: target.innerText, style: {
            width: target.offsetWidth > 400? 400: target.offsetWidth-20,
        }, onkeydown: function(event) {
            switch (event.key) {
                case "Enter": target.innerHTML = event.target.value
                    event.target.value == back || cb(event, event.target.value, back)
                    break
                case "Escape": target.innerHTML = back; break
                default: can.onkeypop.input(event, can)
            }
        }, _init: function(target) {
            item && can.onappend.figure(can, item, target), target.value = text
            target.focus(), target.setSelectionRange(0, -1)
        }}])
    },
    modifys: function(can, target, cb, item) { var back = target.innerHTML
        var ui = can.page.Appends(can, target, [{type: html.TEXTAREA, value: target.innerText, style: {
            width: target.offsetWidth > 400? 400: target.offsetWidth-20, height: target.offsetHeight < 60? 60: target.offsetHeight-20,
        }, onkeydown: function(event) {
            switch (event.key) {
                case "Enter":
                    if (event.ctrlKey) {
                        target.innerHTML = event.target.value
                        event.target.value == back || cb(event, event.target.value, back)
                    }
                    break
                case "Escape": target.innerHTML = back; break
                default: can.onkeypop.input(event, can)
            }
        }, _init: function(target) {
            item && can.onappend.figure(can, item, target)
            target.focus(), target.setSelectionRange(0, -1)
        }}])
    },

    move: function(can, target, layout, cb) { var begin
        target.onmousedown = function(event) {
            layout.height = target.offsetHeight, layout.width = target.offsetWidth
            layout.left = target.offsetLeft, layout.top = target.offsetTop
            begin = can.base.Copy({x: event.x, y: event.y}, layout)
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
            can.base.isFunc(cb) && cb(target)
            event.stopPropagation(), event.preventDefault()
        }
        can.base.isFunc(cb) && cb(target)
    },
    show: function(can, time, cb, target) { target = target||can._target
        time = can.base.isObject(time)? time: {interval: 100, length: time||20}

        can.page.Modify(can, target, {style: {opacity: 0, display: html.BLOCK}})
        can.core.Timer(time, function(event, value, index) {
            can.page.Modify(can, target, {style: {opacity: (index+1)/time.length}})
        }, cb)
    },
    hide: function(can, time, cb, target) { target = target||can._target
        time = can.base.isObject(time)? time: {value: 10, length: time||20}

        can.page.Modify(can, target, {style: {opacity: 1}})
        can.core.Timer(time, function(event, value, index) {
            can.page.Modify(can, target, {style: {opacity: 1-(index+1)/time.length}})
        }, function() {
            can.page.Modify(can, target, {style: {display: html.NONE}})
            can.base.isFunc(cb) && cb()
        })
    },
})
Volcanos("onkeypop", {help: "键盘交互", list: [], _focus: [], _init: function(can, target) {
        var focus = can.onkeypop._focus; can.onkeypop._build(can)
        can.onengine.listen(can, "keymap.focus", function(cb) { cb? focus.push(cb): can.onkeypop._focus.length = 0 })
        document.body.onkeydown = function(event) { if (focus.length > 0) { return focus[focus.length-1](event) }
            event.target == target && (target._keys = can.onkeypop._parse(event, can, "normal", target._keys||[], target))
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
        for (var pre = 0; pre < list.length; pre++) {
            if ("0" <= list[pre] && list[pre] <= "9") { continue } break
        }; var count = parseInt(list.slice(0, pre).join(""))||1

        function repeat(cb, count) { list = []
            for (var i = 1; i <= count; i++) { if (cb(event, can, target, count)) { break } }
            event.stopPropagation(), event.preventDefault()
        }

        var map = can.onkeypop._mode[mode]
        var cb = map && map[event.key.toLowerCase()]; if (can.base.isFunc(cb) && event.key.length > 1) {
            repeat(cb, count); return list
        }

        var map = can.onkeypop._engine[mode]||{}; for (var i = list.length-1; i > pre-1; i--) {
            var cb = map[list[i]]||{}; switch (typeof cb) {
                case lang.FUNCION: repeat(cb, count); return list
                case lang.OBJECT: map = cb; continue
                case lang.STRING: 
                default: return list
            }
        }
        return list
    },
    _mode: {
        normal: {
            j: function(event, can, target) { target.scrollBy(0, event.ctrlKey? 300: 30) },
            k: function(event, can, target) { target.scrollBy(0, event.ctrlKey? -300: -30) },

            b: function(event, can, target) { can.search(event, ["Header.onaction.black"]) },
            w: function(event, can, target) { can.search(event, ["Header.onaction.white"]) },

            s: function(event, can, target) { can.search(event, ["River.ondetail.添加应用"]) },
            t: function(event, can, target) { can.search(event, ["River.ondetail.添加工具"]) },

            ":": function(event, can, target) {
                can.page.Select(can, document.body, "fieldset.panel.Footer input.cmd", function(target) {
                    target.focus()
                })
            },
            " ": function(event, can, target) {
                can.page.Select(can, document.body, "fieldset.panel.Header div.search input", function(target) {
                    target.focus()
                })
            },
            enter: function(event, can, target) { can.misc.Log("enter") },
            escape: function(event, can, target) {
                can.page.Select(can, document.body, "fieldset.float", function(item) {
                    can.page.Remove(can, item)
                })
                can.page.Select(can, document.body, "fieldset.auto", function(item) {
                    can.onmotion.hidden(can, item)
                })
                can.search(event, ["Search.onaction.hide"])
                can.misc.Log("enter")
            },
        },
        insert: {
            escape: function(event, can, target) {
                target.blur()
            },
            jk: function(event, can, target) {
                can.onkeypop.DelText(target, target.selectionStart-1, target.selectionStart)
                target.blur()
            },
            enter: function(event, can, target) {
                var his = target._history || []
                his.push(target.value)

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
                can.misc.Log(pos, his)

                target._current = pos
            },
            n: function(event, can, target) {
                var his = target._history||[]
                var pos = target._current||0

                pos = ++pos % (his.length+1)
                target.value = his[pos]||""
                can.misc.Log(pos, his)

                target._current = pos
            },

            u: function(event, can, target) {
                can.onkeypop.DelText(target, 0, target.selectionEnd)
            },
            k: function(event, can, target) {
                can.onkeypop.DelText(target, target.selectionStart)
            },
            h: function(event, can, target) {
                can.onkeypop.DelText(target, target.selectionStart-1, target.selectionStart)
            },
            d: function(event, can, target) {
                can.onkeypop.DelText(target, 0, target.selectionStart)
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
                can.onkeypop.DelText(target, i+1, end-i)
            },
        },
    }, _engine: {},

    input: function(event, can) { var target = event.target
        target._keys = can.onkeypop._parse(event, can, event.ctrlKey? "insert_ctrl": mdb.INSERT, target._keys||[], target)
        if (target._keys.length == 0)  { event.stopPropagation(), event.preventDefault() }
    },
    DelText: function(target, start, count) {
        target.value = target.value.substring(0, start)+target.value.substring(start+(count||target.value.length), target.value.length)
        target.setSelectionRange(start, start)
    },
})
_can_name = ""
