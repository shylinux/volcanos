Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) {
        can.ui = can.page.Appends(can, target, [
            {view: "project", style: {display: "none"}},
            {view: "profile", list: [
                {view: "preview"}, {view: "content"}
            ]},
            {view: ["display", "pre"]},
            {view: "search", style: {display: "none"}},
        ])

        can.tabview = {}, can.history = []
        can.tabview[can.Option("path")+can.Option("file")] = msg
        msg.Option({path: can.Option("path"), file: can.Option("file"), line: can.Option("line")||1})
        can.onimport.tabview(can, can.Option("path"), can.Option("file"), can.Option("line"))
        return typeof cb == "function" && cb(msg)
    },

    tabview: function(can, path, file, line) {
        var push = {path: path, file: file, line: line}
        !can.core.Eq(can.history[can.history.length-1], push) && can.history.push(push)

        function show() {
            can._msg && can._msg.Option("line", can.Option("line"))
            can._msg = can.tabview[path+file]

            can.Option({path: path, file: file, line: line||parseInt(can._msg.Option("line"))})
            can.file = file, can.parse = can.base.Ext(file), can.max = 0
            can.onsyntax._init(can, can._msg)

            var width = can._target.offsetWidth - can.ui.project.offsetWidth - can.ui.preview.offsetWidth - 20
            can.Status("当前行", can.onexport.position(can, parseInt(can.Option("line")))-1)
            can.page.Modify(can, can.ui.content, {style: {"max-width": width+"px"}})
        }
        if (can.tabview[path+file]) { return show() }

        can.run({}, ["action", "render", can.base.Ext(file), file, path], function(msg) {
            msg.Option({path: path, file: file, line: line||1})
            can.tabview[path+file] = msg

            can.page.EnableDrop(can, can._action, "div.file", can.page.Append(can, can._action, [{view: ["file", "div", file], onclick: function(event) {
                can.onimport.tabview(can, path, file)
            }}]).first).click()
        }, true)
    },
    project: function(can, path) { can.Option({path: path})
        var msg = can.request({}); msg.Option("dir_deep", "true")
        can.run(msg._event, ["action", "render", "dir", "", path+"/"], function(msg) { can.ui.project.innerHTML = ""
            can.onappend.tree(can, msg, can.ui.project, function(event, value) {
                can.onimport.tabview(can, can.Option("path"), value.path)
            })
        }, true)
    },
}, ["/plugin/local/code/inner.css"])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) { can._msg = msg
        can.page.Select(can, can._action, "div.file", function(item) {
            item.innerText == msg.Option("file")? can.page.ClassList.add(can, item, "select"):
                can.page.ClassList.del(can, item, "select")
        })

        // caches save
        can.core.List(["preview", "content", "display"], function(item) {
            can.Cache(can.file+item, can.ui[item], can.ui.profile.scrollTop)
        })
        // caches load
        can.file = can.base.Path(msg.Option("path"), msg.Option("file"))
        var cache = false; can.core.List(["preview", "content", "display"], function(item) {
            var p = can.Cache(can.file+item, can.ui[item]); if (!cache && p != undefined) { can.ui.profile.scrollTo(0, p); cache = true }
        }); if (cache) { return }


        function init(p) {
            can.core.List(can.ls = msg.Result().split("\n"), function(item) {
                can.onaction.appendLine(can, item)
            })
            can.onaction.selectLine(can, can.Option("line")||1)

            can.Status("文件名", can.file), can.Status("解析器", can.parse)
            can.Status("当前行", can.onexport.position(can, 0))
        }

        // plugin
        can.parse = can.base.Ext(can.file), can.max = 0
        var p = can.onsyntax[can.parse]; !p? can.run({}, ["action", "plugin", can.parse, can.Option("file"), can.Option("path")], function(msg) {
            init(p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()))
        }, true): init(p)
    },
    _parse: function(can, line) { line = line.replace("<", "&lt;").replace(">", "&gt;")
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

    makefile: {
        prefix: {"#": "comment"},
        suffix: {":": "comment"},
        keyword: {
            "ifeq": "keyword",
            "ifneq": "keyword",
            "else": "keyword",
            "endif": "keyword",
        },
    },
    shy: {
        prefix: {"#": "comment"},
        profile: true,
        keyword: {
            "chapter": "keyword",
            "label": "keyword",
        },
    },
    json: {link: "js"},
    css: {
        suffix: {"": "comment"},
    },
    html: {
        split: {
            space: " ",
            operator: "<>",
        },
        keyword: {
            "head": "keyword",
            "body": "keyword",
        },
    },

    url: {
        line: function(can, line) {
            return {button: [line, function(event) {
                can.page.Appends(can, can.ui.display, [{type: "iframe", data: {src: line}, style: {
                    height: "600px", width: can.Conf("width")-80+"px",
                }}])
            }]}
        }
    },
    svg: {
        display: true,
        show: function(can) {
            can.page.Append(can, can.ui.display, can.core.List(can._msg.result, function(line) {
                return {type: "iframe", data: {src: "/share/local/"+line}, style: {width: can.Conf("width")-80+"px"}}
            }))
        }
    },
    png: {
        display: true,
        show: function(can) {
            can.page.Append(can, can.ui.display, can.core.List(can._msg.result, function(line) {
                return {img: "/share/local/"+line, height: 400}
            }))
        }
    },
    jpg: {
        display: true,
        show: function(can) {
            can.page.Append(can, can.ui.display, can.core.List(can._msg.result, function(line) {
                return {img: "/share/local/"+line, height: 400}
            }))
        }
    },
    m4v: {
        line: function(can, line) { var auto = true, loop = true, total = 0
            var p = location.href.startsWith("https")? "": "http://localhost:9020"
            function cb(event) { console.log(event) }
            can.page.Modify(can, can._target, {style: {"min-height": can.Conf("height")-160}})
            return {className: "preview", type: "video", style: {height: can.Conf("height")-160+"px", width: can._target.offsetWidth-160+"px"},
                data: {src: p+"/share/local/"+line, controls: "controls", autoplay: auto, loop: loop},
                oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
                onloadedmetadata: function(event) { total = event.timeStamp
                    event.target.currentTime = can._msg.currentTime || 0
                }, onloadeddata: cb, ontimeupdate: function(event) {
                    can.Status("当前行", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
                },
            }
        },
    },
})
Volcanos("onaction", {help: "控件交互", list: ["运行", "项目", "搜索"],
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
    "项目": function(event, can) { var hide = can.ui.project.style.display == "none"
        can.page.Modify(can, can.ui.project, {style: {display: hide? "": "none"}})
        var width = can._target.offsetWidth - can.ui.project.offsetWidth - can.ui.preview.offsetWidth - 120
        can.page.Modify(can, can.ui.content, {style: {"max-width": hide? width+"px": ""}})
        hide && can.onimport.project(can, can.Option("path"))
    },
    "搜索": function(event, can) { var hide = can.ui.search.style.display == "none"
        can.page.Modify(can, can.ui.search, {style: {display: hide? "": "none"}})
        hide && can.onaction.searchLine(event, can, "")
    },

    appendLine: function(can, value) { var index = can.max++
        can.page.Append(can, can.ui.preview, [{view: ["item", "div", index+1], onclick: function(event) {
            can.onaction.selectLine(can, index)
        }}])
        var line = can.page.Append(can, can.ui.content, [{view: ["item", "pre", ""], onclick: function(event) {
            can.onaction.selectLine(can, line)
        }, ondblclick: function(event) {
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
        }}]).first; value && can.onaction.modifyLine(can, line, value)
        return line
    },
    modifyLine: function(can, target, value) { var p = can.onsyntax._parse(can, value)
        typeof p == "object"? can.page.Appends(can, target, [p]): target.innerHTML = p
    },
    selectLine: function(can, target) { if (target !== 0 && !target) { return }
        can.page.Select(can, can.ui.content, "pre.item", function(item, index) {
            can.page.ClassList.del(can, item, "select")
            if (item != target && index+1 != target) { return }
            can.page.ClassList.add(can, item, "select")
            can.Option("line", index+1)

            target = item, can.Status("当前行", can.onexport.position(can, index))
            can.page.Select(can, can.ui.preview, "div.item", function(item, i) {
                can.page.ClassList[index==i? "add": "del"](can, item, "select")
            })
        }); if (typeof target != "object") { return }; can.current = target
        if (target.offsetTop < can.ui.profile.scrollTop || target.offsetTop > can.ui.profile.scrollTop+can.ui.profile.offsetHeight) {
            can.ui.profile.scrollTo(0, target.offsetTop-160)
        }
        return

        can.page.Modify(can, can.editor, {className: "editor "+can.mode, value: can.current.innerText, style: {
            height: target.offsetHeight, width: target.offsetWidth,
            left: target.offsetLeft, top: target.offsetTop,
            display: "block",
        }}), can.editor.focus()

        can.page.Modify(can, can.ui.command, {style: {
            height: target.offsetHeight, width: target.offsetWidth,
            left: target.offsetLeft,
        }})
    },
    searchLine: function(event, can, value) { can.ui.search.innerHTML = "", value = value.trim()
        can.page.Modify(can, can.ui.search, {style: {display: ""}})
        var ui = can.page.Append(can, can.ui.search, [{view: "action", list: [
            {input: ["word", function(event) {
                if (event.key == "Enter") {
                    can.onaction.searchLine(event, can, ui.word.value)
                }
            }], onfocus: function(event) {
                event.target.setSelectionRange(0, -1)
            }, value: value||"main"},
            {button: ["搜索", function(event) {
                can.onaction.searchLine(event, can, ui.word.value)
            }]},
            {button: ["返回", function(event) {
                var last = can.history.pop(); last = can.history.pop()
                last && can.onimport.tabview(can, last.path, last.file, last.line)
            }]},
            {button: ["关闭", function(event) {
                can.page.Modify(can, can.ui.search, {style: {display: "none"}})
            }]},
        ]}])

        var msg = can.request(event); msg.Option("_path", can.Option("path"))
        value && can.run(event, ["action", "search", can.parse, value, ""], function(msg) {
            can.onappend.table(can, can.ui.search, "table", msg, function(value, key, index, line) {
                value = value.replace("<", "&lt;").replace(">", "&gt;")
                value = value.replace("./", "")
                can.Status("标签数", index+1)
                return {text: ["", "td"], list: [{text: [value, "div"]}], onclick: function(event) {
                    line.line && can.onimport.tabview(can, can.Option("path"), line.file.replace("./", ""), parseInt(line.line))
                }}
            })
            can.page.Select(can, can.ui.search, "tr", function(item, index) {
                index == 1 && can.page.Select(can, item, "td", function(item, index) {
                    index == 0 && item.click()
                })
            })
        }, true)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["文件名", "解析器", "当前行", "标签数"],
    position: function(can, index, total) { total = total || can.max
        return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+"/"+parseInt(total)
    },
    content: function(can) {
        return can.page.Select(can, can._output, "div.content>pre.item", function(item) {
            return can.current == item? can.editor.value: item.innerText
        }).join("\n")
    },
})

