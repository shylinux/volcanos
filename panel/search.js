Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, list, cb, target) {
		can._foreach = "*"
		can._foreach = "command,space,text"
		can.list = msg.Table(), can.onmotion.clear(can, can.ui.content)
		var table = can.onappend.table(can, msg, function(value, key, index, line, array) { can.Status(mdb.TOTAL, index+1)
			return {text: [key == mdb.TEXT && can.base.isFunc(line.text) && line.text.help || value, html.TD], onclick: function(event) {
				can.onaction[can.type == can._foreach||event.ctrlKey? chat.PLUGIN: mdb.SELECT](event, can, index) 
			}}
		}, can.ui.content, can.core.List((msg.Option("sort")||"ctx,cmd,type,name,text").split(ice.FS), function(item) {
			return list.indexOf(item)
		})); table && can.page.styleWidth(can, can.ui.display, table.offsetWidth)

		can.page.Select(can, can._output, html.A, function(item) {
			item.onclick = function(event) { can.user.open(item.href), can.onkeymap.prevent(event) }
		}), can.onmotion.story.auto(can)

		can.onappend._status(can, can.base.Obj(msg.Option(ice.MSG_STATUS), []).concat({name: "selected", value: "0"}))
		msg.Length() == 1 && can.ui.profile.innerHTML == "" && can.page.Select(can, table, html.TD)[0].click()
	},
	_word: function(can, msg, cmds, fields) { can.type = cmds[0]
		var cb = can.onaction[cmds[1]]; if (cb) { cb({}, can); return }

		var res = can.request({}, {
			word: cmds, fields: fields.join(ice.FS), sort: msg.Option("sort"),
			river: msg.Option(chat.RIVER), index: msg.Option(mdb.INDEX),
		})

		can.onengine.signal(can, chat.ONSEARCH, res)
		can.run(res, cmds, function(res) { can.onimport._init(can, res, fields) })
		can.onmotion.show(can), can.onmotion.delay(can, function() {
			can.onmotion.focus(can, can.ui.word)
		})
	},

	select: function(can, msg, cmds, cb) { can.ui.word.value = cmds[1]
		var fields = (cmds[2]||msg.Option(ice.MSG_FIELDS)||"ctx,cmd,type,name,text").split(ice.FS)
		can.page.Appends(can, can.ui.display, [{th: fields}]), can.cb = function() {
			can.base.isFunc(cb) && cb(can.onexport.select(can)), can.onmotion.hide(can)
		}

		can.input = function(event, word) { cmds[1] = word||cmds[1]
			can.onimport._word(can, msg, cmds, fields)
		}, can.onimport._word(can, msg, cmds, fields)

		can.getActionSize(function(msg, top, left, width, height) {
			can.ConfHeight(height-2*html.ACTION_HEIGHT-2*html.PLUGIN_MARGIN)
			can.ConfWidth(width-2*html.PLUGIN_MARGIN)
			can.page.style(can, can._target, {top: top, left: left})
			can.page.style(can, can._output, html.MAX_HEIGHT, can.ConfHeight(), html.MAX_WIDTH, can.ConfWidth())
			can.page.style(can, can.ui.content, html.MAX_WIDTH, can.ConfWidth())
			can.page.style(can, can.ui.display, html.MAX_WIDTH, can.ConfWidth())
			can.page.style(can, can.ui.profile, html.MAX_WIDTH, can.ConfWidth())
		})
	},
})
Volcanos(chat.ONACTION, {help: "交互操作", list: [cli.CLOSE, cli.CLEAR, cli.DONE], _init: function(can, cb, target) {
		can.onmotion.hidden(can, can._target), can.base.isFunc(cb) && cb()
	},
	onlogin: function(can, msg) {
		can.onappend._action(can, can.Conf(html.ACTION)||can.onaction.list)
		can.ui = can.page.Append(can, can._output, [
			{input: ["word", function(event) { can.onkeymap.input(event, can)
				if (event.ctrlKey) {
					if (event.key == "0") {
						can.onaction.clear(event, can)
					}
					if ("1" <= event.key && event.key <= "9") {
						can.page.Select(can, can.ui.content, [html.TBODY, html.TR], function(tr, index) {
							if (index+1 == event.key) {
								can.page.Select(can, tr, html.TD, function(td, index) {
									index == 0 && td.click()
								})
							}
						})
						return
					}
				}
				if (event.key == lang.ESCAPE) { return can.onmotion.hide(can) }

				if (event.key == lang.ENTER) { can.onkeymap.prevent(event)
					if (event.shiftKey) { var first = can.page.Select(can, can.ui.content, html.TR)[1]
						return can.onaction[can.type == can._foreach? chat.PLUGIN: html.SELECT](event, can, first.dataset.index)
					}
					if (event.ctrlKey) { return can.onaction[cli.DONE](event, can) }
					return can.input(event, event.target.value)
				}
				can.page.Select(can, can.ui.content, [html.TBODY, html.TR], function(tr) {
					var has = false; can.page.Select(can, tr, html.TD, function(td) {
						has = has || td.innerText.indexOf(event.target.value) > -1
					}), can.page.ClassList.set(can, tr, html.HIDDEN, !has)
				})
			}]},
			chat.CONTENT, html.STATUS, {view: [chat.DISPLAY, html.TABLE]}, chat.PROFILE,
		]), can.page.ClassList.add(can, can.ui.display, chat.CONTENT)
	},
	onopensearch: function(can, msg, type, word) { can.onimport.select(can, msg, [type||can._foreach, word||""]) },

	clear: function(event, can) { can.onmotion.clear(can, can.ui.profile) },
	done: function(event, can) { can.base.isFunc(can.cb) && can.cb() },
	close: function(event, can) { can.onmotion.hide(can) },

	select: function(event, can, index) { var line = can.list[index]
		if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }

		var fields = can.page.Select(can, can.ui.display, html.TH, function(item) { return item.innerText })
		can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) { return line[item] }), data: {index: index}, onclick: function(event) {
			can.page.Remove(can, event.target.parentNode)
			can.Status("selected", can.page.Select(can, can.ui.display, html.TR).length-1)
		}}]), can.Status("selected", can.page.Select(can, can.ui.display, html.TR).length-1)
	},

	plugin: function(event, can, index) { var line = can.list[index]
		if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }
		if (line.ctx == "web.wiki" && line.cmd == "word") { return }
		if (can.page.tagis(html.A, event.target)) { return }

		var cmd = line.cmd == ctx.COMMAND? can.core.Keys(line.type, line.name.split(ice.SP)[0]): can.core.Keys(line.ctx, line.cmd)
		can.onappend.plugin(can, {type: "plug", index: cmd||msg.Option(mdb.INDEX)}, function(sub, meta) {
			sub.run = function(event, cmds, cb) { can.runActionCommand(event, meta.index, cmds, cb) }
			can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth(can.ConfWidth()))
			sub.ConfHeight(can.ConfHeight()-2*html.ACTION_HEIGHT)
			sub.Focus()
		}, can.ui.profile)
	},
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	select: function(can) {
		return can.page.Select(can, can.ui.display, html.TR, function(tr) {
			return can.page.Select(can, tr, html.TD, function(td) { return td.innerHTML })
		}).slice(1)
	},
})
