Volcanos("onimport", {help: "导入数据", _init: function(can, msg, list, cb, target) { target.innerHTML = ""
        if (can.Conf("height") < 600) { can.Conf("height", 600) }
        can.onimport._share(can); var width = can.Conf("width"), height = can.Conf("height")
        can.page.Modify(can, target, {style: {"max-height": height-160+"px"}})

        can.onappend.table(can, target, "table", msg), can.ui = can.page.Append(can, target, [
            {view: "project"}, {view: "profile"},
            {view: "preview"}, {view: "content"},

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
            {view: ["command", "textarea"], onkeydown: function(event) {
                can.onkeymap.parse(event, can, "command")
            }},
            {type: "code", list: [{view: ["display", "pre"]}]},
        ])

        msg.Option("path", can.Option("path"))
        msg.Option("file", can.Option("file"))
        msg.Option("key", can.Option("key"))
        can.tabview = {}, can.Timer(10, function() {
            can.onimport.project(can, can.Option("path"))
            can.onsyntax._init(can, msg)
            can.onkeymap._init(can)
            can.onlayout._init(can)
        })
        return typeof cb == "function" && cb(msg)
    },
    _share: function(can) {
        if (can.user.Search(can, "share") && can.user.Search(can, "river") && can.user.Search(can, "storm")) {
            can.page.Select(can, can._option, "input[type=button]", function(item) {
                can.page.Remove(can, item)
            })
            can.onaction.list = ["项目", "运行", "列表"]
            can.Conf("height", can.Conf("height") + 64)
        }
    },
    tabview: function(can, path, file) { can.Option({path: path, file: file, key: ""})
        if (can.tabview[path+file]) { return can.onsyntax._init(can, can.tabview[path+file]) }
        can.run({}, [path, file], function(msg) {
            msg.Option({path: can.Option("path"), file:  can.Option("file")})
            can.page.Append(can, can._action, [{view: ["file", "div", file], onclick: function(event) {
                can.onsyntax._init(can, can.tabview[path+file] = msg)
                can.Option({path: path, file: file, key: ""})
            }, ondblclick: function(event) {
                can.onkeymap._remote(event, can, "运行")
            }, oncontextmenu: function(event) {
                can.onappend.carte(can, null, ["保存", "运行"])
            }}]).first.click()
        }, true)
    },
    project: function(can, path) { can.Option({path: path}), can.ui.project.innerHTML = ""
        can.run({}, ["action", "project", path+"/"], function(res) { res.Table(function(value) {
            var title = can.core.List(["time", "size"], function(item) { return item + ": " + value[item] }).join("\n")
            can.page.Append(can, can.ui.project, [{text: [value.file, "div", "item"], title: title,
                onclick: function(event) {
                    value.file.endsWith("/")? can.onimport.project(can, can.base.Path(can.Option("path"), value.file)):
                        can.onimport.tabview(can, can.Option("path"), value.file)
                },
                ondblclick: function(event) {
                    can.onkeymap._remote(event, can, "运行", ["action", "运行", path, value.file])
                },
            }])
        }) }, true)
    },
}, ["/plugin/local/code/inner.css"])
Volcanos("onsyntax", {help: "语法高亮", list: ["keyword", "prefix", "line"], _init: function(can, msg) { can._msg = msg
        // action
        can.page.Select(can, can._action, "div.file", function(item) {
            item.innerText == msg.Option("file")? can.page.ClassList.add(can, item, "select"):
                can.page.ClassList.del(can, item, "select")
        })

        // caches save
        can.core.List(["preview", "content", "display"], function(item) {
            can.Cache(can.file+item, can.ui[item], can.current)
        });
        // caches load
        can.file = can.base.Path(msg.Option("path"), msg.Option("file"))
        var cache = false; can.core.List(["preview", "content", "display"], function(item) {
            var p = can.Cache(can.file+item, can.ui[item]); if (!cache && p) { p.click(), cache = true }
        }); if (cache) { return }

        // remote
        can.parse = can.base.Ext(can.file), can.max = 0, can.core.List(can.ls = msg.Result().split("\n"), function(item) {
            can.onaction.appendLine(can, item)
        })

        // status
        can.Status("文件名", can.file), can.Status("解析器", can.parse)
        can.Status("当前行", can.onexport.position(can, 0))

        // plugin
        function init(p) { p.display && can.onkeymap._remote({}, can, "运行")
            typeof p.display == "object" && ( p.display.height && can.page.Modify(can, can.ui.display, {style: {
                "max-height": p.display.height,
            }}))
        }; var p = can.onsyntax[can.parse]; !p? can.run({}, ["action", "plug", can.Option("path"), can.Option("file")], function(msg) {
            p = can.onsyntax[can.parse] = can.base.Obj(msg.Result()), can.onsyntax._init(can, can._msg), init(p)
        }, true): init(p)
    },
    parse: function(can, line) { var p = can.onsyntax[can.parse]; if (!p) { return }
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
            if (line.startsWith(pre)) { line = wrap(type, line) }
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
    sh: {
        prefix: {"#": "comment"},
        suffix: {"\x7B": "comment"},
        keyword: {
            "export": "keyword",
            "source": "keyword",
            "require": "keyword",

            "if": "keyword",
            "then": "keyword",
            "fi": "keyword",
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
        },
    },
    vim: {
        prefix: {"\"": "comment"},
        keyword: {
            highlight: "keyword",
            syntax: "keyword",
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
    mod: {
        prefix: {"#": "comment"},
        keyword: {
            "module": "keyword",
            "require": "keyword",
            "replace": "keyword",
            "=>": "keyword",
        },
    },
    go: {
        prefix: {"//": "comment"},
        keyword: {
            "package": "keyword",
            "import": "keyword",
            "const": "keyword",
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
            "switch": "keyword",
            "case": "keyword",
            "default": "keyword",
            "fallthrough": "keyword",

            "return": "keyword",
            "defer": "keyword",
            "go": "keyword",
            "select": "keyword",

            "map": "datatype",
            "chan": "datatype",
            "string": "datatype",
            "error": "datatype",
            "bool": "datatype",
            "int": "datatype",

            "len": "function",
            "cap": "function",
            "copy": "function",
            "append": "function",

            "nil": "string",

            "m": "function",
            "msg": "function",
            "kit": "keyword",
        },
    },
    js: {
        split: {
            space: " ",
            operator: "{[(.:,;!|)]}",
        },
        prefix: {"//": "comment"},
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
            "10": "string",
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
        word: function(value, index, array) {
            var libs = {base: true, core: true, misc: true, page: true, user: true}
            return array[index-2]=="can"&&array[index-1]=="."&&(libs[value]||libs[value.text])? {keyword: "function", text: value.text||value}: value
        },
    },

    png: {
        line: function(can, line) { return can.page.Format("img", "/share/local/"+line) }
    },
    jpg: {
        line: function(can, line) { return can.page.Format("img", "/share/local/"+line) }
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
    url: {
        line: function(can, line) { var auto = true, loop = true, total = 0
            function cb(event) { console.log(event) }
            return {className: "preview", type: "video", style: {height: can.Conf("height")-160+"px", width: can.Conf("width")-160+"px"},
                data: {src: line, controls: "controls", autoplay: auto, loop: loop},
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
    _mode: function(can, value) { can.Action("mode", can.mode = value)
        can.page.Modify(can, can.ui.editor, {className: "editor "+can.mode, style: {display: "none"}})
        can.page.Modify(can, can.ui.command, {className: "command "+can.mode, style: {display: "none"}})
        return value
    },
    _command: function(can) { can.onkeymap._mode(can, "command")
        can.page.Modify(can, can.ui.command, {value: "", style: {display: "block"}})
        can.ui.command.focus()
    },
    _normal: function(can) { can.onkeymap._mode(can, "normal") },
    _insert: function(can) { can.onkeymap._mode(can, "insert") },

    _remote: function(event, can, key, arg, cb) { can.ui.display.innerHTML = "", can.ui.profile.innerHTML = ""
        var p = can.onsyntax[can.parse]; can.display = p && p.profile && can.ui.profile || can.ui.display

        can.page.Modify(can, can.display, {innerHTML: "", style: {display: "none"}})
        var msg = can.request(event); msg.Option("content", can.onexport.content(can))
        can.run(event, arg||["action", key, can.Option("path"), can.Option("file")], cb||function(msg) {
            (msg.Result() || msg.append && msg.append.length > 0) && can.page.Modify(can, can.display, {innerHTML: "", style: {display: "block"}})
            can.onappend.table(can, can.display, "table", msg)
            can.onappend.board(can, can.display, "board", msg)
        }, true)
    },
    _engine: {
        w: function(event, can) { can.onkeymap._remote(event, can, "保存") },
        e: function(event, can, line, ls) { ls = ls[1].split("/")
            can.onimport.tabview(can, ls.slice(0, -1).join("/")||can.Option("path"), ls.slice(-1).join(""))
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
        }; can.count = parseInt(can.history.slice(0, pre).join(""))||1

        function repeat(cb, count) {
            for (var i = 1; i <= count; i++) { if (cb(event, can, count)) { break } }; can.history = []
        }

        var p = can.onsyntax[can.parse]
        var cb = (p && p.keymap || can.onkeymap[can.mode])[event.key]; if (typeof cb == "function") {
            return repeat(cb, can.count)
        }

        var map = can.onkeymap[can.mode]._engine; for (var i = can.history.length-1; i > pre-1; i--) {
            var cb = map[can.history[i]]; if (typeof cb == "function") {
                return repeat(cb, can.count)
            }; if (typeof cb == "object") { map = cb; continue }; break
        }
    },
    command: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.current.click()
        },
        Enter: function(event, can) { var line = can.ui.command.value; var ls = can.core.Split(line, " ", ",", {simple: true})
            var cb = can.onkeymap._engine[ls[0]]; typeof cb == "function"? cb(event, can, line, ls):
                can.onkeymap._remote(event, can, line, ["action", "cmd"].concat(ls))
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
        j: function(event, can) { can.onaction.selectLine(can, can.current.nextSibling)
            var pos = can.current.offsetTop-can._target.scrollTop; if (pos > 22*15) {
                can._target.scrollBy(0, 22)
            }
        },
        k: function(event, can) { can.onaction.selectLine(can, can.current.previousSibling)
            var pos = can.current.offsetTop-can._target.scrollTop; if (pos < 22*5) {
                can._target.scrollBy(0, -22)
            }
        },

        gg: function(event, can, count) { count = count || 1
            can.onaction.selectLine(can, count - 1)
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*5)
            return true
        },
        G: function(event, can, count) { count = count || can.max
            can.onaction.selectLine(can, count - 1)
            can.current.scrollIntoView()
            if (count - can.max < -5) {
                can._target.scrollBy(0, -22*5)
            }
            return true
        },
        zt: function(event, can, count) { count = count || 2
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*count)
            return true
        },
        zz: function(event, can, count) { count = count || 5
            can.current.scrollIntoView()
            can._target.scrollBy(0, -22*count)
            return true
        },
        zb: function(event, can, count) { count = count || 3
            can._target.scrollBy(0, -(can._target.offsetHeight - (can.current.offsetTop - can._target.scrollTop))+22*count)
            return true
        },

        i: function(event, can) { can.onkeymap._insert(can)
        },
        I: function(event, can) { can.onkeymap._insert(can)
            can.editor.setSelectionRange(0, 0)
        },
        a: function(event, can) { can.onkeymap._insert(can)
        },
        A: function(event, can) { can.onkeymap._insert(can)
            can.editor.setSelectionRange(-1, -1)
        },
        o: function(event, can) { can.onkeymap._insert(can)
            can.onaction.insertLine(can, can.current).click()
        },
        O: function(event, can) { can.onkeymap._insert(can)
            can.onaction.insertLine(can, can.current, "", true).click()
        },

        yy: function(event, can) { can.last = can.current.innerText },
        dd: function(event, can) { can.last = can.current.innerText
            var next = can.current.nextSibling || can.current.previousSibling
            can.onaction.deleteLine(can, can.current)
            next.click()
        },
        p: function(event, can) {
            can.onaction.insertLine(can, can.current, can.last).click()
        },
        P: function(event, can) {
            can.onaction.insertLine(can, can.current, can.last, true).click()
        },
    },
    insert: {
        Escape: function(event, can) { can.onkeymap._normal(can)
            can.onaction.modifyLine(can, can.current, can.editor.value)
            event.stopPropagation(), event.preventDefault()
        },
        Enter: function(event, can) {
            can.onkeymap.insert.Escape(event, can)
            can.onaction.insertLine(can, can.current, "", event.shiftKey).click()
        },
        Backspace: function(event, can) { if (can.editor.selectionStart > 0) { return }
            can.onaction.mergeLine(can, can.current.previousSibling).click()
            event.stopPropagation(), event.preventDefault()
        },
        ArrowDown: function(event, can) {
            can.onaction.selectLine(can, can.current.nextSibling)
        },
        ArrowUp: function(event, can) {
            can.onaction.selectLine(can, can.current.previousSibling)
        },
        jk: function(event, can) {
            can.page.DelText(can.editor, can.editor.selectionStart-1, 1)
            can.onkeymap.insert.Escape(event, can)
        },
    },
})
Volcanos("onaction", {help: "控件交互", list: [
        "", "项目", "上传", "", "保存", "运行",
        "", "提交", "记录", "复盘", "历史",
    ],
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
            height: target.offsetHeight, width: target.offsetWidth,
            left: target.offsetLeft, top: target.offsetTop,
            display: "block",
        }}), can.editor.focus()

        can.page.Modify(can, can.ui.command, {style: {
            height: target.offsetHeight, width: target.offsetWidth,
            left: target.offsetLeft,
        }})
    },
    appendLine: function(can, value) { var index = can.max++
        can.page.Append(can, can.ui.preview, [{view: ["item", "div", index+1], onclick: function(event) {
            can.onaction.selectLine(can, index)
        }}])
        var line = can.page.Append(can, can.ui.content, [{view: ["item", "pre", ""], onclick: function(event) {
            can.onaction.selectLine(can, line)
        }}]).first; value && can.onaction.modifyLine(can, line, value)
        return line
    },
    insertLine: function(can, target, value, before) { var line = can.onaction.appendLine(can, value)
        can.ui.content.insertBefore(line, before && target || target.nextSibling)
        return line
    },
    mergeLine: function(can, target) { if (!target) {return}
        can.onaction.modifyLine(can, target, target.innerHTML + target.nextSibling.innerHTML)
        can.onaction.deleteLine(can, target.nextSibling)
        return target
    },

    "串行": function(event, can, msg) {
        can.core.Next(can.page.Select(can, can._action, "div.file", function(item) {
            return item.innerHTML

        }), function(item, next) {
            can.run({}, ["action", "run", can.Option("path"), item], function(msg) {
                next()
            }, true)

        }, function() {
            can.onappend.toast(can, "执行成功")
        })
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
        can.page.Modify(can, can.ui.project, {style: {display: hide? "": "none"}})
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
