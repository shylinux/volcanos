Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) { can.onmotion.clear(can)
		if (can.Option(mdb.TYPE)) { return can.onimport[can.Option(mdb.TYPE)](can, msg, can.Option(mdb.FIELD)) }
		can.ui = can.onlayout.display(can), can.table = can.onappend.table(can, msg, function(value, key, index, line) { return can.onimport._value(can, value) }, can.ui.content)
		can.base.isFunc(cb) && cb(msg), can.onappend._status(can, msg.append), can.onaction._compute(event, can)
	},
	_value: function(can, value) {
		return {text: [value, html.TD], oncontextmenu: function(event) {
			can.user.carte(event, can, can.ondetail, can.ondetail.list, function(ev, button, meta) { var cb = meta[button]; can.base.isFunc(cb) && cb(event, can, button) })
		}, ondblclick: function(event) { can.page.editable(can, event.target, true) }}
	},
	_story: function(can, msg, display) { return can.onappend.plugin(can, {msg: msg, mode: chat.OUTPUT, display: can.misc.MergePath(can, display, chat.PLUGIN_STORY)}) },
	"折线图": function(can, msg, field) { return can.onimport._story(can, msg, can.base.MergeURL("trend.js", {field: field, view: "折线图"})) },
	"比例图": function(can, msg, field) { return can.onimport._story(can, msg, can.base.MergeURL("pie.js", {field: field})) },
}, [""])
Volcanos(chat.ONFIGURE, {
	"求和": function(event, can, res, td, index) { res[index] = parseFloat(td.innerText) + (res[index]||0) },
	"最大": function(event, can, res, td, index) { (res[index] === undefined || parseFloat(td.innerText) > parseFloat(res[index])) && (res[index] = parseFloat(td.innerText)) },
	"最小": function(event, can, res, td, index) { (res[index] === undefined || parseFloat(td.innerText) < parseFloat(res[index])) && (res[index] = parseFloat(td.innerText)) },
	"平均": function(event, can, res, td, index, cols, rows, nrow) { res[index] = parseFloat(td.innerText) + (res[index]||0); if (nrow == rows.length - 1) { res[index] = res[index] / nrow } },
})
Volcanos(chat.ONACTION, {list: [ice.SAVE,
		[ice.MODE, "全选", "多选", "块选", "反选", "拖动", "编辑"],
		[ice.EXEC, "求和", "最大", "最小", "平均"],
	],
	_compute: function(event, can) { var method = can.onfigure[can.Action(ice.EXEC)], res = {}
		var mul = html.TR + (can.Action(ice.MODE) == "全选"? "": ".select"); can.page.Select(can, can.table, mul, function(tr, nrow, rows) {
			(mul != html.TR || nrow > 0) && can.page.Select(can, tr, html.TD, function(td, ncol, cols) { method && method(event, can, res, td, ncol, cols, rows, nrow) })
		}), can.core.Item(res, function(key, value) { can.Status(can._msg.append[key], value||"") })
	},
	save: function(event, can, button) { can.runAction(event, button, [can.Option(nfs.PATH), can.onexport.content(can)]) },
	exec: function(event, can, button) { can.onaction._compute(event, can) },
	push: function(event, can, button) {
		can.user.input(event, can, can.page.Select(can, can.table, html.TH, function(th, index) { return {name: th.innerText, run: function(event, cmds, cb) {
			var msg = can.request(event); can.page.Select(can, can.table, html.TR, function(tr, _index) { _index > 0 && msg.Push(mdb.VALUE, tr.children[index].innerText) }), cb(msg)
		}} }), function(list) { can.runAction(event, button, [can.Option(nfs.PATH)].concat(list), function() { can.Update() }) })
	},
	draw: function(event, can, button) {
		can.user.input(event, can, [[mdb.TYPE, "折线图", "比例图"], {name: mdb.FIELD, run: function(event, cmds, cb) {
			var msg = can.request(event); can.page.Select(can, can.table, html.TH, function(th) { msg.Push(mdb.VALUE, th.innerText) }), cb(msg)
		}}], function(list) { can.onimport[list[0]](can, can._msg, list[1]) })
	},
	
	_foreach: function(can, button, cb) { button && can.Action(ice.MODE, button), can.page.Select(can, can.table, "tbody>tr", function(target) { cb(target) }) },
	"全选": function(event, can, button) { can.onaction._foreach(can, button, function(target) {
		can.page.ClassList.del(can, target, html.SELECT), can.page.ClassList.del(can, target, "over")
		can.page.editable(can, target, false), can.page.draggable(can, target, false)
		target.onmouseenter = null, target.onclick = null
	}), can.onaction._compute(event, can) },
	"多选": function(event, can, button) { can.onaction._foreach(can, button, function(target) {
		target.onmouseenter = function() {}, target.onclick = function() { can.page.ClassList.neg(can, target, html.SELECT), can.onaction._compute(event, can) }
	}) },
	"块选": function(event, can, button) { can.onaction._foreach(can, button, function(target) {
		target.onmouseenter = function() { can.page.ClassList.add(can, target, html.SELECT), can.onaction._compute(event, can) }
	}) },
	"反选": function(event, can, button) { can.onaction._foreach(can, button, function(target) {
		target.onmouseenter = function() { can.page.ClassList.del(can, target, html.SELECT), can.onaction._compute(event, can) }
	}) },
	"拖动": function(event, can, button) { can.onaction["全选"](event, can, button), can.onaction._foreach(can, "", function(target) { can.page.draggable(can, target, true)
		target.ondragstart = function(event) { can.drag = target }
		target.ondragover = function(event) { event.preventDefault(), can.page.ClassList.add(can, target, "over")}
		target.ondragleave = function(event) { can.page.ClassList.del(can, target, "over") }
		target.ondrop = function(event) { event.preventDefault(), can.page.ClassList.del(can, target, "over"), can.page.Select(can, can.table, html.TBODY, function(tbody) { tbody.insertBefore(can.drag, target) }) }
	}) },
	"编辑": function(event, can, button) { can.onaction._foreach(can, button, function(target) { can.page.editable(can, target, true) }) },
})
Volcanos(chat.ONDETAIL, {list: ["复制", "删除"],
	"复制": function(event, can) { var list = can.page.Select(can, event.target.parentNode, html.TD, function(target) { return target.innerHTML })
		can.page.insertBefore(can, [{type: html.TR, list: can.page.Select(can, can.table, html.TH, function(key, index) { return can.onimport._value(can, list[index]) })}], event.target.parentNode, can.table)
	},
	"删除": function(event, can) { can.page.Remove(can, event.target.parentNode) },
})
Volcanos(chat.ONEXPORT, {
	content: function(can) { return can.page.Select(can, can.ui.content, html.TR, function(tr) {
		return can.page.Select(can, tr, can.page.Keys(html.TH, html.TD), function(td) {return td.innerHTML}).join(ice.FS)
	}).join(ice.NL) },
})
