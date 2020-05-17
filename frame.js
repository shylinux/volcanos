Volcanos("onaction", { _init: function(can, meta, list, cb, target) {
        can.core.Next(meta.panes, function(item, next) {
            can.onappend._init(can, item, Config.libs.concat(item.list), function(pane) {
                pane.Conf(item), pane.run = function(event, cmds, cb) {
                    (can.onaction[cmds[0]]||can.onaction[meta.main.engine])(event, can, pane.request(event), pane, cmds, cb);
                }, can[item.name] = pane, next();
            }, can._target);
        }, function() { can.onlayout._init(can, meta, list, function() {
            can.require(["/publish/order.js"], function(can) {
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
                var pane = can[meta.main.name], msg = can.request({});
                pane.onaction._init(pane, msg, msg.option||[], cb, target);
            })
        }, target) });
    },
    search: function(event, can, msg, pane, cmds, cb) { var chain = cmds[1]
        var sub, mod = can, key, fun = can; can.core.List(chain.split("."), function(value, index, array) {
            fun && (sub = mod, mod = fun, key = value, fun = mod[value])
        }); if (!sub || !mod || !fun) { console.error("not found", chain); return }

        typeof fun == "function" && fun(sub, msg, cmds.slice(2), cb, sub._target)
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
                var river = can.onengine.river[cmds[0]];
                var storm = river && river.storm[cmds[1]];
                var action = storm && storm.action[cmds[2]];
                if (!storm) { break } if (cmds.length == 2) {
                    can.core.List(storm.action, function(value) {
                        msg.Push("name", value.name||"");
                        msg.Push("help", value.help||"");
                        msg.Push("pod", value.pod||"");
                        msg.Push("group", value.group||"");
                        msg.Push("index", value.index||"");
                        msg.Push("args", value.args||"[]");
                        msg.Push("inputs", JSON.stringify(value.inputs||[]));
                        msg.Push("feature", JSON.stringify(value.feature||{}));
                    })
                    typeof cb == "function" && cb(msg);
                } else if (action.engine) {
                    action.engine(event, can, msg, pane, cmds, cb);
                } else {
                    msg.Option("group", action.group)
                    msg.Option("index", action.index)
                    return false
                }
                return true
        }
        return false;
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        if (can.onaction.engine(event, can, msg, pane, cmds, cb)) { return }
        if (location.protocol == "file:") { typeof cb == "function" && cb(msg); return }
        can.misc.Run(event, can, {names: pane._name}, cmds, cb)
    },
})
Volcanos("onappend", { _init: function(can, meta, list, cb, target, field) {
        field = field || can.onappend.field(can, target, meta.type||"plugin", meta);
        var option = can.page.Select(can, field, "form.option")[0];
        var action = can.page.Select(can, field, "div.action")[0];
        var output = can.page.Select(can, field, "div.output")[0];
        var feature = can.base.Obj(meta.feature)

        // 添加插件
        var sub = Volcanos(meta.name, { _help: meta.name, _target: field,
            _option: option, _action: action, _output: output, _history: [],
            _follow: can._follow+"."+meta.name,
        }, [Config.volcano].concat(list), function(sub) {
            meta.feature = can.base.Obj(meta.feature, {})
            meta.detail = meta.feature["detail"] || {}
            sub.onimport._init(sub, sub.Conf(meta), list, function() {}, field);

            // 添加控件
            var args = can.base.Obj(meta.args, [])
            can.core.Next(can.base.Obj(meta.inputs, []), function(item, next, index) {
                sub[item.name] = Volcanos(item.name, { _help: item.name,
                    _target: can.onappend.input(sub, option, item.type, item, args[index]),
                    _option: option, _action: action, _output: output,
                    _follow: can._follow+"."+meta.name+"."+item.name,
                }, Config.libs.concat([item.display||"/plugin/input.js"]), function(input) {
                    input.onimport._init(input, input.Conf(item), item.list||[], function() {}, input._target);

                    input.run = function(event, cmds, cb, silent) {
                        // 控件回调
                        switch (item.name) {
                        case "返回":
                            // 历史命令
                            sub._history.pop(); var his = sub._history.pop(); if (his) {
                                can.page.Select(can, option, "input.args", function(item, index) {
                                    item.value = his[index] || ""
                                })
                            }
                        }

                        // 解析参数
                        cmds = cmds && cmds.length > 0? cmds: can.page.Select(can, option, "input.args", function(item) {
                            return item.name && item.value || ""
                        }); for (var i = cmds.length-1; i >= 0; i--) {
                            if (!cmds[i]) { cmds.pop() } else { break }
                        }

                        sub._history.push(cmds); sub.run(event, cmds, function(msg) {
                            if (silent) { typeof cb == "function" && cb(msg); return }

                            // 添加组件
                            var display = (msg.Option("_display")||feature.display||"table.js")
                            display.indexOf("/") == 0 || (display = "/plugin/"+display)

                            sub[display] = Volcanos(display, { _target: output,
                                _option: option, _action: action, _output: output,
                                _follow: can._follow+"."+meta.name+"."+display,
                            }, Config.libs.concat(["/frame.js", display]), function(table) { table.Conf(sub.Conf())
                                table.onimport._init(table, msg, msg.append||[], function() {}, output)

                                table.run = function(event, cmds, cb, silent) {
                                    // 组件回调
                                    cmds[0] == "field"? sub.run(event, cmds.slice(1), cb, silent):
                                    input.run(event, cmds, cb, silent)
                                }
                            }) 
                        }, silent)
                    }

                    // 添加事件
                    can.core.Item(input.onaction, function(key, value) {
                        input._target && key.indexOf("on") == 0 && (input._target[key] = function(event) {
                            value(event, input);
                        })
                    }), next();

                    // 自动执行
                    if (item.type == "button" && item.action == "auto") {
                        input._target.click()
                    }
                })
            })
        }); cb(sub);
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
    field: function(can, target, type, item) { var dataset = {}; item && item.name && (dataset.names = item.name);
        item.help = typeof item.help == "string" && item.help.startsWith("[") && (item.help = can.base.Obj(item.help, [""])[0]) || item.help || ""
        var field = can.page.Append(can, target, [{view: [(type||"")+" "+(item.name||"")+" "+(item.pos||""), "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"")+"("+(item.help||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: []},
            {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}]).first;
        return field.Meta = item, field;
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
        var target = can.page.Append(can, option, [{view: ["item "+item.type], list: [item.position && {text: item.name+": "}, input]}]).last
        item.figure && item.figure.indexOf("@") == 0 && (item.figure = item.figure.slice(1)) && can.require(["/plugin/input/"+item.figure], function() {
            target.type != "button" && (target.value = "")
        })

        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}]);
        item.type == "text" && !target.placeholder && (target.placeholder = item.name || "");
        item.type != "button" && !target.title && (target.title = item.placeholder);
        // item.type == "button" && item.action == "auto" && can.run && can.run({});
        item.type == "select" && (target.value = item.value || item.values[item.index||0]);
        return target;
    },
    table: function(can, target, type, msg) {
        var table = can.page.AppendTable(can, can._output, msg, msg.append, function(event, value, key, index, tr, td) {
            can.page.Select(can, can._option, "input.args", function(input) { if (input.name == key) { var data = input.dataset || {}
                input.value = value; if (data.action == "auto") {
                    can.run(event, [], function(msg) {})
                }
            } })
        }, function(event, value, key, index, tr, td) {
            can.onappend.carte(can, can.ondetail||{}, msg["_detail"] || can.Conf("detail") || can.ondetail.list, function(event, item, meta) {
                var back = td.innerHTML
                switch (item) {
                    case "编辑":
                        var ui = can.page.Appends(can, td, [{type: "input", value: back, onkeydown: function(event) {
                            console.log("key", event.key)
                            switch (event.key) {
                                case "Enter":
                                    td.innerHTML = event.target.value

                                    var res = can.request(event); can.core.List(msg.append, function(key) {
                                        res.Option(key, msg[key][index])
                                    }); can.run(event, ["field", "action", item, key, event.target.value.trim(), value.trim()], function(res) {}, true)
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
                }); can.run(event, ["field", "action", item, key, value.trim()], function(res) {}, true)
            })
        })
    },
    board: function(can, target, type, msg) {
        msg.result && can.page.AppendBoard(can, can._output, can.page.Display(msg.Result()))
    },

    carte: function(can, meta, list, cb) {
        can._carte = can._carte || can.page.Append(can, can._target, [{view: "carte", onmouseleave: function(event) {
            can.page.Modify(can, can._carte, {style: {display: "none"}})
        }}]).last

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

        var pos = {position: "absolute", display: "block", left: event.x, top: event.y}
        if (document.body.clientWidth - event.x < 60) {
            var pos = {display: "block", right: event.x, top: event.y}
        }
        pos.left += "px"; pos.top += "px";
        can.page.Modify(can, can._carte, {style: pos})

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
            {text: [meta.text||"执行成功", "div", "content"]},
            {view: ["button"], list: meta.button},
            {text: ["", "div", "duration"]},
        ])

        var width = meta.width||200, height = meta.height||100
        var pos = {position: "absolute", display: "block",
            width: width+"px",
            top: document.body.clientHeight/2-height/2,
            left: document.body.clientWidth/2-width/2,
        }; pos.left += "px"; pos.top += "px";
        can.page.Modify(can, can._toast, {style: pos})

        can.Timer({value: 1000, length: (meta.duration||3000)/1000}, function(event, interval, index) {
            if (index > 2) {
                ui.duration.innerHTML = index+"s..."
            }
        }, function() {
            can.page.Modify(can, can._toast, {style: {display: "none"}})
        })
        return ui
    },
    share: function(can, msg) {
        can.run(msg._event, ["share"], function(msg) {
            var src = can.user.Share(can, {path: "/share/"+msg.Result()}, true);
            var ui = can.onappend.toast(can, {title: can.page.Format("a", src, msg.Result()), text: can.page.Format("img", src+"/share"),
                width: 300, height: 300, duration: 100000, button: [{button: ["确定", function(event) {
                    can.page.Modify(can, can._toast, {style: {display: "none"}})
            }]}] });
        })
    }
}, [], function(can) {})
Volcanos("onlayout", { _init: function(can, meta, list, cb, target) {
        var width = can._width, height = can._height;
        if (Volcanos.meta.follow[can._root]) { debugger }

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

