Volcanos("onimport", {
    _init: function(can, meta, list, cb, target) {
        if (Volcanos.meta.follow[can._root]) { debugger }
        can.core.Next(meta.panes, function(item, next) {
            can.onappend._init(can, item, Config.libs.concat(item.list), function(pane) {
                pane.run = function(event, cmds, cb) { var msg = pane.request(event);
                    if (can.onaction[cmds[0]]) {
                        can.onaction[cmds[0]](event, can, msg, pane, cmds, cb);
                    } else {
                        can.onaction[meta.main.engine](event, can, msg, pane, cmds, cb);
                    }
                }, can[item.name] = pane, next();
            }, can._target);
        }, function() { can.onlayout._init(can, meta, list, function() {
            if (Volcanos.meta.follow[can._root]) { debugger }
            var pane = can[meta.main.name], msg = can.request(can._event);
            pane.onaction._init(pane, msg, msg.option||[], cb, target);
        }, target) });
    },
})
Volcanos("onaction", {
    search: function(event, can, msg, pane, cmds, cb) { var chain = cmds[1]
        if (Volcanos.meta.follow[can._root]) { debugger }
        var sub, mod = can, key, fun = can; can.core.List(chain.split("."), function(value, index, array) {
            fun && (sub = mod, mod = fun, key = value, fun = mod[value])
        }); if (!sub || !mod || !fun) { console.error("not found", chain); return }

        Volcanos.meta.debug[can._root] && console.log(can._root, can._name, "engine", chain, "match", sub._name+"."+mod._name)
        typeof fun == "function" && fun(sub, msg, cmds.slice(2), function(value) {
            typeof cb == "function" && cb(value)
        }, sub._target)
    },
    remote: function(event, can, msg, pane, cmds, cb) {
        if (Volcanos.meta.follow[can._root]) { debugger }
        Volcanos.meta.debug[can._root] && console.log(can._root, pane._name, "remote", msg._name, "detail", cmds);
        can.misc.Run(event, can, {names: pane._name}, cmds, function(msg) {
            typeof cb == "function" && cb(msg);
        })
    },
})
Volcanos("onappend", {
    _init: function(can, meta, list, cb, target) {
        var field = can.onappend.field(can, target, meta.type, meta);
        var option = can.page.Select(can, field, "form.option")[0];
        var action = can.page.Select(can, field, "div.action")[0];
        var output = can.page.Select(can, field, "div.output")[0];

        // 添加插件
        if (Volcanos.meta.follow[can._root]) { debugger }
        var sub = Volcanos(meta.name, { _help: meta.name, _target: field,
            _option: option, _action: action, _output: output, _history: [],
        }, [Config.volcano].concat(list), function(sub) {
            sub.onimport._init(sub, sub.Conf(meta), list, function() {
            }, field);

            // 添加控件
            can.core.Next(typeof meta.inputs == "string"? JSON.parse(meta.inputs||"[]"): meta.inputs || [], function(item, next) {
                sub[item.name] = Volcanos(item.name, { _help: item.name,
                    _target: can.onappend.input(sub, option, item.type, item),
                    _option: option, _action: action, _output: output,
                }, Config.libs.concat([item.display||"plugin/input.js"]), function(input) {
                    input.onimport._init(input, input.Conf(item), item.list||[], function() {
                    }, input._target);

                    // 事件回调
                    input.run = function(event, cmds, cb, silent) {
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
                            var display = msg.Option("display")||meta.display||"table"
                            sub[display] = Volcanos(display, { _target: output,
                                _option: option, _action: action, _output: output,
                            }, Config.libs.concat(["plugin/"+display]), function(table) {
                                table.onimport._init(table, msg, msg.append||[], function() {
                                }, output)
                            }) 
                        }, silent)
                    }

                    // 添加事件
                    can.core.Item(input.onaction, function(key, value) {
                        input._target && key.indexOf("on") == 0 && (input._target[key] = function(event) {
                            value(event, input);
                        })
                    }), next();
                })
            })
        }); cb(sub);
    },

    item: function(can, target, type, item, cb, cbs) {
        var ui = can.page.Append(can, target, [{view: [type, "div", item.nick||item.name],
            oncontextmenu: function(event) { cbs(event, ui.item) },
            click: function(event) {
                can.page.Select(can, target, "div."+type, function(item) {
                    can.page.ClassList.del(can, item, "select");
                }); can.page.ClassList.add(can, ui.item, "select");
                cb(event, ui.item)
            },
        }])
        return ui.item.Meta = item, ui.item
    },
    field: function(can, target, type, item) { var dataset = {}; item && item.name && (dataset.names = item.name);
        item.help = typeof item.help == "string" && item.help.startsWith("[") && (item.help = JSON.parse(item.help)[0]) || item.help || ""
        var field = can.page.Append(can, target, [{view: [(item.name||"")+" "+(type||"")+" "+(item.pos||""), "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"")+"("+(item.help||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: []},
            {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}]).first;
        return field.Meta = item, field;
    },
    input: function(can, option, type, item, cb) {
        item.name && item.name.indexOf("@") == 0 && (item.name = item.name.slice(1)) && (item.position = item.position || "opts")
        item.figure = item.figure || item.value || "";
        item.action = item.action || item.value || "";
        item.cb = item.cb || item.value || "";

        var input = {type: "input", name: item.name, data: item};
        switch (item.type = item.type || item._type || item._input || "text") {
            case "upfile": item.type = "file"; break
            // case "button": item.value = item.value || item.name || "查看"; break
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
                item.className || can.page.ClassList.add(can, item, item.position||"args");
                item.autocomplete = "off";
                break
        }

        var target = can.page.Append(can, option, [{view: ["item "+item.type], list: [item.position && {text: item.name+": "}, input]}]).last
        item.figure && item.figure.indexOf("@") == 0 && (item.figure = item.figure.slice(1)) && can.require(["plugin/input/"+item.figure], function() {
            target.type != "button" && (target.value = "")
        })

        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}]);
        item.type == "text" && !target.placeholder && (target.placeholder = item.name || "");
        item.type != "button" && !target.title && (target.title = item.placeholder);
        // item.type == "button" && item.action == "auto" && can.run && can.run({});
        item.type == "select" && (target.value = item.value || item.values[item.index||0]);
        return target;
    },
}, [], function(can) {})
Volcanos("onlayout", {
    _init: function(can, meta, list, cb, target) {
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
                can.page.Modify(can, field, { style: {
                    height: height-border*2-20+"px",
                } })
            })
        })
        typeof cb == "function" && cb()
    },
})

