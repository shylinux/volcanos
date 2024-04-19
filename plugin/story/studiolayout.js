Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) {
		can.onimport.project(can, msg, aaa.SESS, function(event, sess, value) { return {
			content: {index: "web.code.redis.keys", args: sess},
			profile: {index: "web.code.redis.configs", args: sess, style: html.OUTPUT},
			display: {index: "web.code.redis.shells", args: sess, style: html.OUTPUT},
		} })
	},
	_nick: function(can, value) { return value.name },
	project: function(can, msg, key, cb) { can.ui = can.onappend.layout(can), can.onappend.style(can, "studiolayout", can._fields)
		var _select; msg.Table(function(value) { var hash = value[key]; value.nick = can.onimport._nick(can, value)
			var target = can.onimport.item(can, value, function(event, value) { can.misc.SearchHash(can, hash)
				if (can.onmotion.cache(can, function(save, load) {
					save({
						_content: can.ui._content_plugin,
						_profile: can.ui._profile_plugin,
						_display: can.ui._display_plugin,
					}), load(hash, function(bak) {
						can.ui._content_plugin = bak._content
						can.ui._profile_plugin = bak._profile
						can.ui._display_plugin = bak._display
					})
					return hash
				}, can.ui.content, can.ui.profile, can.ui.display)) {
					can.onmotion.select(can, can._action, html.DIV_TABS, value._tabs); return
				}
				value._tabs = can.onimport.tabs(can, [value], function() { target.click() }, function() {
					delete(value._tabs), delete(can._cache_data[hash])
					delete(can.ui.content._cache[hash])
					delete(can.ui.profile._cache[hash])
					delete(can.ui.display._cache[hash])
				})
				can.core.Item(cb(event, hash, value), function(key, item) {
					if (!item) { return }
					can.onmotion.toggle(can, can.ui[key], true)
					item && can.onappend.plugin(can, item, function(sub) { can.ui["_"+key+"_plugin"] = sub
						can.onimport.layout(can), sub.onexport.output = function() { can.onimport.layout(can) }
					}, can.ui[key])
				})
			}); _select = _select||target, can.db.hash[0] == value.sess && (_select = target)
		}), _select && _select.click()
	},
	layout: function(can) {
		can.ui.layout(can.ConfHeight(), can.ConfWidth(), 0, function(height, width) {
			var height = can.ConfHeight(), width = (can.ConfWidth()-can.ui.project.offsetWidth), margin = 0
			can.ui._profile_plugin && (width /= 2), can.ui._display_plugin && (height /= 2)
			can.ui._content_plugin && can.ui._content_plugin.onimport.size(can.ui._content_plugin, height-margin, width-margin-1, false)
			can.ui._profile_plugin && can.ui._profile_plugin.onimport.size(can.ui._profile_plugin, height-margin, width-margin-1, false)
			can.ui._display_plugin && can.ui._display_plugin.onimport.size(can.ui._display_plugin, height-margin-2, width*2-margin, false)
		})
	},
}, [""])
