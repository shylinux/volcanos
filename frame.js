var can = Volcanos("chat", {
    Page: shy("构造网页", function(can, name, conf, cb, body) {
        var page = Volcanos(name, {type: "local",
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Report: function(event, value, key) {
                kit.Item(page, function(index, item) {
                    item.Import && item.Import(event, value, key)
                })
            },

            run: function(event, option, cmds, cb) {ctx.Run(event, option, cmds, cb)},
        }, Config.libs.concat(["page/"+name]), function(page) {
            page.onimport._init && page.onimport._init(page, conf, body)
            can.core.Next(conf.pane, function(item, cb) {
                page[item.pos] = page[item.name] = can.Pane(page, item.name, item, cb, can.page.Select(can, body, "fieldset."+item.name)[0] ||
                    can.page.AppendField(can, body, item.name+" dialog", item))
            }, function() {typeof cb == "function" && cb(page)})
        }, conf)
        return page.target = body, page
    }),
    Pane: shy("构造面板", function(can, name, meta, cb, field) {
        var river = "", storm = "";

        var pane = Volcanos(name, {type: "local",
            option: field.querySelector("form.option"),
            action: field.querySelector("div.action"),
            output: field.querySelector("div.output"),
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Export: function(event, value, key) {can.Report(event, value, key)},
            Import: function(event, value, key) {var cb = pane.onimport[key];
                typeof cb == "function" && cb(event, pane, value, key, pane.output);
            },

            Size: function(event, width, height) {var cb = pane.onimport["size"];
                if (width > 0) {
                    field.style.width = width + "px"
                } else if (width == -1) {
                    field.style.width = document.body.offsetWidth + "px"
                }

                if (height > 0) {
                    field.style.height = height + "px"
                } else if (height == -1) {
                    field.style.height = document.body.offsetHeight + "px"
                }

                typeof cb == "function" && cb(event, pane, {width: width, height: height}, "size", pane.output)
            },

            Show: function(width, height) {field.style.display = "block";
                if (width < 0) {field.style.left = -width / 2 + "px";
                    field.style.width = (document.body.offsetWidth + width) / 2 + "px";
                }
                if (height < 0) {field.style.top = -height / 2 + "px";
                    field.style.height = (document.body.offsetHeight + height) / 2 + "px";
                }
                if (width > 0) {field.style.width = width + "px";
                    field.style.left = (document.body.offsetWidth - width) / 2 + "px";
                }
                if (height > 0) {field.style.height = height + "px";
                    field.style.top = (document.body.offsetHeight - height) / 2 + "px";
                }
            },
            Hide: function() {field.style.display = "none"},

            run: function(event, cmds, cb) {var msg = pane.Event(event)
                can.page.Select(can, pane.action, "input", function(item, index) {
                    msg.Option(name, item.value)
                })
                can.run(event, pane.option.dataset, cmds, cb)
            },
        }, Config.libs.concat(["pane/"+name]), function(pane) {
            pane.onimport._init && pane.onimport._init(pane, pane.output, pane.action, pane.option, field)

            function deal(event, value)  {
                typeof pane.onaction[value] == "function" && pane.onaction[value](event, pane, meta, value, pane.output)
            }

            can.page.Append(can, pane.action, can.core.List(pane.onaction.list, function(line) {
                return typeof line == "string"? {button: [line, deal]}: line.length > 0? {select: [line, deal]}: line
            }))
            typeof cb == "function" && cb(pane)
        }, meta)
        return pane.target = field, pane
    }),
    Plugin: shy("构造插件", function(can, name, meta, run, field) {
        var option = field.querySelector("form.option");
        var action = field.querySelector("div.action");
        var output = field.querySelector("div.output");

        var history = []

        var args = meta.args || [];
        var feature = JSON.parse(meta.feature||'{}');
        var exports = JSON.parse(meta.exports||'{}');
        var plugin = Volcanos(name, {type: "local",
            Inputs: can.Inputs, Output: can.Output,

            Append: function(item, cb) {item = item || {type: "text", name: "", className: "args temp"};
                var name = item.name || item.value || "args"+plugin.page.Select(can, option, "input.args.temp").length;
                var count = plugin.page.Select(can, option, ".args").length, value = "";
                args && count < args.length && (value = args[count] || item.value || "");
                plugin[name] = can.Inputs(plugin, item, "input", name, value, cb, option);
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
                for (var i = 0; i < exports.length; i += 3) {
                    if (exports[i+1] == key) {key = exports[i]}
                }
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
        }, Config.libs.concat(["plugin/"+(meta.type||"state")]), function(plugin) {
            can.core.Next(JSON.parse(meta.inputs||"[]"), plugin.Append)
        }, meta)
        return plugin.target = field, field.Plugin = plugin
    }),
    Inputs: shy("构造控件", function(can, item, type, name, value, cb, option) {
        var input = Volcanos(name, {type: "local", item: item,
            Select: function(event) {can.Select(event, input.target, true)},
            Import: function(event, value, key, index) {input.target.value = value;
                item.action == "auto"? can.Runs(event): can.Check(event, input.target);
            },
            run: function(event, cmd, cb, silent) {
                (input[item.cb] || can[item.cb] || can.Check)(event, event.target, cb);
            },

        }, Config.libs.concat(["plugin/"+type]), function(input) {
            var target = input.onimport.init(input, item, name, value, option);
            input.target = target, target.Input = input;

            typeof cb == "function" && cb();
        })
        return input
    }),
    Output: shy("构造组件", function(can, type, msg, cb, target, option) {
        if (type == "inner" && (!msg.result || msg.result.length == 0)) {
            type = "table"
        }
        var output = Volcanos(type, {type: "local",
            Export: function(event, value, key, index) {can.Report(event, value, key, index)},
            run: function(event, cmd, cb, silent) {
                (output[cmd[1]] || can[cmd[1]] || can.Run)(event, cmd, cb, silent);
            },
        }, Config.libs.concat(["plugin/"+type]), function(output) {
            output.onimport.init(output, msg, cb, target, option);
        }, msg)
        return output.target = target, target.Output = output
    }),
}, Config.libs.concat(Config.list), function(can) {
    if (ctx.Search("feature") != "") {
        can[Config.main] = can.Page(can, Config.main, Config, function(chat) {
            // can.user.carte = page.carte.Pane.Show;
            // can.user.toast = page.toast.Pane.Show;
            chat.River.Import(event||{}, "shy", "username")
        }, document.body)
    }
})

