var _can_name = "/frame.js"
Volcanos("onengine", {help: "搜索引擎", list: [], _init: function(can, meta, list, cb, target) {
        can.core.Next(list, function(item, next) { item.type = "panel"
            can.onappend._init(can, item, item.list, function(panel) {
                panel.run = function(event, cmds, cb) { var msg = panel.request(event); cmds = cmds || []
                    return (can.onengine[cmds[0]]||can.onengine._remote)(event, can, msg, panel, cmds, cb)
                }, can[item.name] = panel

                can.core.Item(panel.onaction, function(key, item) { if (key.indexOf("on") == 0) {
                    can.onengine.listen(can, key, function(msg) { can.core.CallFunc(item, {can: panel, msg: msg}) })
                } }), panel.const(panel.onaction._const||[]), panel._trans = panel.onaction._trans
                panel.onaction._init(panel, item, item.list, next, panel._target)
            }, target)
        }, function() { can.onlayout.topic(can)
            can.misc.Log(can.user.title(), "run", can)
            can.base.Copy(can.onengine.river, can.Conf("river"))
            can.onmotion._init(can, target), can.onkeypop._init(can, target)
            can.onengine.signal(can, "onmain", can.request())
        })
    },
    _search: function(event, can, msg, panel, cmds, cb) {
        var sub, mod = can, fun = can, key = ""; can.core.List(cmds[1].split("."), function(value) {
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

        var key = panel._name+"."+cmds.join(",")
        if (can.user.isLocalFile) { var msg = can.request(event); msg.Clear("append")
            var res = Volcanos.meta.pack[key]; res? msg.Copy(res): can.user.toast(can, "缺失数据")
            return can.base.isFunc(cb) && cb(msg)
        }

        can.misc.Run(event, can, {names: (can.Conf("iceberg")||"/chat/")+panel._name, daemon: can.ondaemon._list[0]+"."+msg._daemon}, cmds, function(msg) {
            Volcanos.meta.pack[key] = msg, delete(msg._handle), delete(msg._toast)
            can.base.isFunc(cb) && cb(msg)
        })
    },

    listen: shy("监听事件", {}, [], function(can, name, cb) {
        arguments.callee.meta[name] = (arguments.callee.meta[name]||[]).concat(cb)
    }),
    signal: shy("触发事件", function(can, name, msg) { msg = msg || can.request()
        can.misc.Log("signal", name, msg)
        can.core.List(can.onengine.listen.meta[name], function(cb) {
            can.core.CallFunc(cb, {msg: msg})
        })
    }),
    river: {}, _merge: function(can, sub) {
        for (var k in sub["river"]) { can.onengine["river"] = sub["river"]; break }
    },
})
Volcanos("ondaemon", {help: "推荐引擎", list: [], _init: function(can, name) { if (can.user.isLocalFile) { return }
        can.misc.WSS(can, {type: "chrome", name: can.user.Search(can, "daemon")||name}, function(event, msg, cmd, arg) { if (!msg) { return }
            can.base.isFunc(can.ondaemon[cmd])? can.core.CallFunc(can.ondaemon[cmd], {
                "can": can, "msg": msg, "cmd": cmd, "arg": arg, "cb": function() { msg.Reply() },
            }): can.onengine._search({}, can, msg, can, ["_search", cmd].concat(arg), function() {
                msg.Reply()
            })
        })
    }, _list: [""],
    pwd: function(can, msg, arg) { can.ondaemon._list[0] = arg[0] },
    grow: function(can, msg, arg) {
        var sub = can.ondaemon._list[msg.Option("_target")]
        if (!sub || !sub._outputs || !sub._outputs.length) { return }

        var out = sub._outputs[sub._outputs.length-1]
        out.onimport._grow(out, arg.join(""))
    },
    toast: function(can, msg, arg) {
        can.onmotion.float.add(can, "float", can.core.CallFunc(can.user.toast, {can: can, msg: msg, cmds: arg}))
    },
})
Volcanos("onappend", {help: "渲染引擎", list: [], _init: function(can, meta, list, cb, target, field) {
        meta.name = meta.name || "", meta.name = meta.name.split(" ")[0].split(".").pop()
        field = field || can.onappend.field(can, meta.type, meta, target).first
        var legend = can.page.Select(can, field, "legend")[0]
        var option = can.page.Select(can, field, "form.option")[0]
        var action = can.page.Select(can, field, "div.action")[0]
        var output = can.page.Select(can, field, "div.output")[0]
        var status = can.page.Select(can, field, "div.status")[0]

        var sub = Volcanos(meta.name, {_follow: can.core.Keys(can._follow, meta.name), _target: field,
            _legend: legend, _option: option, _action: action, _output: output, _status: status,
            _inputs: {}, _outputs: [], _history: [],
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
                if (typeof key == "object") {
                    value? sub.core.List(value, function(k) { sub.Status(k, key[k]) }): sub.core.Item(key, sub.Status)
                    return key
                }
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
                    can.base.isFunc(cb) && cb(sub)
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
            sub.page.ClassList.add(sub, field, meta.index? meta.index.split(".").pop(): meta.name)

            can.base.isFunc(cb) && cb(sub)
            meta.option = can.base.Obj(meta.option||"{}", {})
            meta.inputs && sub.onappend._option(sub, meta, sub._option)

            sub.page.Modify(sub, sub._legend, {
                onmouseenter: function(event) { sub.user.carte(event, sub, sub.onaction, sub.onaction.list) },
            })
        }); return sub
    },
    _option: function(can, meta, option) { var index = -1, args = can.base.Obj(meta.args||meta.arg, [])
        function add(item, next) { item._input != "button" && item.type != "button" && index++
            Volcanos(item.name, {_follow: can._follow+"."+item.name,
                _option: can._option, _action: can._action, _output: can._output, _status: can._status,
                // _target: can.onappend.input(can, item, args[index]||meta.option[item.name], option),
                _target: can.onappend.input(can, item, args[index], option),
                Option: can.Option, Action: can.Action, Status: can.Status,
                CloneInput: function() { add(item)._target.focus() },
                CloneField: function() { can.Clone() },
            }, [item.display||"/plugin/input.js"].concat(Volcanos.meta.volcano, Volcanos.meta.libs), function(input) {
                input.Conf(item), input.sup = can, input.run = function(event, cmds, cb, silent) {
                    var msg = can.request(event)
                    var sub = can.core.Value(can, "_outputs.-1")
                    if (msg.Option("_handle") != "true" && sub && cmds && cmds[0] == "action" && sub.onaction && sub.onaction[cmds[1]]) {
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
                }), can.onappend.figure(input, item, item.value, function() {}, input._target)

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

            }}: /*其它*/ item
        , "", action)})
        return meta
    },
    _output: function(can, meta, event, cmds, cb, silent) {
        var msg = can.request(event); can.page.Select(can, can._output, "div.control .args", function(item) {
            item.name && item.value && msg.Option(item.name, item.value)
        })

        if (msg.Option("_handle") != "true" && cmds && cmds[0] == "action" && can.onaction[cmds[1]]) {
            return can.onaction[cmds[1]](event, can, cmds[1])
        }

        can._daemon == undefined && (can._daemon = can.ondaemon._list.push(can)-1)
        msg._daemon = msg._daemon||can._daemon

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
                    can.base.isFunc(cb) && cb(msg)
                })
            })
            return
        }

        return can.run(event, cmds, function(msg) { var sub = can.core.Value(can, "_outputs.-1")
            can._msg = msg
            if (can.core.CallFunc([sub, "onimport._process"], [sub, msg, cmds, cb])) { return }
            if (can.core.CallFunc([can, "onimport._process"], [can, msg, cmds, cb])) { return }
            if (can.base.isFunc(cb) && can.core.CallFunc(cb, {can: can, msg: msg})) { return }
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
                    table.onaction && table.onappend._action(table, can.base.Obj(msg.Option("_action"), meta._action||table.onaction.list))
                    table.ondetail && table.onappend._detail(table, can.base.Obj(msg.Option("_detail"), meta._detail||table.ondetail.list))
                    table.onexport && table.onappend._status(table, can.base.Obj(msg.Option("_status"), meta._export||table.onexport.list))
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

    item: function(can, type, item, cb, cbs, target) { target = target||can._output
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
                    index < array.length - 1? can.onmotion.toggle(can, node[name]): can.base.isFunc(cb) && cb(event, item)
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
            case "upload": item.type = "file", input.name = "upload"; break
        }

        return can.page.Append(can, target, [{view: ["item "+item.type], list: [input]}])[item.name]
    },
    table: function(can, msg, cb, target, sort) {
        var table = can.page.AppendTable(can, msg, target||can._output, msg.append, cb||function(value, key, index, line, array) {
            if (key == "value") { key = line.key||line.name, line = {}
                can.core.List(array, function(item, index) { line[item.key||line.name] = item.value })
            }

            return {type: "td", inner: value, onclick: function(event) { var target = event.target
                if (target.tagName == "INPUT" && target.type == "button") {
                    var msg = can.sup.request(event, can.Option(), line)
                    return can.run(event, ["action", target.name], function(msg) { can.run() }, true)
                }

                can.sup.onaction.change(event, can.sup, key, value, function(msg) {
                    can.onimport._init(can, msg, [], cb, can._output)
                })
            }, ondblclick: function(event) { var target = event.target
                can.onmotion.modify(can, target, function(event, value, old) {
                    var msg = can.sup.request(event, can.Option(), line)
                    can.run(event, ["action", "modify", key, value], function(msg) {
                        can.user.toast(can, "修改成功")
                    }, true)
                })
            }}
        }); table && can.page.Modify(can, table, {className: "content"})

        can.page.Select(can, table, "input[type=button]", function(button) {
            button.value = can.user.trans(can, button.value)
        })

        return sort && can.page.RangeTable(can, table, sort), table
    },
    board: function(can, text, target) { text = can.page.Color(text||"")
        var code = text && can.page.Append(can, target||can._output, [{view: ["code", "div", text]}]).code
        can.page.Select(can, code, "input[type=button]", function(target) {
            target.onclick = function(event) {
                var msg = can.sup.request(event, can.Option())
                return can.run(event, ["action", target.name], function(msg) { can.run() }, true)
            }
        })
        code && code.scrollBy(0, 10000)
        return code
    },

    figure: function(can, meta, key, cb, target) {
        if (!key || key[0] != "@") { return }
        var list = can.core.Split(key, "@=", "@=")
        var pkey = list[0], pval = list[1]||""

        target.type != "button" && (target.value = pval||""), can.require(["/plugin/input/"+pkey+".js"], function(can) {
            can.core.Item(can.onfigure[pkey], function(key, on) { if (key.indexOf("on") == 0) { target[key] = function(event) {
                can.onappend._init(can, {type: "input", name: pkey, pos: "float"}, [], function(sub) {
                    sub.run = function(event, cmds, cb) {
                        var msg = sub.request(event, can.Option());
                        (meta.run||can.run)(event, cmds, cb, true)
                    }, sub.Conf(meta)

                    can.onmotion.float.add(can, "input", sub)

                    meta.style && sub.page.Modify(sub, sub._target, {style: meta.style})
                    on(event, sub, meta, cb, target)
                }, document.body)
            } } })
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
            sub.base.isFunc(cb) && cb(sub, meta)
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
            can.base.isFunc(cb) && cb(sub)
        }, target)
    },
}, [], function(can) {})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can, target) { target = document.body
        var width = window.innerWidth, height = window.innerHeight
        can.user.isMobile && can.page.ClassList.add(can, target, "mobile")
        can.user.isMobile && can.page.ClassList.set(can, target, "landscape", width > height)

        document.body.onresize = function() { can.onlayout._init(can, target) }

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
    figure: function(event, can, target, right) { target = target||can._target; if (!event || !event.target) { return }
        var left = event.clientX-event.offsetX, top = event.clientY-event.offsetY+event.target.offsetHeight; if (right) {
            var left = event.clientX-event.offsetX+event.target.offsetWidth, top = event.clientY-event.offsetY
        }

        if (left+target.offsetWidth>window.innerWidth) { left = window.innerWidth - target.offsetWidth }
        if (top+target.offsetHeight>window.innerHeight) { top = window.innerHeight - target.offsetHeight }

        var layout = {left: left, top: top}
        can.page.Modify(can, target, {style: layout})
        can.onmotion.move(can, target, layout)
    },
    resize: function(can, name, cb) {
        var list = []; can.onengine.listen(can, name, function(width, height) {
            can.Conf({width: width, height: height}), can.core.Delay(list, 100, function() {
                can.base.isFunc(cb) && cb(event)
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
Volcanos("onmotion", {help: "动态特效", list: [], _init: function(can, target) {
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
    clear: function(can, target) {
        can.page.Modify(can, target||can._output, "")
    },
    focus: function(can, target) {
        target.setSelectionRange(0, -1), target.focus()
    },
    float: {
        _hash: {},
        del: function(can, key) {
            if (key == "carte") {
                can.page.Select(can, document.body, "div.carte", function(item) {
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
            can.page.Modify(can, target, {onmouseover: function(event) { 
                if (event.target.tagName == "IMG") { return }
                can.core.List(list, function(key, index) { that.del(can, key) })
            }})
        },
    },
    story: {
        _hash: {
            spark: function(can, meta, target) {
                if (meta["name"] == "inner") {
                    target.title = "点击复制", target.onclick = function(event) {
                        can.user.copy(event, can, target.innerText)
                    }
                } else {
                    can.page.Select(can, target, "span", function(item) {
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
                can.core.CallFunc(that._hash[meta.type], [can, meta, target])
            })
        },
    },

    hidden: function(can, target) {
        can.page.Modify(can, target||can._target, {style: {display: "none"}})
    },
    toggle: function(can, target) {
        return can.onmotion.Toggle(can, target||can._target)
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

    autosize: function(can, target, max, min) {
        can.page.Modify(can, target, {
            onfocus: function(event) {
                can.onmotion.resize(can, target, max, 10)
            }, onmouseenter: function(event) {
                can.onmotion.resize(can, target, max, 10)
            }, onmouseleave: function(event) {
                can.onmotion.resize(can, target, min, 5)
            }, onblur: function(event) {
                can.onmotion.resize(can, target, min, 5)
            },
        })
    },
    resize: function(can, target, width, speed) {
        var begin = target.offsetWidth
        var space = (width - begin) / 30
        can.core.Timer({interval: speed||10, length: 30}, function() {
            can.page.Modify(can, target, {style: {width: begin+=space}})
        })
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
            can.base.isFunc(cb) && cb()
        })
    },

    EnableDrop: function(can, parent, search, target) {
        return can.page.Modify(can, target, { draggable: true,
            ondragstart: function(event) { var target = event.target; can.drop = function(event, tab) {
                parent.insertBefore(target, tab)
                can.page.Select(can, parent, search, function(item) {
                    can.page.ClassList.del(can, item, "over")
                })
            } },
            ondragover: function(event) { event.preventDefault()
                can.page.Select(can, parent, search, function(item) {
                    can.page.ClassList.del(can, item, "over")
                }), can.page.ClassList.add(can, event.target, "over")
            },
            ondrop: function(event) { event.preventDefault()
                can.drop(event, event.target)
            },
        })
    },
    Resizes: function(event, item, begin, p0, p1, pos) {
        switch (pos) {
            case 5:
                item.Value("x", begin.x + p1.x - p0.x)
                item.Value("y", begin.y + p1.y - p0.y)
                return
        }

        switch (pos) {
            case 1:
            case 2:
            case 3:
                item.Value("y", begin.y + p1.y - p0.y)
                item.Value("height", begin.height - p1.y + p0.y)
                break
        }
        switch (pos) {
            case 1:
            case 4:
            case 7:
                item.Value("x", begin.x + p1.x - p0.x)
                item.Value("width", begin.width - p1.x + p0.x)
                break
        }
        switch (pos) {
            case 3:
            case 6:
            case 9:
                item.Value("width", begin.width + p1.x - p0.x)
                break
        }
        switch (pos) {
            case 7:
            case 8:
            case 9:
                item.Value("height", begin.height + p1.y - p0.y)
                break
        }
    },
    Resize: function(event, item, begin, pos) {
        switch (pos) {
            case 5:
                item.style.left = begin.left + event.clientX - begin.x + "px"
                item.style.top = begin.top + event.clientY - begin.y + "px"
                return
        }

        switch (pos) {
            case 1:
            case 2:
            case 3:
                item.style.top = begin.top + event.clientY - begin.y + "px"
                item.style.height = begin.height - event.clientY + begin.y + "px"
                break
        }
        switch (pos) {
            case 1:
            case 4:
            case 7:
                item.style.left = begin.left + event.clientX - begin.x + "px"
                item.style.width = begin.width - event.clientX + begin.x + "px"
                break
        }
        switch (pos) {
            case 3:
            case 6:
            case 9:
                item.style.width = begin.width + event.clientX - begin.x + "px"
                break
        }
        switch (pos) {
            case 7:
            case 8:
            case 9:
                item.style.height = begin.height + event.clientY - begin.y + "px"
                break
        }
    },
    Anchor: function(event, target, pos, point) {
        switch (pos) {
            case 1:
            case 2:
            case 3:
                point.y = target.Val("y")
                break
            case 4:
            case 5:
            case 6:
                point.y = target.Val("y") + target.Val("height") / 2
                break
            case 7:
            case 8:
            case 9:
                point.y = target.Val("y") + target.Val("height")
                break
        }

        switch (pos) {
            case 1:
            case 4:
            case 7:
                point.x = target.Val("x")
                break
            case 2:
            case 5:
            case 8:
                point.x = target.Val("x") + target.Val("width") / 2
                break
            case 3:
            case 6:
            case 9:
                point.x = target.Val("x") + target.Val("width")
                break
        }
        return point
    },
    Prepos: function(event, item, p, q) {
        var max = 20
        p = p || item.getBoundingClientRect()
        q = q || {x: event.clientX, y: event.clientY}

        var pos = 5
        var y = (q.y - p.y) / p.height
        if (y < 0.2 && q.y - p.y < max) {
            pos -= 3
        } else if (y > 0.8 && q.y - p.y - p.height > -max) {
            pos += 3
        }
        var x = (q.x - p.x) / p.width
        if (x < 0.2 && q.x - p.x < max) {
            pos -= 1
        } else if (x > 0.8 && q.x - p.x - p.width > -max) {
            pos += 1
        }

        var cursor = [
            "nw-resize", "n-resize", "ne-resize",
            "w-resize", "move", "e-resize",
            "sw-resize", "s-resize", "se-resize",
        ]
        item.style.cursor = cursor[pos-1]
        return pos
    },
    Toggle: function(can, target, show, hide) { var status = target.style.display == "none"
        can.page.Modify(can, target, {style: {display: status? "": "none"}})
        status? typeof show == "function" && show(): typeof hide == "function" && hide()
        return status
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
        // can.Status("按键", list.join(""))
        for (var pre = 0; pre < list.length; pre++) {
            if ("0" <= list[pre] && list[pre] <= "9") { continue } break
        }; var count = parseInt(list.slice(0, pre).join(""))||1

        function repeat(cb, count) { list = []
            for (var i = 1; i <= count; i++) { if (cb(event, can, target, count)) { break } }
            event.stopPropagation(), event.preventDefault()
            // can.Status("按键", list.join(""))
        }

        var map = can.onkeypop._mode[mode]
        var cb = map && map[event.key]; if (can.base.isFunc(cb) && event.key.length > 1) {
            repeat(cb, count); return list
        }
        var cb = map && map[event.key.toLowerCase()]; if (can.base.isFunc(cb) && event.key.length > 1) {
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

            b: function(event, can, target) { can.search(event, ["Header.onaction.black"]) },
            w: function(event, can, target) { can.search(event, ["Header.onaction.white"]) },

            s: function(event, can, target) { can.search(event, ["River.ondetail.添加应用"]) },
            t: function(event, can, target) { can.search(event, ["River.ondetail.添加工具"]) },

            " ": function(event, can, target) {
                can.page.Select(can, document.body, "fieldset.panel.Header div.search input", function(target) {
                    target.focus()
                })
            },
            enter: function(event, can, target) { can.misc.Log("enter") },
            escape: function(event, can, target) {
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

                can.misc.Log("input", target, his)
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

    DelText: function(target, start, count) {
        target.value = target.value.substring(0, start)+target.value.substring(start+(count||target.value.length), target.value.length)
        target.setSelectionRange(start, start)
    },
    input: function(event, can) { var target = event.target
        target._keys = can.onkeypop._parse(event, can, event.ctrlKey? "insert_ctrl": "insert", target._keys||[], target)
        if (target._keys.length == 0)  { event.stopPropagation(), event.preventDefault() }
    },
})

