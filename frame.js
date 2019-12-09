var can = Volcanos("chat", {
    Plugin: shy("构造插件", function(can, meta, run, field) {
        var option = field.querySelector("form.option");
        var action = field.querySelector("div.action");
        var output = field.querySelector("div.output");

        var history = []

        var name = meta.name, args = meta.args || [];
        var feature = JSON.parse(meta.feature||'{}');
        var plugin = Volcanos(name, {type: "local",
            Append: function(item, cb) {item = item || {type: "text", name: "", className: "args temp"};
                var name = item.name || item.value || "args"+plugin.page.Select(can, option, "input.args.temp").length;
                var count = plugin.page.Select(can, option, ".args").length, value = "";
                args && count < args.length && (value = args[count] || item.value || "");
                plugin[name] = can.Inputs(plugin, item, name, value, cb, option);
            },
            Select: function(event, target, focus) {
                can.plugin = field, can.input = target || option.querySelectorAll("input")[1];
                focus && can.input.focus();
            },
            Option: function(key, value) {
                value != undefined && option[key] && (option[key].value = value)
                return key != undefined? option[key] && option[key].value || "":
                    plugin.page.Select(can, option, ".args", function(item) {return item.value})
            },
            Report: function(event, value, key, index) {
                plugin[key] && plugin[key].target && plugin[key].Import(event, value, key, index)
            },
            Check: function(event, target, cb) {
                plugin.page.Select(can, option, ".args", function(item, index, list) {
                    if (item == target && index < list.length-1) {can.plugin == field && list[index+1].focus(); return item}
                }).length == 0 && plugin.Runs(event, cb)
            },
            Last: function(event) {
                can.core.List(history.pop() && history.pop(), function(item, index) {
                    return item.target.value = item.value
                }).length > 0 && plugin.Runs(event)
            },
            Runs: function(event, cb) {plugin.Run(event, plugin.Option(), cb)},
            Run: function(event, args, cb, silent) {var show = !silent;
                history.push(plugin.page.Select(can, option, ".args", function(item, index, list) {
                    return {target: item, value: item.value}
                }))

                for (var i = args.length-1; i >= 0; i--) {if (args[i] == "") {args = args.slice(0, i)} else {break}}
                show && plugin.Timer(1000, function() {show && plugin.user.toast(kit.Format(args||["running..."]), meta.name, -1)});
                run(event, args, function(msg) {if (silent) {return typeof cb == "function" && cb(msg)}
                    plugin.Show(feature.display || "table", msg, cb)
                    show = false, plugin.user.toast();
                })
            },
            Show: function(type, msg, cb) {msg._plugin_name = name;
                return plugin[type] = can.Output(plugin, type, msg, cb, output, option)
            },
        }, ["core", "page", "user", "state"], function(plugin) {
            function next(list, cb) {
                list && list.length > 0 && cb(list[0], function() {
                    list.length > 0 && next(list.slice(1), cb)
                })
            }
            next(JSON.parse(meta.inputs||"[]"), plugin.Append)
        })
        return plugin.target = field, field.Plugin = plugin
    }),
    Inputs: shy("构造控件", function(can, item, name, value, cb, option) {
        var input = Volcanos(name, {type: "local", item: item,
            Select: function(event) {can.Select(event, input.target, true)},
            Import: function(event, value, key, index) {input.target.value = value;
                item.action == "auto"? can.Runs(event): can.Check(event, input.target);
            },
            run: function(event, cmd, cb, silent) {
                (input[item.cb] || can[item.cb] || can.Check)(event, event.target, cb);
            },

        }, ["core", "page", "user", "input"], function(input) {typeof cb == "function" && cb();
            var target = input.onimport.init(input, item, name, value, option);
            input.target = target, target.Input = input;
        })
        return input
    }),
    Output: shy("构造组件", function(can, type, msg, cb, target, option) {
        var output = Volcanos(type, {type: "local",
            Export: function(event, value, key, index) {can.Report(event, value, key, index)},
            run: function(event, cmd, cb, silent) {
                (output[cmd[1]] || can[cmd[1]] || can.Run)(event, cmd, cb, silent);
            },
        }, ["core", "page", "user", type], function(output) {
            output.onimport.init(output, msg, cb, target, option);
        }, msg)
        return output.target = target, target.Output = output
    }),
}, ["base", "core", "misc", "page", "user", "state", "input", "table"], function(can) {})

