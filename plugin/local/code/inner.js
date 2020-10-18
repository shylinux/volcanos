Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) {
        can.ui = can.page.Appends(can, target, [
            {type: "table", list: [{type: "tr", list: [
                    {type: "td", list: [{view: "project", style: {"max-height": window.innerHeight-300, display: "none"}} ]},
                    {type: "td", list: [{view: "profile", style: {"max-height": window.innerHeight-300}, list: [
                        {view: ["content", "table"]},
                    ]} ], onscroll: function(event) {
                    }},
                ]},
            ]},
            {view: "display", style: {display: "none", "max-height": "200"}, list: [{view: "action", list: [
                {button: ["关闭", function(event) {
                    can.page.Modify(can, can.ui.display, {style: {display: "none"}})
                }]},
            ]}, {view: "output"} ]},
            {view: "search", style: {display: "none"}, list: [{view: "action", list: [
                    {input: ["word", function(event) {
                        if (event.key == "Enter") {
                            can.onaction.searchLine(event, can, can.ui.word.value)
                        }
                    }], onfocus: function(event) {
                        event.target.setSelectionRange(0, -1)
                    }},
                    {button: ["搜索", function(event) {
                        can.onaction.searchLine(event, can, can.ui.word.value)
                    }]},
                    {button: ["返回", function(event) {
                        var last = can.history.pop(); last = can.history.pop()
                        last && can.onimport.tabview(can, last.path, last.file, last.line)
                    }]},
                    {button: ["关闭", function(event) {
                        can.page.Modify(can, can.ui.search, {style: {display: "none"}})
                    }]},
                ]},
                {view: "tags"},
            ]},
        ])

        can.tabview = {}, can.history = []
        can.tabview[can.Option("path")+can.Option("file")] = msg
        msg.Option({path: can.Option("path"), file: can.Option("file"), line: can.Option("line")||1})
        can.onimport.tabview(can, can.Option("path"), can.Option("file"), can.Option("line")||1)
        return typeof cb == "function" && cb(msg)
    },
    tabview: function(can, path, file, line) {
        var push = {path: path, file: file, line: line}
        !can.core.Eq(can.history[can.history.length-1], push) && can.history.push(push)

        function show() {
            can._msg && can._msg.Option("line", can.Option("line"))
            can._msg = can.tabview[path+file]

            can.Option({path: path, file: file, line: line||parseInt(can._msg.Option("line"))||1})
            can.onsyntax._init(can, can._msg)
        }
        if (can.tabview[path+file]) { return show() }

        can.run({}, ["action", "render", can.base.Ext(file||path), file, path], function(msg) {
            msg.Option({path: path, file: file, line: line||1})
            can.tabview[path+file] = msg

            var name = file.split("/").pop()
            can.page.EnableDrop(can, can._action, "div.file", can.page.Append(can, can._action, [{view: ["file", "div", name], title: file, onclick: function(event) {
                can.onimport.tabview(can, path, file)
            }}]).first).click()
        }, true)
    },
    project: function(can, path, cb) { can.Option({path: path})
        var msg = can.request({}); msg.Option("dir_deep", "true")
        can.run(msg._event, ["action", "render", "dir", "", path+"/"], function(msg) { can.ui.project.innerHTML = ""
            can.onappend.tree(can, msg, can.ui.project, function(event, value) {
                can.onimport.tabview(can, can.Option("path"), value.path)
            }), typeof cb == "function" && cb()
        }, true)
    },
}, ["/plugin/local/code/inner.css"])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) { can._msg = msg
        can.page.Select(can, can._action, "div.file", function(item) {
            item.title == msg.Option("file")? can.page.ClassList.add(can, item, "select"):
                can.page.ClassList.del(can, item, "select")
        })

        // caches save
        can.core.List(["content"], function(item) {
            can.Cache(can.file+item, can.ui[item], {
                scrollTop: can.ui.profile.parentNode.scrollTop,
                current: can.current,
                max: can.max,
            })
        })
        // caches load
        can.file = can.base.Path(msg.Option("path"), msg.Option("file"))
        can.parse = can.base.Ext(can.file)
        can.Status("模式", "normal")

        var cache = false; can.core.List(["content"], function(item) {
            var p = can.Cache(can.file+item, can.ui[item]); if (p != undefined) { cache = true
                can.ui.profile.parentNode.scrollTo(0, p.scrollTop)
                can.onaction.selectLine(can, p.current.target)
                can.max = p.max
            }
        }); if (cache) {
            return
        }


        function init(p) {
            can.max = 0, can.core.List(can.ls = msg.Result().split("\n"), function(item) {
                can.onaction.appendLine(can, item)
            })
            can.onaction.selectLine(can, can.Option("line")||1)
        }

        // plugin
        var p = can.onsyntax[can.parse]; !p? can.run({}, ["action", "plugin", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = line || "", line = line.replace("<", "&lt;").replace(">", "&gt;")
        var p = can.onsyntax[can.parse]; if (!p) { return }
        p = can.onsyntax[p.link] || p

        function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
        p.keyword && (line = can.core.List(can.core.Split(line, p.split && p.split.space || " ", p.split && p.split.operator || "{[(|)]}"), function(item, index, array) {
            item = typeof item == "object"? item: {text: item}, p.word && (item = p.word(item, index, array))
            var text = item.text; var key = item.keyword||p.keyword[text]

            switch (item.type) {
                case "space": return text
                case "string": return wrap("string", item.left+text+item.right)
                default: return wrap(key, text)
            }
        }).join(""))

        p.prefix && can.core.Item(p.prefix, function(pre, type) {
            if (line.trim().startsWith(pre)) { line = wrap(type, line) }
        })
        p.suffix && can.core.Item(p.suffix, function(pre, type) {
            if (line.endsWith(pre)) { line = wrap(type, line) }
        })
        return p.line? p.line(can, line): line
    },
})
Volcanos("onaction", {help: "控件交互", list: [],
    "刷新": function(event, can) {
        can.run(event, [can.Option("path"), can.Option("file")])
    },
    "编辑": function(event, can) { can.onkeymap && can.onkeymap._insert(can) },

    "返回": function(event, can) {
        var last = can.history.pop(); last = can.history.pop()
        last && can.onimport.tabview(can, last.path, last.file, last.line)
    },

    "运行": function(event, can) {
        can.page.Modify(can, can.ui.display, {innerHTML: "", style: {display: "none"}})
        can.run(event, ["action", "engine", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            (msg.Result() || msg.append && msg.append.length > 0) && can.page.Modify(can, can.ui.display, {innerHTML: "", style: {display: "block"}})
            can.onappend.table(can, can.ui.display, "table", msg)
            can.onappend.board(can, can.ui.display, "board", msg)
        }, true)
    },

    "save": function(event, can) {
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, ["action", "save", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            can.user.toast(can, "保存成功")
        }, true)
    },
    "project": function(event, can) {
        var hide = can.ui.project.style.display == "none"
        hide? can.onimport.project(can, can.Option("path"), function() {
            can.page.Modify(can, can.ui.project, {style: {display: ""}})
        }): (
            can.page.Modify(can, can.ui.project, {style: {display: "none"}})
        )
        // can.onaction.selectLine(can, can.current)
    },

    "search": function(event, can) { var hide = can.ui.search.style.display == "none"
        can.page.Modify(can, can.ui.search, {style: {display: hide? "": "none"}})
        hide && can.onaction.searchLine(event, can, "")
    },

    appendLine: function(can, value) { var index = ++can.max
        var line = can.page.Append(can, can.ui.content, [{type: "tr", list: [{view: ["line", "td", index], onclick: function(event) {
            can.onaction.selectLine(can, line)

        }, ondblclick: function(event) {
            can.user.input(event, can, [
                {_input: "text", name: "topic", value: "@key"},
                {_input: "text", name: "name", value: "@key"},
            ], function(event, button, meta, list) {
                can.run(event, [
                    "favor", "topic", meta.topic||"some",
                    "type", can.parse, "name", meta.name||"some", "text", value,
                    "path", can.Option("path"), "file", can.Option("file"), "line", can.Option("line"),
                ], function(msg) {
                    can.user.toast(can, "收藏成功")
                }, true)
                return true
            })
        }}, {view: ["text", "td"], _init: function(td) {
            var p = can.onsyntax._parse(can, value)
            typeof p == "object"? can.page.Appends(can, td, [p]): td.innerHTML = p

        }, onclick: function(event) {
            can.onaction.selectLine(can, line)

            if (can.ui.editor) {
                can.ui.editor.focus()
                can.ui.editor.setSelectionRange(0, 0)
                can.onkeymap && can.onkeymap._mode(can, "insert")
                // can.ui.editor.setSelectionRange(event.offsetX/10, event.offsetX/10)
            }
        }, ondblclick: function(event) {
            return
            var s = document.getSelection()
            var str = s.baseNode.data
            var begin = str.indexOf(s.toString())
            var end = begin+s.toString().length
            s = s.toString()
            for (var i = begin; i >= 0; i--) {
                if (!str[i].match(/[a-zA-Z0-9.]/)) {
                    s = str.slice(i+1, end)
                    break
                }
            }
            if (s.indexOf(".") == 0) {
                s = s.slice(1)
            }
            if (s.indexOf("kit.") == 0) {
                s = s.replace("kit.", "toolkits.")
            }

            can.onaction.searchLine(event, can, s)
        }} ] }]).tr
        return line
    },
    rerankLine: function(can, value) { can.max = 0
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            can.max++, can.page.Select(can, item, "td.line", function(item) {
                item.innerText = index+1
            })
        })
    },
    modifyLine: function(can, line, value) {
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            if (item != line && index+1 != line) { return }

            can.page.Select(can, item, "td.text", function(item) {
                var p = can.onsyntax._parse(can, value)
                typeof p == "object"? can.page.Appends(can, item, [p]): item.innerHTML = p
            })
        })
    },
    selectLine: function(can, line) { if (!line) { return }
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            can.page.ClassList.del(can, item, "select")
            if (item != line && index+1 != line) { return }

            can.Status("文件名", can.file)
            can.Status("解析器", can.parse)
            can.Status("当前行", can.onexport.position(can, index+1))
            can.page.ClassList.add(can, item, "select")
            can.Option("line", index+1)
            line = item
        })

        can.page.Select(can, line, "td.text", function(item) {
            can.current = {
                scroll: function(x, y) { return can.ui.profile.parentNode.scrollBy(x, y) },
                offset: function() { return can.ui.profile.parentNode.scrollTop },
                window: function() { return can.ui.profile.parentNode.offsetHeight },
                height: function() { return line.offsetHeight },
                prev: function() { return line.previousSibling },
                next: function() { return line.nextSibling },
                text: function(what) {
                    what != undefined && can.onaction.modifyLine(can, line, what)
                    return item.innerText
                },
                target: line,
            }

            can.ui.editor && can.page.Modify(can, can.ui.editor, {className: "editor "+can.mode, value: item.innerText, style: {
                height: item.offsetHeight, width: item.offsetWidth,
                left: item.offsetLeft, top: item.offsetTop,
            }})
            can.ui.command && can.page.Modify(can, can.ui.command, {className: "command "+can.mode, value: item.innerText, style: {
                height: item.offsetHeight, width: item.offsetWidth,
                left: item.offsetLeft, top: item.offsetTop + can.ui.profile.offsetHeight-100,
            }})
        })
    },
    searchLine: function(event, can, value) { value = value.trim()
        can.page.Modify(can, can.ui.search, {style: {display: ""}})
        value = can.ui.word.value = value || can.ui.word.value || "main"

        var msg = can.request(event); msg.Option("_path", can.Option("path"))
        value && can.run(event, ["action", "search", can.parse, value, ""], function(msg) { can.ui.tags.innerHTML = ""
            can.onappend.table(can, can.ui.tags, "table", msg, function(value, key, index, line) {
                value = value.replace("<", "&lt;").replace(">", "&gt;")
                value = value.replace("./", "")
                can.Status("标签数", index+1)
                return {text: ["", "td"], list: [{text: [value, "div"]}], onclick: function(event) {
                    line.line && can.onimport.tabview(can, can.Option("path"), line.file.replace("./", ""), parseInt(line.line))
                }}
            })
            can.page.Select(can, can.ui.tags, "tr", function(item, index) {
                index == 1 && can.page.Select(can, item, "td", function(item, index) {
                    index == 0 && item.innerText && item.click()
                })
            })
        }, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["模式", "按键", "文件名", "解析器", "当前行", "标签数"],
    position: function(can, index, total) { total = total || can.max
        return (parseInt(index))+"/"+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
    },
    content: function(can) {
        return can.page.Select(can, can._output, "table.content>td.text", function(item) {
            return item.innerText
        }).join("\n")
    },
})

