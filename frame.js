var can = Volcanos("chat", {
    Page: shy("构造网页", function(can, name, conf, cb, body, topic) {
        var page = Volcanos(name, {_type: "local", _panes: {}, _views: {}, target: body,
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Import: function(event, value, key) {var cb = page.onimport[key];
                typeof cb == "function" && cb(event, page, value, key, body);
            },
            Report: function(event, value, key) {
                // 导入数据
                page.Import(event, value, key)
                // 分发数据
                can.core.Item(page._panes, function(index, item) {
                    if (key == "favor") {var msg = value;
                        var cmds = msg.detail, cmd = cmds[0];
                        if (cmd == item._name || cmd == item.Name()) {cmd = cmds[1], cmds = cmds.slice(1)}

                        var cb = item.onchoice[cmd];
                        if (typeof cb == "function") {
                            cb(event, item, value, cmd, item.target);
                            return msg.Echo(item._name, " onchoice ", cmd), msg._hand = true;
                        }

                        var cb = item.onaction[cmd];
                        if (typeof cb == "function") {
                            cb(event, item, value, cmd, item.target);
                            return msg.Echo(item._name, " onaction ", cmd), msg._hand = true;
                        }
                    }
                    // 下发数据
                    item.Import && item.Import(event, value, key)
                })
            },

            run: function(event, option, cmds, cb) {can.misc.Run(event, page, option, cmds, cb)},
        }, Config.libs.concat(["page/"+name, "page/topic/"+topic+".css"]), function(page) {
            // 加载配置
            page.onimport._init && page.onimport._init(page, page.Conf(conf), body)

            can.core.Next(conf.pane, function(item, cb) {
                // 加载模块
                page._panes[item.name] = page[item.name] = page._views[item.pos] = page[item.pos] = can.Pane(page, item.name, item, cb,
                    can.page.Select(can, body, "fieldset."+item.name)[0] ||
                    can.page.AppendField(can, body, item.name+" "+(item.pos||""), item))
            }, function() {typeof cb == "function" && cb(page)})
        }, conf)
        return page
    }),
    Pane: shy("构造组件", function(can, name, meta, cb, field) {
        var river = "", storm = "";
        var pane = Volcanos(name, {_type: "local", _plugins: [], _local: {}, target: field,
            option: field.querySelector("form.option"),
            action: field.querySelector("div.action"),
            output: field.querySelector("div.output"),
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Export: function(event, value, key) {var cb = pane.onexport[key];
                typeof cb == "function"? cb(event, pane, value, key, field): can.Report(event, value, key)
            },
            Import: function(event, value, key) {var cb = pane.onimport[key];
                // 导入数据
                typeof cb == "function" && cb(event, pane, value, key, field);
                // 分发数据
                can.core.List(pane._plugins, function(item) {item.Import(event, value, key)})
                // 显示数据
                pane.page.Select(pane, pane.action, "input."+key, function(item) {item.value = value})
            },

            Action: function(key, value) {var cb = pane.onimport[key];
                typeof cb == "function" && cb(event, pane, value, key, field);

                return can.page.Select(can, pane.action, "input[name="+key+"],select."+key+",select[name="+key+"]", function(item) {
                    // 读写控件
                    value != undefined && (item.value = value), value = item.value
                }), value
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
                } else if (height == -2) {
                    field.style.height = ""
                }

                typeof cb == "function" && cb(event, pane, {width: width, height: height}, "size", field)
            },
            Show: function(event, width, height, offset) {field.style.display = "block";
                if (width < 0) {field.style.left = -width / 2 + "px";
                    field.style.width = (document.body.offsetWidth + width) + "px";
                }
                if (width > 0) {field.style.width = width + "px";
                    field.style.left = (document.body.offsetWidth - width) / 2 + "px";
                }
                if (width === "") {
                    field.style.width = ""
                }
                if (height > 0) {field.style.height = height + "px";
                    field.style.top = (document.body.offsetHeight - height) / 2 + (offset||0) + "px";
                }
                if (height < 0) {field.style.top = -height / 2 + (offset||0) + "px";
                    field.style.height = (document.body.offsetHeight + height) + "px";
                }
                if (height === "") {
                    field.style.height = ""
                }
                var cb = pane.onimport["show"];
                typeof cb == "function" && cb(event, can, width, "show", pane.output)
                return field;
            },
            Hide: function() {field.style.display = "none"},

            run: function(event, cmds, cb) {var msg = pane.Event(event)
                can.page.Select(can, pane.action, "input", function(item, index) {
                    // 控件参数
                    item.name && item.value && msg.Option(item.name, item.value)
                })
                can.run(event, pane.option.dataset, cmds, cb)
                return msg
            },
        }, Config.libs.concat(["pane/"+(meta.path||"")+name]), function(pane) {can.Dream(document.head, "pane/"+(meta.path||"")+name+".css")
            pane.onimport._init && pane.onimport._init(pane, pane.Conf(meta), pane.output, pane.action, pane.option, field)
            typeof cb == "function" && cb(pane)
        }, meta)
        return pane
    }),
    Plugin: shy("构造插件", function(can, name, meta, run, field, cb) {
        meta && meta.class && can.page.ClassList.add(can, field, meta.class)

        var option = field.querySelector("form.option");
        var action = field.querySelector("div.action");
        var output = field.querySelector("div.output");
        var status = field.querySelector("div.status");

        var history = []

        var args = can.base.Obj(meta.args, []);
        var feature = can.base.Obj(meta.feature);
        var exports = can.base.Obj(meta.exports, feature.exports||[]);
        var plugin = Volcanos(name, {_type: "local", _local: {}, target: field,
            option: option, action: action, output: output,
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,

            Export: function(event, value, key) {var cb = plugin.onexport[key];
                typeof cb == "function"? cb(event, plugin, value, key, field): can.Export(event, value, key)
            },
            Import: function(event, value, key) {var cb = plugin.onimport[key];
                // 导入数据
                typeof cb == "function" && cb(event, plugin, value, key, plugin.output);
                // 下发数据
                key && plugin[key] && plugin[key].target && plugin[key].Import(event, value, key)
                // 下发数据
                plugin._output && plugin._output.Import(event, value, key)
            },
            Report: function(event, value, key, index) {
                // 导入数据
                plugin.Import(event, value, key)

                for (var i = 0; i < exports.length; i += 3) {
                    if (exports[i+1] == key) {key = exports[i]
                        if (exports[i+2]) {var cb = plugin.onexport[exports[i+2]], res;
                            // 数据转换
                            value = typeof cb == "function" && ((res = cb(event, plugin, plugin.msg, value, key, index)) != undefined) && res || value;
                        }
                        // 上报数据
                        // 上下循环
                        // key && can.Import(event, value, key)
                        can.Action(key, value)
                    }
                }
            },

            Remove: function(event) {var list = can.page.Select(can, option, "input.temp")
                list.length > 0 && list[list.length-1].parentNode.removeChild(list[list.length-1])
            },
            Append: function(item, cb) {item = item || {type: "text", name: "", className: "args temp"};
                var name = item.name || item.value || "args"+plugin.page.Select(can, option, "input.args.temp").length;
                var count = plugin.page.Select(can, option, ".args").length, value = "";
                args && count < args.length && (value = args[count] || item.value || "");
                plugin._local[name] = plugin[name] = can.Inputs(plugin, item, item.display||"input", name, value, cb, option);
            },
            Select: function(event, target, focus) {
                can.page.Select(can, field.parentNode, "fieldset.item.select", function(item) {
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
            Check: function(event, target, cb) {
                plugin.page.Select(can, option, ".args", function(item, index, list) {
                    if (item == target && index < list.length-1) {can._plugin && can._plugin.target == field && list[index+1].focus(); return item}
                }).length == 0 && plugin.Runs(event, cb)
            },
            Last: function(event) {
                can.core.List(history.pop() && history.pop(), function(item, index) {
                    return item.target.value = item.value
                }).length > 0 && plugin.Runs(event)
            },
            Runs: function(event, cb) {
                plugin.Run(event, plugin.Option(), cb)
            },
            Run: function(event, args, cb, silent) {var show = !silent;
                history.push(plugin.page.Select(can, option, ".args", function(item, index, list) {
                    return {target: item, value: item.value}
                }))
                can.Export(event, 1, "ncmd")

                var msg = can.Event(event);
                can.page.Select(can, option, ".opts", function(item) {
                    item.name && item.value && msg.Option(item.name, item.value)
                })

                for (var i = args.length-1; i >= 0; i--) {if (args[i] == "") {args = args.slice(0, i)} else {break}}
                show && plugin.Timer(1000, function() {show && plugin.user.toast(can.base.Format(args||["running..."]), meta.name, -1)});
                run(event, args, function(msg) {if (silent) {return typeof cb == "function" && cb(msg)}
                    plugin.msg = msg, plugin.Show(feature.display || "table", msg, cb)
                    show = false, plugin.user.toast();
                })
            },
            Show: function(type, msg, cb) {plugin.msg = msg, msg._plugin_name = name;
                msg.Option("title") && can.user.title(msg.Option("title"))
                return plugin._output = plugin._local[type] = plugin[type] = can.Output(plugin, feature, type, msg, cb, output, action, option, status)
            },
            Clone: function(event, cb) {meta.nick = meta.name + can.ID()
                meta.msg = plugin.msg
                meta.args = can.page.Select(can, plugin.option, ".args", function(item) {return item.value})
                can._plugins.push(can.Plugin(can, meta.nick, meta, run,
                    can.page.AppendField(can, field.parentNode, "item "+meta.name+" "+meta.nick, meta), cb))
            },
            Delete: function(event) {field.parentNode.removeChild(field)},
        }, Config.libs.concat(["plugin/"+(meta.type||feature.active||"state")]), function(plugin) {plugin.Conf(meta);
            var list = typeof meta.inputs == "string"? JSON.parse(meta.inputs||"[]"): meta.inputs || [];
            // 加载配置
            plugin.onimport._init? plugin.onimport._init(plugin, feature, plugin.output, plugin.action, plugin.option):
            // 加载控件
            can.core.Next(list.length>0? list: [{type: "text"}, {type: "button", value: "执行"}], plugin.Append, function() {
                typeof cb == "function" && cb(plugin)
            })
            // 加载控件
            meta.msg && plugin.Show(feature.display || "table", meta.msg)
        }, meta)
        return field.Check = plugin.Check, plugin
    }),
    Inputs: shy("构造控件", function(can, item, type, name, value, cb, option) {
        var input = Volcanos(name, {_type: "input", _plugin: can, item: item, target: "",
            Run: can.Run, Runs: can.Runs,

            Import: function(event, value, key, index) {var cb = input.onimport[item.imports];
                value = typeof cb == "function" && cb(event, input, value, key, input.target) || value
                input.target.value = value;
                item.action == "auto"? can.Runs(event): can.Check(event, input.target);
            },
            Append: function(event, value) {can.Append(null, function(input) {can.Select(event, input.target, true)})},
            Clone: function(event, value) {can.Clone(event, function(input) {input.Select(event, null, true)})},
            Select: function(event) {can.Select(event, input.target, true)},

            run: function(event, cmd, cb, silent) {var msg = can.Event(event);
                msg.Option("_action", item.name);

                var cbs = typeof input[item.cb] == "function" && input[item.cb]
                    || typeof can[item.cb] == "function" && can[item.cb] || can.Check
                cbs(event, event.target, cb);
            },
        }, Config.libs.concat(["plugin/"+type, "plugin/input/"+(item.figure||"")]), function(input) {
            var target = input.onimport.init(input, item, name, value, option);
            input.target = target, typeof cb == "function" && cb(input);
        })
        return input
    }),
    Output: shy("构造组件", function(can, feature, type, msg, cb, target, action, option, status) {
        var output = Volcanos(type, {_type: "output", feature: feature, msg: msg,
            target: target, action: action,
            Plugin: can.Plugin, Inputs: can.Inputs, Output: can.Output,
            Run: can.Run, Runs: can.Runs,

            Import: function(event, value, key) {var cb = output.onimport && output.onimport[key];
                typeof cb == "function" && cb(event, output, value, key, target);
            },
            Option: function(key, value) {
                return key == undefined? can.page.Select(can, can.option, ".args", function(item) {return item.value}):
                    (can.page.Select(can, can.option, "input[name="+key+"],select[name="+key+"]", function(item) {
                        value != undefined && (item.value = value), value = item.value
                    }), value)
            },
            Action: function(key, value) {
                return can.page.Select(can, action, "input[name="+key+"],select."+key+",select[name="+key+"]", function(item) {
                    value != undefined && (item.value = value), value = item.value
                }), value
            },
            Status: function(event, value, key) {var cb = output.onstatus[key];
                typeof cb == "function" && cb(event, output, value, key, can.page.Select(can, status, "span."+key, function(item) {
                    value? can.page.ClassList.del(can, item.previousSibling, "hidden"):
                        can.page.ClassList.add(can, item.previousSibling, "hidden")
                    return item
                })[0]||{})
            },
            Export: function(event, value, key, index) {var cb = output.onexport[key];
                return typeof cb == "function"? cb(event, output, value, key, target): can.Report && can.Report(event, value, key, index)
            },

            run: function(event, cmd, cb, silent) {var msg = can.Event(event);
                cmd = cmd || can.Option(), can.page.Select(can, option, ".args", function(item) {
                    item.name && item.value && msg.Option(item.name) == undefined && msg.Option(item.name, item.value)
                });
                can.Run(event, cmd, cb, silent);
            },
        }, Config.libs.concat([(type.startsWith("/")? "": "plugin/")+type]), function(output) {
            status.innerHTML = "", output.onstatus && can.page.AppendStatus(output, status, output.onstatus.list)
            output.onimport.Action = output.Action
            output.onimport.init(output, msg, cb, target, action, option);
            output.onfigure && (output.onfigure.sup = output, output.onfigure.target = target)
        }, msg)
        return output
    }),
}, Config.libs.concat(Config.list), function(can) {
    can.user.Search(can, "sessid") && can.user.Cookie(can, "sessid", can.user.Search(can, "sessid")) && can.user.Search(can, "sessid", "")

    can[Config.main] = can.Page(can, Config.main, Config, function(chat) {
        chat.Import({}, can.user.Search(can, "pod")||can.user.Search(can, "you")||can.user.Search(can, "title")||Config.title, "title")
        chat.Import({}, can.user.Search(can, "layout")||Config.layout.def, "layout")
        chat.Import({}, "", "login")
    }, document.body, can.user.Search(can, "topic")||Config.topic)
})
