Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) {
		can.isCmdMode() && can.sup.onimport.size(can.sup, can.page.height(), can.page.width())
		can.onmotion.clear(can), can.onmotion.hidden(can, can._status), cb && cb(msg)
		can.onimport._tabs(can, msg) // can.onimport._full(can, msg)
	},
	_tabs: function(can, msg) { can.onappend.style(can, web.STUDIO)
		msg.Table(function(value, index) { value.nick = value.help||value.name.split(lex.SP)[0]
			var target = can.onimport.item(can, value, function() {
				if (value._plugin) { return can.onmotion.select(can, can._output, html.FIELDSET, value._plugin._target) }
				can.onappend.plugin(can, value, function(sub) { value._plugin = sub
					can.onmotion.select(can, can._output, html.FIELDSET, value._plugin._target)
					sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight()-20, can.ConfWidth()-20) }
					target.oncontextmenu = function(event) { sub._legend.onclick(event) }, can.onmotion.hidden(can, sub._legend)
				}, can._output)
			}, null, can._action); index == 0 && target.click(), can.onappend.style(can, "cmds", target)
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
	layout: function(can) { can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth()) },
})
