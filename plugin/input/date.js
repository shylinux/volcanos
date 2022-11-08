Volcanos(chat.ONFIGURE, {date: {
	onclick: function(event, can, meta, target, cbs) { cbs(function(can, cb) { function lunar(year, month, day) { return [] }
		const TODAY = "today", YEAR = "year", MONTH = "month", HOUR = "hour", MINUTE = "minute", SECOND = "second"
		var today = new Date(), now = can.base.Date((target.value||"").trim()); function _cb(_now) { cb(can, can.user.time(can, now = _now), target.value) }
		can.onappend._action(can, [cli.CLOSE, [HOUR].concat(can.core.List(24)), [MINUTE].concat(can.core.List(0, 60, 5)), [SECOND].concat(can.core.List(0, 60, 5)),
			TODAY, "", mdb.PREV, [YEAR].concat(can.core.List(now.getFullYear() - 10, now.getFullYear() + 10)), [MONTH].concat(can.core.List(1, 13)), mdb.NEXT,
		], can.onmotion.clear(can, can._action), kit.Dict(cli.CLOSE, function() { can.close() },
			HOUR, function(event, can, button, value) { now.setHours(parseInt(value)||0), show(now) },
			MINUTE, function(event, can, button, value) { now.setMinutes(parseInt(value)||0), show(now) },
			SECOND, function(event, can, button, value) { now.setSeconds(parseInt(value)||0), show(now) },
			TODAY, function() { _cb(show(today)) },

			mdb.PREV, function() { now.setMonth(now.getMonth()-1), _cb(show(now)) },
			YEAR, function(event, can, button, value) { now.setFullYear(parseInt(value)), show(now) },
			MONTH, function(event, can, button, value) { now.setMonth(parseInt(value)-1), show(now) },
			mdb.NEXT, function() { now.setMonth(now.getMonth()+1), _cb(show(now)) },

			"rand", function() { now.setDate((Math.random() * 100 - 50) + now.getDate()), show(now) },
			"over", function() { now.setFullYear(now.getFullYear()-1), show(now) },
			"come", function() { now.setFullYear(now.getFullYear()+1), show(now) },
			chat._TRANS, kit.Dict(TODAY, "今天", mdb.NEXT, "下一月", mdb.PREV, "上一月", "over", "去年", "come", "今年"),
		)), can._table = can.page.Appends(can, can._output, [{view: [chat.CONTENT, html.TABLE]}]).first
		target.value == "" && (now.setMinutes(now.getMinutes()>30? 30: 0), now.setSeconds(0))
		function show(now) {
			can.Action(YEAR, now.getFullYear())
			can.Action(MONTH, now.getMonth()+1)
			can.Action(HOUR, now.getHours())
			can.Action(MINUTE, parseInt(now.getMinutes()/5)*5)
			can.Action(SECOND, parseInt(now.getSeconds()/5)*5)

			can.page.Appends(can, can._table, [{th: ["日", "一", "二", "三", "四", "五", "六"]}])
			var tr; function add(day, type) { if (day.getDay() == 0) { tr = can.page.Append(can, can._table, [{type: html.TR}]).last } var _day = new Date(day)
				var l = lunar(day)
				can.page.Append(can, tr, [{view: [can.base.isIn(can.base.Time(day, "%y-%m-%d"), can.base.Time(now, "%y-%m-%d"), can.base.Time(today, "%y-%m-%d"))? html.SELECT: type, html.TD],
					onclick: function(event) { _day.setHours(now.getHours()), _day.setMinutes(now.getMinutes()), _day.getSeconds(now.getSeconds()), _cb(_day), meta._hold? show(_day): can.close() },
				list: [{text: day.getDate()+""}, {text: l.autoDay, "className": l.autoClass}]}])
			}

			var one = new Date(now); one.setDate(1)
			var end = new Date(now); end.setMonth(end.getMonth()+1), end.setDate(1)
			var head = new Date(one); head.setDate(one.getDate()-one.getDay())
			var tail = new Date(end); tail.setDate(end.getDate()+7-end.getDay())

			for (var day = new Date(head); day < one; day.setDate(day.getDate()+1)) { add(day, mdb.PREV) }
			for (var day = new Date(one); day < end; day.setDate(day.getDate()+1)) { add(day, mdb.MAIN) }
			for (var day = new Date(end); end.getDay() != 0 && day < tail; day.setDate(day.getDate()+1)) { add(day, mdb.NEXT) }
			var l = lunar(now); can.page.Appends(can, can._status, [{view: "today", inner: [l.gzYear, l.Animal+"年", l.cnMonth, l.cnDay, l.lunarFestival||l.festival||l.Term, l.Astro].join(ice.SP)}])
			return now
		}
		can.require(["/lib/lunar.js"], function() { lunar = function(day) { return calendar.solar2lunar(day) }
			show(now), can._show = function(d) { _cb(show(new Date(now.getTime()+d*24*3600*1000))) }
		})
	})},
	onkeydown: function(event, can, meta, cb, target, sub, last) { if (sub.hidden()) { return } switch (event.key) {
		case "n": can.page.SelectInput(can, sub._action, mdb.NEXT, function(target) { target.click() }); break
		case "p": can.page.SelectInput(can, sub._action, mdb.PREV, function(target) { target.click() }); break
		case "t": can.page.SelectInput(can, sub._action, "today", function(target) { target.click() }); break
		case "j": sub._show(7); break
		case "k": sub._show(-7); break
		case "h": sub._show(-1); break
		case "l": sub._show(1); break
		default: return
	} can.onkeymap.prevent(event) },
} })
