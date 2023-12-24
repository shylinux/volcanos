Volcanos(chat.ONIMPORT, {_init: function(can, msg) { can.onmotion.clear(can, can.ui.content)
		var table = can.onappend.table(can, msg, function(value, key, index, data) { return {text: [can.base.isFunc(value) && value.help || value, html.TD], onclick: function(event) {
			can.page.tagis(event.target, html.A) || can.onaction[can.db.type == mdb.FOREACH || event.ctrlKey? mdb.PLUGIN: mdb.SELECT](event, can, data)
		}} }, can.ui.content, msg.append); can.onmotion.story.auto(can), can.onimport._size(can)
		can.onmotion.toggle(can, can._status, can.db.type != mdb.FOREACH) && can.onappend._status(can, can.base.Obj(msg.Option(ice.MSG_STATUS), []).concat({name: mdb.SELECT, value: "0"}))
		can.onmotion.focus(can, can.ui.filter), msg.Length() == 1 && can.ui.profile.innerHTML == "" && can.page.Select(can, table, html.TD)[0].click()
	},
	_size: function(can) { can.ui && can.ui.content && can.getActionSize(function(left, top, width, height) {
		can.page.style(can, can._target, {left: left||0, top: top||0, width: width}),
			can.page.style(can, can._output, html.MAX_HEIGHT, height -= 2*10+(can.user.isMobile? 2: 1)*html.ACTION_HEIGHT+can.onexport.statusHeight(can))
		can.core.List([can.ui.content, can.ui.display], function(target) { can.page.style(can, target, html.MAX_WIDTH, can.ConfWidth(width-2*10)) })
		can.ConfHeight(can.base.Min(height-can.ui.content.offsetHeight-can.ui.display.offsetHeight-1, height/2))
	}) },
	_input: function(can, msg, arg, fields) { if (can.base.contains(arg[1], ";")) { arg = can.core.Split(arg[1], "\t ;", "\t ;") }
		can.run(can.request({}, {fields: fields.join(mdb.FS)}, msg), arg, function(res) { can.db.type = arg[0]
			res.Option(ice.ARG, arg), can.onengine.signal(can, chat.ONSEARCH, res), can.onimport._init(can, res)
		}), can.onmotion.toggle(can, can._target, true)
	},
	select: function(can, msg, cmds, cb) { can.ui.filter.value = cmds[1], can.ui.input = function(event, word) { cmds[1] = word||cmds[1]; can.onimport._input(can, msg, cmds, fields) }
		var fields = (cmds[2]||msg.Option(ice.MSG_FIELDS)||"ctx,cmd,type,name,text").split(mdb.FS); can.page.Appends(can, can.ui.display, [{th: fields}]), can.onmotion.hidden(can, can.ui.display), can.onmotion.clear(can, can.ui.profile)
		can.ui.done = function() { can.base.isFunc(cb) && cb(can.onexport.select(can)), can.onmotion.hidden(can) }, can.db = {}, can._plugins = [], can.onimport._input(can, msg, cmds, fields)
	},
})
Volcanos(chat.ONACTION, {_init: function(can) { can.onmotion.hidden(can) }, list: [cli.CLOSE, web.CLEAR, cli.DONE],
	onsize: function(can, msg, height, width) { can.onimport._size(can), can.core.List(can._plugins, function(sub) { sub.onimport.size(sub, can.ConfHeight(), can.ConfWidth(), true) }) },
	onlogin: function(can, msg) { can.ui = can.page.Append(can, can._output, [chat.CONTENT, {view: [[chat.DISPLAY, chat.CONTENT], html.TABLE]}, chat.PROFILE])
		can.onappend._action(can, (can.Conf(html.ACTION)||can.onaction.list).concat({type: html.TEXT, _className: "args trans", name: html.FILTER, _init: function(target) { can.ui.filter = target }, onkeydown: function(event) {
			if (event.key == code.ESCAPE) { return event.target.blur() }
			if (event.key == code.ENTER) { can.onkeymap.prevent(event); if (event.shiftKey) { return can.page.SelectOne(can, can.ui.content, [html.TBODY, html.TR, html.TD], function(target) { target.click() }) }
				return event.ctrlKey? can.onaction.done(event, can): can.ui.input(event, event.target.value)
			} if (event.ctrlKey) { return event.key == "0"? can.onaction.clear(event, can): can.onkeymap.selectCtrlN(event, can, can.ui.content, [html.TBODY, html.TR], function(target) { target.firstChild.click() }) }
			event.key.length == 1 && can.onmotion.delayOnce(can, function() { can.onmotion.tableFilter(can, can.ui.content, event.target.value) }, 100, can._delay_filter = can._delay_filter||[])
		}}), null, null, null, 10)
		var key = can.misc.Search(can, "_search"); key && can.onmotion.delay(can, function() { can.onaction.onopensearch(can, can.request({}), "*", key) }, 1000)
	},
	onopensearch: function(can, msg, type, word) { can.onimport.select(can, msg, [type||mdb.FOREACH, word||""]) },
	close: function(event, can) { can.onmotion.hidden(can) },
	clear: function(event, can) { can.onmotion.clear(can, can.ui.profile) },
	done: function(event, can) { can.base.isFunc(can.ui.done) && can.ui.done() },
	select: function(event, can, data) { if (can.base.isFunc(data.text)) { return can.onmotion.hidden(can), data.text(event) }
		function show() { can.page.style(can, can.ui.content, html.MAX_HEIGHT, "")
			can.page.style(can, can.ui.content, html.MAX_HEIGHT, can._output.offsetHeight-can.ui.display.offsetHeight)
			can.Status(mdb.SELECT, can.page.Select(can, can.ui.display, html.TR).length-1)
		}
		var fields = can.page.Select(can, can.ui.display, html.TH, function(item) { return item.innerText }); can.onmotion.toggle(can, can.ui.display, true)
		var ui = can.page.Append(can, can.ui.display, [{td: can.core.List(fields, function(item) { return data[item] }), onclick: function(event) {
			can.page.Remove(can, ui._target), show()
		}}]); show()
	},
	plugin: function(event, can, data) { if (can.base.isFunc(data.text)) { return can.onmotion.hidden(can), data.text(event) }
		var cmd = data.cmd == ctx.COMMAND? can.core.Keys(data.type, data.name.split(lex.SP)[0]): can.core.Keys(data.ctx, data.cmd)
		var meta = {type: chat.STORY, index: cmd||msg.Option(mdb.INDEX), args: cmd == web.WIKI_WORD? [data.name]: []}
		if (data.type == cli.OPENS) { return can.runAction(event, cli.OPENS, [data.text], null, true) }
		if (data.type == ssh.SHELL) { meta = {index: web.CODE_XTERM, args: [data.text]} }
		if (data.type == ctx.INDEX) { meta = {index: data.text.split(mdb.FS)[0], args: data.text.split(mdb.FS).slice(1) } }
		if (data.type == nfs.FILE) { meta = {index: web.CODE_VIMER, args: can.misc.SplitPath(can, data.text)} }
		if (data.type == nfs.SHY) { meta = {index: web.WIKI_WORD, args: data.text} }
		if (data.type == ice.CMD) { meta = {index: data.name, args: can.core.Split(data.text)} }
		function plugin(meta) { can.onappend.plugin(can, meta, function(sub) { can._plugins = (can._plugins||[]).concat(sub)
			can.onmotion.delay(can, function() { can.onmotion.scrollIntoView(can, can.ui.profile) }, 500)
			sub.onimport.size(sub, can.ConfHeight(), can.ConfWidth()-1, true)
		}, can.ui.profile) }
		if (data.ctx == ice.NFS && data.cmd == nfs.PACK) { var ls = can.misc.SplitPath(can, data.text)
			can.runAction(event, ctx.RUN, [web.CODE_VIMER, ctx.ACTION, mdb.RENDER, data.type, ls[1], ls[0]], function(msg) { msg.Table(function(meta) {
				plugin(meta)
			}), can.onappend.board(can, msg.Result(), can.ui.profile) })
		} else {
			plugin(meta)
		}
	},
})
Volcanos(chat.ONEXPORT, {statusHeight: function(can) { return can.db && can.db.type == mdb.FOREACH? 0: html.ACTION_HEIGHT },
	select: function(can) { return can.page.Select(can, can.ui.display, html.TR, function(tr) { return can.page.Select(can, tr, html.TD, function(td) { return td.innerHTML }) }).slice(1) },
})
