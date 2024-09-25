Volcanos(chat.ONFIGURE, {date: {
	onclick: function(event, can, meta, target, cbs) { cbs(function(can, cb) { if (can._output.innerHTML) { return }
		const TODAY = "today", YEAR = "year", MONTH = "month", HOUR = "hour", MINUTE = "minute", SECOND = "second"
		var today = new Date(), now = can.base.Date((target.value||"").trim()); function _cb(_now) { cb(can, can.user.time(can, now = _now), target.value) }
		can.base.Copy(can._trans, kit.Dict(TODAY, "今天", mdb.NEXT, "下一月", mdb.PREV, "上一月"))
		var meta = kit.Dict(cli.CLOSE, function() { can.close() },
			HOUR, function(event, can, button, value) { now.setHours(parseInt(value)||0), show(now) },
			MINUTE, function(event, can, button, value) { now.setMinutes(parseInt(value)||0), show(now) },
			SECOND, function(event, can, button, value) { now.setSeconds(parseInt(value)||0), show(now) },
			TODAY, function() { show(today) },
			mdb.PREV, function() { now.setMonth(now.getMonth()-1), show(now) },
			YEAR, function(event, can, button, value) { now.setFullYear(parseInt(value)), show(now) },
			MONTH, function(event, can, button, value) { now.setMonth(parseInt(value)-1), show(now) },
			mdb.NEXT, function() { now.setMonth(now.getMonth()+1), show(now) }
		)
		var ui = can.page.Append(can, can._action, ["time", "date"])
		can.onappend._action(can, [cli.CLOSE, [HOUR].concat(can.core.List(24)), [MINUTE].concat(can.core.List(0, 60, 5)), [SECOND].concat(can.core.List(0, 60, 5)), TODAY], ui.time, meta)
		can.onappend._action(can, [mdb.PREV, [YEAR].concat(can.core.List(now.getFullYear() - 10, now.getFullYear() + 10)), [MONTH].concat(can.core.List(1, 13)), mdb.NEXT], ui.date, meta)
		can._table = can.page.Appends(can, can._output, [{view: [chat.CONTENT, html.TABLE], list: [{type: html.TBODY}]}]).tbody
		can.page.Append(can, can._output, [{text: "请先选择时间，再选择日期"}])
		target.value == "" && (now.setMinutes(now.getMinutes()>30? 30: 0), now.setSeconds(0))
		function show(now) { can.Action(YEAR, now.getFullYear()), can.Action(MONTH, now.getMonth()+1)
			can.Action(HOUR, now.getHours()), can.Action(MINUTE, parseInt(now.getMinutes()/30)*30), can.Action(SECOND, 0)
			can.page.Appends(can, can._table, can.date.List(can, function(event, day) { day.setHours(now.getHours()), day.setMinutes(now.getMinutes()), day.getSeconds(now.getSeconds()), _cb(day), can.close() }, now))
			var l = can.date.solar2lunar(now); can.page.Appends(can, can._status, [{view: "today", inner: [l.gzYear, l.Animal+"年", l.cnMonth, l.cnDay, l.lunarFestival||l.festival||l.Term, l.Astro].join(lex.SP)}])
			return now
		} show(now), can._show = function(d) { d? _cb(show(now = new Date(now.getTime()+d*24*3600*1000))): _cb(show(now)) }
	})},
	onfocus: function(event, can, meta, target, cbs, mod) {
		if (target._selectonly) { can.onmotion.delay(can, function() { target.blur() }) }
	},
	onblur: function(event, can, sub, cb, target) {
		if (target._selectonly) { return }
	},
	onkeydown: function(event, can, meta, cb, target, sub, last) { if (sub && sub.hidden()) { return last(event) } switch (event.key) {
		case "n": can.page.SelectInput(can, sub._action, mdb.NEXT, function(target) { target.click(), sub._show() }); break
		case "p": can.page.SelectInput(can, sub._action, mdb.PREV, function(target) { target.click(), sub._show() }); break
		case "t": can.page.SelectInput(can, sub._action, "today", function(target) { target.click(), sub._show() }); break
		case "j": sub._show(7); break
		case "k": sub._show(-7); break
		case "h": sub._show(-1); break
		case "l": sub._show(1); break
		default: last(event); return
	} can.onkeymap.prevent(event) },
} })
