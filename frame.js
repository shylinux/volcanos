var can = Volcanos("chat", {
    Page: shy("构造网页", function(can, name, conf, cb, body) {
        var page = Volcanos(name, {_type: "local",
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Report: function(event, value, key) {
                page.Import && page.Import(event, value, key)
                can.core.Item(page.panes, function(index, item) {
                    item.Import && item.Import(event, value, key)
                })
            },
            Import: function(event, value, key) {var cb = page.onimport[key];
                typeof cb == "function" && cb(event, page, value, key, body);
            },

            run: function(event, option, cmds, cb) {can.misc.Run(event, page, option, cmds, cb)},
        }, Config.libs.concat(["page/"+name]), function(page) {page.Conf(conf);
            page.onimport._init && page.onimport._init(page, conf, body)
            can.core.Next(conf.pane, function(item, cb) {page.panes = page.panes || {};
                page.panes[item.name] = page[item.pos] = page[item.name] = can.Pane(page, item.name, item, cb,
                    can.page.Select(can, body, "fieldset."+item.name)[0] ||
                    can.page.AppendField(can, body, item.name+" "+(item.pos||""), item))
            }, function() {typeof cb == "function" && cb(page)})
        }, conf)
        return page.target = body, page
    }),
    Pane: shy("构造面板", function(can, name, meta, cb, field) {
        var river = "", storm = "";

        var pane = Volcanos(name, {_type: "local", target: field,
            option: field.querySelector("form.option"),
            action: field.querySelector("div.action"),
            output: field.querySelector("div.output"),
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Export: function(event, value, key) {can.Report(event, value, key)},
            Import: function(event, value, key) {var cb = pane.onimport[key];
                typeof cb == "function" && cb(event, pane, value, key, pane.output);
            },

            Size: function(event, width, height) {var cb = pane.onimport["size"];
                field.style.display = width === 0 || height === 0? "none": "block";
                if (width > 0) { 
                    field.style.width = width + "px"
                } else if (width == -1) {
                    field.style.width = document.body.offsetWidth + "px"
                } else if (width == -2) {
                    field.style.width = ""
                }

                if (height > 0) {
                    field.style.height = height + "px"
                } else if (height == -1) {
                    field.style.height = document.body.offsetHeight + "px"
                } else if (width == -2) {
                    field.style.width = ""
                }

                typeof cb == "function" && cb(event, pane, {width: width, height: height}, "size", pane.output)
            },
            Show: function(event, width, height, offset) {field.style.display = "block";
                if (width < 0) {field.style.left = -width / 2 + "px";
                    field.style.width = (document.body.offsetWidth + width) + "px";
                }
                if (width > 0) {field.style.width = width + "px";
                    field.style.left = (document.body.offsetWidth - width) / 2 + "px";
                }
                if (height > 0) {field.style.height = height + "px";
                    field.style.top = (document.body.offsetHeight - height) / 2 + (offset||0) + "px";
                }
                if (height < 0) {field.style.top = -height / 2 + (offset||0) + "px";
                    field.style.height = (document.body.offsetHeight + height) + "px";
                }
                var cb = pane.onimport["show"];
                typeof cb == "function" && cb(event, can, width, "show", pane.output)
                return field;
            },
            Hide: function() {field.style.display = "none"},

            run: function(event, cmds, cb) {var msg = pane.Event(event)
                can.page.Select(can, pane.action, "input", function(item, index) {
                    msg.Option(item.name, item.value)
                })
                can.run(event, pane.option.dataset, cmds, cb)
                return msg
            },
        }, Config.libs.concat(["pane/"+name]), function(pane) {
            can.Dream(document.head, "pane/"+name+".css")
            pane.onimport._init && pane.onimport._init(pane, pane.Conf(meta), pane.output, pane.action, pane.option, field)

            function deal(event, value)  {
                typeof pane.onaction[value] == "function" && pane.onaction[value](event, pane, meta, value, pane.output)
            }

            can.page.Append(can, pane.action, can.core.List(pane.onaction.list, function(line) {
                return typeof line == "string"? {button: [line, deal]}: line.length > 0? {select: [line, deal]}: line
            }))
            typeof cb == "function" && cb(pane)
        }, meta)
        return pane
    }),
    Plugin: shy("构造插件", function(can, name, meta, run, field) {
        var option = field.querySelector("form.option");
        var action = field.querySelector("div.action");
        var output = field.querySelector("div.output");

        var history = []

        var args = meta.args || [];
        var feature = JSON.parse(meta.feature||'{}');
        var exports = JSON.parse(meta.exports||'{}');
        var plugin = Volcanos(name, {_type: "local", target: field,
            option: field.querySelector("form.option"),
            action: field.querySelector("div.action"),
            output: field.querySelector("div.output"),
            Inputs: can.Inputs, Output: can.Output,

            Import: function(event, value, key) {var cb = plugin.onimport[key];
                typeof cb == "function" && cb(event, plugin, value, key, plugin.output);
            },

            Remove: function(event) {var list = can.page.Select(can, option, "input.temp")
                list.length > 0 && list[list.length-1].parentNode.removeChild(list[list.length-1])
            },
            Append: function(item, cb) {item = item || {type: "text", name: "", className: "args temp"};
                var name = item.name || item.value || "args"+plugin.page.Select(can, option, "input.args.temp").length;
                var count = plugin.page.Select(can, option, ".args").length, value = "";
                args && count < args.length && (value = args[count] || item.value || "");
                plugin[name] = can.Inputs(plugin, item, "input", name, value, cb, option);
            },
            Select: function(event, target, focus) {
                can.page.Select(can, field.parentNode, "field.item.select", function(item) {
                    can.page.ClassList.del(can, item, "select")
                })
                can.page.ClassList.add(can, field, "select")

                can._plugin = plugin, can.input = target || option.querySelectorAll("input")[1];
                focus && can.input.focus();
                return true
            },
            Option: function(key, value) {
                value != undefined && option[key] && (option[key].value = value)
                return key != undefined? option[key] && option[key].value || "":
                    plugin.page.Select(can, option, ".args", function(item) {return item.value})
            },
            Report: function(event, value, key, index) {
                for (var i = 0; i < exports.length; i += 3) {
                    if (exports[i+1] == key) {key = exports[i]
                        if (exports[i+2]) {var cb = plugin.onexport[exports[i+2]], res;
                            value = typeof cb == "function" && ((res = cb(event, plugin, plugin.msg, value, key, index)) != undefined) && res || value;
                        }
                        key && can.Import(event, value, key)
                    }
                }
                key && plugin[key] && plugin[key].target && plugin[key].Import(event, value, key, index)
            },
            Check: function(event, target, cb) {
                plugin.page.Select(can, option, ".args", function(item, index, list) {
                    if (item == target && index < list.length-1) {can._plugin.target == field && list[index+1].focus(); return item}
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
                can.Export(event, 1, "ncmd")

                for (var i = args.length-1; i >= 0; i--) {if (args[i] == "") {args = args.slice(0, i)} else {break}}
                show && plugin.Timer(1000, function() {show && plugin.user.toast(can.base.Format(args||["running..."]), meta.name, -1)});
                run(event, args, function(msg) {if (silent) {return typeof cb == "function" && cb(msg)}
                    plugin.msg = msg
                    plugin.Show(feature.display || "table", msg, cb)
                    show = false, plugin.user.toast();
                })
            },
            Show: function(type, msg, cb) {plugin.msg = msg, msg._plugin_name = name;
                return plugin._output = plugin[type] = can.Output(plugin, type, msg, cb, output, option)
            },
            Clone: function(event) {meta.nick = meta.name + can.ID()
                can.Plugin(can, meta.nick, meta, run,
                    can.page.AppendField(can, field.parentNode, "item "+meta.group+" "+meta.nick, meta))
            },
            Delete: function(event) {field.parentNode.removeChild(field)},
        }, Config.libs.concat(["plugin/"+(meta.type||"state")]), function(plugin) {plugin.Conf(meta);
            can.core.Next(JSON.parse(meta.inputs||"[]"), plugin.Append)
        }, meta)
        return plugin
    }),
    Inputs: shy("构造控件", function(can, item, type, name, value, cb, option) {
        var input = Volcanos(name, {type: "local", item: item,
            Select: function(event) {can.Select(event, input.target, true)},
            Import: function(event, value, key, index) {var cb = input.onimport[item.imports];
                value = typeof cb == "function" && cb(event, input, value, key, input.target) || value
                input.target.value = value;
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
        if (type == "inner" && (!msg.result || msg.result.length == 0)) {type = "table"}
        var output = Volcanos(type, {_type: "local", msg: msg,
            Import: function(event, value, key) {var cb = output.onimport[key];
                typeof cb == "function" && cb(event, output, value, key, target);
            },

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
    can[Config.main] = can.Page(can, Config.main, Config, function(chat) {
        chat.Login.Export(event||{}, can.user.Search(can, "layout")||"工作", "layout")
        chat.Login.Import(event||{}, "", "login")
    }, document.body)
})

