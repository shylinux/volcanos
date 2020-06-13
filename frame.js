// volcanos: 前端 火山架 我看不行
// FMS: a fieldset manager system

Volcanos("onengine", { _init: function(can, meta, list, cb, target) {
        can.core.Next(meta.panes, function(item, next) {
            can.onappend._init(can, item, meta.libs.concat(item.list), function(pane) {
                pane.Conf(item), pane.run = function(event, cmds, cb) {
                    return (can.onengine[cmds[0]]||can.onengine[meta.main.engine])(event, can, pane.request(event), pane, cmds, cb)
                }, can[item.name] = pane, next();
            }, can._target);
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
                can.user.title(can.user.Search(can, "title"))
                var pane = can[meta.main.name], msg = can.request({});
                pane.onaction && pane.onaction._init(pane, msg, msg.option||[], cb, target);
            })
        }, target) });
    },
    _merge: function(can, sub) { can.core.Item(sub, function(key, value) {
        if (sub.hasOwnProperty(key)) { can.onengine[key] = value }
    }); return true },
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
                break
            case "Storm":
                var river = can.onengine.river[cmds[0]]
                if (!river) { break }
                can.core.Item(river.storm, function(key, value) {
                    msg.Push("key", key)
                    msg.Push("name", value.name)
                })
                typeof cb == "function" && cb(msg)
                return true
            case "Action":
                var river = can.onengine.river[cmds[0]]
                var storm = river && river.storm[cmds[1]]
                var action = storm && storm.action && storm.action[cmds[2]]
                if (!storm) { break } if (cmds.length == 2) {
                    if (storm.index) {
                        can.misc.Run(event, can, {names: pane._name}, [river.name, storm.name, "index"].concat(storm.index), cb)
                        return true
                    }

                    can.core.List(storm.action, function(value) {
                        msg.Push("name", value.name||"")
                        msg.Push("help", value.help||"")
                        msg.Push("pod", value.pod||"")
                        msg.Push("group", value.group||"")
                        msg.Push("index", value.index||"")
                        msg.Push("args", value.args||"[]")
                        msg.Push("inputs", JSON.stringify(value.inputs||[]))
                        msg.Push("feature", JSON.stringify(value.feature||{}))
                    })
                    typeof cb == "function" && cb(msg);
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
        return false;
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        if (can.onengine.engine(event, can, msg, pane, cmds, cb)) { return }
        if (location.protocol == "file:") { typeof cb == "function" && cb(msg); return }
        can.misc.Run(event, can, {names: pane._name}, cmds, cb)
    },
})
Volcanos("onappend", { _init: function(can, meta, list, cb, target, field) { meta.name = meta.name.split(" ")[0]
        field = field || can.onappend.field(can, target, meta.type||"plugin", meta).first;
        var legend = can.page.Select(can, field, "legend")[0];
        var option = can.page.Select(can, field, "form.option")[0];
        var action = can.page.Select(can, field, "div.action")[0];
        var output = can.page.Select(can, field, "div.output")[0];
        var status = can.page.Select(can, field, "div.status")[0];

        // 添加插件
        var sub = Volcanos(meta.name, { _help: meta.name, _follow: can._follow+"."+meta.name,
            _target: field, _inputs: {}, _outputs: [], _history: [],
            _option: option, _action: action, _output: output,
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
            if (can.user.Search(can, "share") && can.user.Search(can, "river") && can.user.Search(can, "storm")) {
                can.page.Select(can, field, "legend", function(item) { can.page.Remove(can, item) })
            }

            meta.detail = meta.feature["detail"] || {}
            sub.onimport._init(sub, sub.Conf(meta), list, function() {}, field);

            // 添加控件
            function add(item, next, index) {
                return sub._inputs[item.name] = Volcanos(item.name, { _help: item.name, _follow: can._follow+"."+meta.name+"."+item.name,
                    _target: can.onappend.input(sub, option, item.type, item, args[index]),
                    _option: option, _action: action, _output: output,
                    CloneInput: function() { add(item, function() {}, index)._target.focus() },
                    CloneField: function() { can.onappend._init(can, meta, list, function(sub) {
                        cb(sub), sub.Timer(10, function() {
                            for (var k in sub._inputs) { sub._inputs[k]._target.focus(); break }
                        })
                    }, target) },
                }, Volcanos.meta.libs.concat([item.display||"/plugin/input.js"]), function(input) {
                    input.onimport._init(input, input.Conf(item), item.list||[], function() {}, input._target);

                    if (location.protocol == "chrome-extension:") {
                        var p = sub.user.Cookie(can, item.name)
                        item.type != "button" && p != undefined && (input._target.value = p)
                    }
                    if (can.user.Search(can, "active") == meta.name || can.user.Search(can, "title") == meta.name) {
                        var p = sub.user.Search(can, item.name)
                        p != undefined && (input._target.value = p)
                    }

                    input.run = function(event, cmds, cb, silent) { var msg = sub.request(event); msg.Option("_action", item.name)
                        // 控件回调
                        switch (item.name) {
                        case "查看":
                        case "打开":
                                msg.Option("_action", "")
                                break
                        case "返回":
                            // 历史命令
                            msg.Option("_action", "")
                            sub._history.pop(); var his = sub._history.pop(); if (his) {
                                can.page.Select(can, option, "input.args", function(item, index) {
                                    item.value = his[index] || ""
                                })
                            }
                        }

                        // 解析参数
                        cmds = cmds && cmds.length > 0? cmds: can.page.Select(can, option, "input.args,select.args", function(item) {
                            return item.name && item.value || ""
                        }); for (var i = cmds.length-1; i >= 0; i--) {
                            if (!cmds[i]) { cmds.pop() } else { break }
                        }

                        var last = sub._history[sub._history.length-1]; !can.core.Eq(last, cmds) && cmds[0] != "action" && sub._history.push(cmds)
                        return run(event, cmds, cb, silent)
                    }

                    can.core.Item(input.onaction, function(key, value) {
                        input._target && key.indexOf("on") == 0 && (input._target[key] = input._target[key] || function(event) {
                            value(event, input);
                        })
                    }), next();

                    // 自动执行
                    item.type == "button" && item.action == "auto" && input._target.click()
                })
            }

            var args = can.base.Obj(meta.args, []); can.core.Next(can.base.Obj(meta.inputs, []), add)
            var count = 0; function run(event, cmds, cb, silent) { return sub.run(event, cmds, function(msg) {
                sub.Status("ncmd", sub._history.length+"/"+count++)
                if (silent) { typeof cb == "function" && cb(msg); return }

                // 添加组件
                var display = (msg.Option("_display")||meta.feature.display||"table.js")
                display.indexOf("/") == 0 || (display = "/plugin/"+display)

                var table = Volcanos(display, { _help: display, _follow: can._follow+"."+meta.name+"."+display,
                    _target: output, Option: sub.Option, Action: sub.Action, Status: sub.Status,
                    _option: option, _action: action, _output: output,
                }, Volcanos.meta.libs.concat(["/frame.js", display]), function(table) { table.Conf(sub.Conf())
                    table.onimport && table.onimport._init && table.onimport._init(table, msg, msg.result||[], function() {}, output)
                    table._msg = msg, table.run = function(event, cmds, cb, silent) { cmds = cmds || []
                        var last = sub._history[sub._history.length-1]; !can.core.Eq(last, cmds) && !silent && sub._history.push(cmds)
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
                value != undefined && msg.Option(key, can.user.Search(key))
            })
            can.core.List(["River", "Storm", "Action"], function(item) {
                can.run(event, ["search", item+".onexport.key"])
            })
            var args = {}; can.core.List(msg.option, function(key) { args[key] = msg.Option(key) })
            // can.core.Item(can.Option(), function(key, value) { args[key] = value })
            location.href = can.user.Share(can, args, true)
        })
    },
    _action: function(can, action, list) { // [string [class item...] {}]
        action && (action.innerHTML = ""), can.onaction && can.core.List(list||can.onaction.list, function(item) {
            item === ""? can.page.Append(can, action, [{view: "item space"}]):
                typeof item == "string"? can.onappend.input(can, action, "input", {type: "button", value: item, onclick: function(event) {
                    var cb = can.onaction[item] || can.onkeymap && can.onkeymap._remote
                    cb? cb(event, can, item): can.run(event, ["action", item], function(msg) {}, true)
                }}): item.length > 0? can.onappend.input(can, action, "input", {type: "select", values: item.slice(1), name: item[0], onchange: function(event) {
                    var cb = can.onaction[item[0]]
                    cb && cb(event, can, item[0], item[event.target.selectedIndex+1])
                }}): typeof item == "object" && can.page.Append(can, action, [item])
        })
    },
    _detail: function(can, msg, list, target) {
        can.ondetail && can.ondetail.list && can.ondetail.list.length > 0 && (target.oncontextmenu = function(event) {
            can.onappend.carte(can, can.ondetail||{}, list, function(ev, item, meta) {
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
                    can.page.ClassList.del(can, item, "select");
                }); can.page.ClassList.add(can, ui.item, "select");
                cb(event, ui.item)
            },
        }])
        return ui.item.Meta = item, ui.item
    },
    menu: function(can, msg, value) {
        can.ondetail && can.ondetail.list && can.ondetail.list.length > 0 && (can._target.oncontextmenu = function(event) {
            can.onappend.carte(can, can.ondetail||{}, msg["_detail"] || can.Conf("detail"), function(ev, item, meta) {
                (can.ondetail[item]||can.onaction[item])(event, can, value, item)
            })
        })
    },
    field: function(can, target, type, item) { var dataset = {}; item && item.name && (dataset.names = item.name);
        item.help = typeof item.help == "string" && item.help.startsWith("[") && (item.help = can.base.Obj(item.help, [""])[0]) || item.help || ""
        var field = can.page.Append(can, target, [{view: [(type||"")+" "+(item.name||"")+" "+(item.pos||""), "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"")+"("+(item.help||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: []},
            {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}]);
        return field.first.Meta = item, field;
    },
    input: function(can, option, type, item, value) {
        item.name && item.name.indexOf("@") == 0 && (item.name = item.name.slice(1)) && (item.position = item.position || "opts")
        item.figure = item.figure || item.value || "";
        item.action = item.action || item.value || "";
        item.cb = item.cb || item.value || "";

        var input = {type: "input", name: item.name, data: item, dataset: {}};
        switch (item.type = item.type || item._type || item._input || "text") {
            case "upfile": item.type = "file"; break
            case "button": item.value = item.name || item.value || "查看"; break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values;
                if (!item.values && item.value) {
                    item.values = item.value.split("|");
                    item.value = item.values[0];
                }
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value};
                });
                item.className || can.page.ClassList.add(can, item, item.position||"args");
                break
            case "textarea":
                input.type = "textarea"
                // no break
            case "password":
                // no break
            case "text":
                item.value = value || item.value || ""
                item.className || can.page.ClassList.add(can, item, item.position||"args");
                item.autocomplete = "off";
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

        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}]);
        item.type == "text" && !target.placeholder && (target.placeholder = item.name || "");
        item.type == "text" && !target.title && (target.title = target.placeholder);
        // item.type == "button" && item.action == "auto" && can.run && can.run({});
        // item.type == "select" && (target.value = item.value || item.values[item.index||0]);
        return target;
    },
    table: function(can, target, type, msg, cb) {
        var table = can.page.AppendTable(can, target, msg, msg.append, function(event, value, key, index, tr, td) {
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
        }, function(event, value, key, index, tr, td) {
            can.onappend.carte(can, can.ondetail||{}, msg["_detail"] || can.Conf("detail") || can.ondetail.list, function(event, item, meta) {
                var back = td.innerHTML
                switch (item) {
                    case "编辑":
                        var ui = can.page.Appends(can, td, [{type: "input", value: back, onkeydown: function(event) {
                            switch (event.key) {
                                case "Enter":
                                    td.innerHTML = event.target.value

                                    var res = can.request(event); can.core.List(msg.append, function(key) {
                                        res.Option(key, msg[key][index])
                                    }); can.run(event, ["action", item, key, event.target.value.trim(), value.trim()], function(res) {}, true)
                                    break
                                case "Escape":
                                    td.innerHTML = back
                                    break
                            }
                        }, onkeyup: function(event) {

                        }}]);
                        ui.input.focus()
                        ui.input.setSelectionRange(0, -1)
                        return
                }

                var res = can.request(event); can.core.List(msg.append, function(key) {
                    res.Option(key, msg[key][index])
                }); can.run(event, ["action", item, key, value.trim()], function(res) {}, true)
            })
        })
    },
    board: function(can, target, type, msg) {
        msg.result && can.page.AppendBoard(can, target, can.page.Display(msg.Result()))
    },

    carte: function(can, meta, list, cb) { meta = meta || can.ondetail, list = list && list.length > 0? list: meta.list; if (list.length == 0) { return }
        can._carte = can._carte || can.page.Append(can, can._target, [{view: "carte", onmouseleave: function(event) {
            can.page.Modify(can, can._carte, {style: {display: "none"}})
        }}]).last

        meta = meta||can.ondetail||{}, cb = cb||function(ev, item, meta) {
            var cb = can.ondetail[item] || can.onaction[item] || can.onkeymap&&can.onkeymap._remote
            cb && cb(event, can, item)
        }

        can.page.Appends(can, can._carte, can.core.List(list, function(item) {
            return {view: ["item"], list: [typeof item == "string"? {text: [item], click: function(event) {
                typeof cb == "function" && cb(event, item, meta)
            }}: item.args? {text: [item.name], click: function(event) {
                can.user.input(event, can, item.args, function(event, cmd, form, list) {
                    var msg = can.Event(event);
                    can.core.Item(form, function(key, value) {msg.Option(key, value)})
                    cmd == "提交" && typeof cb == "function" && cb(event, item.name, meta)
                    return true
                })
            }}: {select: [item, function(event) {
                typeof cb == "function" && cb(event, event.target.value, meta)
            }], value: src[item[0]]||""}]}
        }))


        var ls = can._follow.split(".")

        var left = (ls.length > 2) && can.run({}, ["search", can._follow.split(".")[1]+".onexport.left"]) || 0
        var top = (ls.length == 3) && can.run({}, ["search", can._follow.split(".")[1]+".onexport.top"]) || 0
        var top = (ls.length > 3)? event.y: top
        var pos = {position: "absolute", display: "block", left: event.x-left, top: event.y-top}
        // if (document.body.clientWidth - event.x < 60) {
        //     var pos = {display: "block", right: event.x, top: event.y}
        // }
        can.page.Modify(can, can._carte, {style: pos})
        console.log("carte ", can._carte.offsetLeft, "output", can._carte.parentNode.offsetLeft)

        event.stopPropagation()
        event.preventDefault()
    },
    toast: function(can, text, title, duration) {
        var meta = typeof text == "object"? text: {text: text, title: title, duration: duration}
        can._toast = can._toast || can.page.Append(can, can._target, [{view: "toast", onmouseleave: function(event) {
            can.page.Modify(can, can._toast, {style: {display: "none"}})
        }}]).last

        var ui = can.page.Appends(can, can._toast, [
            {text: [meta.title||"", "div", "title"]},
            typeof meta.text == "object"? meta.text: {text: [meta.text||"执行成功", "div", "content"]},
            {view: ["button"], list: meta.button},
            {text: ["", "div", "duration"]},
        ])

        var width = meta.width||200, height = meta.height||100
        var pos = {position: "absolute", display: "block",
            width: width, bottom: 100,
            left: document.body.clientWidth/2-width/2,
        };
        can.page.Modify(can, can._toast, {style: pos})

        can.Timer({value: 1000, length: (meta.duration||3000)/1000}, function(event, interval, index) {
            if (index > 2) {
                ui.duration.innerHTML = index+"s..."
            }
        }, function() {
            can.page.Modify(can, can._toast, {style: {display: "none"}})
        })
        ui.Close = function() {
            can.page.Modify(can, can._toast, {style: {display: "none"}})
        }
        return ui
    },
    share: function(can, msg, name, text) {
        can.run(msg._event, ["share"], function(msg) {
            var src = can.user.Share(can, {_path: "/share/"+msg.Result()}, true);
            var ui = can.onappend.toast(can, {title: can.page.Format("a", src, msg.Result()), text: can.page.Format("img", src+"/share"),
                width: 300, height: 300, duration: 100000, button: [{button: ["确定", function(event) {
                    can.page.Modify(can, can._toast, {style: {display: "none"}})
            }]}] });
        })
    },

    upload: function(can) { var begin = new Date();
        can._upload = can._upload || can.page.Append(can, can._target, [{view: "upload", list: [{view: "action"}, {view: "output"}]}])

        function show(event, value, total, loaded) {
            var now = new Date(); can.page.Appends(can, can._upload.output, [
                {view: ["progress"], style: {height: "10px", border: "solid 2px red"}, list: [{
                    view: ["progress"], style: {height: "10px", width: value + "%", background: "red"},  
                }]},
                {text: [value+"%", "div"], style: {"float": "right"}},
                {text: [can.base.Duration(now - begin), "div"], style: {"float": "left"}},
                {text: [can.base.Size(loaded)+"/"+can.base.Size(total), "div"], style: {"text-align": "center"}},
            ]);
        }

        var action = can.page.AppendAction(can, can._upload.action, [
            {type: "input", data: {name: "upload", type: "file", onchange: function(event) {
                var file = action.upload.files[0]
                show(event, 0, file.size, 0)
            }}, style: {width: "200px"}}, "上传", "关闭"], function(event, value, cmd) {
                if (action.upload.files.length == 0) {return action.upload.focus()}
                if (value == "关闭") {can._upload.stick = false; return can.page.Remove(can, can._upload.output.parentNode)}

                var msg = can.request(event, can.Option());

                // 上传文件
                begin = new Date();
                msg._progress = show
                msg.upload = action.upload.files[0];
                can.run(event, ["action", "upload"], function(msg) {
                    can.onappend.toast(can, "上传成功")
                }, true);
            })
        action.upload.click()
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
}, [], function(can) {})
Volcanos("onlayout", { _init: function(can, meta, list, cb, target) {
        var width = can._width, height = can._height;

        can.page.Select(can, target, "fieldset.head", function(field) {
            height -= field.offsetHeight;
        })
        can.page.Select(can, target, "fieldset.foot", function(field) {
            height -= field.offsetHeight;
        })

        can.page.Select(can, target, ["fieldset.left", "fieldset.middle", "fieldset.right"], function(field) {
            var border = field.offsetHeight - field.clientHeight;
            can.page.Modify(can, field, { style: {
                height: height-border*2+"px",
            } })

            can.page.Select(can, field, "div.output", function(output) {
                var border = output.offsetHeight - output.clientHeight;
                can.page.Modify(can, output, { style: {
                    height: height-border*2-20+"px",
                } })
            })
        })
        typeof cb == "function" && cb()
    },
})

