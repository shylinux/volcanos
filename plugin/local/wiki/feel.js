Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.page.Modify(can, can._action, {style: {display: "none"}})
        typeof cb == "function" && cb()
        can.list = msg.Table()||[]

        can.begin = 0
        can.Action("倍速", 1)
        can.Action("数量", can.limit = parseInt(msg.Option("limit"))||3)
        can.Action("高度", can.height = parseInt(msg.Option("height"))||200)
        can.Option("path") != "最近/" && can.onimport.page(can, can.list, can.begin, can.limit)
    },
    page: function(can, list, begin, limit) { can._target.innerHTML = ""
        for (var i = begin; i < begin+limit; i++) { list[i] && can.onimport.file(can, list[i].path) }
        can.Status("begin", begin), can.Status("limit", limit), can.Status("total", can.list.length)
    },
    file: function(can, path) { can.Status("文件", path)
        var p = location.href.startsWith("http")? "": "http://localhost:9020"
        path = path.startsWith("http")? path: p+can.base.Path("/share/local", " "+(can._msg.Option("prefix")||""), path)

        var ls = path.split("/")
        var ls = ls[ls.length-1].split(".")
        var ext = ls[ls.length-1].toLowerCase()
        ext && can.page.Append(can, can._target, [can.onfigure[ext](can, path)])
    },
}, ["/plugin/local/wiki/feel.css"])
Volcanos("onfigure", {help: "组件菜单", list: [],
    qrc: function(can, path) { return can.onfigure.image(can, path) },
    png: function(can, path) { return can.onfigure.image(can, path) },
    jpg: function(can, path) { return can.onfigure.image(can, path) },
    jpeg: function(can, path) { return can.onfigure.image(can, path) },
    image: function(can, path) { return {img: path, height: can.height, onclick: function(event) {
            can.Status("文件", path)
        }, _init: function(target) {
            can.Status("文件", path)
        }
    } },

    video: function(can, path) { var auto = true, loop = true, total = 0
        function cb(event) { console.log(event) }
        return {className: "preview", type: "video", style: {height: can.height},
            data: {src: path, controls: "controls", autoplay: auto, loop: loop, playbackRate: can.rate},
            oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
            onloadedmetadata: function(event) { total = event.timeStamp
                event.target.currentTime = can._msg.currentTime || 0
            }, onloadeddata: cb, ontimeupdate: function(event) {
                can.Status("position", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
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
    "上传": function(event, can) { can.user.upload(event, can) },
    "收藏": function(event, can) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "copy" }, function (response) {
                can.onimport.file(can, response.src)
                var msg = can.request(event); msg.Option(can.Option())
                can.run(event, ["action", "spide", "mp4", response.title, response.src, "poster", response.poster], function(msg) {

                }, true)
            })
        })
    },
    "清空": function(event, can) { 
        can._target.innerHTML = ""
    },
    "参数": function(event, can) { 
        can.page.Modify(can, can._action, {style: {display: can._action.style.display=="none"? "block": "none"}})
    },
    "上一页": function(event, can, key, value) { 
        can.begin > 0 && (can.begin -= can.limit, can.onimport.page(can, can.list, can.begin, can.limit))
    },
    "下一页": function(event, can, key, value) { 
        can.begin + can.limit < can.list.length && (can.begin += can.limit, can.onimport.page(can, can.list, can.begin, can.limit))
    },
    "数量": function(event, can, key, value) { 
        can.limit = parseInt(value), can.onimport.page(can, can.list, can.begin, can.limit)
    },
    "高度": function(event, can, key, value) { 
        can.height = parseInt(value), can.onimport.page(can, can.list, can.begin, can.limit)
    },
    "倍速": function(event, can, key, value) { 
        can.rate = parseInt(value), can.onimport.page(can, can.list, can.begin, can.limit)
    },
})
Volcanos("onexport", {help: "导出数据", list: ["begin", "limit", "total", "position", "文件"],
    position: function(can, index, total) { total = total || can.max
        return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+"/"+parseInt(total)
    },
})
