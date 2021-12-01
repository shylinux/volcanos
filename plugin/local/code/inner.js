Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) {
        can.onmotion.clear(can)
        can.ui = can.onlayout.profile(can)
        can.onimport._content(can, target)
        can.onimport._output(can, target)
        // can.onimport._favor(can, target)
        // can.onimport._search(can, target)

        can.history = can.history||[]
        msg.Option({path: can.Option(nfs.PATH), file: can.Option(nfs.FILE), line: can.Option(nfs.LINE)||1})
        can.tabview = can.tabview||{}, can.tabview[can.Option(nfs.PATH)+can.Option(nfs.FILE)] = msg

        can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE)||1)
        can.onimport.project(can, msg.Option(nfs.PATH))
        can.base.isFunc(cb) && cb(msg)
    },
    _content: function(can, target) {
        var height = can.Conf(html.HEIGHT)-(can.user.mod.isCmd? 54: 320); height < 240 && (height = 240)
        can.page.Modify(can, can.ui.project, {style: {"max-height": height}})
        can.page.Modify(can, can.ui.content, {style: {"max-height": height}})
        can.page.Modify(can, can.ui.display, {style: {display: chat.NONE}})
    },
    _output: function(can, target) {
        var ui = can.page.Append(can, can.ui.display, [{view: html.ACTION}, {view: html.OUTPUT}]); can.ui.output = ui.output

        can.onappend._action(can, ["exec", cli.CLEAR, cli.CLOSE], ui.action, {
            exec: function(event) { can.onaction["exec"](event, can) },
            clear: function(event) { can.onmotion.clear(can, can.ui.output) },
            close: function(event) { can.onmotion.hidden(can, can.ui.display) },
        })
    },
    _favor: function(can, target) {
        can.onappend.plugin(can, {type: chat.STORY, index: "web.code.favor"}, function(sub) {
            sub.run = function(event, cmds, cb) { var msg = can.request(event)
                if (cmds && cmds[0] == ctx.ACTION) { switch (cmds[1]) {
                    case code.INNER: can.onimport.tabview(can, msg.Option(nfs.PATH), msg.Option(nfs.FILE), msg.Option(nfs.LINE)); return
                } }

                can.run(event, can.misc.concat([ctx.ACTION, code.FAVOR], cmds), function(msg) {
                    can.base.isFunc(cb) && cb(msg), can.core.Timer(10, function() {
                        can.onappend._action(sub, [cli.CLOSE], sub._action, {
                            close: function(event) { can.onmotion.hidden(sub, sub._target) },
                        })
                    })
                }, true)
            }, can.ui.favor = sub

            can.onmotion.hidden(sub, sub._target)
        }, target)
    },
    _search: function(can, target) {
        var ui = can.page.Append(can, target, [
            {view: mdb.SEARCH, style: {display: chat.NONE}, list: [
                {view: chat.ACTION, list: [
                    {input: ["word", function(event) {
                        event.key == lang.ENTER && can.onaction.searchLine(event, can, ui.word.value)
                    }], value: "main", onfocus: function(event) { event.target.setSelectionRange(0, -1) }},
                    {button: [mdb.SEARCH, function(event) { can.onaction.searchLine(event, can, ui.word.value) }]},
                    {button: ["back", function(event) { can.onaction["back"](event, can) }]},
                    {button: ["close", function(event) { can.onaction["搜索"](event, can) }]},
                ]},
                {view: "tags", style: {"max-height": 160}},
            ]},
        ]); can.base.Copy(can.ui, ui, mdb.SEARCH, "word", "tags")
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

        can.run({}, [path, file], function(msg) {
            msg.Option({path: path, file: file, line: line||1})
            can.tabview[path+file] = msg

            msg._tab = can.page.Append(can, can._action, [
                {text: [file.split(ice.PS).pop(), html.DIV, nfs.FILE], title: file, onclick: function(event) {
                    can.onimport.tabview(can, path, file, "", cb)
                }, _init: function(item) {
                    can.core.Timer(10, function() { item.click() })
                    can.onaction.EnableDrop(can, can._action, "div.file", item)
                }}
            ]).last
        }, true)
    },
}, [""])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) {
        // caches save
        can.file && can.core.List([chat.CONTENT, chat.PROFILE, chat.OUTPUT], function(item) { can.page.Cache(can.file, can.ui[item], {
            scrollTop: can.ui.content.scrollTop, current: can.current, max: can.max,
        }) })

        can.file = can.base.Path(msg.Option(nfs.PATH), msg.Option(nfs.FILE))
        can.parse = can.base.Ext(can.file)
        can.Status("模式", "normal")

        // caches load
        can.onmotion.select(can, can._action, "div.file", msg._tab)
        var cache = false; can.core.List([chat.CONTENT, chat.PROFILE, chat.OUTPUT], function(item) {
            var p = can.page.Cache(can.file, can.ui[item]); if (p != undefined && !cache) { cache = true
                can.onaction.selectLine(can, parseInt(msg.Option(nfs.LINE)))
                can.ui.content.scrollTo(0, p.scrollTop)
                can.max = p.max
            }
        }); if (cache) { return }

        function init(p) { can.max = 0
            can.core.List(can.ls = msg.Result().split(ice.NL), function(item) {
                can.onaction.appendLine(can, item)
            }), can.onaction.selectLine(can, msg.Option(nfs.LINE)||1)
        }

        // plugin
        var p = can.onsyntax[can.parse]; !p? can.run({}, [ctx.ACTION, mdb.PLUGIN, can.parse, msg.Option(nfs.FILE), msg.Option(nfs.PATH)], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = line||"", line = line.replace("<", "&lt;").replace(">", "&gt;")
        var p = can.onsyntax[can.parse]; if (!p) { return line }
        p = can.onsyntax[p.link]||p

        function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
        p.keyword && (line = can.core.List(can.core.Split(line, p.split && p.split.space||ice.SP, p.split && p.split.operator || "{[(|)]}", {detail: true}), function(item, index, array) {
            item = can.base.isObject(item)? item: {text: item}, p.word && (item = p.word(item, index, array))
            var text = item.text; var key = item.keyword||p.keyword[text]

            switch (item.type) { case "space": return text
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
Volcanos("onaction", {help: "控件交互", list: ["项目", "收藏"],
    "back": function(event, can) {
        var last = can.history.pop(); last = can.history.pop()
        last && can.onimport.tabview(can, last.path, last.file, last.line)
        can.Status("跳转数", can.history.length)
    },
    "项目": function(event, can) {
        var width = can.Conf(html.WIDTH)-(can.onmotion.toggle(can, can.ui.project)? 170: 0)
    },
    "收藏": function(event, can) { can.onmotion.toggle(can, can.ui.favor._target) },
    "搜索": function(event, can) { can.onmotion.toggle(can, can.ui.search) },
    "exec": function(event, can) { var msg = can.request(event, {_toast: "运行中..."})
        can.run(event, [ctx.ACTION, mdb.ENGINE, can.parse, can.Option(nfs.FILE), can.Option(nfs.PATH)], function(msg) {
            can.onappend.table(can, msg, null, can.ui.output||can.ui.display)
            can.onappend.board(can, msg.Result(), can.ui.output||can.ui.display)
            can.page.Modify(can, can.ui.display, {style: {display: html.BLOCK}})
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

        can.request(event, {_toast: "搜索中..."})
        can.run(event, [ctx.ACTION, mdb.SEARCH, can.parse, value, can.Option(nfs.PATH)], function(msg) {
            can.onmotion.clear(can, can.ui.tags)
            can.onappend.table(can, msg, function(value, key, index, line) {
                value = value.replace("<", "&lt;").replace(">", "&gt;"), value = value.replace("./", "")

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
        can.user.input(event, can, [
            {name: "zone", value: "hi"},
            {name: "name", value: "hello"},
        ], function(event, button, meta, list) {
            can.run(event, [ctx.ACTION, code.FAVOR,
                ctx.ACTION, mdb.INSERT, kit.MDB_ZONE, meta.zone||"",
                kit.MDB_TYPE, can.parse, kit.MDB_NAME, meta.name||"", kit.MDB_TEXT, (value||"").trimRight(),
                nfs.PATH, can.Option(nfs.PATH), nfs.FILE, can.Option(nfs.FILE), nfs.LINE, can.Option(nfs.LINE),
            ], function(msg) {
                can.user.toastSuccess(can)
            }, true)
        })
    },
    EnableDrop: function(can, parent, search, target) {
        return can.page.Modify(can, target, { draggable: true,
            ondragstart: function(event) { var target = event.target; can.drop = function(event, tab) {
                parent.insertBefore(target, tab)
                can.page.Select(can, parent, search, function(item) {
                    can.page.ClassList.del(can, item, "over")
                })
            } },
            ondragover: function(event) { event.preventDefault()
                can.page.Select(can, parent, search, function(item) {
                    can.page.ClassList.del(can, item, "over")
                }), can.page.ClassList.add(can, event.target, "over")
            },
            ondrop: function(event) { event.preventDefault()
                can.drop(event, event.target)
            },
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
    position: function(can, index, total) { total = total || can.max
        return (parseInt(index))+ice.PS+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
    },
    content: function(can) {
        return can.page.Select(can, can.ui.content, "td.text", function(item) {
            return item.innerText
        }).join(ice.NL)+ice.NL
    },
})

