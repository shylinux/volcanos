Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) { target.innerHTML = ""
        if (can.user.Search(can, "share") && can.user.Search(can, "river") && can.user.Search(can, "storm")) {
            can.onaction.list = ["项目", "运行", "列表"]
            can.page.Modify(can, can._action, {style: {clear: "none"}})
            can.page.Select(can, can._option, "input[type=button]", function(item) {
                can.page.Remove(can, item)
            })
            can.Conf("height", can.Conf("height") + 64)
        }
        var width = can.Conf("width"), height = can.Conf("height")
        can.page.Modify(can, target, {style: {"max-height": height-160+"px"}})


        if (msg.key && msg.time && msg.key.length != msg.time.length) {
            msg.key && (msg.key = msg.key.slice(2))
        }
        msg.Option("_action") != "查看" && msg.Option("_action") != "打开" && can.onappend.table(can, target, "table", msg)

        can.ui = can.page.Append(can, target, [
            {view: ["project", "div"], style: {width: "80px", "max-height": height-180+"px"}},
            {view: ["profile", "div"]},

            {view: "preview", style: {width: "30px"}},
            {view: "content"}, {type: "code", list: [{view: ["display", "pre"]}]},

            {view: ["command", "textarea"], onkeydown: function(event) {
                can.onkeymap.parse(event, can, "command")
            }},
            {view: ["editor", "textarea"], onkeydown: function(event) {
                can.onkeymap.parse(event, can, "insert"), can.Timer(10, function() {
                    can.onaction.modifyLine(can, can.current, can.editor.value)
                })
            }, onblur: function(event) {
                can.onaction.modifyLine(can, can.current, can.editor.value)
            }, onclick: function(event) {
            }, ondblclick: function(event) {
                can.onkeymap._mode(can, "insert")
            }},
        ])

        msg.Option("path", can.Option("path"))
        msg.Option("name", can.Option("name"))
        msg.Option("key", can.Option("key"))
        can.tabview = {}, can.Timer(10, function() {
            can.onlayout._init(can)
            can.onsyntax._init(can, msg)
            can.onkeymap._init(can, "normal")
            can.onimport.project(can, can.Option("path"))
        })
        return typeof cb == "function" && cb(msg)
    },
    tabview: function(can, path, name) {
        can.user.Cookie(can, "path", path)
        can.user.Cookie(can, "name", name)
        can.Option("path", path)
        can.Option("name", name)
        can.Option("key", "")
        if (can.tabview[path+name]) { return can.onsyntax._init(can, can.tabview[path+name]) }

        can.run({}, [path, name], function(msg) {
            msg.Option("path", can.Option("path"))
            msg.Option("name", can.Option("name"))

            can.page.Append(can, can._action, [{view: ["file", "div", name], onclick: function(event) {
                can.onsyntax._init(can, msg)
            }, oncontextmenu: function(event) {
                can.onappend.carte(can, null, ["保存", "运行"])

            }}]), can.onsyntax._init(can, can.tabview[path+name] = msg)
        }, true)
    },
    project: function(can, path) { can.ui.project.innerHTML = ""
        can.Option("path", path)
        can.run({}, ["action", "project", path+"/"], function(res) { res.Table(function(value) {
            var title = can.core.List(["time", "size"], function(item) {
                return item + ": " + value[item]
            }).join("\n")

            can.page.Append(can, can.ui.project, [{text: [value.file, "div", "item"], title: title, onclick: function(event) {
                if (value.file.endsWith("/")) {
                    can.onimport.project(can, can.Option("path", can.base.Path(can.Option("path"), value.file)))
                } else {
                    can.onimport.tabview(can, can.Option("path"), can.Option("name", value.file))
                }
            }} ])
        }) }, true)
    },
}, ["/plugin/inner.css"])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) { can._msg = msg
        var file = can.base.Path(msg.Option("path"), msg.Option("name"))

        // option
        can.core.List(["path", "name"], function(item) {
            can.Option(item, msg.Option(item))
        })
        // action
        can.page.Select(can, can._action, "div.file", function(item) {
            item.innerText == msg.Option("name")? can.page.ClassList.add(can, item, "select"): can.page.ClassList.del(can, item, "select")
        })

        // caches
        can.core.List(["preview", "content", "display"], function(item) {
            can.Cache(can.file+item, can.ui[item], can.current)
        });
        // caches
        can.file = file; var cache = false; can.core.List(["preview", "content", "display"], function(item) {
            var p = can.Cache(can.file+item, can.ui[item]); if (p) { p.click(), cache = true }
        }); if (cache) { return }

        // remote
        can.parse = can.base.Ext(file)
        can.max = 0, can.core.List(can.ls = msg.Result().split("\n"), function(item) {
            can.onaction.appendLine(can, item)
        })

        // status
        can.Status("当前行", can.onexport.position(can, 0))
        can.Status("文件名", can.file), can.Status("解析器", can.parse)

        // plugin
        function init() {
            can.onkeymap._remote(null, can, "运行")
            typeof p.display == "object" && (
                p.display.height && can.page.Modify(can, can.ui.display, {style: {
                    "max-height": p.display.height,
                }})
            )
        }; var p = can.onsyntax[can.parse]; !p? can.run({}, ["action", "plug", can.Option("path"), can.Option("name")], function(msg) {
            can.onsyntax[can.parse] = p = can.base.Obj(msg.Result()), p.display && init()
        }, true): p.display && init()
    },
    parse: function(can, line) { var p = can.onsyntax[can.parse]
        function wrap(type, str) { return type? '<span class="'+type+'">'+str+'</span>': str }
        p && p.keyword && (line = can.core.List(can.core.Split(line, " ", p && p.split && p.split.operator || "{[()]}"), function(item, index, array) {
            item = typeof item == "object"? item: {text: item}
            p.word && (item = p.word(item, index, array))
            var text = item.text; var key = item.keyword||p.keyword[text]

            switch (item.type) {
                case "space": return text
                case "string": return wrap("string", item.left+text+item.right)
                default: return wrap(key, text)
            }
        }).join(""))

        p && p.prefix && can.core.Item(p.prefix, function(pre, type) {
            if (line.startsWith(pre)) { line = wrap(type, line) }
        })
        p && p.suffix && can.core.Item(p.suffix, function(pre, type) {
            if (line.endsWith(pre)) { line = wrap(type, line) }
        })
        return p && p.line? p.line(can, line): line
    },
    makefile: {
        split: {},
        prefix: {"#": "comment"},
        suffix: {":": "comment"},
        keyword: {
            "ifeq": "keyword",
            "ifneq": "keyword",
            "else": "keyword",
            "endif": "keyword",
        },
    },
    sh: {
        split: {
            operator: "{[(|)]}",
        },
        keyword: {
            "if": "keyword",
            "then": "keyword",
            "for": "keyword",
            "do": "keyword",
            "done": "keyword",

            "local": "keyword",
            "echo": "keyword",
            "kill": "keyword",
            "let": "keyword",
            "cd": "keyword",

            "xargs": "function",
            "date": "function",
            "find": "function",
            "grep": "function",
            "sed": "function",
            "awk": "function",
            "pwd": "function",
            "ps": "function",
            "ls": "function",
            "rm": "function",
            "go": "function",

            "export": "keyword",
            "source": "keyword",
            "require": "keyword",
        },
        prefix: {"#": "comment"},
        suffix: {"\x7B": "comment"},
        line: function(can, line) { return line },
    },
    vim: {
        split: {},
        keyword: {
            highlight: "keyword",
            syntax: "keyword",
        },
        prefix: {"\"": "comment"},
    },
    shy: {
        profile: true,
        keyword: {
            "chapter": "keyword",
            "label": "keyword",
        },
        split: {},
        line: function(can, line) { return line },
    },
    mod: {
        split: {},
        keyword: {
            "module": "keyword",
            "require": "keyword",
            "replace": "keyword",
            "=>": "keyword",
        },
        prefix: {"#": "comment"},
    },
    go: {
        split: {},
        keyword: {
            "package": "keyword",
            "import": "keyword",
            "func": "keyword",
            "var": "keyword",
            "type": "keyword",
            "struct": "keyword",
            "interface": "keyword",

            "if": "keyword",
            "else": "keyword",
            "for": "keyword",
            "range": "keyword",
            "break": "keyword",
            "continue": "keyword",
            "return": "keyword",
            "defer": "keyword",
            "switch": "keyword",
            "case": "keyword",
            "default": "keyword",
            "fallthrough": "keyword",
            "go": "keyword",
            "select": "keyword",

            "map": "datatype",
            "chan": "datatype",
            "string": "datatype",
            "error": "datatype",
            "bool": "datatype",
            "int": "datatype",

            "len": "datatype",
            "cap": "datatype",
            "copy": "datatype",
            "append": "datatype",

            "nil": "string",

            "m": "function",
            "msg": "function",
            "kit": "keyword",
        },
        prefix: {"//": "comment"},
    },
    js: {
        split: {
            space: " ",
            operator: "{[(.:,;!|)]}",
        },
        keyword: {
            "var": "keyword",
            "new": "keyword",
            "delete": "keyword",
            "typeof": "keyword",
            "function": "keyword",

            "if": "keyword",
            "else": "keyword",
            "for": "keyword",
            "while": "keyword",
            "break": "keyword",
            "continue": "keyword",
            "switch": "keyword",
            "case": "keyword",
            "default": "keyword",
            "return": "keyword",

            "window": "function",
            "console": "function",
            "document": "function",
            "arguments": "function",
            "event": "function",
            "Date": "function",
            "JSON": "function",

            "0": "string",
            "1": "string",
            "-1": "string",
            "true": "string",
            "false": "string",
            "undefined": "string",
            "null": "string",

            "__proto__": "function",
            "setTimeout": "function",
            "createElement": "function",
            "appendChild": "function",
            "removeChild": "function",
            "parentNode": "function",
            "childNodes": "function",

            "Volcanos": "function",
            "request": "function",
            "require": "function",

            "cb": "function",
            "cbs": "function",
            "shy": "function",
            "can": "function",
            "sub": "function",
            "msg": "function",
            "res": "function",
            "pane": "function",
            "plugin": "function",
        },
        prefix: {"//": "comment"},
        word: function(value, index, array) {
            var libs = {
                base: true,
                core: true,
                misc: true,
                page: true,
                user: true,
            }
            return array[index-2]=="can"&&array[index-1]=="."&&(libs[value]||libs[value.text])? {keyword: "function", text: value.text||value}: value
        },
    },

    png: {
        line: function(can, line) { return can.page.Format("img", "/share/local/"+line) }
    },
    m4v: {
        keymap: {
            j: function(event, can) {
                console.log("down")
            },
            k: function(event, can) {
            },
        },
        line: function(can, line) { var auto = true, loop = true
            var p = location.href.startsWith("https")? "": "http://localhost:9020"
            var total = 0
            function cb(event) { console.log(event) }
            return {className: "preview", type: "video", style: {
                height: can.Conf("height")-160+"px", width: can.Conf("width")-160+"px"},
                data: {src: p+"/share/local/"+line, controls: "controls", autoplay: auto, loop: loop},
                oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
                onloadedmetadata: function(event) {
                    total = event.timeStamp
                    event.target.currentTime = can._msg.currentTime || 0
                }, onloadeddata: cb, ontimeupdate: function(event) {
                    can.Status("当前行", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
                },
            }
        },
    },
    url: {
        line: function(can, line) { var auto = true, loop = true
            var total = 0
            function cb(event) { console.log(event) }
            return {className: "preview", type: "video", style: {
                height: can.Conf("height")-160+"px", width: can.Conf("width")-160+"px"},
                data: {src: line, controls: "controls", autoplay: auto, loop: loop},
                oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
                onloadedmetadata: function(event) {
                    total = event.timeStamp
                    event.target.currentTime = can._msg.currentTime || 0
                }, onloadeddata: cb, ontimeupdate: function(event) {
                    can.Status("当前行", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
                },
            }
        },
    },
    jpg: {
        keymap: {
        },
        line: function(can, line) { return can.page.Format("img", "/share/local/"+line) }
    },
})
Volcanos("onkeymap", {help: "键盘交互", list: ["command", "normal", "insert"], _init: function(can, mode) {
        can.page.Modify(can, can.ui.command, {style: {display: "none", width: can._target.offsetWidth-20+"px"}})

        can.history = [], can.editor = can.ui.editor
        can.core.List(can.onkeymap.list, function(item) { var engine = {}
            can.core.Item(can.onkeymap[item], function(key, cb) { var map = engine
                for (var i = key.length-1; i > -1; i--) {
                    map = map[key[i]] = i == 0? cb: (map[key[i]]||{})
                }
            }), can.onkeymap[item]._engine = engine
        }), can.onkeymap._mode(can, mode||"normal")
    },
    _mode: function(can, value) { can.Status("输入法", can.mode = value)
        can.ui.editor.className = "editor "+can.mode
        can.Action("mode", can.mode)
        return value
    },
    _command: function(can) { can.onkeymap._mode(can, "command")
        can.page.Modify(can, can.ui.command, {value: "", style: {display: "block"}})
        can.ui.command.focus()
    },
    _normal: function(can) { can.onkeymap._mode(can, "normal") },
    _insert: function(can) { can.onkeymap._mode(can, "insert") },

    _remote: function(event, can, key, arg, cb) { can.ui.display.innerHTML = "", can.ui.profile.innerHTML = ""
        var p = can.onsyntax[can.parse]
        can.display = p && p.profile && can.ui.profile || can.ui.display
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, arg||["action", key, can.Option("path"), can.Option("name")], cb||function(msg) {
            if (msg.key && msg.time && msg.key.length != msg.time.length) {
                msg.key && (msg.key = msg.key.slice(2))
            }
            can.page.Modify(can, can.display, {innerHTML: "", style: {display: "block"}})
            can.onappend.table(can, can.display, "table", msg)
            can.onappend.board(can, can.display, "board", msg)
        }, true)
    },
    _engine: {
        w: function(event, can) { can.onkeymap._remote(event, can, "保存") },
        e: function(event, can, line, ls) { ls = ls[1].split("/")
            can.onimport.tabview(can, ls.slice(0, -1).join("/"), ls.slice(-1).join(""))
        },
        r: function(event, can) { can.onkeymap._remote(event, can, "运行") },

        commit: function(event, can) { can.onkeymap._remote(event, can, "提交") },
        history: function(event, can) { can.onkeymap._remote(event, can, "历史") },
    },

    parse: function(event, can, mode) {
        event.key.length == 1 && can.history.push(event.key); if (can.mode != mode) {
            event.stopPropagation(), event.preventDefault()
        }; can.mode != "command" && can.Status("输入值", can.history.join())

        for (var pre = 0; pre < can.history.length; pre++) {
            if ("0" <= can.history[pre] && can.history[pre] <= "9") { continue } break
        }; can.count = parseInt(can.history.slice(0, pre).join(""))

        var p = can.onsyntax[can.parse]
        var cb = (p&&p.keymap||can.onkeymap[can.mode])[event.key]; if (typeof cb == "function") {
            return cb(event, can, can.count), can.history = []
        }

        var map = can.onkeymap[can.mode]._engine; for (var i = can.history.length-1; i > pre-1; i--) {
            var cb = map[can.history[i]]; if (typeof cb == "function") {
                return cb(event, can, can.count), can.history = []
            }; if (typeof cb == "object") { map = cb; continue }; break
        }
    },
    command: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.page.Modify(can, can.ui.command, {style: {display: "none"}})
            can.editor.focus()
        },
        Enter: function(event, can) { can.onkeymap._normal(can)
            var line = can.ui.command.value
            var ls = can.core.Split(line, " ", ",", {simple: true})
            var cb = can.onkeymap._engine[ls[0]]
            typeof cb == "function"? cb(event, can, line, ls): can.onkeymap._remote(event, can, line, ls)

            can.onkeymap.command.Escape(event, can)
        },
        jk: function(event, can) { can.history = can.history.slice(0, -1)
            can.onkeymap.command.Enter(event, can)
        },
    },
    normal: {
        ":": function(event, can) { can.onkeymap._command(can) },

        h: function(event, can) {
            can.editor.setSelectionRange(can.editor.selectionStart-1, can.editor.selectionStart-1)
        },
        l: function(event, can) {
            can.editor.setSelectionRange(can.editor.selectionStart+1, can.editor.selectionStart+1)
        },
        j: function(event, can, count) { count = count || 1
            for (var i = 0; i < count; i++) {
                var pos = can.current.offsetTop-can._target.scrollTop
                can.onaction.selectLine(can, can.current.nextSibling)
                if (pos > 22*15) {
                    can._target.scrollBy(0, 22)
                }
            }
        },
        k: function(event, can, count) { count = count || 1
            for (var i = 0; i < count; i++) {
                var pos = can.current.offsetTop-can._target.scrollTop
                can.onaction.selectLine(can, can.current.previousSibling)
                if (pos < 22*5) {
                    can._target.scrollBy(0, -22)
                }
            }
        },
        gg: function(event, can, count) { count = count || 1
            can.onaction.selectLine(can, count - 1)
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*5)
        },
        G: function(event, can, count) { count = count || can.max
            can.onaction.selectLine(can, count - 1)
            can.current.scrollIntoView()
            if (count - can.max < -5) {
                can._target.scrollBy(0, -22*5)
            }
        },
        zt: function(event, can, count) { count = count || 2
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*count)
        },
        zz: function(event, can, count) { count = count || 5
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*count)
        },
        zb: function(event, can, count) { count = count || 3
            can._target.scrollBy(0, -(can._target.offsetHeight - (can.current.offsetTop - can._target.scrollTop))+22*count)
        },

        i: function(event, can) { can.onkeymap._insert(can)
        },
        I: function(event, can) { can.onkeymap._insert(can)
            can.editor.setSelectionRange(0, 0)
        },
        o: function(event, can) { can.onkeymap._insert(can)
            can.onaction.insertLine(can, can.current).click()
        },
        O: function(event, can) { can.onkeymap._insert(can)
            can.onaction.insertLine(can, can.current, "", true).click()
        },

        yy: function(event, can) { can.last = can.current.innerText
        },
        dd: function(event, can, count) { count = count || 1
            for (var i = 0; i < count; i++) {
                can.last = can.current.innerText
                var next = can.current.nextSibling || can.current.previousSibling
                can.onaction.deleteLine(can, can.current)
                next.click()
            }
        },
        p: function(event, can, count) { count = count || 1
            for (var i = 0; i < count; i++){
                var last = can.onaction.insertLine(can, can.current, can.last)
            }
            last.click()
        },
        P: function(event, can) {
            can.onaction.insertLine(can, can.current, can.last, true).click()
        },
    },
    insert: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.onaction.modifyLine(can, can.current, can.editor.value)
        },
        Enter: function(event, can) {
            can.onaction.modifyLine(can, can.current, can.editor.value)
            can.onaction.insertLine(can, can.current, "", event.shiftKey).click()
            event.stopPropagation(), event.preventDefault()
        },
        Backspace: function(event, can) {
            can.editor.selectionStart == 0 && can.onaction.mergeLine(can, can.current.previousSibling).click()
        },
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.nextSibling)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.previousSibling)
        },
        jk: function(event, can) { can.onkeymap._normal(can)
            can.page.DelText(can.editor, can.editor.selectionStart-1, 1)
            can.onaction.modifyLine(can, can.current, can.editor.value)
            event.stopPropagation(), event.preventDefault()
        },
    },
})
Volcanos("onaction", {help: "控件交互", list: ["", "项目", "", "上传", "保存", "运行", "日志", "", "提交", "历史", "记录", "复盘", "", "收藏", "列表", "搜索", "推荐"],
    modifyLine: function(can, target, value) { var p = can.onsyntax.parse(can, value)
        typeof p == "object"? can.page.Appends(can, target, [p]): target.innerHTML = p
    },
    deleteLine: function(can, target) { can.page.Remove(can, target)
        var ls = can.page.Select(can, can.ui.preview, "div.item")
        can.page.Remove(can, ls[ls.length-1]), can.max--
    },
    selectLine: function(can, target) { if (target !== 0 && !target) { return }
        can.page.Select(can, can.ui.content, "pre.item", function(item, index) { if (item != target && index != target) { return }
            target = item, can.Status("当前行", can.onexport.position(can, index))
            can.page.Select(can, can.ui.preview, "div.item", function(item, i) {
                can.page.ClassList[index==i? "add": "del"](can, item, "select")
            })
        }); if (typeof target != "object") { return }; can.current = target

        can.page.Modify(can, can.editor, {className: "editor "+can.mode, value: can.current.innerText, style: {
            height: target.offsetHeight+"px", width: target.offsetWidth+"px",
            top: (target.offsetTop)+"px", display: "block",
        }}), can.editor.focus()

        can.page.Modify(can, can.ui.command, {value: can.current.innerText, style: {
            height: target.offsetHeight+"px", width: target.offsetWidth+"px",
        }})
    },
    appendLine: function(can, value) { var index = can.max++
        can.page.Append(can, can.ui.preview, [{view: ["item", "div", index+1], onclick: function(event) {
            can.onaction.selectLine(can, index)
        }}])
        var p = can.onsyntax.parse(can, value||"")
        var line = can.page.Append(can, can.ui.content, [typeof p == "object"? p: {view: ["item", "pre", p], onclick: function(event) {
            can.onaction.selectLine(can, line)
        }}]).last
        return line
    },
    insertLine: function(can, target, value, before) {
        var line = can.onaction.appendLine(can, value)
        can.ui.content.insertBefore(line, before && target || target.nextSibling)
        return line
    },
    mergeLine: function(can, target) { if (!target) {return}
        can.onaction.modifyLine(can, target, target.innerHTML + target.nextSibling.innerHTML)
        can.onaction.deleteLine(can, target.nextSibling)
        return target
    },

    "项目": function(event, can) { can.onlayout.project(can) },
    "上传": function(event, can) { can.onappend.upload(can) },
    "搜索": function(event, can) { can.onkeymap._remote(event, can, "搜索", ["action", "find", "vim.history", "", "id", "type", "name", "text"]) },
    "记录": function(event, can) { var sub = can.request(event)
        can.core.Item(can.Option(), sub.Option)
        sub.Option("display", can.display.innerText)
        can.onkeymap._remote(event, can, "记录", ["action", "记录"])
    },
    "收藏": function(event, can) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "copy" }, function (response) {
                var win = chrome.extension.getBackgroundPage();
                win.can.user.toast(response.src)
                can.run(event, ["action", "favor", "url.favor", "spide", response.title, response.src, "poster", response.poster], function(msg) {
                    alert(response.title)
                }, true)
            })
        })
    },
    "列表": function(event, can) { can.onkeymap._remote(event, can, "收藏", ["action", "favor", "url.favor"]) },
})
Volcanos("ondetail", {help: "菜单交互", list: ["保存", "运行", "提交", "记录", "删除行", "合并行", "插入行", "添加行", "追加行"],
    "删除行": function(event, can, msg) {
        can.onaction.deleteLine(can, can.current)
    },
    "合并行": function(event, can, msg) {
        can.onaction.mergeLine(can, can.current)
    },
    "插入行": function(event, can, msg) {
        can.onaction.insertLine(can, can.current, "", true)
    },
    "添加行": function(event, can, msg) {
        can.onaction.insertLine(can, can.current)
    },
    "追加行": function(event, can, msg) {
        can.onaction.appendLine(can)
    },
})
Volcanos("onlayout", {help: "页面布局", list: [], _init: function(can) {
        can.onlayout.project(can)
        can.onlayout.project(can)
    },
    project: function(can) { var hide = can.ui.project.style.display == "none"
        var width = 80, height = 480;
        can.page.Modify(can, can.ui.project, {style: {width: width, "max-height": height, display: hide? "": "none"}})

        var style = {style: {
            "margin-left": hide? width: 0,
        }}; can.page.Modify(can, can.ui.preview, style)

        var style = {style: {
            "margin-left": hide? width+30: 30,
        }}; can.page.Modify(can, can.ui.content, style)

        can.page.Modify(can, can.ui.display, style)
        can.page.Modify(can, can.ui.command, style)
        can.page.Modify(can, can.ui.editor, style)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["输入法", "输入值", "文件名", "解析器", "当前行", "ncmd"],
    content: function(can) {
        return can.page.Select(can, can._output, "div.content>pre.item", function(item) {
            return can.current == item? can.editor.value: item.innerText
        }).join("\n")
    },
    position: function(can, index, total) { total = total || can.max
        return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+"/"+parseInt(total)
    },
})

