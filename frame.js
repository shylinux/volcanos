var can = Volcanos("chat", {
    Plugin: shy("构造插件", function(can, meta, run, field) {
        var option = field.querySelector("form.option");
        var action = field.querySelector("div.action");
        var output = field.querySelector("div.output");

        var name = meta.name, args = meta.args || [];
        var feature = JSON.parse(meta.feature||'{}');
        var plugin = Volcanos(name, {type: "local",
            Append: shy("添加控件", function(item, cb) {item = item || {type: "text", name: "", className: "args temp"};
                var name = item.name || item.value || "args"+plugin.page.Select(can, option, "input.args.temp").length;
                var count = plugin.page.Select(can, option, ".args").length, value = "";
                args && count < args.length && (value = args[count] || item.value || "");
                plugin[name] = can.Inputs(plugin, item, name, value, cb, option);
            }),
            Select: shy("选择控件", function(event, target, focus) {
                can.plugin = field, can.input = target || option.querySelectorAll("input")[1];
                focus && can.input.focus();
            }),
            Option: shy("控件参数", function(key, value) {
                value != undefined && option[key] && (option[key].value = value)
                return key != undefined? option[key] && option[key].value || "":
                    plugin.page.Select(can, option, ".args", function(item) {return item.value})
            }),
            Check: shy("检查控件", function(event, target, cb) {
                plugin.page.Select(can, option, ".args", function(item, index, list) {
                    item == target && index < list.length-1 && can.plugin == field && list[index+1].focus();
                    (target == undefined || item == target) && index == list.length-1 && plugin.Runs(event, cb);
                    return item;
                }).length == 0 && plugin.Runs(event, cb)
            }),
            Runs: shy("执行命令", function(event, cb) {plugin.Run(event, plugin.Option(), cb)}),
            Run: shy("执行命令", function(event, args, cb, silent) {var show = !silent;
                show && plugin.Timer(1000, function() {show && plugin.user.toast(kit.Format(args||["running..."]), meta.name, -1)});
                run(event, args, function(msg) {if (silent) {return typeof cb == "function" && cb(msg)}
                    var display = feature.display || "table";
                    plugin[display] = can.Output(plugin, display, msg, cb, output, option)
                    show = false, plugin.user.toast();
                })
            }),
        }, ["core", "page", "user", "state"], function(plugin) {
            function next(list, cb) {
                list && list.length > 0 && cb(list[0], function() {
                    list.length > 0 && next(list.slice(1), cb)
                })
            }
            next(JSON.parse(meta.inputs||"[]"), plugin.Append)

            kit.Item(plugin.onaction, function(key, cb) {field[key] = function(event) {
                cb(event, plugin, field)
            }})
        })
        return plugin.target = field, field.Plugin = plugin
    }),
    Inputs: shy("构造控件", function(can, item, name, value, cb, option) {
        var input = Volcanos(name, {type: "local",
            Select: function(event) {can.Select(event, input.target, true)},
            run: function(event) {(input[item.cb] || can[item.cb] || can.Check)(event)},

        }, ["core", "page", "user", "input"], function(input) {typeof cb == "function" && cb();
            var target = input.onimport.init(can, item, name, value, option);
            input.target = target, target.Input = input;

            kit.Item(input.onaction, function(key, cb) {target[key] = function(event) {
                cb(event, input, item.type, option);
            }})
        })
        return input
    }),
    Output: shy("构造组件", function(can, type, msg, cb, target, option) {
        type = "table"
        var output = Volcanos(type, {type: "local",
            run: function(event, can, msg, value, index, key) {(output[item.cb] || can[item.cb] || can.Check)(event)},
            size: function(cb) {
                can.onfigure.meta.size(function(width, height) {
                    cb(width, height)
                })
            }
        }, ["core", "page", "user", type], function(output) {
            output.onimport.init(output, msg, cb, target, option)

            kit.Item(output.onaction, function(key, cb) {target[key] = function(event) {
                cb(event, output, type, msg, target)
            }})

            target.oncontextmenu = function(event) {
                can.user.carte(event, shy("", output.onchoice, output.onchoice.list, function(event, value, meta) {
                    typeof meta[value] == "function"? meta[value](event, can, msg, cb, target, option):
                        typeof output[value] == "function"? output[value](event, can, msg, cb, target, option):
                            typeof can[value] == "function"? can[value](event, can, msg, cb, target, option): null
                    return true
                }))
                event.stopPropagation()
                event.preventDefault()
                return true
            }
        })
        return output.target = target, target.Output = output
    }),
}, ["base", "core", "misc", "page", "user"], function(can) {})

