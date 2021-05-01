Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
        can.ui = can.onlayout.display(can, target)
        can.ui.canvas = can.page.Append(can, can.ui.display, [{type: "canvas", width: 320, height: 240, style: {display: "none"}}]).first

        can.onappend.table(can, msg, function(value, key, index, line, array) {
            return {text: [value, "td"], onclick: function(event) {
                can.sup.onaction.change(event, can.sup, key, value, function(msg) {
                    can.run(event)
                })
            }}
        }, can.ui.content)

        can.onappend.board(can, msg.Result(), can.ui.display)
        can.base.isFunc(cb) && cb(msg)
    },
})
Volcanos("onaction", {help: "操作数据", list: [], _init: function(can, msg, list, cb, target) {

    },

    open: function(event, can) {
        navigator.getUserMedia({video: {width: 320, height: 240}}, function(stream) {
            var video = can.page.Append(can, can.ui.content, "video")
            video.srcObject = stream, video.play()
            can.ui.video = video
        }, function(error) {
            can.base.Log("open camera", error)
        })
    },
    snapshot: function(event, can) {
        can.ui.canvas.getContext("2d").drawImage(can.ui.video, 0, 0)
        can.page.Append(can, can.ui.display, [{type: "img", src: can.ui.canvas.toDataURL('image/webp')}])
    },
})
Volcanos("onexport", {help: "导出数据", list: [], 
})
