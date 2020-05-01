Volcanos("onappend", {
    _init: function(can, meta, list, cb, target) {
        var field = can.onappend.field(can, target, meta.type, meta);
        var option = can.page.Select(can, field, "form.option")[0];
        var action = can.page.Select(can, field, "div.action")[0];
        var output = can.page.Select(can, field, "div.output")[0];

        // 添加插件
        var sub = Volcanos(meta.name, { _help: meta.name, _target: field,
            _option: option, _action: action, _output: output,
            _history: [],
        }, list, function(sub) { sub.Conf(meta);
            sub.onimport && sub.onimport._init && sub.onimport._init(sub, meta, [], function() {
            }, output, action, option, field);

            // 添加控件
            can.core.Next(typeof meta.inputs == "string"? JSON.parse(meta.inputs||"[]"): meta.inputs || [], function(item, next) {
                sub[item.name] = Volcanos(item.name, {
                    _target: can.onappend.input(sub, sub._option, "input", item),
                    _option: option, _action: action, _output: output,
                }, Config.libs.concat(["plugin/input.js"]), function(input) { input.Conf(item);
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
                                //事件响应
                                table.onimport._init(table, msg, [], function() {
                                }, output, action, option)
                            }) 
                        }, silent)
                    }
                    can.core.Item(input.onaction, function(key, value) {
                        key.indexOf("on") == 0 && (input._target[key] = function(event) {
                            // 事件触发
                            value(event, input)
                        })
                    })
                    next()
                })
            })
        })
        cb(sub)
    },

    item: function(can, target, type, item, cb, cbs) {
        var ui = can.page.Append(can, target, [{view: ["item", "div", item.name], click: function(event) {
            cb(event, ui.item)
        }}])
        return ui.item.Meta = item, ui.item
    },
    field: function(can, target, type, item) {
        typeof item.help == "string" && item.help.startsWith("[") && (item.help = JSON.parse(item.help))

        var dataset = {}; item && item.name && (dataset.names = item.name);
        var field = can.page.Append(can, target, [{view: [(item.name||"")+" "+(type||"")+" "+(item.pos||""), "fieldset"], list: [
            item.pos? undefined: {text: [(item.nick||item.name||"")+"("+((typeof item.help == "string"? item.help: item.help.length > 0 && item.help[0])||"")+")", "legend"]},
            {view: ["option", "form"], dataset: dataset, list: []},
            {view: ["action"]}, {view: ["output"]}, {view: ["status"]},
        ]}]).first;
        return field.Meta = item, field;
    },
    input: function(can, option, type, item, cb) {
        var input = {type: "input", name: item.name, data: item};
        item.action = item.action || item.value || "";
        item.figure = item.figure || item.value || "";
        item.cb = item.cb || item.value || "";
        item.name && item.name.indexOf("@") == 0 && (item.name = item.name.slice(1)) && (item.position = item.position || "opts")

        switch (item.type = item.type || item._type || item._input || "text") {
            case "upfile": item.type = "file"; break
            case "button":
                item.value = item.name || item.value;
                break
            case "select":
                item.values = typeof item.values == "string"? item.values.split(" "): item.values;
                if (!item.values && item.value) {
                    item.values = item.value.split("|")
                    item.value = item.values[0]
                }
                input.type = "select", input.list = item.values.map(function(value) {
                    return {type: "option", value: value, inner: value};
                })
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

        if (item.value == "auto") {item.value = ""}
        item.figure && item.figure.indexOf("@") == 0 && (item.figure = item.figure.slice(1)) && can.require(["plugin/input/"+item.figure], function() {
            target.type != "button" && (target.value = "")
        })

        var list = [], style = ""
        switch (type) {
            case "option":
                list.push({text: item.name+": "})
            case "input":
                style = " "+item.type
                list.push(input)
                break
        }
        var ui = can.page.Append(can, option, [{view: ["item"+style], list:list}])
        var target = ui[item.name]
        if (!target) { return }

        item.type == "text" && !target.placeholder && (target.placeholder = item.name || "");
        item.type != "button" && !target.title && (target.title = item.placeholder || item.name || "");
        item.type == "textarea" && can.page.Append(can, option, [{type: "br"}])
        item.type == "select" && (target.value = item.value || item.values[item.index||0])
        item.type == "button" && item.action == "auto" && can.run && can.run({});
        return target;
    },
}, [], function(can) {})
Volcanos("onlayout", {
    start: function(can, target, width, height) {
        can.page.Select(can, target, "fieldset.head", function(field) {
            height -= field.offsetHeight;
        })
        can.page.Select(can, target, "fieldset.foot", function(field) {
            height -= field.offsetHeight;
        })

        can.page.Select(can, target, ["fieldset.left", "fieldset.middle", "fieldset.right"], function(field) {
            var border = field.offsetHeight - field.clientHeight
            can.page.Modify(can, field, {style: {
                height: height-border*2+"px",
            }})
        })
        can.page.Select(can, target, ["fieldset.left>div.output", "fieldset.middle>div.output", "fieldset.right>div.output"], function(field) {
            var border = field.offsetHeight - field.clientHeight
            can.page.Modify(can, field, {style: {
                height: height-border*2-20+"px",
            }})
        })
    },
})
Volcanos("onsearch", {
    start: function(event, can, chain, cb) {
        var sub, mod, fun = can, key;
        can.core.List(chain.split("."), function(value, index, array) {
            sub = mod, mod = fun, fun = mod[value], key = value
        })
        if (!sub || !mod) { console.error("not found", chain); return }

        Volcanos.meta.debug["search"] && console.log("volcano", can._name, "search", chain, "match", sub._name+"."+mod._name)
        typeof fun == "function" && fun(event, sub, key, function(value) {
            Volcanos.meta.debug["search"] && console.log("volcano", can._name, "search", chain, "value", value)
            cb(value)
        })
    },
})
