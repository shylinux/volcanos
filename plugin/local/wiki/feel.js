Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb) {
        can._target.innerHTML = "", can.ui = can.page.Append(can, can._target, [
            {view: "content"}, {view: "control"}, {view: "display"},
        ])

        can.table = can.onappend.table(can, can.ui.content, "table", msg, function(value, key, index, line) {
            return {text: [value, "td"], onclick: function(event) {
                can.onimport.file(can, line.path)
            }}
        })

        var list = msg.Table(), begin = 0, limit = 3; function page() {
            can.ctrl.offset.innerHTML = begin+"-"+(begin+limit)
            can.onimport.page(can, list, begin, limit)
        }
        can.ctrl = can.page.Append(can, can.ui.control, [
            {button: ["clear", function() {
                can.ui.display.innerHTML = ""
            }]},
            {select: [["height", 100, 200, 400, 600, 800], function(event, value) {
                can.height = parseInt(value), page()
            }]},
            {select: [["rate", 0.1, 0.2, 0.5, 1, 2, 3, 5, 10], function(event, value) {
                can.rate = value, page()
            }]},
            {button: ["prev", function() {
                begin > 0 && (begin -= limit, can.onimport.page(can, list, begin, limit))
            }]},
            {text: [begin+"-"+(begin+limit)], name: "offset"},
            {button: ["next", function() {
                begin < msg[msg.append[0]].length && (begin += limit, page())
            }]},
            {select: [["limit", 1, 3, 6, 9, 12, 15], function(event, value) {
                limit = parseInt(value), page()
            }]},
            {text: [list.length]},
        ])

        can.rate = can.ctrl.rate.value = 1
        limit = can.ctrl.limit.value = parseInt(msg.Option("limit"))||1
        can.height = can.ctrl.height.value = parseInt(msg.Option("height"))||400
        can.onimport.page(can, list, begin, limit)
    },
    page: function(can, list, begin, limit) { can.ui.display.innerHTML = ""
        for (var i = begin; i < begin+limit; i++) { can.onimport.file(can, list[i].path) }
    },
    file: function(can, item) { item = (can._msg.Option("prefix")||"")+"/"+item
        var ls = item.split("/")
        var ls = ls[ls.length-1].split(".")
        var ext = ls[ls.length-1].toLowerCase()
        can.page.Append(can, can.ui.display, [can.onfigure[ext](can, item)])
    },
}, ["/plugin/local/wiki/feel.css"])
Volcanos("onfigure", {help: "组件菜单", list: [],
    image: function(can, path) {
        return {img: "/share/local/"+path}
    },
    jpg: function(can, path) { return can.onfigure.image(can, path) },
    qrc: function(can, path) { return can.onfigure.image(can, path) },

    video: function(can, path) { var auto = true, loop = true, total = 0
        var p = location.href.startsWith("https")? "": "http://localhost:9020"
        function cb(event) { console.log(event) }
        return {className: "preview", type: "video", style: {height: can.height},
            data: {src: p+"/share/local/"+path, controls: "controls", autoplay: auto, loop: loop, playbackRate: can.rate},
            oncontextmenu: cb, onplay: cb, onpause: cb, onended: cb,
            onloadedmetadata: function(event) { total = event.timeStamp
                event.target.currentTime = can._msg.currentTime || 0
            }, onloadeddata: cb, ontimeupdate: function(event) {
                can.Status("当前行", can.onexport.position(can, (can._msg.currentTime=event.target.currentTime)-1, event.target.duration))
            },
        }
    },
    m4v: function(can, path) { return can.onfigure.video(can, path) },
})

Volcanos("onaction", {help: "组件菜单", list: ["", "上传"],
    "上传": function(event, can) { can.onappend.upload(can) },
})
Volcanos("onexport", {help: "导出数据", list: ["当前行"],
    position: function(can, index, total) { total = total || can.max
        return parseInt((index+1)*100/total)+"%"+" = "+(parseInt(index)+1)+"/"+parseInt(total)
    },
})
