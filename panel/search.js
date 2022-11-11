Volcanos(chat.ONIMPORT, {_init: function(can, msg) { can.onmotion.clear(can, can.ui.content), can.list = msg.Table()
		var table = can.onappend.table(can, msg, function(value, key, index, line) { can.Status(mdb.TOTAL, index+1)
			return {text: [key == mdb.TEXT && can.base.isFunc(line.text) && line.text.help || value, html.TD], onclick: function(event) { if (can.page.tagis(event.target, html.A)) { return }
				can.onaction[can.type==mdb.FOREACH||event.ctrlKey? chat.PLUGIN: mdb.SELECT](event, can, index) 
			}}
		}, can.ui.content, can.core.List((msg.Option("sort")||"ctx,cmd,type,name,text").split(ice.FS))); can.onmotion.story.auto(can)
		can.onappend._status(can, can.base.Obj(msg.Option(ice.MSG_STATUS), []).concat({name: "selected", value: "0"}))
		can.onmotion.focus(can, can.ui.word), msg.Length() == 1 && can.ui.profile.innerHTML == "" && can.page.Select(can, table, html.TD)[0].click()
		can.page.style(can, can._output, html.MAX_HEIGHT, window.innerHeight-2*html.PLUGIN_MARGIN-5*html.ACTION_HEIGHT)
	},
	_word: function(can, msg, cmds, fields) {
		if (cmds[1].indexOf(";") > -1) { var ls = can.core.Split(cmds[1], "\t ;", "\t ;"); cmds[0] = ls[0], cmds[1] = ls[1] }
		can.run(can.request({}, {word: cmds, fields: fields.join(ice.FS)}, msg), cmds, function(res) {
			res.Option("word", cmds)
			can.type = cmds[0], can.onengine.signal(can, chat.ONSEARCH, res), can.onimport._init(can, res)
		}), can.onmotion.show(can)
	},
	select: function(can, msg, cmds, cb) {
		can.getActionSize(function(left, top, width, height) { can.ConfHeight(height-2*html.ACTION_HEIGHT-2*html.PLUGIN_MARGIN), can.ConfWidth(width-2*html.PLUGIN_MARGIN)
			can.page.style(can, can._target, {left: left||0, top: top||0})
			can.page.style(can, can._output, html.MAX_HEIGHT, can.ConfHeight())
			can.page.style(can, can.ui.content, html.MAX_WIDTH, can.ConfWidth())
			can.page.style(can, can.ui.display, html.MAX_WIDTH, can.ConfWidth())
			can.page.style(can, can.ui.profile, html.MAX_WIDTH, can.ConfWidth())
		})
		var fields = (cmds[2]||msg.Option(ice.MSG_FIELDS)||"ctx,cmd,type,name,text").split(ice.FS); can.page.Appends(can, can.ui.display, [{th: fields}]), can.ui.word.value = cmds[1]
		can.cb = function() { can.base.isFunc(cb) && cb(can.onexport.select(can)), can.onmotion.hide(can) }
		can.input = function(event, word) { cmds[1] = word||cmds[1]; can.onimport._word(can, msg, cmds, fields) }
		can.onimport._word(can, msg, cmds, fields)
	},
})
Volcanos(chat.ONACTION, {_init: function(can) { can.onmotion.hidden(can) }, list: [cli.CLOSE, cli.CLEAR, cli.DONE],
	onlogin: function(can, msg) { can.onappend._action(can, can.Conf(html.ACTION)||can.onaction.list)
		can.ui = can.page.Append(can, can._output, [chat.CONTENT, {view: [[chat.DISPLAY, chat.CONTENT], html.TABLE]}, chat.PROFILE])
		can.ui.word = can.page.Append(can, can._action, [{input: ["word", function(event) { // can.onkeymap.input(event, can)
			if (event.key == lang.ESCAPE) { return can.onmotion.hide(can) }
			if (event.key == lang.ENTER) { can.onkeymap.prevent(event)
				if (event.shiftKey) { var first = can.page.Select(can, can.ui.content, html.TR)[1]
					return can.onaction[can.type==mdb.FOREACH? chat.PLUGIN: html.SELECT](event, can, first.dataset.index)
				} return event.ctrlKey? can.onaction[cli.DONE](event, can): can.input(event, event.target.value)
			}
			if (event.ctrlKey) { if (event.key == "0") { return can.onaction.clear(event, can) }
				if ("1" <= event.key && event.key <= "9") { return can.page.Select(can, can.ui.content, [html.TBODY, html.TR], function(tr, index) { index+1 == event.key && tr.firstChild.click() }) }
			} can.onmotion.tableFilter(can, can.ui.content, event.target.value+event.key)
		}] }])._target
	},
	onopensearch: function(can, msg, type, word) { can.onimport.select(can, msg, [type||mdb.FOREACH, word||""]) },

	clear: function(event, can) { can.onmotion.clear(can, can.ui.profile) },
	done: function(event, can) { can.base.isFunc(can.cb) && can.cb() },
	close: function(event, can) { can.onmotion.hide(can) },

	plugin: function(event, can, index) { var line = can.list[index]; if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }
		var cmd = line.cmd == ctx.COMMAND? can.core.Keys(line.type, line.name.split(ice.SP)[0]): can.core.Keys(line.ctx, line.cmd)
		can.onappend.plugin(can, {index: cmd||msg.Option(mdb.INDEX), args: cmd == web.WIKI_WORD? [line.name]: []}, function(sub, meta) { can.onmotion.delay(can, function() { sub.Focus() }, 20)
			sub.onimport.size(sub, can.base.Min(320, can.ConfHeight()-html.ACTION_HEIGHT-can.ui.content.offsetHeight-can.ui.display.offsetHeight)-2*html.ACTION_HEIGHT-1, can.ConfWidth()-1, true)
		}, can.ui.profile)
	},
	select: function(event, can, index) { var line = can.list[index]; if (can.base.isFunc(line.text)) { return can.onmotion.hide(can), line.text(event) }
		var fields = can.page.Select(can, can.ui.display, html.TH, function(item) { return item.innerText })
		can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) { return line[item] }), data: {index: index}, onclick: function(event) {
			can.page.Remove(can, event.target.parentNode), can.Status("selected", can.page.Select(can, can.ui.display, html.TR).length-1)
		}}]), can.Status("selected", can.page.Select(can, can.ui.display, html.TR).length-1)
	},
})
Volcanos(chat.ONEXPORT, {
	select: function(can) { return can.page.Select(can, can.ui.display, html.TR, function(tr) { return can.page.Select(can, tr, html.TD, function(td) { return td.innerHTML }) }).slice(1) },
})
