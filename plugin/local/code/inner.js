Volcanos("onimport", {help: "导入数据", _init: function(can, msg, cb, target) {
        can.onmotion.clear(can), can.ui = can.onlayout.profile(can)
        can.onimport._project(can, can.ui.project)
        can.onimport._content(can, can.ui.content)
        can.onimport._profile(can, can.ui.profile)
        can.onimport._display(can, can.ui.display)
        can.onimport._search(can, target)
        can.onimport._favor(can, target)

        msg.Option({path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)||1})
        can.tabview = can.tabview||{}, can.tabview[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = msg
        can.history = can.history||[]

        can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE)||1, function() {
            var repos = can.base.trimSuffix(can.base.trimPrefix(msg.Option(nfs.PATH), "usr/"), ice.PS)
            can.onimport.toolkit(can, {index: "web.code.git.spide", args: [repos]})
            can.onimport.toolkit(can, {index: "web.code.git.trend", args: [repos]})
            can.onimport.toolkit(can, {index: "web.code.git.total", args: [repos]})
            can.onimport.project(can, msg.Option(nfs.PATH))
            can.onaction["工具"](event, can)
            can.base.isFunc(cb) && cb(msg)
        })
    },
    _project: function(can, target) {
        target._show = function(event) { can.onimport._content(can) }
    },
    _content: function(can, target) { var height = can.Conf(html.HEIGHT)
        if (can.user.mod.isCmd) {
            can.page.style(can, can.ui.project, html.HEIGHT, height)
            can.page.style(can, can.ui.content, html.HEIGHT, height)
            can.page.style(can, can.ui.content, html.MAX_WIDTH, can.Conf(html.WIDTH)-can.ui.project.offsetWidth-33)
            can.page.style(can, can._output, html.WIDTH, can.Conf(html.WIDTH))
        } else {
            can.page.style(can, can.ui.project, html.MAX_HEIGHT, height)
            can.page.style(can, can.ui.content, html.MAX_HEIGHT, height)
        }
    },
    _profile: function(can, target) {
        var ui = can.page.Append(can, target, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.profile_output = ui.output
        var action = can.onappend._action(can, [cli.SHOW, cli.CLEAR, cli.CLOSE], ui.action, kit.Dict(
            cli.SHOW, function(event) { can.onaction["展示"](event, can) },
            cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
            cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport._content(can, target) },
        ))
        target._show = function(event, hidden) { action[hidden? cli.CLOSE: cli.SHOW](event) }
    },
    _display: function(can, target) { can.ui.toolkit = can.onappend.field(can, "toolkit", {}, can._output)
       var ui = can.page.Append(can, target, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.display_output = ui.output
        var action = can.onappend._action(can, [cli.EXEC, cli.CLEAR, cli.CLOSE], ui.action, kit.Dict(
            cli.EXEC, function(event) { can.onaction["执行"](event, can) },
            cli.CLEAR, function(event) { can.onmotion.clear(can, ui.output) },
            cli.CLOSE, function(event) { can.onmotion.hidden(can, target), can.onimport._content(can, target) },
        ))
        target._show = function(event, hidden) { action[hidden? cli.CLOSE: cli.EXEC](event) }
    },
    _search: function(can, target) {
        can.onengine.plugin(can, "can.code.inner.search", shy("搜索", {}, [
            {type: html.TEXT, name: "word", value: cli.MAIN}, {type: html.BUTTON, name: nfs.FIND}, {type: html.BUTTON, name: cli.BACK},
        ], function(msg, cmds, cb) { can.misc.runAction(can, msg, cmds, cb, kit.Dict(
            nfs.FIND, function(cmds) { msg.Option(kit.Dict(ice.MSG_HANDLE, ice.TRUE, ice.MSG_FIELDS, "file,line,text"))
                can.run(msg._event, [ctx.ACTION, mdb.SEARCH, can.parse, cmds[0], can.Option(nfs.PATH)], function(msg) { var sub = msg._can
                    sub.Option("word", cmds[0]), can.page.style(can, sub._output, html.MAX_HEIGHT, 200)
                    can.onmotion.hidden(can, can.ui.toolkit.fieldset, true), can.page.ClassList.has(sub, sub._target, html.SELECT) || sub._legend.click()
                    sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
                        return {text: ["", html.TD], list: [{text: [can.page.replace(can, value, ice.PWD, ""), html.DIV]}], onclick: function(event) {
                            line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace(ice.PWD, ""), parseInt(line.line), function() {
                                can.onaction.selectLine(can, line.line)
                            })
                        }}
                    }, sub._output), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), can.Status("标签数", msg.Length())
                }, true)
            },
        )) }))
        can.onimport.toolkit(can, {index: "can.code.inner.search"}, function(sub) { can.ui.search = sub })
    },
    _favor: function(can, target) {
        can.onimport.toolkit(can, {index: "web.code.favor"}, function(sub) {
            sub.run = function(event, cmds, cb) { var msg = can.request(event)
                if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
                    code.INNER, function(cmds) {
                        can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE))
                    },
                ))) { return }

                can.run(event, can.misc.concat(can, [ctx.ACTION, code.FAVOR], cmds), function(msg) { var sub = msg._can
                    sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
                        if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) {
                            if (key == mdb.VALUE) { key = line.key }
                        }
                        if (key != ctx.ACTION) { value = sub.page.replace(sub, value, ice.PWD, "") }

                        return {text: ["", html.TD], list: [{text: [value, html.DIV]}], onclick: function(event) {
                            if ([mdb.ZONE, mdb.ID].indexOf(key) > -1) { return sub.onaction.change(event, sub, key, value) }

                            if (target.tagName == "INPUT" && target.type == html.BUTTON) { var msg = sub.sup.request(event, line, sub.Option())
                                return sub.run(event, [ctx.ACTION, target.name], function(msg) { sub.run() }, true)
                            }

                            line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace(ice.PWD, ""), parseInt(line.line), function() {
                                can.onaction.selectLine(can, line.line)
                            })
                        }}
                    }, sub._output), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), can.Status("标签数", msg.Length())
                }, true)
            }
        })
    },

    project: function(can, path) { can.Option({path: path})
        var msg = can.request({}, {dir_root: path, dir_deep: true})
        can.run(msg._event, [ice.PWD], function(msg) { can.onmotion.clear(can, can.ui.project)
            can.onappend.tree(can, msg.Table(), nfs.PATH, ice.PS, function(event, item) {
                can.onimport.tabview(can, path, item.path)
            }, can.ui.project), can.Status("文件数", msg.Length())
        }, true)
    },
    tabview: function(can, path, file, line, cb) {
        if (can.tabview[path+file]) {
            can._msg && can._msg.Option(nfs.LINE, can.Option(nfs.LINE))
            can._msg = can.tabview[path+file]

            can.Option({path: path, file: file, line: line||parseInt(can._msg.Option(nfs.LINE))||1})
            return can.onsyntax._init(can, can._msg), can.base.isFunc(cb) && cb()
        }

        can.run({}, [path, file], function(msg) { can.tabview[path+file] = msg
            msg.Option({path: path, file: file, line: line||1})
            msg._tab = can.onappend.tabs(can, [{name: file.split(ice.PS).pop(), text: file}], function(event, meta) {
                can.onimport.tabview(can, path, file, "", cb)
            }, function(item) { delete(can.tabview[path+file]) })
        }, true)
    },
    profile: function(can, msg) {
        if (msg) {
            can.onappend.table(can, msg, null, can.ui.profile_output)
            can.onappend.board(can, msg.Result(), can.ui.profile_output)
        }
        can.page.style(can, can.ui.profile, html.DISPLAY, html.BLOCK)
        can.page.style(can, can.ui.profile, html.HEIGHT, can.ui.content.offsetHeight)
    },
    display: function(can, msg) {
        if (msg) {
            can.onappend.table(can, msg, null, can.ui.output||can.ui.display)
            can.onappend.board(can, msg.Result(), can.ui.output||can.ui.display)
        }
        can.page.style(can, can.ui.display, html.DISPLAY, html.BLOCK)
        can.page.style(can, can.ui.output, html.HEIGHT, 200)
        can.page.style(can, can.ui.content, html.HEIGHT, can.ui.project.offsetHeight-200-1*html.ACTION_HEIGHT)
        can.page.style(can, can.ui.profile, html.HEIGHT, can.ui.content.offsetHeight)
    },
    toolkit: function(can, meta, cb) {
        can.onappend.plugin(can, meta, function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb, true)
            }
            sub.Conf(html.HEIGHT, 400), sub.Conf(html.WIDTH, can.Conf(html.WIDTH))
            sub.page.style(sub, sub._output, html.MAX_WIDTH, can.Conf(html.WIDTH))
            sub.page.style(sub, sub._output, html.MAX_HEIGHT, can.Conf(html.HEIGHT)-2*html.ACTION_HEIGHT)

            can.ui.toolkit.status.appendChild(sub._legend)
            sub._legend.onclick = function(event) {
                if (can.page.ClassList.has(can, sub._target, html.SELECT)) {
                    can.page.ClassList.del(can, sub._target, html.SELECT)
                    return
                }
                can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target)
                can.onmotion.select(can, can.ui.toolkit.status, html.DIV_LEGEND, event.target)
            }
            sub._legend.oncontextmenu = sub._legend.onmouseenter, sub._legend.onmouseenter = function() {}
            can.base.isFunc(cb) && cb(sub)
        }, can.ui.toolkit.output)
    },
}, [""])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) {
        can._cache_list = can._cache_list||{}, can._cache_list[can.file] = {current: can.current, max: can.max}
        if (can.onmotion.cache(can, function() { can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
            var p = can._cache_list[can.file]; if (p) { can.current = p.current, can.max = p.max }
            can.parse = can.base.Ext(can.file), can.Status("模式", "normal")
            can.onmotion.select(can, can._action, chat.DIV_TABS, msg._tab)
            return can.file
        }, can.ui.content, can.ui.profile_output, can.ui.display_output)) {
            return can.onaction.selectLine(can, parseInt(msg.Option(nfs.LINE)))
        }

        function init(p) { can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) {
            can.onaction.appendLine(can, item)
        }), can.onaction.selectLine(can, msg.Option(nfs.LINE)||1) }

        var p = can.onsyntax[can.parse]; !p? can.run({}, [ctx.ACTION, mdb.PLUGIN, can.parse, msg.Option(nfs.FILE), msg.Option(nfs.PATH)], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = can.page.replace(can, line||"")
        var p = can.onsyntax[can.parse]; if (!p) { return line }
        p = can.onsyntax[p.link]||p

        function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
        p.keyword && (line = can.core.List(can.core.Split(line, p.split&&p.split.space||ice.SP, p.split&&p.split.operator||"{[(|)]}", {detail: true}), function(item, index, array) {
            item = can.base.isObject(item)? item: {text: item}, p.word && (item = p.word(item, index, array))
            var text = item.text; var key = item.keyword||p.keyword[text]

            switch (item.type) { case html.SPACE: return text
                case lang.STRING: return wrap(lang.STRING, item.left+text+item.right)
                default: return wrap(key, text)
            }
        }).join(""))

        p.prefix && can.core.Item(p.prefix, function(pre, type) {
            if (line.trim().indexOf(pre) == 0) {
                line = wrap(type, line)
            } else {
                var ls = line.split(pre); if (ls.length > 1) {
                    line = ls[0] + wrap(type, pre + ls[1])
                }
            }
        })
        p.suffix && can.core.Item(p.suffix, function(pre, type) {
            if (line.endsWith(pre)) { line = wrap(type, line) }
        })
        return p.line? p.line(can, line): line
    },
})
Volcanos("onaction", {help: "控件交互", list: ["项目", "工具"],
    "项目": function(event, can) {
        can.onmotion.toggle(can, can.ui.project)
        can.onimport._content(can)
    },

    "展示": function(event, can) { var msg = can.request(event, {_toast: "运行中..."})
        can.onimport.profile(can)
        can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.onimport.profile(can, msg)
        }, true)
    },
    "执行": function(event, can) { var msg = can.request(event, {_toast: "运行中..."})
        can.onimport.profile(can)
        can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.onimport.display(can, msg)
        }, true)
    },
    "工具": function(event, can) { can.onmotion.toggle(can, can.ui.toolkit.fieldset) },

    back: function(event, can) {
        var last = can.history.pop(); last = can.history.pop()
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
                can.onaction._selectLine(can, ui)

            }, ondblclick: function(event) {
                can.onaction._searchLine(can, ui)
            }}
        ]}]); return ui.tr
    },
    modifyLine: function(can, line, value) {
        can.page.Select(can, can.ui.content, html.TR, function(item, index) {
            if (item != line && index+1 != line) { return }

            can.page.Select(can, item, "td.text", function(item) {
                can.page.Appends(can, item, [can.onsyntax._parse(can, value)])
            })
        })
    },
    rerankLine: function(can, value) { can.max = 0
        can.page.Select(can, can.ui.content, html.TR, function(item, index) {
            can.max++, can.page.Select(can, item, "td.line", function(item) {
                item.innerText = index+1
            })
        })
    },
    selectLine: function(can, line) { if (!line) { return }
        can.page.Select(can, can.ui.content, html.TR, function(item, index) {
            can.page.ClassList.del(can, item, html.SELECT)
            if (item != line && index+1 != line) { return }
            can.page.ClassList.add(can, item, html.SELECT)

            line = item
            can.Option(nfs.LINE, index+1)
            can.Status("文件名", can.file)
            can.Status("解析器", can.parse)
            can.Status("当前行", can.onexport.position(can, index+1))
        })

        can.base.isObject(line) && can.page.Select(can, line, "td.text", function(item) {
            can.current = {
                scroll: function(x, y) {
                    can.ui.content.scrollLeft += x
                    can.ui.content.scrollTop += y
                    // return can.ui.content.scrollBy(x, y)
                },
                window: function() { return can.ui.content.offsetHeight },
                offset: function() { return can.ui.content.scrollTop },

                prev: function() { return line.previousSibling },
                next: function() { return line.nextSibling },
                line: line, text: function(text) {
                    return text != undefined && can.onaction.modifyLine(can, line, text), item.innerText
                }, height: function() { return line.offsetHeight },
            }

            var push = {path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)}
            can.base.Eq({path: push.path, file: push.file}, can.history[can.history.length-1]) || can.history.push(push)
            can.Status("跳转数", can.history.length)
        })

        if (can.current) { var offline = 5
            var pos = can.current.line.offsetTop-can.current.offset()
            if (pos > can.current.window()-offline*20) {
                can.current.scroll(0, pos-can.current.window()+offline*20)
            } else if (pos < offline*20) {
                can.current.scroll(0, pos-offline*20)
            }
        } can.onkeymap && can.onkeymap.selectLine(can)
    },
    searchLine: function(event, can, value) { if (!can.ui.search) { return }
        can.ui.search.Update(event, [ctx.ACTION, nfs.FIND, value.trim()])
    },
    _searchLine: function(can, ui) {
        var s = document.getSelection().toString(), str = ui.text.innerText
        var begin = str.indexOf(s), end = begin+s.length

        for (var i = begin; i >= 0; i--) {
            if (str[i].match(/[a-zA-Z0-9_.]/)) {
                s = str.slice(i, end)
            } else {
                break
            }
        }

        if (s.indexOf("kit.") == 0) { s = s.replace("kit.", "toolkits.") }
        if (s.indexOf(".") == 0) { s = s.slice(1) }
        can.onaction.searchLine(event, can, s)
    },
    _selectLine: function(can, ui) {
        can.onkeymap && can.onkeymap._mode(can, "insert")
        can.onaction.selectLine(can, ui.tr)
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
    position: function(can, index, total) { total = total || can.max
        return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
    },
    content: function(can) {
        return can.page.Select(can, can.ui.content, "td.text", function(item) { return item.innerText }).join(ice.NL)+ice.NL
    },
})

