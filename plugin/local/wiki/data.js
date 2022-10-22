Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) { can.onmotion.clear(can)
		if (can.Option(mdb.TYPE)) { return can.onfigure[can.Option(mdb.TYPE)](can, msg, can.Option("fields")) }
		can.ui = can.onlayout.display(can), can.table = can.onappend.table(can, msg, function(value, key, index, line) {
			return {text: [value, html.TD], oncontextmenu: function(event) {
				can.user.carte(event, can, can.ondetail, can.ondetail.list, function(ev, cmd, meta) {
					var cb = meta[cmd]; cb && cb(event, can, cmd, value, key, index, line)
				})
			}, onclick: function(event) {
				key == nfs.PATH && can.run(event, [can.Option(nfs.PATH, value)])
			}, ondblclick: function(event) {
				can.page.editable(can, event.target, true)
			}}
		}, can.ui.content), can.base.isFunc(cb) && cb(msg), can.onappend._status(can, msg.append), can.onaction._compute(event, can)
	},
}, [""])
Volcanos(chat.ONFIGURE, {help: "组件菜单",
	"求和": function(event, can, res, td, index) {
		res[index] = parseInt(td.innerText) + (res[index]||0);
	},
	"最大": function(event, can, res, td, index) {
			(res[index] === undefined || parseInt(td.innerText) > parseInt(res[index])) && (res[index] = parseInt(td.innerText))
	},
	"最小": function(event, can, res, td, index) {
		(res[index] === undefined || parseInt(td.innerText) < parseInt(res[index])) && (res[index] = parseInt(td.innerText))
	},
	"平均": function(event, can, res, td, ncol, cols, rows, nrow) {
		res[ncol] = parseInt(td.innerText) + (res[ncol]||0);
		if (nrow == rows.length - 1) {
			res[ncol] = res[ncol] / nrow
		}
	},
	"折线图": function(can, msg, fields) {
		return can.onappend.plugin(can, {type: "output", index: "can.plugin", display: "/plugin/story/trend.js", width: can.ConfWidth(), height: can.ConfHeight()}, function(sub) {
			sub.list = can.core.List(can.core.Split(fields), function(field) { return msg.Table(function(item) { return item[field] }) })
			sub.Conf(ice.VIEW, "折线图")
		})
	},
	"比例图": function(can, msg, fields) {
		return can.onappend.plugin(can, {type: "output", index: "can.plugin", display: "/plugin/story/pie.js", width: can.ConfWidth(), height: can.ConfHeight()}, function(sub) {
			sub.list = can.core.List(can.core.Split(fields), function(field) { return msg.Table(function(item) { return item[field] }) })
			sub.__msg = msg, sub.Conf(mdb.FIELD, fields)
		})
	},
})
Volcanos(chat.ONACTION, {help: "组件菜单", list: [ice.SAVE, [ice.MODE, "全选", "块选", "反选", "多选", "拖动", "编辑"], [ice.EXEC, "求和", "最大", "最小", "平均"]],
	_compute: function(event, can) {
		var mul = html.TR + (can.Action(ice.MODE) == "全选"? "": ".select")
		var method = can.onfigure[can.Action(ice.EXEC)], res = {}

		can.page.Select(can, can.ui.content, mul, function(tr, nrow, rows) {
			(mul != html.TR || nrow > 0) && can.page.Select(can, tr, html.TD, function(td, ncol, cols) {
				method && method(event, can, res, td, ncol, cols, rows, nrow)
			})
		})
		can.core.Item(res, function(key, value) { can.Status(can._msg.append[key], value||"") })
	},

	save: function(event, can, button) { can.runAction(event, button, [can.Option(nfs.PATH), can.onexport.file(can)]) },
	exec: function(event, can, button) { can.onaction._compute(event, can) },
	push: function(event, can, button) {
		can.user.input(event, can, can.page.Select(can, can._output, ["table.content", "tr>th"], function(th, index) { return {name: th.innerText, run: function(event, cmds, cb) {
			var msg = can.request(event); can.page.Select(can, can._output, ["table.content", "tr"], function(tr, order) { order != 0 && msg.Push(mdb.VALUE, tr.children[index].innerText) }), cb(msg)
		}} }), function(list) { can.run(can.request(event, {_handle: true}), [button, can.Option(nfs.PATH)].concat(list), function() { can.Update() }) })
	},
	draw: function(event, can, button) {
		can.user.input(event, can, [["type", "折线图", "比例图"], {name: "fields", run: function(event, cmds, cb) {
			var msg = can.request(event); can.page.Select(can, can._output, ["table.content", "tr>th"], function(th) { msg.Push(mdb.VALUE, th.innerText) }), cb(msg)
		}}], function(list) { can.onfigure[list[0]](can, can._msg, list[1]) })
	},

	_foreach: function(can, button, cb) {
		button && can.Action(ice.MODE, button)
		can.page.Select(can, can.ui.content, html.TR, function(item) {
			cb(item)
		})
	},

	"全选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			can.page.editable(can, item, false)
			can.page.draggable(can, item, false)
			item.onmouseenter = null, item.onclick = null
			can.page.ClassList.del(can, item, html.SELECT)
			can.page.ClassList.del(can, item, "over")
		})
		can.onaction._compute(event, can)
	},
	"块选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			item.onmouseenter = function() {
				can.page.ClassList.add(can, item, html.SELECT)
				can.onaction._compute(event, can)
			}
		})
	},
	"反选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			item.onmouseenter = function() {
				can.page.ClassList.del(can, item, html.SELECT)
				can.onaction._compute(event, can)
			}
		})
	},
	"多选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			item.onmouseenter = function() {}
			item.onclick = function() {
				can.page.ClassList.neg(can, item, html.SELECT)
				can.onaction._compute(event, can)
			}
		})
	},
	"拖动": function(event, can, button) {
		can.onaction["全选"](event, can, button)
		can.onaction._foreach(can, "", function(item) {
			can.page.draggable(can, item, true)
			item.ondragstart = function(event) { can.drag = item }
			item.ondragover = function(event) { event.preventDefault(), can.page.ClassList.add(can, item, "over")}
			item.ondragleave = function(event) { can.page.ClassList.del(can, item, "over") }
			item.ondrop = function(event) { event.preventDefault()
				can.page.Select(can, can.ui.content, html.TABLE, function(table) {
					table.insertBefore(can.drag, item)
				})
			}
		})
	},
	"编辑": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			can.page.editable(can, item, true)
		})
	},
})
Volcanos(chat.ONDETAIL, {help: "组件详情", list: ["复制", "删除"],
	"复制": function(event, can, button, value, key, index, line) {
		var end = can.page.Append(can, can.table, [{type: html.TR, list: can.core.List(can._msg.append, function(key) {
			return {text: [line[key], html.TD]}
		})}]).tr; can.table.insertBefore(end, event.target.parentNode)
	},
	"删除": function(event, can, button) {
		can.page.Remove(can, event.target.parentNode)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	file: function(can) {
		return can.page.Select(can, can.ui.content, html.TR, function(tr) {
			return can.page.Select(can, tr, can.page.Keys(html.TH, html.TD), function(td) {return td.innerHTML}).join(ice.FS)
		}).join(ice.NL)
	},
})

Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) { can.onmotion.clear(can)
		if (can.Option(mdb.TYPE)) { return can.onfigure[can.Option(mdb.TYPE)](can, msg, can.Option("fields")) }
		can.ui = can.onlayout.display(can), can.table = can.onappend.table(can, msg, function(value, key, index, line) {
			return {text: [value, html.TD], oncontextmenu: function(event) {
				can.user.carte(event, can, can.ondetail, can.ondetail.list, function(ev, cmd, meta) {
					var cb = meta[cmd]; cb && cb(event, can, cmd, value, key, index, line)
				})
			}, onclick: function(event) {
				key == nfs.PATH && can.run(event, [can.Option(nfs.PATH, value)])
			}, ondblclick: function(event) {
				can.page.editable(can, event.target, true)
			}}
		}, can.ui.content), can.base.isFunc(cb) && cb(msg), can.onappend._status(can, msg.append), can.onaction._compute(event, can)
	},
}, [""])
Volcanos(chat.ONFIGURE, {help: "组件菜单",
	"求和": function(event, can, res, td, index) {
		res[index] = parseInt(td.innerText) + (res[index]||0);
	},
	"最大": function(event, can, res, td, index) {
			(res[index] === undefined || parseInt(td.innerText) > parseInt(res[index])) && (res[index] = parseInt(td.innerText))
	},
	"最小": function(event, can, res, td, index) {
		(res[index] === undefined || parseInt(td.innerText) < parseInt(res[index])) && (res[index] = parseInt(td.innerText))
	},
	"平均": function(event, can, res, td, ncol, cols, rows, nrow) {
		res[ncol] = parseInt(td.innerText) + (res[ncol]||0);
		if (nrow == rows.length - 1) {
			res[ncol] = res[ncol] / nrow
		}
	},
	"折线图": function(can, msg, fields) {
		return can.onappend.plugin(can, {type: "output", index: "can.plugin", display: "/plugin/story/trend.js", width: can.ConfWidth(), height: can.ConfHeight()}, function(sub) {
			sub.list = can.core.List(can.core.Split(fields), function(field) { return msg.Table(function(item) { return item[field] }) })
			sub.Conf(ice.VIEW, "折线图")
		})
	},
	"比例图": function(can, msg, fields) {
		return can.onappend.plugin(can, {type: "output", index: "can.plugin", display: "/plugin/story/pie.js", width: can.ConfWidth(), height: can.ConfHeight()}, function(sub) {
			sub.list = can.core.List(can.core.Split(fields), function(field) { return msg.Table(function(item) { return item[field] }) })
			sub.__msg = msg, sub.Conf(mdb.FIELD, fields)
		})
	},
})
Volcanos(chat.ONACTION, {help: "组件菜单", list: [ice.SAVE, [ice.MODE, "全选", "块选", "反选", "多选", "拖动", "编辑"], [ice.EXEC, "求和", "最大", "最小", "平均"]],
	_compute: function(event, can) {
		var mul = html.TR + (can.Action(ice.MODE) == "全选"? "": ".select")
		var method = can.onfigure[can.Action(ice.EXEC)], res = {}

		can.page.Select(can, can.ui.content, mul, function(tr, nrow, rows) {
			(mul != html.TR || nrow > 0) && can.page.Select(can, tr, html.TD, function(td, ncol, cols) {
				method && method(event, can, res, td, ncol, cols, rows, nrow)
			})
		})
		can.core.Item(res, function(key, value) { can.Status(can._msg.append[key], value||"") })
	},

	save: function(event, can, button) { can.runAction(event, button, [can.Option(nfs.PATH), can.onexport.file(can)]) },
	exec: function(event, can, button) { can.onaction._compute(event, can) },
	draw: function(event, can, button) {
		can.user.input(event, can, [{name: "type", values: ["折线图", "比例图"]}, "fields"], function(list) { can.onfigure[list[0]](can, can._msg, list[1]) })
	},
	push: function(event, can, button) {
		can.user.input(event, can, can.page.Select(can, can._output, ["table.content", "tr>th"], function(th, index) { return {name: th.innerText, run: function(event, cmds, cb) {
			var msg = can.request(event); can.page.Select(can, can._output, ["table.content", "tr"], function(tr, order) {
				order != 0 && msg.Push("value", tr.children[index].innerText)
			}), cb(msg)
		}} }), function(list) {
			can.run(can.request(event, {_handle: true}), [button, can.Option(nfs.PATH)].concat(list), function() { can.Update() })
		})
	},

	_foreach: function(can, button, cb) {
		button && can.Action(ice.MODE, button)
		can.page.Select(can, can.ui.content, html.TR, function(item) {
			cb(item)
		})
	},

	"全选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			can.page.editable(can, item, false)
			can.page.draggable(can, item, false)
			item.onmouseenter = null, item.onclick = null
			can.page.ClassList.del(can, item, html.SELECT)
			can.page.ClassList.del(can, item, "over")
		})
		can.onaction._compute(event, can)
	},
	"块选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			item.onmouseenter = function() {
				can.page.ClassList.add(can, item, html.SELECT)
				can.onaction._compute(event, can)
			}
		})
	},
	"反选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			item.onmouseenter = function() {
				can.page.ClassList.del(can, item, html.SELECT)
				can.onaction._compute(event, can)
			}
		})
	},
	"多选": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			item.onmouseenter = function() {}
			item.onclick = function() {
				can.page.ClassList.neg(can, item, html.SELECT)
				can.onaction._compute(event, can)
			}
		})
	},
	"拖动": function(event, can, button) {
		can.onaction["全选"](event, can, button)
		can.onaction._foreach(can, "", function(item) {
			can.page.draggable(can, item, true)
			item.ondragstart = function(event) { can.drag = item }
			item.ondragover = function(event) { event.preventDefault(), can.page.ClassList.add(can, item, "over")}
			item.ondragleave = function(event) { can.page.ClassList.del(can, item, "over") }
			item.ondrop = function(event) { event.preventDefault()
				can.page.Select(can, can.ui.content, html.TABLE, function(table) {
					table.insertBefore(can.drag, item)
				})
			}
		})
	},
	"编辑": function(event, can, button) {
		can.onaction._foreach(can, button, function(item) {
			can.page.editable(can, item, true)
		})
	},
})
Volcanos(chat.ONDETAIL, {help: "组件详情", list: ["复制", "删除"],
	"复制": function(event, can, button, value, key, index, line) {
		var end = can.page.Append(can, can.table, [{type: html.TR, list: can.core.List(can._msg.append, function(key) {
			return {text: [line[key], html.TD]}
		})}]).tr; can.table.insertBefore(end, event.target.parentNode)
	},
	"删除": function(event, can, button) {
		can.page.Remove(can, event.target.parentNode)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	file: function(can) {
		return can.page.Select(can, can.ui.content, html.TR, function(tr) {
			return can.page.Select(can, tr, can.page.Keys(html.TH, html.TD), function(td) {return td.innerHTML}).join(ice.FS)
		}).join(ice.NL)
	},
})
