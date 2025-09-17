Volcanos(chat.ONFIGURE, {upload: {
	_init: function(can, meta, target) {
		target.placeholder = "点击上传文件"
	},
	onkeydown: function(event, can, meta, target, cbs) {
		can.onkeymap.prevent(event)
	},
	onkeyup: function(event, can, meta, target, cbs) {
		can.onkeymap.prevent(event)
	},
	onclick: function(event, can, meta, target, cbs) {
		can.user.upload(event, can, function(msg) {
			target._show_icons_title(msg.Result(), msg._upload[3].split("/")[0] == "image"? msg.Result(): "/p/usr/icons/dir.png",
				can.base.Size(msg._upload[2])+" "+msg._upload[1],
			)
			// target.value = msg.Result()
		})
	},
	onfocus: function(event, can, meta, target, cbs, mod) {
		can.onmotion.delay(can, function() { target.blur() })
	},
}})