Volcanos(chat.ONIMPORT, {_init: function(can, msg, target) { can.onmotion.clear(can, target), can._display_heights = {}
		can.list = {}; var ls = can.misc.SearchHash(can)
		can.ui = can.onappend.layout(can), can.onmotion.hidden(can, can.ui.profile), can.onmotion.hidden(can, can.ui.display)
		can.onmotion.hidden(can, can.ui.project)
		can.onimport[can.Option("scale")||team.WEEK](can, msg), can.Status(mdb.COUNT, msg.Length()), can.onimport.layout(can)
		var item; if (can.isCmdMode() && ls.length > 0) { item = can.list[can.core.Keys(ls[0], ls[1])] } else if (can.sup.task) { item = can.list[can.core.Keys(can.sup.task.zone, can.sup.task.id)] } item && item.click()
	},
	_content: function(can, msg, head, list, key, get, set) { var begin_time = can.base.Date(can.Option(team.BEGIN_TIME)); can.sup.task && (can.sup.task._target = null)
		var hash = {}; msg.Table(function(value, index) { var k = key(can.base.Date(value.begin_time)); hash[k] = (hash[k]||[]).concat([value]) })
		can.ui.table = can.page.Append(can, can.ui.content, [{view: [[chat.CONTENT, team.PLAN], html.TABLE], list: can.core.List(list, function(hour, row) {
			return {type: html.TR, list: can.core.List(head, function(week, col) {
				if (row == 0) { return {text: [can.user.trans(can, week), html.TH]} } if (col == 0) { return {text: [hour, html.TH]} }
				return can.onimport._task(can, msg, get(begin_time, col, row, hash), set(begin_time, col, row))
			})}
		}) }])._target, can.onmotion.delay(can, function() { var target = can.sup.task && can.sup.task._target; target && target.click(), can.Status(mdb.COUNT, msg.Length()) })
	},
	_task: function(can, msg, list, time) { return {type: html.TD, className: time == can.base.Time().slice(0, time.length)? html.SELECT: "",
		ondblclick: function(event) { can.onaction.insertTask(event, can, time+can.base.Time().slice(time.length)) },
		ondrop: function(event) { can.onkeymap.prevent(event), can.drop(event, event.target, time) },
		ondragover: function(event) { can.onkeymap.prevent(event), can.page.Select(can, can.ui.content, html.TD, function(td) { can.page.ClassList.set(can, td, "over", td == event.target) }) },
		list: can.core.List(list, function(task) { return can.base.isString(task)? {text: [task, html.DIV, "date"]}:
			{text: [can.core.CallFunc([can.onexport, can.Action(ice.VIEW)||mdb.TEXT], [can, task])||task.name, html.DIV, can.onexport.style(can, task)],
				ondragstart: function(event) { var target = event.target; can.drop = function(event, td, time) { td.append(target)
					can.onaction.modifyTask(event, can, task, team.BEGIN_TIME, time+task.begin_time.slice(time.length), task.begin_time)
				} }, draggable: time != undefined, title: can.onexport.title(can, task), _init: function(target) {
					var item = can.onimport.item(can, {nick: task.name+nfs.DF+task.text}, function() { can.onmotion.delay(can, function() {
						can.onmotion.select(can, can.ui.content, html.TD, target.parentNode), can.onimport._profile(can, task), can.onimport._display(can, task), can.onimport.layout(can)
					}) }, null, can.ui.project); task._target = target, target.onclick = function(event) { item.click() }, can.list[can.core.Keys(task.zone, task.id)] = target
				}}
		}),
	} },
	_profile: function(can, task) { can.onmotion.toggle(can, can.ui.profile, true), can.onexport.hash(can, task)
		if (can.onmotion.cache(can, function() { return can.sup.task = task, can.Status(task), [task.pod, task.zone, task.id].join(nfs.PT) }, can.ui.profile)) { return }
		task.extra && can.core.Item(can.base.Obj(task.extra), function(key, value) { task["extra."+key] = value }), delete(task.extra)
		var table = can.page.Appends(can, can.ui.profile, [{view: [chat.CONTENT, html.TABLE], list: [{th: [can.user.trans(can, mdb.KEY, "字段"), can.user.trans(can, mdb.VALUE, "属性")]}]}])._target
		can.core.Item(task, function(key, value) { key != "_target" && can.page.Append(can, table, [{
			td: [key, key == ice.POD && value != ""? can.page.Format(html.A, can.misc.MergeURL(can, {pod: value}), value): value],
			onclick: function(event) { can.page.tagis(event.target, html.INPUT) && event.target.type == html.BUTTON && can.run(can.request(event, task), [ctx.ACTION, event.target.name]) },
			ondblclick: function(event) { if ([ice.POD, mdb.ZONE, mdb.ID].indexOf(key) > -1) { return }
				can.onmotion.modify(can, event.target, function(sub, value) { can.onaction.modifyTask(event, can, task, key, value) }, {name: key, action: key.indexOf(mdb.TIME) > 0? "date": "key"})
			},
		}]) }), can.onmotion.story.auto(can, can.ui.profile)
	},
	_display: function(can, task) { can.onmotion.toggle(can, can.ui.display, true)
		if (can.onmotion.cache(can, function() { return can.sup.task = task, can.Status(task), [task.pod, task.zone, task.id].join(nfs.PT) }, can.ui.display)) { return }
		task[ctx.EXTRA_INDEX] && can.onappend.plugin(can, {index: task[ctx.EXTRA_INDEX], args: task[ctx.EXTRA_ARGS], height: can.ConfHeight()/2-2*html.ACTION_HEIGHT}, function(sub, meta) {
			sub.run = function(event, cmds, cb) { can.request(event, kit.Dict(team.TASK_POD, task.pod, team.TASK_ZONE, task.zone, team.TASK_ID, task.id))
				can.page.style(can, sub._output, html.MAX_HEIGHT, ""), can.runAction(event, ice.RUN, [task[mdb.ZONE], task[mdb.ID]].concat(cmds), cb)
			}
			sub.onexport.output = function() { can.onmotion.delay(can, function() {
				sub.onimport.size(sub, can._display_heights[[task.zone, task.id].join(mdb.FS)] = can.base.Max(sub._target.offsetHeight, can.ConfHeight()/2), can.ConfWidth()-can.ui.project.offsetWidth)
				can.onimport.layout(can)
			}) }, sub.onaction.close = function() { can.onmotion.toggle(can, can.ui.display), can.onimport.layout(can) }
		}, can.ui.display)
	},
	day: function(can, msg) { var head = [team.HOUR, team.TASK]
		var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }
		function key(time) { return can.base.Number(time.getHours(), 2) }
		function get(begin_time, col, row, hash) { return hash[list[row]] }
		function set(begin_time, col, row) { return can.base.Time(begin_time, "%y-%m-%d ")+list[row] }
		can.onimport._content(can, msg, head, list, key, get, set)
	},
	week: function(can, msg) { var head = can.onexport.head(can, team.HOUR)
		var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)) }
		// var list = [0]; for (var i = 7; i < 24; i++) { list.push(can.base.Number(i, 2)+":00") }
		function key(time) { return time.getDay()+" "+can.base.Number(time.getHours(), 2) }
		function get(begin_time, col, row, hash) { return hash[col-1+" "+list[row]] }
		function set(begin_time, col, row) { return can.base.Time(can.base.DateAdd(begin_time, -begin_time.getDay()+col-1), "%y-%m-%d ")+list[row] }
		can.onimport._content(can, msg, head, list, key, get, set)
	},
	month: function(can, msg) { var head = can.onexport.head(can, "order")
		var list = [0]; for (var i = 1; i < 6; i++) { list.push(i) }
		function key(time) { return can.base.Time(time, "%y-%m-%d") }
		function get(begin_time, col, row, hash) {
			var begin = can.base.DateAdd(begin_time, -(begin_time.getDate()-1))
			var last = can.base.DateAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())
			var day = can.base.DateAdd(last, (row-1)*7+col)
			var l = can.date.solar2lunar(day)
			return [can.page.Format(html.SPAN, day.getDate(), "day")+" "+can.page.Format(html.SPAN, l.autoDay, l.autoClass)].concat(hash[key(day)]||[])
		}
		function set(begin_time, col, row) {
			var begin = can.base.DateAdd(begin_time, -(begin_time.getDate()-1))
			var last = can.base.DateAdd(begin_time, -(begin_time.getDate()-1)-begin.getDay())
			var day = can.base.DateAdd(last, (row-1)*7+col)
			return key(day)
		}
		can.onimport._content(can, msg, head, list, key, get, set)
	},
	year: function(can, msg) { var head = can.onexport.head(can, team.MONTH)
		var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }
		function key(time) { return can.base.Time(time, "%y-%m ")+time.getDay() }
		function get(begin_time, col, row, hash) { return hash[begin_time.getFullYear()+"-"+can.base.Number(row, 2)+" "+(col-1)] }
		function set(begin_time, col, row) { return begin_time.getFullYear()+"-"+can.base.Number(list[row], 2) }
		can.onimport._content(can, msg, head, list, key, get, set)
	},
	long: function(can, msg) {
		var begin_time = can.base.Date(can.base.Time(can.Option(team.BEGIN_TIME), "%y-%m-%d %H:%M:%S")), begin = begin_time.getFullYear() - 5
		var head = [team.MONTH]; for (var i = 0; i < 10; i++) { head.push(begin+i) }
		var list = [0]; for (var i = 1; i < 13; i++) { list.push(i) }
		function key(time) { return can.base.Time(time, "%y-%m") }
		function get(begin_time, col, row, hash) { return hash[begin+col-1+"-"+can.base.Number(row, 2)] }
		function set(begin_time, col, row) { return begin+col-1+"-"+can.base.Number(row, 2) }
		can.onimport._content(can, msg, head, list, key, get, set)
	},
	layout: function(can) {
		can.ui.layout(can.ConfHeight(), can.ConfWidth())
		return
		can.page.styleHeight(can, can._output, can.ConfHeight()), can.page.styleHeight(can, can.ui.project, can.ConfHeight())
		var height = can._display_heights[can.sup.task? [can.sup.task.zone, can.sup.task.id].join(mdb.FS): ""]||html.ACTION_HEIGHT
		if (!can.ui.display.innerHTML || can.ui.display.style.display == html.NONE) { height = 0 }
		can.page.style(can, can.ui.table, html.HEIGHT, can.ConfHeight()-height, html.WIDTH, can.ConfWidth()-can.ui.project.offsetWidth-can.ui.profile.offsetWidth)
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight()-height, html.WIDTH, can.ConfWidth()-can.ui.project.offsetWidth-can.ui.profile.offsetWidth)
		can.page.styleHeight(can, can.ui.profile, can.ConfHeight()-height), height == 0 || can.core.List(can._plugins_display, function(sub) {
			sub.onimport.size(sub, height-html.ACTION_HEIGHT-sub.onexport.statusHeight(sub), sub.ConfWidth(can.ConfWidth()-can.ui.project.offsetWidth), true)
		})
	}
}, [""])
Volcanos(chat.ONACTION, {list: [
		["status", "status", "prepare", "process", "cancel", "finish"],
		["level", "level", "l1", "l2", "l3", "l4", "l5"],
		["score", "score", "s1", "s2", "s3", "s4", "s5"],
		["view", "text", "name", "text", "level", "score"],
	], _trans: {"task": "任务", "hour": "时间", "month": "月份", "order": "周序"},
	prev: function(event, can) { var begin = can.base.Date(can.Option(team.BEGIN_TIME)||can.base.Time())
		can.Option(team.BEGIN_TIME, can.base.Time(new Date(begin-can.onexport.span(can)))), can.Update()
	},
	next: function(event, can) { var begin = can.base.Date(can.Option(team.BEGIN_TIME)||can.base.Time())
		can.Option(team.BEGIN_TIME, can.base.Time(new Date(begin-(-can.onexport.span(can))))), can.Update()
	},
	insertTask: function(event, can, time) { var msg = can.sup.request(event, {begin_time: time})
		can.user.input(event, can, can.Conf([ctx.FEATURE, mdb.INSERT]), function(args) {
			can.runAction(event, mdb.INSERT, [mdb.ZONE, args[1], team.BEGIN_TIME, time].concat(args))
		})
	},
	modifyTask: function(event, can, task, key, value) { can.runAction(can.request(event, task, can.Option()), mdb.MODIFY, [key, value], function() { can.Update() }) },
	_filter: function(event, can, key, value) { var count = 0
		if (value == key) {
			can.page.Select(can, can.ui.content, html.DIV_ITEM, function(item) { can.page.ClassList.del(can, item, html.HIDE), count++ })
		} else {
			can.page.Select(can, can.ui.content, html.DIV_ITEM, function(item) { can.page.ClassList.add(can, item, html.HIDE) })
			can.page.Select(can, can.ui.content, can.core.Keys(html.DIV, value), function(item) { can.page.ClassList.del(can, item, html.HIDE), count++ })
		} can.Action(key, value), can.Status(mdb.COUNT, count)
	},
	status: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
	level: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
	score: function(event, can, key, value) { can.onaction._filter(event, can, key, value) },
	view: function(event, can, key, value) { can.Action(key, value), can.onmotion.clear(can, can.ui.project), can.onmotion.clear(can, can.ui.content), can.core.CallFunc([can.onimport, can.Option("scale")], [can, can._msg]) },
})
Volcanos(chat.ONEXPORT, {list: [mdb.COUNT, team.BEGIN_TIME, mdb.ZONE, mdb.ID, mdb.TYPE, mdb.NAME, mdb.TEXT],
	span: function(can) { return kit.Dict(team.DAY, 24*3600*1000, team.WEEK, 7*24*3600*1000, team.MONTH, 30*24*3600*1000, team.YAER, 365*24*3600*1000, team.LONG, 365*24*3600*1000)[can.Option("scale")]||0 },
	hash: function(can, task) { if (!can.isCmdMode()) { return } location.hash = [task.zone, task.id].join(nfs.DF) },
	head: function(can, scale) { if ([team.YEAR, team.LONG].indexOf(scale) > -1) { return } return [scale].concat(can.user.time(can, "", "%W")) },
	name: function(can, task) { return task.name },
	text: function(can, task) { return task.name+": "+(task.text||"") },
	level: function(can, task) { return "l-"+(task.level||3)+": "+(task.name||"") },
	score: function(can, task) { return "s-"+(task.level||3)+": "+(task.name||"") },
	title: function(can, task) { return task.zone+": "+(task.type||"") },
	style: function(can, task) { return [html.ITEM, task.status, mdb.ID+task.id, "l"+(task.level||""), "s"+(task.score||"")].join(lex.SP) },
})
