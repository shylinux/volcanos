Volcanos(chat.ONFIGURE, {key: {
	_load: function(event, can, cb, target, name, value) {
		if (target._done && target.value) { return can.onmotion.hidden(can, can._target, can.Status("total") > 0)} target._done = true
		can.onmotion.focus(can, target), can.onmotion.hidden(can, can._target)
		can.runAction(event, mdb.INPUTS, [name, value||""], function(msg) {
			name == ctx.INDEX && can.core.Item(can.onengine.plugin.meta, function(key) { msg.Push(ctx.INDEX, can.core.Keys(ice.CAN, key)) })
			can._show(can, msg, cb, target, name)
		})
	},
	_show: function(can, msg, cb, target, name) {
		if (msg.Length() == 0 || msg.Length() == 1 && msg.Append(name) == target.value && target.value != "" || msg.Length() == 1 && msg.Append(name) == "") { return can.onmotion.hidden(can) }
		if (can.base.isIn(msg.append[msg.append.length-1], ctx.ACTION, "cb")) { msg.append = msg.append.slice(0, -1) } var list = {}
		can.onmotion.clear(can), can.onappend.table(can, msg, function(value, key, index, item) { value = item[key]
			if (msg.append.length == 1 && index < 100 && list[value]) { return } list[value] = true
			return {text: [value, html.TD, value == ""? html.HR: ""], style: msg.append && msg.append.length == 1? kit.Dict(html.MIN_WIDTH, target.offsetWidth-16): {}, onclick: function(event) {
				can.close(); if (msg.cb && msg.cb[index]) { return msg.cb[index](value) }
				var _cb = can.Conf("select"); if (_cb) { return _cb(target.value = value) } can.base.isFunc(cb) && cb(can, value, target.value)
			}}
		}), can.onappend._status(can, [mdb.TOTAL, mdb.INDEX]), can.Status(mdb.TOTAL, msg.Length()), can.onmotion.toggle(can, can._status, msg.Length() > 5)
		can.page.style(can, can._output, html.MAX_HEIGHT, can.page.height()/2, html.MIN_WIDTH, target.offsetWidth, html.MAX_WIDTH, can.Conf("style.width")||can.page.width()/2)
		msg.append.length == 1 && can.page.ClassList.add(can, can._target, chat.SIMPLE), can.onlayout.figure({target: target}, can, can._target, false, 200)
		can.onmotion.toggle(can, can._target, can.Status("total") > 0)
	},
	onclick: function(event, can, meta, target, cbs) {
		// can.onmotion.focus(can, target)
	},
	onfocus: function(event, can, meta, target, cbs) { cbs(function(sub, cb) { if (sub.Status(mdb.TOTAL) > 0) { return }
		meta.msg && meta.msg.Length() > 0? sub._show(sub, meta.msg, cb, target, meta.name): sub._load(event, sub, cb, target, meta.name, target.value)
	}) },
	onblur: function(event, can, sub, cb) { sub && can.onmotion.delay(can, sub.close, 300) },
	onkeydown: function(event, can, meta, cb, target, sub, last) { if (event.key == code.TAB) { return }
		if (event.key == code.ENTER) { return meta._enter && (!can.page.tagis(event.target, html.TEXTAREA) || event.ctrlKey) && meta._enter(event, target.value)? sub.close(): last(event) }
		if (!sub) { return } can.onmotion.toggle(can, sub._target, true)
		sub.hidden() || can.onkeymap.selectCtrlN(event, can, sub._output, "tr:not(.hidden)>td:first-child", function(td) { return meta.select && (sub.close(), meta.select(target.value = td.innerText)), cb(sub, td.innerText, target.value), td })
			|| can.onmotion.delayOnce(can, function() { can.onkeymap.selectInputs(event, sub, function() { sub._load(event, sub, cb, target, meta.name) }, target) }, target.value.length < 3? 500: 150)
	},
}})
