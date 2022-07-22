Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can, target), can.base.isFunc(cb) && cb(msg)
		can.ui = can.onlayout.profile(can), can.onimport[can.Option("scale")||"week"](can, msg)
		can.page.style(can, can.ui.project, html.MAX_HEIGHT, can.ui.content.offsetHeight)
		can.page.style(can, can.ui.profile, html.MAX_HEIGHT, can.ui.content.offsetHeight)
		can.user.isMobile && !can.user.isLandscape() && can.onmotion.hidden(can, can.ui.project)
		!can.user.isMobile && can.onmotion.toggle(can, can.ui.profile, true)
		!can.user.isMobile && can.onmotion.toggle(can, can.ui.display, true)
	},
	_content: function(can, msg, head, list, key, get, set) {
		var hash = {}; msg.Table(function(value, index) { var k = key(can.base.Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value]) })

		can.sup.task && (can.sup.task._target = null)
		var begin_time = can.base.Date(can.Option("begin_time"))
		can.page.Append(can, can.ui.content, [{view: [chat.CONTENT, html.TABLE], list: can.core.List(list, function(hour, row) {
			return {type: html.TR, list: can.core.List(head, function(week, col) {
				if (row == 0) { return {text: [can.user.trans(can, week), html.TH]} }
				if (col == 0) { return {text: [hour, html.TD]} }
				return can.onimport._task(can, msg, get(begin_time, col, row, hash), set(begin_time, col, row))
			})}
		}) }]), can.Status(mdb.COUNT, msg.Length())

		msg.Length() > 0 && can.sup.task && can.onmotion.delay(can, function() {
			var target = can.sup.task._target||can.task._target; can.sup.task = null, target && target.click()
		})
	},
	_task: function(can, msg, list, time) { return {text: ["", html.TD],
		ondblclick: function(event) {
			can.onaction.insertTask(event, can, time+can.base.Time(null, "%y-%m-%d %H:%M:%S").slice(time.length))
		},
		ondrop: function(event) { can.onkeymap.prevent(event)
			can.drop(event, event.target, time)
		},
		ondragover: function(event) { can.onkeymap.prevent(event)
			can.page.Select(can, can.ui.content, html.TD, function(item) {
				can.page.ClassList.set(can, item, "over", event.target == item)
			})
		},
		list: can.core.List(list, function(task) {
			return can.base.isString(task)? {text: [task, html.DIV, "date"]}: {text: [can.onexport[can.Action("view")||"text"](can, task), html.DIV, can.onexport.style(can, task)],
				ondragstart: function(event) { var target = event.target; can.drop = function(event, td, time) { td.append(target)
					can.onaction.modifyTask(event, can, task, "begin_time", time+task.begin_time.slice(time.length), task.begin_time)
				} }, draggable: time != undefined, title: can.onexport.title(can, task), _init: function(target) {
					var item = can.onimport.item(can, {nick: task.name+":"+task.text}, function() { can.onmotion.delay(can, function() {
						can.onmotion.select(can, can.ui.content, html.TD, target.parentNode), can.onimport._profile(can, task)
					}) }, null, can.ui.project); task._target = target, target.onclick = function(event) { item.click() }
					can.task = can.task||task, can.sup.task = can.sup.task||task, can.sup.task.zone == task.zone && can.sup.task.id == task.id && (can.sup.task._target = target)
				},
			}
		}),
	} },
	_profile: function(can, task) {
		if (can.onmotion.cache(can, function() { return can.sup.task = task, can.Status(task), [task.pod, task.zone, task.id].join(ice.PT) }, can.ui.profile, can.ui.display)) { return }

		task.extra && can.core.Item(can.base.Obj(task.extra), function(key, value) { task["extra."+key] = value }), delete(task.extra)
		var table = can.page.Appends(can, can.ui.profile, [{view: [chat.CONTENT, html.TABLE], list: [{th: [mdb.KEY, mdb.VALUE]}]}]).first
		can.core.Item(task, function(key, value) { key != "_target" && can.page.Append(can, table, [{
			td: [key, key == ice.POD && value != ""? can.page.Format(html.A, can.misc.MergeURL(can, {pod: value}), value): value],
			onclick: function(event) { if (can.page.tagis(html.INPUT, event.target) && event.target.type == html.BUTTON) {
				can.run(can.request(event, task), [ctx.ACTION, event.target.name], function(msg) { can.Update() })
			} },
			ondblclick: function(event) { var msg = can.request()
				switch (key) {
					case "zone":
					case "id":
						return
					case "level":
					case "score":
						msg.Push(key, "1")
						msg.Push(key, "2")
						msg.Push(key, "3")
						msg.Push(key, "4")
						msg.Push(key, "5")
						break
					case "status":
						msg.Push(key, "prepare")
						msg.Push(key, "process")
						msg.Push(key, "finish")
						msg.Push(key, "cancel")
						break
				}
				can.onmotion.modify(can, event.target, function(sub, value) {
					can.onaction.modifyTask(event, can, task, key, value)
				}, {name: key, action: key.indexOf(mdb.TIME) > 0? "date": "key", msg: msg, mode: "simple"})
			},
		}]) }), can.onimport._display(can, task)
	},
	_display: function(can, task) { if (!task["extra.cmd"]) { return }
		can.onappend.plugin(can, {type: "plug", ctx: task["extra.ctx"], cmd: task["extra.cmd"], arg: task["extra.arg"]}, function(sub, meta) {
			sub.run = function(event, cmds, cb) { var msg = can.request(event, kit.Dict("task.pod", task["pod"], "task.zone", task.zone, "task.id", task.id))
				can.runAction(event, ice.RUN, [task[mdb.ZONE], task[mdb.ID]].concat(cmds), cb)
			}
		}, can.ui.display)
	},

	day: function(can, msg) {
		var head = ["hour", "task"]
		var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }

		function key(time) { return can.base.Number(time.getHours(), 2) }
		function get(begin_time, col, row, hash) { return hash[list[row]] }
		function set(begin_time, col, row) { return can.base.Time(begin_time, "%y-%m-%d ")+list[row] }

		can.onimport._content(can, msg, head, list, key, get, set)
	},
	week: function(can, msg) {
		var head = can.onexport.head(can, "hour")
		var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }

		function key(time) { return time.getDay()+" "+can.base.Number(time.getHours(), 2) }
		function get(begin_time, col, row, hash) { return hash[col-1+" "+list[row]] }
		function set(begin_time, col, row) { return can.base.Time(can.base.TimeAdd(begin_time, -begin_time.getDay()+col-1), "%y-%m-%d ")+list[row] }

		can.onimport._content(can, msg, head, list, key, get, set)
	},
	month: function(can, msg) {
		var head = can.onexport.head(can, "order")
		var list = [0]; for (var i = 1; i < 6; i++) { list.push(i) }

		function key(time) { return can.base.Time(time, "%y-%m-%d") }
		function get(begin_time, col, row, hash) {
			var begin = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1))
			var last = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())
			var day = can.base.TimeAdd(last, (row-1)*7+col)
			return [day.getDate()+""].concat(hash[key(day)]||[])
		}
		function set(begin_time, col, row) {
			var begin = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1))
			var last = can.base.TimeAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())
			var day = can.base.TimeAdd(last, (row-1)*7+col)
			return key(day)
		}

		can.onimport._content(can, msg, head, list, key, get, set)
	},
	year: function(can, msg) {
		var head = can.onexport.head(can, "month")
		var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }

		function key(time) { return can.base.Time(time, "%y-%m ")+time.getDay() }
		function get(begin_time, col, row, hash) { return hash[begin_time.getFullYear()+"-"+can.base.Number(row, 2)+" "+(col-1)] }
		function set(begin_time, col, row) { return begin_time.getFullYear()+"-"+can.base.Number(list[row], 2) }

		can.onimport._content(can, msg, head, list, key, get, set)
	},
	long: function(can, msg) {
		var begin_time = can.base.Date(can.base.Time(can.Option("begin_time"), "%y-%m-%d %H:%M:%S"))
		var begin = begin_time.getFullYear() - 5

		var head = ["month"]; for (var i = 0; i < 10; i++) { head.push(begin+i) }
		var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }

		function key(time) { return can.base.Time(time, "%y-%m") }
		function get(begin_time, col, row, hash) { return hash[begin+col-1+"-"+can.base.Number(row, 2)] }
		function set(begin_time, col, row) { return begin+col-1+"-"+can.base.Number(row, 2) }

		can.onimport._content(can, msg, head, list, key, get, set)
	},
}, [""])
Volcanos(chat.ONACTION, {help: "组件交互", list: [
		"insert", "export", "import",
		["level", "all", "l1", "l2", "l3", "l4", "l5"],
		["status", "all", "prepare", "process", "cancel", "finish"],
		["score", "all", "s1", "s2", "s3", "s4", "s5"],
		["view", "", "name", "text", "level", "score"],
	],
	_trans: {"task": "任务", "hour": "时间", "month": "月份"},
	insertTask: function(event, can, time) { var msg = can.sup.request(event, {begin_time: time})
		can.user.input(event, can, can.Conf([ctx.FEATURE, mdb.INSERT]), function(args) {
			can.runAction(event, mdb.INSERT, ["zone", args[1], "begin_time", time].concat(args))
		})
	},
	modifyTask: function(event, can, task, key, value) {
		can.runAction(can.request(event, task), mdb.MODIFY, [key, value, task[key]])
	},

	_filter: function(event, can, key, value) { var count = 0
		if (value == "all") {
			can.page.Select(can, can.ui.content, html.DIV_ITEM, function(item) {
				can.page.ClassList.del(can, item, html.HIDE), count++
			})
		} else {
			can.page.Select(can, can.ui.content, html.DIV_ITEM, function(item) {
				can.page.ClassList.add(can, item, html.HIDE)
			})
			can.page.Select(can, can.ui.content, can.core.Keys(html.DIV, value), function(item) {
				can.page.ClassList.del(can, item, html.HIDE), count++
			})
		}
		can.Action(key, value), can.Status(mdb.COUNT, count)
	},
	level: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
	status: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
	score: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
	view: function(event, can, key, value) { can.Action(key, value)
		can.onmotion.clear(can, can.ui.project), can.onmotion.clear(can, can.ui.content)
		can.onimport[can.Option("scale")](can, can._msg)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据", list: [mdb.COUNT, "begin_time", mdb.ZONE, mdb.ID, mdb.TYPE, mdb.NAME, mdb.TEXT],
	name: function(can, task) { return task.name },
	text: function(can, task) { return task.name+": "+(task.text||"") },
	level: function(can, task) { return "l-"+(task.level||3)+": "+(task.name||"") },
	score: function(can, task) { return "s-"+(task.level||3)+": "+(task.name||"") },
	title: function(can, task) { return task.zone+": "+(task.type||"") },
	style: function(can, task) { return [html.ITEM, task.status, mdb.ID+task.id, "l"+(task.level||""), "s"+(task.score||"")].join(ice.SP) },
	head: function(can, scale) {
		switch (scale) {
			case "year":
			case "long":
				return
		}
		return [scale].concat(can.user.info.language == "en"? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]);
	},
})
