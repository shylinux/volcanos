Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) { cb && cb(msg), can.onmotion.clear(can)
		can.isCmdMode() && can.sup.onimport.size(can.sup, can.page.height(), can.page.width())
		can.onimport._tabs(can, msg) // can.onimport._full(can, msg)
	},
	_tabs: function(can, msg) {
		can.onappend.style(can, "studio")
		msg.Table(function(value, index) { value.nick = value.help||value.name.split(" ")[0]
			var target = can.onimport.item(can, value, function() {
				if (can.onmotion.cache(can, function() { return value.index }, can._output)) { return }
				can.onappend.plugin(can, value, function(sub) {
					sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight()-20, can.ConfWidth()-20) }
					target.oncontextmenu = function(event) {
						sub._legend.onclick(event)
					}
				}, can._output)

			}, function(event) {
			}, can._action); index == 0 && target.click()
		})
	},
	_full: function(can, msg) {
		can.ui = can.onappend.layout(can), can.page.style(can, can.ui.content, html.PADDING, 10)
		msg.Table(function(value, index) { value.nick = value.help||value.name.split(" ")[0]
			var target = can.onimport.item(can, value, function(event) {
				if (can.onmotion.cache(can, function() { return value.index }, can.ui.content)) { return }
				can.onappend.plugin(can, value, function(sub) {
					sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight()-20, can.ConfWidth()-can.ui.project.offsetWidth-20) }
				}, can.ui.content)
			}, function() {}); index == 0 && target.click()
		})
	},
	layout: function(can) {
		can.page.styleHeight(can, can._output, can.ConfHeight())
	},
})
