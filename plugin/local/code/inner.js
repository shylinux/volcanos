Volcanos("onimport", {help: "导入数据", _init: function(can, msg, cb, target) {
        can.tabview = can.tabview||{}, can.tabview[can.Option(nfs.PATH)+":"+can.Option(nfs.FILE)] = msg
        can.history = can.history||[], can.toolkit = {}

        can.onmotion.clear(can), can.onlayout.profile(can)
        can.onimport._project(can, can.ui.project)
        can.onimport._profile(can, can.ui.profile)
        can.onimport._display(can, can.ui.display)
        can.base.isFunc(cb) && cb(msg)

        can.onimport.tabview(can, can.Option(nfs.PATH), can.Option(nfs.FILE), can.Option(nfs.LINE))
        can.onimport.project(can, can.Option(nfs.PATH), function() {
            can.onimport._toolkit(can, can.ui.toolkit), can.core.Timer(100, function() {
                can.onimport.sess(can)
                can.core.Next(can.core.Split(msg.OptionOrSearch("tool")), function(item, next) {
                    can.onimport.toolkit(can, {index: item}, next)
                }, function() {
                    can.core.Next(["inner/search.js", "inner/favor.js", "inner/sess.js"].reverse(), function(item, next) {
                        can.require([item], function() {}, function(can, name, sub) { sub._init(can, next) })
                    }, function() {
                        can.core.List(can.core.Split(msg.OptionOrSearch("tabs")), function(item) {
                            can.onimport.tabview(can, can.Option(nfs.PATH), item)
                        })
                    })
                })
            })
        })
        var run = can.run; can.run = function(event, cmds, cb, silent) { var msg = can.request(event)
            if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
                ctx.INPUTS, function(cmds) {
                    if (cmds[0] == nfs.FILE) {
                        switch (msg.Option(mdb.TYPE)) {
                            case ctx.INDEX:
                                run(event, [ctx.ACTION, ctx.INPUTS, ctx.INDEX].concat(cmds.slice(1)), cb, silent)
                                break
                            default:
                                can.core.List(can._file, function(item) {
                                    if (!cmds[1] || item.path.indexOf(cmds[1])) {
                                        msg.Push(nfs.FILE, item.path)
                                    }
                                })
                                can.base.isFunc(cb) && cb(msg)
                        }
                        return
                    }
                    run(event, [ctx.ACTION, ctx.INPUTS].concat(cmds), cb, silent)
                },
            ))) { return }
            run(event, cmds, cb, silent)
        }
        can.user.mod.isCmd && can.onengine.listen(can, chat.ONKEYDOWN, function(event) {
            var cb = can.onaction[kit.Dict(
                "r", "执行", "v", "展示", "s", "保存",
                "t", "添加", "f", "打开", "p", "插件", lang.ESCAPE, "清屏",
            )[event.key]]
            can.base.isFunc(cb) && cb(event, can)
        })
    },
    _project: function(can, target) {
        target._toggle = function(event) { can.onmotion.toggle(can, target), can.onimport.layout(can) }
    },
    _profile: function(can, target) {
        var ui = can.page.Append(can, target, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.profile_output = ui.output
        var action = can.onappend._action(can, [cli.SHOW, cli.CLEAR, mdb.PLUGIN, cli.CLOSE], ui.action, kit.Dict(
            cli.SHOW, function(event) { can.onaction["展示"](event, can) },
            cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
            cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
            mdb.PLUGIN, function(event) {
                can.user.input(event, can, [ctx.INDEX], function(event, button, data, list, args) {
                    can.onappend.plugin(can, data, function(sub) {
                        sub.run = function(event, cmds, cb) {
                            can.run(event, [ctx.ACTION, ice.RUN, data.index].concat(cmds), cb, true)
                        }
                    }, ui.output)
                })
            },
        ))
        target._toggle = function(event, show) { action[show? cli.SHOW: cli.CLOSE](event) }
    },
    _display: function(can, target) {
        var ui = can.page.Append(can, target, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.display_output = ui.output
        var action = can.onappend._action(can, [cli.EXEC, cli.CLEAR, mdb.PLUGIN, cli.CLOSE], ui.action, kit.Dict(
            cli.EXEC, function(event) { can.onaction["执行"](event, can) },
            cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
            cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport.layout(can) },
            mdb.PLUGIN, function(event) {
                can.user.input(event, can, [ctx.INDEX], function(event, button, data, list, args) {
                    can.onappend.plugin(can, data, function(sub) {
                        sub.run = function(event, cmds, cb) {
                            can.run(event, [ctx.ACTION, ice.RUN, data.index].concat(cmds), cb, true)
                        }
                    }, ui.output)
                })
            },
        ))
        target._toggle = function(event, show) { action[show? cli.EXEC: cli.CLOSE](event) }
    },
    _toolkit: function(can, target) {
        can.ui.toolkit = can.onappend.field(can, "toolkit", {}, can._output)
        can.ui.docker = can.page.Append(can, can._fields, [{view: "docker"}]).first
        var repos = can.base.trimSuffix(can.base.trimPrefix(can.Option(nfs.PATH), "usr/"), ice.PS)

        can.run({}, [ctx.ACTION, ctx.COMMAND].concat([
            "web.code.git.spide", "web.code.git.trend", "web.code.git.total",
        ].reverse()), function(msg) {
            can.core.Next(msg.Table(), function(item, next) {
                item.args = can.base.getValid(item.args, [repos]), can.onimport.toolkit(can, item, next)
            })
        }, true)
    },

    project: function(can, path, cb) { can.Option({path: path})
        var msg = can.request({}, {dir_root: path, dir_deep: true})
        can.run(msg._event, [ice.PWD], function(msg) { can.onmotion.clear(can, can.ui.project)
            can.onappend.tree(can, can._file = msg.Table(), nfs.PATH, ice.PS, function(event, item) {
                can.onimport.tabview(can, path, item.path)
            }, can.ui.project), can.onimport.layout(can), can.Status("文件数", msg.Length())
            can.base.isFunc(cb) && cb()
        }, true)
    },
    tabview: function(can, path, file, line, cb) { var key = path+":"+file
        if (can.tabview[key]) {
            can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE)), can._msg = can.tabview[key]
            can.Option({path: path, file: file, line: line||can._msg.Option(nfs.LINE)||1})
            return can._msg.Option(can.Option()), can.onsyntax._init(can, can._msg, cb)
        }

        if (line == ctx.INDEX) { var msg = can.request({}, {index: file, line: line})
            can.tabview[key] = msg
            msg._tab = can.onappend.tabs(can, [{name: file.split(ice.PS).pop(), text: file}], function(event, meta) {
                can.onimport.tabview(can, path, file, "", cb), cb = null
            }, function(item) { delete(can.tabview[key]) })
            return
        }


        can.Option({path: path, file: file, line: line||1})
        can.run({}, [path, file], function(msg) { can.tabview[key] = msg
            msg._tab = can.onappend.tabs(can, [{name: file.split(ice.PS).pop(), text: file}], function(event, meta) {
                can.onimport.tabview(can, path, file, "", cb), cb = null
            }, function(item) { delete(can.tabview[key]) })
        }, true)
    },
    profile: function(can, msg) {
        if (msg) {
            // can.onappend.table(can, msg, null, can.ui.profile_output)
            can.onappend.board(can, msg.Result(), can.ui.profile_output)
        }
        can.page.style(can, can.ui.profile_output, html.WIDTH, (can.Conf(html.WIDTH)-can.ui.project.offsetWidth)/2)
        can.onmotion.hidden(can, can.ui.profile, true), can.onimport.layout(can)
    },
    display: function(can, msg) {
        if (msg) {
            // can.onappend.table(can, msg, null, can.ui.display_output)
            can.onappend.board(can, msg.Result(), can.ui.display_output)
        }
        can.page.style(can, can.ui.display_output, html.HEIGHT, 200)
        can.onmotion.hidden(can, can.ui.display, true), can.onimport.layout(can)
    },
    toolkit: function(can, meta, cb) {
        can.onappend.plugin(can, meta, function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb, true)
            }

            sub.Conf(html.HEIGHT, can.Conf(html.HEIGHT)-4*html.ACTION_HEIGHT, html.WIDTH, can.Conf(html.WIDTH))
            sub.page.style(sub, sub._output, html.MAX_HEIGHT, sub.Conf(html.HEIGHT))
            sub.page.style(sub, sub._output, html.MAX_WIDTH, sub.Conf(html.WIDTH))

            can.ui.toolkit.status.appendChild(sub._legend), sub._legend.onclick = function(event) {
                if (can.page.Select(can, can.ui.toolkit.status, ice.PT+html.SELECT)[0] == event.target) {
                    can.page.ClassList.del(can, event.target, html.SELECT)
                    can.page.ClassList.del(can, sub._target, html.SELECT)
                    return
                }
                can.onmotion.select(can, can.ui.toolkit.status, html.DIV_LEGEND, event.target)
                can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target)
                can.page.Select(can, sub._option, html.OPTION_ARGS)[0].focus()
            }
            can.base.isFunc(cb) && cb(sub)
        }, can.ui.toolkit.output)
    },
    layout: function(can) { var height = can.Conf(html.HEIGHT), width = can.Conf(html.WIDTH)
        can.page.style(can, can.ui.content, can.user.mod.isCmd? html.HEIGHT: html.MAX_HEIGHT, height)
        if (can.ui.project.style.display != html.NONE) {
            can.page.style(can, can.ui.project, html.HEIGHT, can.ui.content.offsetHeight)
        }
        if (can.user.mod.isCmd) {
            can.page.style(can, can.ui.content, html.HEIGHT, (can.ui.project.offsetHeight||height)-can.ui.display.offsetHeight)
        }
        can.page.style(can, can.ui.content, html.WIDTH, width-can.ui.project.offsetWidth-can.ui.profile.offsetWidth-25)
        can.page.style(can, can.ui.profile_output, html.HEIGHT, can.ui.content.offsetHeight-html.ACTION_HEIGHT)
    },
    sess: function(can, sess) { sess = sess||can.base.Obj(localStorage.getItem("web.code.inner.sess"), {})
        can.core.Next(sess.tabs, function(item, next) { var ls = item.split(":")
            can.onimport.tabview(can, ls[0], ls[1], ls[2], next)
        })
        can.core.Next(sess.tool, function(item, next) {
            can.onimport.toolkit(can, {index: item}, function(sub) { can.toolkit[item] = sub, next() })
        })
    },
}, [""])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg, cb) {
        if (can.onmotion.cache(can, function(cache_data) {
            can.file && (cache_data[can.file] = {current: can.current, max: can.max})
            can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
            var p = cache_data[can.file]; p && (can.current = p.current, can.max = p.max)
            can.parse = can.base.Ext(can.file), can.Status("模式", "normal")
            can.onmotion.select(can, can._action, chat.DIV_TABS, msg._tab)
            if (msg.Option(ctx.INDEX)) {
                can.core.Timer(100, function() {
                    var input = can.page.Select(can, can.ui.content, html.OPTION_ARGS)[0]; input && input.focus()
                })
            }
            return can.file
        }, can.ui.content, can.ui.profile_output, can.ui.display_output)) {
            return can.onaction.selectLine(can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb()
        }
        if (msg.Option(ctx.INDEX)) {
            can.onappend.plugin(can, {index: msg.Option(ctx.INDEX)}, function(sub) {
                sub.run = function(event, cmds, cb) {
                    can.run(event, [ctx.ACTION, ice.RUN, msg.Option(ctx.INDEX)].concat(cmds), cb, true)
                }
                can.core.Timer(100, function() {
                    var input = can.page.Select(can, can.ui.content, html.OPTION_ARGS)[0]; input && input.focus()
                })
                can.base.isFunc(cb) && cb()
            }, can.ui.content)
            return
        }

        function init(p) { can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) {
            can.onaction.appendLine(can, item)
        }), can.onaction.selectLine(can, msg.Option(nfs.LINE)), can.base.isFunc(cb) && cb() }

        var p = can.onsyntax[can.parse]; !p? can.run({}, [ctx.ACTION, mdb.PLUGIN, can.parse, msg.Option(nfs.FILE), msg.Option(nfs.PATH)], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = can.page.replace(can, line||"")
        function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }

        var p = can.onsyntax[can.parse]; if (!p) { return line } p = can.onsyntax[p.link]||p, p.split = p.split||{}
        p.keyword && (line = can.core.List(can.core.Split(line, p.split.space||ice.SP, p.split.operator||"{[(|)]}", {detail: true}), function(item, index, array) {
            item = can.base.isObject(item)? item: {text: item}
            var text = item.text; var type = item.keyword||p.keyword[text]

            switch (item.type) { case html.SPACE: return text
                case lang.STRING: return wrap(lang.STRING, item.left+text+item.right)
                default: return wrap(type, text)
            }
        }).join(""))

        p.prefix && can.core.Item(p.prefix, function(pre, type) {
            if (can.base.beginWith(line, pre)) {
                line = wrap(type, line)
            } else {
                var ls = line.split(pre); if (ls.length > 1) {
                    line = ls[0] + wrap(type, pre + ls[1])
                }
            }
        })
        p.suffix && can.core.Item(p.suffix, function(end, type) {
            if (can.base.endWith(line, end)) { line = wrap(type, line) }
        })
        return line
    },
})
Volcanos("onaction", {help: "控件交互", list: ["打开", "插件", "添加", "保存"],
    "保存": function(event, can) { can.onexport.sess(can), can.user.toastSuccess(can) },
    "打开": function(event, can) {
        can.user.input(event, can, [nfs.FILE], function(event, button, data, list, args) {
            can.onimport.tabview(can, can.Option(nfs.PATH), data.file)
        })
    },
    "插件": function(event, can) {
        can.user.input(event, can, [ctx.INDEX], function(event, button, data, list, args) {
            can.onimport.tabview(can, can.Option(nfs.PATH), data.index, ctx.INDEX)
        })
    },
    "添加": function(event, can) {
        can.user.input(event, can, [ctx.INDEX], function(event, button, data, list, args) {
            var sub = can.toolkit[data.index]; if (sub) { sub._legend.click(); return }
            can.onimport.toolkit(can, data, function(sub) { can.toolkit[data.index] = sub
                sub._legend.click(), sub.page.Select(sub, sub._target, html.OPTION_ARGS)[0].focus()
            })
        })
    },
    "项目": function(event, can) { can.onmotion.toggle(can, can.ui.project), can.onimport.layout(can) },
    "展示": function(event, can) { can.onimport.profile(can)
        can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.onimport.profile(can, msg)
        }, true)
    },
    "清屏": function(event, can) {
        if (can.page.Select(can, document.body, ".input.float", function(item) {
            return can.page.Remove(can, item)
        }).length > 0) { return }

        if (can.page.Select(can, can.ui.toolkit.status, "div.select", function(item) {
            return item.click(), item
        }).length > 0) { return }
        can.onmotion.hidden(can, can.ui.profile)
        can.onmotion.hidden(can, can.ui.display)
        can.onimport.layout(can)
    },
    "执行": function(event, can) { can.onimport.display(can)
        can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.onimport.display(can, msg)
        }, true)
    },
    "工具": function(event, can) { can.onmotion.toggle(can, can.ui.toolkit.fieldset) },
    back: function(event, can) { can.history.pop(); var last = can.history.pop()
        last && can.onimport.tabview(can, last.path, last.file, last.line)
        can.Status("跳转数", can.history.length)
    },

    appendLine: function(can, value) {
        var ui = can.page.Append(can, can.ui.content, [{type: html.TR, list: [
            {view: ["line unselectable", html.TD, ++can.max], onclick: function(event) {
                can.onaction.selectLine(can, ui.tr)
            }, ondblclick: function(event) {
                can.onaction.favorLine(can, ui.text.innerText)
            }},

            {view: [html.TEXT, html.TD], list: [can.onsyntax._parse(can, value)], onclick: function(event) {
                can.onaction.selectLine(can, ui.tr)

            }, ondblclick: function(event) {
                var s = document.getSelection().toString(), str = ui.text.innerText
                var begin = str.indexOf(s), end = begin+s.length

                for (var i = begin; i >= 0; i--) {
                    if (str[i].match(/[a-zA-Z0-9_.]/)) { s = str.slice(i, end) } else { break }
                }

                if (s.indexOf("kit.") == 0) { s = s.replace("kit.", "toolkits.") }
                if (s.indexOf(".") == 0) { s = s.slice(1) }
                can.onaction.searchLine(event, can, s)
            }}
        ]}]); return ui.tr
    },
    selectLine: function(can, line) { if (!line) { return }
        can.page.Select(can, can.ui.content, html.TR, function(item, index) {
            if (!can.page.ClassList.set(can, item, html.SELECT, item == line || index+1 == line)) { return }
            line = item, can.Status(kit.Dict("文件名", can.file, "解析器", can.parse, "当前行", can.onexport.position(can, can.Option(nfs.LINE, index+1))))
        })

        can.base.isObject(line) && can.page.Select(can, line, "td.text", function(item) {
            can.current = {
                scroll: function(x, y) { can.ui.content.scrollLeft += x, can.ui.content.scrollTop += y },
                window: function() { return can.ui.content.offsetHeight },
                offset: function() { return can.ui.content.scrollTop },
                height: function() { return line.offsetHeight },

                prev: function() { return line.previousSibling },
                next: function() { return line.nextSibling },
                line: line, text: function(text) {
                    return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText
                },
            }

            var offhead = 5, size = 20
            var pos = can.current.line.offsetTop-can.current.offset(); if (pos < offhead*20) {
                can.current.scroll(0, pos-offhead*size)
            } else if (pos > can.current.window()/2) {
                can.current.scroll(0, pos-can.current.window()/2)
            }

            var push = {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)}
            can.base.Eq({path: push.path, file: push.file, line: push.line}, can.history[can.history.length-1]) || can.history.push(push)
            can.Status("跳转数", can.history.length)
        })

        // can.onkeymap && can.onkeymap._mode(can, "insert")
        // can.onkeymap && can.onkeymap.selectLine(can)
    },
    searchLine: function(event, can, value) { if (!can.ui.search) { return }
        can.ui.search.Update(event, [ctx.ACTION, nfs.FIND, value.trim()])
    },
    favorLine: function(can, value) {
        can.user.input(event, can, [{name: "zone", value: "hi"}, {name: "name", value: "hello"}], function(event, button, meta, list) {
            can.run(event, [ctx.ACTION, code.FAVOR, ctx.ACTION, mdb.INSERT, mdb.ZONE, meta.zone||"",
                mdb.TYPE, can.parse, mdb.NAME, meta.name||"", mdb.TEXT, (value||"").trimRight(),
                nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
            ], function(msg) { can.user.toastSuccess(can) }, true)
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
    sess: function(can) {
        localStorage.setItem("web.code.inner.sess", JSON.stringify(
            {
                "tabs": can.onexport.tabs(can),
                "tool": can.onexport.tool(can),
            }
        ))
    },
    tabs: function(can) {
        return can.core.Item(can.tabview, function(key, msg) {
            return key+":"+msg.Option(nfs.LINE)
        })
    },
    tool: function(can) {
        return can.core.Item(can.toolkit)
    },
    position: function(can, index, total) { total = total||can.max
        return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
    },
    content: function(can) {
        return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL)+ice.NL
    },
})

