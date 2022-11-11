Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.ui = can.onlayout.display(can, target)
		can.ui.canvas = can.page.Append(can, can.ui.display, [{type: "canvas", width: 320, height: 240, style: {display: "none"}}])._target

		can.onappend.table(can, msg, function(value, key, index, line, array) {
			return {text: [value, "td"], onclick: function(event) {
				can.sup.onimport.change(event, can.sup, key, value, function(msg) {
					can.run(event)
				})
			}}
		}, can.ui.content)

		can.onappend.board(can, msg.Result(), can.ui.display)
		can.base.isFunc(cb) && cb(msg)
	},
})
Volcanos(chat.ONACTION, {_init: function(can, msg, cb, target) {
	},

	open: function(event, can) {
		navigator.getUserMedia({video: {width: 320, height: 240}}, function(stream) {
			var video = can.page.Append(can, can.ui.content, "video")
			video.srcObject = stream, video.play()
			can.ui.video = video
		}, function(error) {
			can.misc.Log("open camera", error)
		})
	},
	snapshot: function(event, can) {
		can.ui.canvas.getContext("2d").drawImage(can.ui.video, 0, 0)
		can.page.Append(can, can.ui.display, [{type: "img", src: can.ui.canvas.toDataURL('image/webp')}])
	},
})
