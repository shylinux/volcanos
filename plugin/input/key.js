Volcanos(chat.ONFIGURE, {key: {
	_load: function(event, can, cb, target, name, value) { can.runAction(event, mdb.INPUTS, [name, value||""], function(msg) {
		name == ctx.INDEX && can.core.Item(can.onengine.plugin.meta, function(key) { msg.Push(ctx.INDEX, can.core.Keys(ice.CAN, key)) })
		can._show(can, msg, cb, target, name)
	}) },
	_show: function(can, msg, cb, target, name) { if (msg.Length() == 0 || msg.Length() == 1 && msg.Append(name) == target.value) { return can.onmotion.hidden(can) }
		if (can.base.isIn(msg.append[msg.append.length-1], ctx.ACTION, "cb")) { msg.append = msg.append.slice(0, -1) }
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, item) { value = item[key]
			return {text: [value, html.TD, value == ""? html.HR: ""], style: msg.append && msg.append.length == 1? kit.Dict(html.MIN_WIDTH, target.offsetWidth-16): {}, onclick: function(event) {
				can.close(); if (msg.cb && msg.cb[index]) { return msg.cb[index](value) } cb(can, value, target.value)
				msg.Option(ice.MSG_PROCESS) == ice.PROCESS_AGAIN && can.onmotion.delay(can, function() { can._load(event, can, cb, target, name, value) })
			}}
		}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length())
		msg.append.length == 1 && can.page.ClassList.add(can, can._target, chat.SIMPLE), can.onlayout.figure({target: target}, can, can._target)
	},
	onclick: function(event, can, meta, target, cbs) { can.onmotion.focus(can, target) },
	onfocus: function(event, can, meta, target, cbs) { cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub) { sub && can.onmotion.delay(can, sub.close, 300) },
	onkeydown: function(event, can, meta, cb, target, sub, last) {
		if (event.key == lang.ENTER) { return meta._enter && (!can.page.tagis(event.target, html.TEXTAREA) || event.ctrlKey) && meta._enter(event, target.value)? sub.close(): last(event) }
		if (!sub) { return }
		sub.hidden() || can.onkeymap.selectCtrlN(event, can, sub._output, "tr:not(.hidden)>td:first-child", function(td) { return cb(sub, td.innerText, target.value), td }) || can.onmotion.delayOnce(can, function() {
			can.onkeymap.selectInputs(event, sub, function() { sub._load(event, sub, cb, target, meta.name) }, target) }, target.value.length < 3? 500: 150)
	},
}})
