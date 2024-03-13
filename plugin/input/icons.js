Volcanos(chat.ONFIGURE, {icons: {
	_load: function(event, can, cb, target, name, value) {
		can.runAction(event, mdb.INPUTS, [mdb.ICONS], function(msg) { can._show(can, msg, cb, target, name) })
	},
	_show: function(can, msg, cb, target, name) { var table = can.page.Appends(can, can._output, [{type: html.TABLE}])._target, tr
		msg.Table(function(value, index) { if (index%5 == 0) { tr = can.page.Append(can, table, [{type: html.TR}])._target }
			can.page.Append(can, tr, [{type: html.TD, title: value.icons, list: [{img: can.misc.Resource(can, value.icons), style: {width: 60, height: 60}}], onclick: function() {
				can.close(), can.base.isFunc(cb) && cb(can, value.icons, target.value), target._icon.src = can.misc.Resource(can, value.icons)
			}}])
		}), can.layout(msg)
	},
	onfocus: function(event, can, meta, target, cbs, mod) { meta._force && mod.onclick(event, can, meta, target, cbs) },
	onclick: function(event, can, meta, target, cbs) { cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		target._icon = target._icon || can.page.insertBefore(can, [{img: can.misc.Resource(can, "usr/icons/icebergs.png") }], target)
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub, cb) { sub && can.onmotion.delay(can, sub.close, 300) },
}})
