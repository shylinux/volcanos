Volcanos(chat.ONFIGURE, {icon: {
	_load: function(event, can, cb, target, name, value) {
		can.runAction(event, ctx.RUN, ["web.chat.icon"], function(msg) { can._show(can, msg, cb, target, name) })
	},
	_show: function(can, msg, cb, target, name) { can.onmotion.clear(can)
		var table = can.page.Append(can, can._output, [{type: html.TABLE}])._target, tr
		msg.Table(function(value, index) { if (index%10 == 0) { tr = can.page.Append(can, table, [{type: html.TR}])._target }
			can.page.Append(can, tr, [{type: html.TD, inner: value.icon, title: value.name, onclick: function() {
				can.close(), can.base.isFunc(cb) && cb(can, value.name, target.value)
				target._icon.className = value.name
			}}])
		}), can.onappend._status(can, [mdb.TOTAL]), can.Status(mdb.TOTAL, msg.Length())
		can.onlayout.figure({target: target}, can, can._target, false, 200)
	},
	onclick: function(event, can, meta, target, cbs) { can.onmotion.focus(can, target) },
	onfocus: function(event, can, meta, target, cbs) { cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		target._icon = target._icon || can.page.insertBefore(can, [{type: "i"}], target)
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub, cb) { sub && can.onmotion.delay(can, sub.close, 300) },
	onkeyup: function(event, can, sub, cb) { if (!sub) { return }
		can.page.Select(can, sub._output, html.TD, function(target) {
			can.onmotion.hidden(can, target, target.title.indexOf(event.target.value) > -1)
		})
		can.page.Select(can, sub._output, html.TR, function(target) {
			can.onmotion.hidden(can, target, 
				can.page.Select(can, target, html.TD, function(target) {
					if (!can.page.ClassList.has(can, target, html.HIDE)) { return target }
				}).length > 0
			)
		})
	},
}})

