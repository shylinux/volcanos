Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.path = can.request(), can.list = []
        msg.Table(function(value) { if (value.path.indexOf("/local") == 0) { return }
            value.path.endsWith("/")? can.path.Push(value): can.list.push(value)
        })

        can.ui = can.onlayout.display(can, target)
        can.onappend.table(can, can.path, null, can.ui.content)

        var feature = can.Conf("feature") || {}
        can.onmotion.hidden(can, can._action)
        typeof cb == "function" && cb(msg)

        can.Action("倍速", can.rate = parseInt(msg.Option("rate"))||feature["rate"]||1)
        can.Action("起始", can.begin = parseInt(msg.Option("begin"))||feature["begin"]||0)
        can.Action("数量", can.limit = parseInt(msg.Option("limit"))||feature["limit"]||6)
        can.Action("高度", can.height = parseInt(msg.Option("height"))||feature["height"]||100)
        can.Option("path") != "最近/" && can.onimport._page(can, can.list, can.begin, can.limit)
    },
    _page: function(can, list, begin, limit) { can.onmotion.clear(can, can.ui.content)
        if (!list || list.length == 0) { return }
        for (var i = begin; i < begin+limit; i++) { list && list[i] && can.onimport.file(can, list[i].path, i) }
        can.Status("begin", begin), can.Status("limit", limit), can.Status("total", can.list.length)
    },
    _file: function(can, path, index) { var p = location.href.indexOf("http") == 0? "": "http://localhost:9020"
        return path.indexOf("http") == 0? path: p+can.base.Path("/share/local", " "+(can._msg.Option("prefix")||""), path)
    },
    file: function(can, path, index) { path = can.onimport._file(can, path, index)
        var cb = can.onfigure[can.base.Ext(path)]; can.Status("file", path)
        typeof cb == "function" && can.page.Append(can, can.ui.content, [cb(can, path, index)])
    },
}, ["/plugin/local/wiki/feel.css"])
Volcanos("onfigure", {help: "组件菜单", list: [],
    qrc: function(can, path, index) { return can.onfigure.image(can, path, index) },
    png: function(can, path, index) { return can.onfigure.image(can, path, index) },
    jpg: function(can, path, index) { return can.onfigure.image(can, path, index) },
    jpeg: function(can, path, index) { return can.onfigure.image(can, path, index) },
    image: function(can, path, index) { return {img: path, height: can.height, onclick: function(event) {
            can.onappend._init(can, {}, [], function(sub) {
                sub.run = function(event, cmds, cb) { return can.run(event, cmds, cb, true) }

                var header = sub.run({}, ["search", "Header.onexport.height"])
                var footer = sub.run({}, ["search", "Footer.onexport.height"])
                var river = sub.run({}, ["search", "River.onexport.width"])
                var height = window.innerHeight-header-footer

                sub.page.Modify(sub, sub._output, {style: {"max-height": height}})
                sub.page.Modify(sub, sub._target, {style: {
                    left: river, top: header, height: height, background: "#4eaad0c2",
                    margin: "0 10px", padding: "0 10px",
                }})

                var order = index; function show(order) {
                    path = can.onimport._file(can, can.list[order].path)
                    sub.page.Appends(sub, sub._output, [{img: path, height: height-55}])
                    sub.Status("位置", order+1+"/"+can.list.length), sub.Status("file", path)
                }; show(order)

                sub.onappend._action(sub, ["关闭", "下载", "上一个", "下一个", "设置背景"], sub._action, {
                    "关闭": function(event) { sub.page.Remove(sub, sub._target) },
                    "下载": function(event) { can.user.download(can, path) },
                    "上一个": function(event) { order > 0? show(--order): can.user.toast(can, "已经是第一张啦!") },
                    "下一个": function(event) { order < can.list.length-1? show(++order): can.user.toast(can, "已经是最后一张啦!") },
                    "设置背景": function(event) { var msg = can.request(event, {url: can.onimport._file(can, can.list[order].path)})
                        sub.run(event, ["search", "Header.onimport.background"])
                    },
                })
            }, document.body)
        }, _init: function(target) { can.Status("file", path) },
        onmouseover: function(event) { can.Status("file", path) },
    } },

    video: function(can, path) { var auto = true, loop = true, total = 0; function cb(event) { }
        return {className: "preview", type: "video", style: {height: can.height},
            data: {src: path, controls: "controls", autoplay: auto, loop: loop, playbackRate: can.rate},
            oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
            onmouseover: function(event) { can.Status("file", path) },
            onloadedmetadata: function(event) { total = event.timeStamp
                event.target.currentTime = can._msg.currentTime || 0
            }, onloadeddata: cb, ontimeupdate: function(event) {
                can.Status("file") == path && can.Status("position", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
            },
        }
    },
    m4v: function(can, path) { return can.onfigure.video(can, path) },
    mp4: function(can, path) { return can.onfigure.video(can, path) },
    mov: function(can, path) { return can.onfigure.video(can, path) },
})
Volcanos("onaction", {help: "组件菜单", list: [
        ["数量", 1, 3, 6, 9, 12, 15],
        ["高度", 100, 200, 400, 600, 800],
        ["倍速", 0.1, 0.2, 0.5, 1, 2, 3, 5, 10],
    ],
    "上一页": function(event, can, key, value) { 
        can.begin > 0 && (can.begin -= can.limit, can.onimport._page(can, can.list, can.begin, can.limit))
    },
    "下一页": function(event, can, key, value) { 
        can.begin + can.limit < can.list.length && (can.begin += can.limit, can.onimport._page(can, can.list, can.begin, can.limit))
    },

    "数量": function(event, can, key, value) { 
        can.limit = parseInt(value), can.onimport._page(can, can.list, can.begin, can.limit)
    },
    "高度": function(event, can, key, value) { 
        can.height = parseInt(value), can.onimport._page(can, can.list, can.begin, can.limit)
    },
    "倍速": function(event, can, key, value) { 
        can.rate = parseInt(value), can.onimport._page(can, can.list, can.begin, can.limit)
    },

    chooseImage: function(event, can) { var msg = can.request(event)
        can.user.agent.chooseImage(function(list) { can.core.List(list, function(item) {
            can.page.Append(can, can._output, [{img: item, height: 200}])
        }) })
    },
})
Volcanos("onexport", {help: "导出数据", list: ["begin", "limit", "total", "position", "file"],
    position: function(can, index, total) { total = total || can.max
        return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+"/"+parseInt(total)
    },
})

