Volcanos("onimport", {help: "导入数据", list: [], _init: function(can, msg, list, cb, target) {
		can.list = msg.Table(), can.onmotion.clear(can, can.ui.content)
		var table = can.onappend.table(can, msg, function(value, key, index, line, array) { can.Status(mdb.TOTAL, index+1)
			return {text: [key == mdb.TEXT && can.base.isFunc(line.text) && line.text.help || value, html.TD], onclick: function(event) {
				can.onaction[can.type == "*"||event.ctrlKey? chat.PLUGIN: mdb.SELECT](event, can, index) 
			}}
		}, can.ui.content, can.core.List((msg.Option("sort")||"ctx,cmd,type,name,text").split(ice.FS), function(item) {
			return list.indexOf(item)
		})); table && can.page.Modify(can, can.ui.display, {style: {width: table.offsetWidth}})
		can.onmotion.story.auto(can)

		can.onappend._status(can, can.base.Obj(msg.Option("_status"), []).concat({name: "selected", value: "0"}))
		can.getActionSize(function(msg, height) {
			can.page.Modify(can, can.ui.profile, kit.Dict(html.MAX_HEIGHT, can.base.Min(height-(table&&table.offsetHeight||0), height/2)))
		})
		msg.Length() == 1 && can.page.Select(can, table, html.TD)[0].click()
		can.page.Select(can, can._output, "A", function(item) {
			item.onclick = function(event) { can.user.open(item.href), can.onkeymap.prevent(event) }
		})
	},
	_word: function(can, msg, cmds, fields) { can.type = cmds[0]
		var cb = can.onaction[cmds[1]]; if (cb) { cb({}, can); return }

		var res = can.request({}, {
			word: cmds, fields: fields.join(ice.FS), sort: msg.Option("sort"),
			river: msg.Option(chat.RIVER), index: msg.Option("index"),
		})

		can.onengine.signal(can, chat.ONSEARCH, res)
		can.run(res._event, cmds, function(res) { can.onimport._init(can, res, fields) })
		can.onmotion.show(can), can.onmotion.focus(can, can.ui.word)
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
			can.page.Modify(can, can._target, {style: {top: top, left: left}})
			can.page.Modify(can, can._output, {style: kit.Dict(html.MAX_HEIGHT, height-71, html.MAX_WIDTH, width-2*html.PLUGIN_MARGIN)})
			can.page.Modify(can, can.ui.content, {style: kit.Dict(html.MAX_WIDTH, width-2*html.PLUGIN_MARGIN)})
			can.page.Modify(can, can.ui.display, {style: kit.Dict(html.MAX_WIDTH, width-2*html.PLUGIN_MARGIN)})
		})
	},
})
Volcanos("onaction", {help: "交互操作", list: [cli.CLEAR, cli.CLOSE, cli.DONE], _init: function(can, cb, target) {
		can.onmotion.hidden(can, can._target)
		can.base.isFunc(cb) && cb()
	},
	onlogin: function(can, msg) {
		can.onappend._action(can, can.Conf(html.ACTION)||can.onaction.list)
		can.ui = can.page.Append(can, can._output, [
			{input: ["word", function(event) { can.onkeymap.input(event, can)
				if (event.key == lang.ESCAPE) { can.onmotion.hide(can) }

				if (event.key == lang.ENTER) { can.onkeymap.prevent(event)
					if (event.shiftKey) { var first = can.page.Select(can, can.ui.content, html.TR)[1]
						return can.onaction[can.type == "*"? chat.PLUGIN: html.SELECT](event, can, first.dataset.index)
					}
					if (event.ctrlKey) { return can.onaction[cli.DONE](event, can) }
					can.input(event, event.target.value)
				}
				can.page.Select(can, can.ui.content, html.TR, function(tr, index) {
					if (index == 0) { return }
					var has = false; can.page.Select(can, tr, html.TD, function(td) {
						has = has || td.innerText.indexOf(event.target.value) > -1
					})
					can.page.ClassList.set(can, tr, html.HIDDEN, !has)
				})
			}]},
			{view: chat.CONTENT}, {view: html.STATUS}, {view: [chat.DISPLAY, html.TABLE]},{view: chat.PROFILE},
		]), can.page.ClassList.add(can, can.ui.display, chat.CONTENT)
	},
	onopensearch: function(can, msg, type, word) { can.onimport.select(can, msg, [type||"*", word||""]) },

	clear: function(event, can) { can.onmotion.clear(can, can.ui.profile) },
	done: function(event, can) { can.base.isFunc(can.cb) && can.cb() },
	close: function(event, can) { can.onmotion.hide(can) },

	select: function(event, can, index) { var line = can.list[index]
		if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }

		if (line.ctx == "web.chat" && line.cmd == "/search") {
			return can.onimport.select(can, msg, [line.type, line.name, line.text], can.cb)
		}

		var fields = can.page.Select(can, can.ui.display, html.TH, function(item) { return item.innerText })
		can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) {
			return line[item]
		}), data: {index: index}, onclick: function(event) { can.page.Remove(can, event.target.parentNode)
			can.Status("selected", can.page.Select(can, can.ui.display, html.TR).length-1)
		}}]), can.Status("selected", can.page.Select(can, can.ui.display, html.TR).length-1)
	},

	plugin: function(event, can, index) { var line = can.list[index]
		if (event.target.tagName == "A") { return }
		if (line.ctx == "web.wiki" && line.cmd == "word") { return }
		if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }

		var cmd = line.cmd == ctx.COMMAND? can.core.Keys(line.type, line.name.split(ice.SP)[0]): can.core.Keys(line.ctx, line.cmd)
		can.onappend.plugin(can, {type: chat.PLUGIN, index: cmd||msg.Option(mdb.INDEX)}, function(sub, meta) {
			can.getActionSize(function(msg, height, width) { height = can.base.Min(height - can.ui.content.offsetHeight+204, height/2)
				can.page.Modify(can, sub._output, {style: kit.Dict(html.MAX_HEIGHT, height-26, html.MAX_WIDTH, width-40)})
				sub.Conf(html.HEIGHT, height+28), sub.Conf(html.WIDTH, width-60)
			})

			sub.run = function(event, cmds, cb) { var msg = can.request(event)
				can.run(event, can.misc.concat(can, [ctx.ACTION, ice.RUN, meta.index], cmds), cb, true)
			}
			sub.Focus()
		}, can.ui.profile)
	},
})
Volcanos("onexport", {help: "导出数据", list: [],
	select: function(can) {
		return can.page.Select(can, can.ui.display, html.TR, function(tr) {
			return can.page.Select(can, tr, html.TD, function(td) { return td.innerHTML })
		}).slice(1)
	},
})
