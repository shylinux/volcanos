Volcanos(chat.ONIMPORT, {
	_init: function(can, msg, cb) {
		// can.isCmdMode() && can.sup.onimport.size(can.sup, can.page.height(), can.page.width())
		can.onmotion.hidden(can, can._status), cb && cb(msg), can.onimport._tabs(can, msg)
	},
	_tabs: function(can, msg) { can.onappend.style(can, web.STUDIO), can.onmotion.clear(can, can._action)
		var margin = html.PLUGIN_MARGIN*2
		msg.Table(function(value, index) { value.nick = can.user.trans(can, value.index.split(nfs.PT).pop(), value.help)
			value._select == index == 0
			var target = can.onimport.item(can, value, function() {
				if (value._plugin) { return can.onmotion.select(can, can._output, html.FIELDSET, value._plugin._target) }
				can.onappend.plugin(can, value, function(sub) { value._plugin = sub
					can.onmotion.select(can, can._output, html.FIELDSET, value._plugin._target)
					sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight()-margin, can.ConfWidth()-margin, false) }
					target.oncontextmenu = function(event) { sub._legend.onclick(event) }, can.onmotion.hidden(can, sub._legend)
				}, can._output)
			}, null, can._action); can.onappend.style(can, "cmds", target)
		}), can.onappend._action(can, null, null, null, true)
	},
	_full: function(can, msg) {
		can.ui = can.onappend.layout(can), can.page.style(can, can.ui.content, html.PADDING, 10)
		msg.Table(function(value, index) {
			value.nick = can.user.trans(can, value.index.split(nfs.PT).pop(), value.help)
			var target = can.onimport.item(can, value, function(event) {
				if (can.onmotion.cache(can, function() { return value.index }, can.ui.content)) { return }
				can.onappend.plugin(can, value, function(sub) {
					sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight(), can.ConfWidth()-can.ui.project.offsetWidth) }
				}, can.ui.content)
			}); index == 0 && target.click()
		})
	},
})
