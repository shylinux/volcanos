Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) {
        can.history = can.history || []
        can.onmotion.clear(can), can.ui = can.onlayout.profile(can)
        can.page.Modify(can, can.ui.project, {style: {"max-height": can.Conf("height")-320}})
        can.page.Modify(can, can.ui.content, {style: {"max-height": can.Conf("height")-320}})
        can.page.Modify(can, can.ui.content, {style: {"min-width": can.Conf("width")-170}})
        can.page.Modify(can, can.ui.display, {style: {display: "none"}})

        var ui = can.page.Append(can, can.ui.display, [
            {view: "action"}, {view: "output"},
        ]); can.ui.output = ui.output
        can.onappend._action(can, ["关闭", "清空", "运行"], ui.action, {
            "关闭": function(event) { can.onmotion.hidden(can, can.ui.display) },
            "清空": function(event) { can.onmotion.clear(can, can.ui.output) },
            "运行": function(event) { can.onaction["运行"](event, can) },
        })

        msg.Option({path: can.Option("path"), file: can.Option("file"), line: can.Option("line")||1})
        can.tabview = can.tabview || {}, can.tabview[can.Option("path")+can.Option("file")] = msg

        can.onimport.tabview(can, msg.Option("path"), msg.Option("file"), msg.Option("line")||1)
        can.onimport.project(can, msg.Option("path"))
        typeof cb == "function" && cb(msg)
        can.onimport._search(can, target)
        can.onimport._favor(can, target)
    },
    _search: function(can, target) {
        var ui = can.page.Append(can, target, [
            {view: "search", style: {display: "none"}, list: [
                {view: "action", list: [
                    {input: ["word", function(event) {
                        event.key == "Enter" && can.onaction.searchLine(event, can, ui.word.value)
                    }], value: "main", onfocus: function(event) { event.target.setSelectionRange(0, -1) }},
                    {button: ["搜索", function(event) { can.onaction.searchLine(event, can, ui.word.value) }]},
                    {button: ["返回", function(event) { can.onaction["返回"](event, can) }]},
                    {button: ["关闭", function(event) { can.onaction["搜索"](event, can) }]},
                ]},
                {view: "tags", style: {"max-height": 160}},
            ]},
        ]); can.base.Copy(can.ui, ui, "search", "word", "tags")
    },
    _favor: function(can, target) {
        can.onappend.plugin(can, {index: "web.code.favor"}, function(sub) {
            sub.run = function(event, cmds, cb) {
                var msg = can.request(event); if (cmds && cmds[0] == "action") { switch (cmds[1]) {
                    case "inner": can.onimport.tabview(can, msg.Option("path"), msg.Option("file"), msg.Option("line")); return
                } }

                can.run(event, ["action", "favor"].concat(cmds), cb, true)
            }, can.ui.favor = sub

            can.onmotion.hidden(sub, sub._target)
        }, target)
    },
    project: function(can, path) { can.Option({path: path})
        var msg = can.request({}, {dir_root: path, dir_deep: true})
        can.run(msg._event, ["./"], function(msg) {
            can.onmotion.clear(can, can.ui.project)
            can.onappend.tree(can, msg.Table(), "path", "/", function(event, item) {
                can.onimport.tabview(can, path, item.path)
            }, can.ui.project), can.Status("文件数", msg.Length())
        }, true)
    },
    tabview: function(can, path, file, line, cb) {
        if (can.tabview[path+file]) {
            can._msg && can._msg.Option("line", can.Option("line"))
            can._msg = can.tabview[path+file]

            can.Option({path: path, file: file, line: line||parseInt(can._msg.Option("line"))||1})
            can._msg.Option("line", can.Option("line"))
            return can.onsyntax._init(can, can._msg), typeof cb == "function" && cb()
        }

        can.run({}, [path, file], function(msg) {
            msg.Option({path: path, file: file, line: line||1})
            can.tabview[path+file] = msg

            msg._tab = can.page.Append(can, can._action, [
                {text: [file.split("/").pop(), "div", "file"], title: file, onclick: function(event) {
                    can.onimport.tabview(can, path, file, "", cb)
                }, _init: function(item) {
                    can.core.Timer(10, function() { item.click() })
                    can.page.EnableDrop(can, can._action, "div.file", item)
                }}
            ]).last
        }, true)
    },
}, ["/plugin/local/code/inner.css"])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) {
        // caches save
        can.file && can.core.List(["content", "profile", "output"], function(item) { can.page.Cache(can.file, can.ui[item], {
            scrollTop: can.ui.content.scrollTop, current: can.current, max: can.max,
        }) })

        can.file = can.base.Path(msg.Option("path"), msg.Option("file"))
        can.parse = can.base.Ext(can.file)
        can.Status("模式", "normal")

        // caches load
        can.onmotion.select(can, can._action, "div.file", msg._tab)
        var cache = false; can.core.List(["content", "profile", "output"], function(item) {
            var p = can.page.Cache(can.file, can.ui[item]); if (p != undefined && !cache) { cache = true
                can.onaction.selectLine(can, parseInt(msg.Option("line")))
                can.ui.content.scrollTo(0, p.scrollTop)
                can.max = p.max
            }
        }); if (cache) { return }

        function init(p) { can.max = 0
            can.core.List(can.ls = msg.Result().split("\n"), function(item) {
                can.onaction.appendLine(can, item)
            }), can.onaction.selectLine(can, msg.Option("line")||1)
        }

        // plugin
        var p = can.onsyntax[can.parse]; !p? can.run({}, ["action", "plugin", can.parse, msg.Option("file"), msg.Option("path")], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = line || "", line = line.replace("<", "&lt;").replace(">", "&gt;")
        var p = can.onsyntax[can.parse]; if (!p) { return }
        p = can.onsyntax[p.link] || p

        function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
        p.keyword && (line = can.core.List(can.core.Split(line, p.split && p.split.space || " ", p.split && p.split.operator || "{[(|)]}", {detail: true}), function(item, index, array) {
            item = typeof item == "object"? item: {text: item}, p.word && (item = p.word(item, index, array))
            var text = item.text; var key = item.keyword||p.keyword[text]

            switch (item.type) {
                case "space": return text
                case "string": return wrap("string", item.left+text+item.right)
                default: return wrap(key, text)
            }
        }).join(""))

        p.prefix && can.core.Item(p.prefix, function(pre, type) {
            if (line.trim().indexOf(pre) == 0) { line = wrap(type, line) }
        })
        p.suffix && can.core.Item(p.suffix, function(pre, type) {
            if (line.endsWith(pre)) { line = wrap(type, line) }
        })
        return p.line? p.line(can, line): line
    },
})
Volcanos("onaction", {help: "控件交互", list: ["项目", "运行", "搜索"],
    "返回": function(event, can) {
        var last = can.history.pop(); last = can.history.pop()
        last && can.onimport.tabview(can, last.path, last.file, last.line)
        can.Status("跳转数", can.history.length)
    },
    "运行": function(event, can) {
        var msg = can.request(event, {_toast: "运行中..."})
        can.run(event, ["action", "engine", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            can.onappend.table(can, msg, function(value, key, index) { return {text: [value, "td"]} }, can.ui.output||can.ui.display)
            can.onappend.board(can, msg.Result(), can.ui.output||can.ui.display)
            can.page.Modify(can, can.ui.display, {style: {display: "block"}})
        }, true)
    },
    "项目": function(event, can) { can.onmotion.toggle(can, can.ui.project) },
    "搜索": function(event, can) { can.onmotion.toggle(can, can.ui.search) },
    "收藏": function(event, can) { can.onmotion.toggle(can, can.ui.favor._target) },

    appendLine: function(can, value) {
        var ui = can.page.Append(can, can.ui.content, [{type: "tr", list: [
            {view: ["line", "td", ++can.max], onclick: function(event) {
                can.onaction.selectLine(can, ui.tr)

            }, ondblclick: function(event) {
                can.onaction.favorLine(can, ui.text.innerText)
            }},
            {view: ["text", "td"], list: [can.onsyntax._parse(can, value)], onclick: function(event) {
                can.onaction._selectLine(can, ui)

            }, ondblclick: function(event) {
                can.onaction._searchLine(can, ui)
            }}
        ]}]); return ui.tr
    },
    modifyLine: function(can, line, value) {
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            if (item != line && index+1 != line) { return }

            can.page.Select(can, item, "td.text", function(item) {
                can.page.Appends(can, item, [can.onsyntax._parse(can, value)])
            })
        })
    },
    rerankLine: function(can, value) { can.max = 0
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            can.max++, can.page.Select(can, item, "td.line", function(item) {
                item.innerText = index+1
            })
        })
    },
    selectLine: function(can, line) { if (!line) { return }
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            can.page.ClassList.del(can, item, "select")
            if (item != line && index+1 != line) { return }
            can.page.ClassList.add(can, item, "select")

            line = item
            can.Option("line", index+1)
            can.Status("文件名", can.file)
            can.Status("解析器", can.parse)
            can.Status("当前行", can.onexport.position(can, index+1))
        })

        typeof line == "object" && can.page.Select(can, line, "td.text", function(item) {
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

            var push = {path: can.Option("path"), file: can.Option("file"), line: can.Option("line")}
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
        value = can.ui.word.value = value || can.ui.word.value || "main"

        var msg = can.request(event, {_toast: "搜索中..."})
        can.run(event, ["action", "search", can.parse, value, can.Option("path")], function(msg) {

            can.onmotion.clear(can, can.ui.tags)
            can.onappend.table(can, msg, function(value, key, index, line) {
                value = value.replace("<", "&lt;").replace(">", "&gt;"), value = value.replace("./", "")

                return {text: ["", "td"], list: [{text: [value, "div"]}], onclick: function(event) {
                    line.line && can.onimport.tabview(can, can.Option("path"), line.file.replace("./", ""), parseInt(line.line), function() {
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
            {_input: "text", name: "topic", value: "@key"},
            {_input: "text", name: "name", value: "@key"},
        ], function(event, button, meta, list) {
            can.run(event, ["action", "favor",
                "action", "insert", "topic", meta.topic||"some",
                "type", can.parse, "name", meta.name||"some", "text", value||"",
                "path", can.Option("path"), "file", can.Option("file"), "line", can.Option("line"),
            ], function(msg) {
                can.user.toast(can, "收藏成功")
            }, true)
            return true
        })
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
    position: function(can, index, total) { total = total || can.max
        return (parseInt(index))+"/"+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
    },
    content: function(can) {
        return can.page.Select(can, can.ui.content, "td.text", function(item) {
            return item.innerText
        }).join("\n")+"\n"
    },
})

