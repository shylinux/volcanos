Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) {

    /*
        var width = can.Conf("width"), height = can.Conf("height")
        can.ui = can.page.Appends(can, target, [
            {view: ["void", "table"], list: [{type: "tr", list: [
                {type: "td", list: [{view: "project", style: {"max-height": height-240, display: "none"}} ]},
                {type: "td", list: [{view: "profile", style: {"max-height": height-240}, list: [
                    {view: ["content", "table"]},
                ]}], style: {"min-width": width-80}},
            ]}, ]},
            {view: "search", style: {display: "none"}, list: [{view: "action", list: [
                    {input: ["word", function(event) {
                        if (event.key == "Enter") {
                            can.onaction.searchLine(event, can, can.ui.word.value)
                        }
                    }], value: "main", onfocus: function(event) {
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
                {view: "tags", style: {"max-height": 160}},
            ]},
        ])
        */

        can.history = can.history || []
        can.onmotion.clear(can), can.ui = can.onlayout.profile(can)
        can.page.Modify(can, can.ui.content, {style: {"max-height": can.Conf("height")-480}})
        can.page.Modify(can, can.ui.project, {style: {"max-height": can.Conf("height")-480}})

        msg.Option({path: can.Option("path"), file: can.Option("file"), line: can.Option("line")||1})
        can.tabview = can.tabview || {}, can.tabview[can.Option("path")+can.Option("file")] = msg

        can.onimport.tabview(can, msg.Option("path"), msg.Option("file"), msg.Option("line")||1)
        can.onimport.project(can, msg.Option("path"))
        typeof cb == "function" && cb(msg)
    },
    project: function(can, path) { can.Option({path: path})
        var msg = can.request({}, {dir_root: path, dir_deep: true})
        can.run(msg._event, ["action", "dir", "./"], function(msg) {
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
            can.onmotion.select(can, can._action, "div.file", can._msg._tab)
            can.onsyntax._init(can, can._msg)
            typeof cb == "function" && cb()
            return
        }

        can.run({}, ["action", "render", can.base.Ext(file||path), file, path], function(msg) {
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
        can.file && can.core.List(["content", "profile", "display"], function(item) { can.page.Cache(can.file, can.ui[item], {
            scrollTop: can.ui.profile.parentNode.scrollTop,
            current: can.current, max: can.max,
        }) })

        can.file = can.base.Path(msg.Option("path"), msg.Option("file"))
        can.parse = can.base.Ext(can.file)
        can.Status("解析器", can.parse)
        can.Status("文件名", can.file)
        can.Status("模式", "normal")

        // caches load
        var cache = false; can.core.List(["content", "profile", "display"], function(item) {
            var p = can.page.Cache(can.file, can.ui[item]); if (p != undefined && !cache) { cache = true
                can.ui.profile.parentNode.scrollTo(0, p.scrollTop)
                can.onaction.selectLine(can, p.current.line)
                can.max = p.max
            }
        }); if (cache) { return }

        function init(p) {
            can.max = 0, can.core.List(can.ls = msg.Result().split("\n"), function(item) {
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
Volcanos("onaction", {help: "控件交互", list: [],
    appendLine: function(can, value) {
        var ui = can.page.Append(can, can.ui.content, [{type: "tr", list: [
            {view: ["line", "td", ++can.max], onclick: function(event) {
                can.onaction.selectLine(can, ui.tr)

            }, ondblclick: function(event) {
                can.onaction.favorLine(can)
            }},
            {view: ["text", "td"], list: [can.onsyntax._parse(can, value)], onclick: function(event) {
                can.onaction._selectLine(can, ui, value)

            }, ondblclick: function(event) {
                can.onaction._searchLine(can, ui, value)
            }}
        ]}]); return ui.tr
    },
    selectLine: function(can, line) { if (!line) { return }
        can.page.Select(can, can.ui.content, "tr", function(item, index) {
            can.page.ClassList.del(can, item, "select")
            if (item != line && index+1 != line) { return }
            can.page.ClassList.add(can, item, "select")

            line = item
            can.Option("line", index+1)
            can.Status("当前行", can.onexport.position(can, index+1))
        })

        typeof line == "object" && can.page.Select(can, line, "td.text", function(item) {
            can.current = {
                scroll: function(x, y) { return can.ui.profile.parentNode.scrollBy(x, y) },
                offset: function() { return can.ui.profile.parentNode.scrollTop },
                window: function() { return can.ui.profile.parentNode.offsetHeight },
                height: function() { return line.offsetHeight },

                prev: function() { return line.previousSibling },
                next: function() { return line.nextSibling },
                line: line, text: function(text) {
                    text != undefined && can.onaction.modifyLine(can, line, text)
                    return item.innerText
                },
            }

            var push = {path: can.Option("path"), file: can.Option("file"), line: can.Option("line")}
            can.core.Eq({path: push.path, file: push.file}, can.history[can.history.length-1]) || can.history.push(push)
            can.Status("跳转数", can.history.length)

            can.onkeymap && can.onkeymap.selectLine(can, line, item)
        })

        if (can.current) {
            var pos = can.current.offset()-can.current.line.offsetTop
            if (pos > 0 || -pos > can._output.offsetHeight) {
                can.current.scroll(0, -pos)
            }
        }
    },


    "返回": function(event, can) {
        var last = can.history.pop(); last = can.history.pop()
        last && can.onimport.tabview(can, last.path, last.file, last.line)
        can.Status("跳转数", can.history.length)
    },
    project: function(event, can) {
        can.page.Toggle(can, can.ui.project, function() {
            // can.onimport.project(can, can.Option("path"))
        })
    },
    searchShow: function(event, can) {
        can.page.Toggle(can, can.ui.search, function() {
            // can.onaction.searchLine(event, can, "")
        })
    },
    favorLine: function(can, value) {
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
    _selectLine: function(can, ui) {
        can.onkeymap && can.onkeymap._mode(can, "insert")
        can.onaction.selectLine(can, ui.tr)
        can.onkeymap && can.ui.editor.focus()
        // can.ui.editor.setSelectionRange(0, 0)
        // can.ui.editor.setSelectionRange(event.offsetX/10, event.offsetX/10)
    },
    _searchLine: function(can, ui, value) {
        var str = ui.text.innerText
        var s = document.getSelection().toString()
        var begin = str.indexOf(s)
        var end = begin+s.length

        for (var i = begin; i >= 0; i--) {
            if (str[i].match(/[a-zA-Z0-9_.]/)) {
                s = str.slice(i, end)
            } else {
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
    },
    searchLine: function(event, can, value) { value = value.trim()
        can.page.Modify(can, can.ui.search, {style: {display: ""}})
        value = can.ui.word.value = value || can.ui.word.value || "main"

        var toast = can.user.toast(can, "搜索中...", value, 1000000)
        can.run(event, ["action", "search", can.parse, value, can.Option("path")], function(msg) {
            toast.Close()

            can.ui.tags.innerHTML = ""
            can.onappend.table(can, msg, function(value, key, index, line) { can.Status("标签数", index+1)
                value = value.replace("<", "&lt;").replace(">", "&gt;"), value = value.replace("./", "")
                return {text: ["", "td"], list: [{text: [value, "div"]}], onclick: function(event) {
                    line.line && can.onimport.tabview(can, can.Option("path"), line.file.replace("./", ""), parseInt(line.line), function() {
                        can.onaction.selectLine(can, parseInt(line.line))
                    })
                }}
            }, can.ui.tags)
        }, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件数", "解析器", "文件名", "当前行", "跳转数", "标签数"],
    position: function(can, index, total) { total = total || can.max
        return (parseInt(index))+"/"+parseInt(total)+" = "+parseInt((index)*100/total)+"%"
    },
    content: function(can) {
        return can.page.Select(can, can._output, "table.content td.text", function(item) {
            return item.innerText
        }).join("\n")+"\n"
    },
})

