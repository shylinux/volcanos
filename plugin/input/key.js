Volcanos("onfigure", {help: "控件详情", list: [], key: {
	_init: function(can, msg, target) { var call = arguments.callee; target._msg = msg
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, line) {
			return {text: [value, html.TD], onclick: function(event) { target.value = line[key]
				if (msg.Option(ice.MSG_PROCESS) != ice.PROCESS_AGAIN) { return can.close() }
				can.run(event, [ctx.ACTION, mdb.INPUTS, can.Conf(mdb.NAME), target.value], function(msg) { call(can, msg, target) })
			}}
		}), can.Status(mdb.TOTAL, msg.Length()), can.onmotion.hidden(can, can._target, msg.Length() > 0)
	},
	_show: function(event, can, name, cbs, target, value) {
		can.run(event, [ctx.ACTION, mdb.INPUTS, name, value||target.value], function(msg) {
			can.onfigure.key._init(can, msg, target), can.base.isFunc(cbs) && cbs(can, msg.Length() == 0)
		})
	},
	onfocus: function(event, can, meta, cb, target) { if (target._figure) { return } target._figure = {}; cb(function(can, cbs) {
		target._figure = can.onlayout.figure(event, can, can._target, false, {top: can.page.offsetTop(target)+target.offsetHeight, left: can.page.offsetLeft(target)})
		can.onfigure.key._show(event, can, meta.name, cbs, target), can.onmotion.focus(can, target)
	}) },
	onblur: function(event, can, meta, cb, target) {
		can.onmotion.delay(can, function() { delete(target._figure), target._can && target._can.close() })
	},
	onclick: function(event, can, meta, cb, target) { if (target._figure) { target._figure = can.onlayout.figure(event, can, can.core.Value(target, "_can._target")||{}); return } target._figure = {}; cb(function(can, cbs) {
		target._figure = can.onlayout.figure(event, can)
		can.onfigure.key._show(event, can, meta.name, cbs, target), can.onmotion.focus(can, target)
	}) },
	onkeydown: function(event, can, meta, cb, target, last) { var sub = target._can
		switch (event.key) {
			case lang.SHIFT: break
			case lang.CONTROL: break
			case lang.ENTER: sub.close(); break
			case lang.ESCAPE: event.target.blur(); break
			case lang.PS: can.onfigure.key._show(event, sub, meta.name, null, target, target.value+ice.PS); break
			case lang.TAB: 
				if (can.page.tagis(html.TEXTAREA, target)) {
					can.onkeymap.insertText(event.target, "\t"), can.onkeymap.prevent(event)
					break
				}
			default:
				can.onmotion.selectTableInput(event, sub, target, function() {
					can.onfigure.key._show(event, sub, meta.name, null, target)
				}), can.base.isFunc(last) && last(event, can)
		}
	},
}})

