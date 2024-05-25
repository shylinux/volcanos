Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) {
		can.onimport.project(can, msg, aaa.SESS, function(event, sess, value) { return {
			profile: {index: "web.code.redis.configs", args: sess, style: html.OUTPUT},
			display: {index: "web.code.redis.shells", args: sess, style: html.OUTPUT},
			content: {index: "web.code.redis.keys", args: sess},
		} })
	},
	project: function(can, msg, key, cb) { can.ui = can.onappend.layout(can), can.onappend.style(can, "studiolayout")
		msg.Table(function(value) { var hash = value[key]; value._hash = hash, value._title = hash
			can.onimport.item(can, value, function(event, value, show, target) { if (value._tabs) { return value._tabs.click() }
				var msg = can.request(event), list = cb(event, hash, value)
				can.core.List("content,display,profile".split(","), function(field) {
					list[field] && can.core.List("index,args,style,_init".split(","), function(key) { msg.Push(key, list[field][key]||"") })
				}), can.onimport.tabsCache(can, value, target, msg)
			})
		})
	},
}, [""])
