Volcanos("onimport", {help: "导入数据", _init: function(can, msg, cb, target) {
        can.onmotion.clear(can), can.ui = can.onlayout.profile(can)
        can.onimport._content(can, target)
        can.onimport._output(can, target)
        can.onimport._favor(can, target)
        can.onimport._search(can, target)

        msg.Option({path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)||1})
        can.tabview = can.tabview||{}, can.tabview[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = msg
        can.history = can.history||[]

        can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE)||1, function() {
            can.onimport.project(can, msg.Option(nfs.PATH))
            can.base.isFunc(cb) && cb(msg)
        })
    },
    _content: function(can, target) { var height = can.Conf(html.HEIGHT)
        can.user.mod.isCmd && can.page.style(can, can._output, html.HEIGHT, can.Conf(html.HEIGHT))
        can.page.style(can, can.ui.project, html.MAX_HEIGHT, height)
        can.page.style(can, can.ui.content, html.MAX_HEIGHT, height)
        can.page.style(can, can.ui.display, html.DISPLAY, html.NONE)
        can.ui.toolkit = can.onappend.field(can, chat.STORY, {}, can._output)
        can.page.ClassList.add(can, can.ui.toolkit.fieldset, "toolkit")
    },
    _output: function(can, target) {
        var ui = can.page.Append(can, can.ui.display, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.output = ui.output

        can.onappend._action(can, [cli.EXEC, cli.CLEAR, cli.CLOSE], ui.action, kit.Dict(
            cli.EXEC, function(event) { can.onaction[cli.EXEC](event, can) },
            cli.CLEAR, function(event) { can.onmotion.clear(can, can.ui.output) },
            cli.CLOSE, function(event) { can.onmotion.hidden(can, can.ui.display) },
        ))
    },
    _favor: function(can, target) {
        can.onimport.toolkit(can, {index: "web.code.git.spide", args: ["icebergs"]})
        can.onimport.toolkit(can, {index: "web.code.git.total", args: ["icebergs"]})
        can.onimport.toolkit(can, {index: "web.code.favor"}, function(sub) {
            sub.run = function(event, cmds, cb) { var msg = can.request(event)
                if (cmds && cmds[0] == ctx.ACTION) { switch (cmds[1]) {
                    case code.INNER: can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE)); return
                } }
                can.run(event, can.misc.concat(can, [ctx.ACTION, code.FAVOR], cmds), function(msg) { var sub = msg._can;
                    sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
                        if (msg.append.length == 2 && msg.append[0] == mdb.KEY && msg.append[1] == mdb.VALUE) {
                            if (key == mdb.VALUE) { key = line.key }
                        }
                        if (key != ctx.ACTION) {
                            value = sub.base.replaceAll(value, "<", "&lt;", ">", "&gt;", "./", "")
                        }
                        return {text: ["", html.TD], list: [{text: [value, html.DIV]}], onclick: function(event) {
                            if ([mdb.ZONE, mdb.ID].indexOf(key) > -1) {
                                return sub.onaction.change(event, sub, key, value)
                            }

                            line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace("./", ""), parseInt(line.line), function() {
                                can.onaction.selectLine(can, line.line)
                            })
                        }}
                    }, sub._output), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), can.Status("标签数", msg.Length())
                }, true)
            }
        })
    },
    _search: function(can, target) {
        can.onengine.plugin(can, "code.inner.search", shy("搜索", {}, [
            {type: "text", name: "word", value: "main"},
            {type: "button", name: "find"},
            {type: "button", name: "back"},
        ], function(msg, cmds, cb) { can.misc.runAction(can, msg, cmds, cb, {
            "find": function(cmds) { msg.Option(ice.MSG_HANDLE, ice.TRUE), msg.Option(ice.MSG_FIELDS, "file,line,text")
                can.run(msg._event, [ctx.ACTION, mdb.SEARCH, can.parse, cmds[0], can.Option(nfs.PATH)], function(msg) {
                    var sub = msg._can; sub.onappend.table(sub, msg, function(value, key, index, line) {
                        value = can.base.replaceAll(value, "<", "&lt;", ">", "&gt;", "./", "")
                        return {text: ["", html.TD], list: [{text: [value, html.DIV]}], onclick: function(event) {
                            line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace("./", ""), parseInt(line.line), function() {
                                can.onaction.selectLine(can, line.line)
                            })
                        }}
                    }, sub._output), sub.Status("标签数", msg.Length())
                }, true)
            },
        }) }))
        can.onimport.toolkit(can, {index: "can.code.inner.search"})
    },
    toolkit: function(can, meta, cb) {
        can.onappend.plugin(can, meta, function(sub) {
            sub.run = function(event, cmds, cb, silent) {
                can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb, true)
            }
            sub.page.style(sub, sub._output, html.MAX_WIDTH, can.Conf(html.WIDTH))
            can.ui.toolkit.status.appendChild(sub._legend)
            sub._legend.onclick = function(event) {
                if (can.page.ClassList.has(can, sub._target, html.SELECT)) {
                    can.page.ClassList.del(can, sub._target, html.SELECT)
                    return
                }
                can.onmotion.select(can, can.ui.toolkit.output, html.FIELDSET, sub._target)
                can.onmotion.select(can, can.ui.toolkit.status, html.DIV_LEGEND, event.target)
            }
            sub._legend.ondblclick = sub._legend.onmouseenter, sub._legend.onmouseenter = function() {}
            can.base.isFunc(cb) && cb(sub)
        }, can.ui.toolkit.output)
    },

    project: function(can, path) { can.Option({path: path})
        var msg = can.request({}, {dir_root: path, dir_deep: true})
        can.run(msg._event, ["./"], function(msg) { can.onmotion.clear(can, can.ui.project)
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
            can._msg.Option(nfs.LINE, can.Option(nfs.LINE))
            return can.onsyntax._init(can, can._msg), can.base.isFunc(cb) && cb()
        }

        can.run({}, [path, file], function(msg) { can.tabview[path+file] = msg
            msg.Option({path: path, file: file, line: line||1})
            msg._tab = can.onappend.tabs(can, [{name: file.split(ice.PS).pop(), text: file}], function(event, meta) {
                can.onimport.tabview(can, path, file, "", cb)
            }, function(item) {
                delete(can.tabview[path+file])
            }), can.core.Timer(10, function() { msg._tab.click() })
        }, true)
    },
}, [""])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) {
        can._cache_list = can._cache_list||{}, can._cache_list[can.file] = {current: can.current, max: can.max}
        if (can.onmotion.cache(can, function() { can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
            var p = can._cache_list[can.file]; if (p) { can.current = p.current, can.max = p.max }
            can.parse = can.base.Ext(can.file), can.Status("模式", "normal")
            can.onmotion.select(can, can._action, chat.DIV_TABS, msg._tab)
            return can.file
        }, can.ui.content, can.ui.profile, can.ui.output)) {
            return can.onaction.selectLine(can, parseInt(msg.Option(nfs.LINE)))
        }

        function init(p) { can.max = 0, can.core.List(can.ls = msg.Result().split(ice.NL), function(item) {
            can.onaction.appendLine(can, item)
        }), can.onaction.selectLine(can, msg.Option(nfs.LINE)||1) }

        var p = can.onsyntax[can.parse]; !p? can.run({}, [ctx.ACTION, mdb.PLUGIN, can.parse, msg.Option(nfs.FILE), msg.Option(nfs.PATH)], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = can.base.replaceAll(line||"", "<", "&lt;", ">", "&gt;")
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
    back: function(event, can) {
        var last = can.history.pop(); last = can.history.pop()
        last && can.onimport.tabview(can, last.path, last.file, last.line)
        can.Status("跳转数", can.history.length)
    },
    "项目": function(event, can) { can.onmotion.toggle(can, can.ui.project) },
    "工具": function(event, can) { can.onmotion.toggle(can, can.ui.toolkit.fieldset) },
    exec: function(event, can) { var msg = can.request(event, {_toast: "运行中..."})
        can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.onappend.table(can, msg, null, can.ui.output||can.ui.display)
            can.onappend.board(can, msg.Result(), can.ui.output||can.ui.display)
            can.page.style(can, can.ui.display, html.DISPLAY, html.BLOCK)
        }, true)
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
    searchLine: function(event, can, value) { value = value.trim()
        can.page.Modify(can, can.ui.search, {style: {display: ""}})
        value = can.ui.word.value = value||can.ui.word.value||"main"

        can.request(event, kit.Dict(ice.MSG_HANDLE, ice.TRUE, ice.MSG_FIELDS, "file,line,text"))
        can.run(event, [ctx.ACTION, mdb.SEARCH, can.parse, value, can.Option(nfs.PATH)], function(msg) {
            can.onmotion.hidden(can, can.ui.search, true)
            can.onmotion.clear(can, can.ui.tags)
            can.onappend.table(can, msg, function(value, key, index, line) {
                value = can.base.replaceAll(value, "<", "&lt;", ">", "&gt;", "./", "")

                return {text: ["", html.TD], list: [{text: [value, html.DIV]}], onclick: function(event) {
                    line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace("./", ""), parseInt(line.line), function() {
                        can.onaction.selectLine(can, line.line)
                    })
                }}
            }, can.ui.tags), can.Status("标签数", msg.Length())
        }, true)
    },
    _searchLine: function(can, ui) {
        var s = document.getSelection().toString()
        var str = ui.text.innerText
        var begin = str.indexOf(s)
        var end = begin+s.length

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

