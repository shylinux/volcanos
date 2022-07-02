Volcanos("onimport", {help: "导入数据", _init: function(can, args, cb) { var history = []; const SEARCH = "can.code.inner.search"
	function show(msg, word) { if (!msg) { return } history.push(msg); var sub = msg._can; sub.Option("word", word||msg._word)
		!sub.page.ClassList.has(sub, sub._legend, "select") && can.ui.search.select()
		sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
			return {text: ["", html.TD], list: [{text: [can.page.replace(can, value, ice.PWD, ""), html.DIV]}], onclick: function(event) {
				line.line && can.onimport.tabview(can, can.Option(nfs.PATH), line.file.replace(ice.PWD, ""), parseInt(line.line))
			}}
		}, sub._output), sub.onappend.board(sub, msg.Result()), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS)), can.Status("标签数", msg.Length())
	}
	can.onengine.plugin(can, SEARCH, shy("搜索", {}, [
		{type: html.TEXT, name: "word", value: cli.MAIN, onkeydown: function(event, can) {
			can.onmotion.selectTable(event, can.sup, event.target, function(tr) {
				can.page.Select(can, tr, html.TD, function(td, index) { index == 0 && td.click() })
				tr.scrollIntoView(), can._output.scrollTop -= 60
			})
			if (event.key == lang.ENTER) { can.sup.Update(event, [ctx.ACTION, event.ctrlKey? nfs.GREP: nfs.TAGS, can.sup.Option("word")]) }
			if (event.key == lang.ESCAPE) { event.target.blur() }
		}},
		{type: html.TEXT, name: "filter", value: "", onkeydown: function(event, can) {
			can.onmotion.selectTableInput(event, can.sup, event.target)
			if (event.key == lang.ENTER) { can.sup.Update(event, [ctx.ACTION, event.ctrlKey? nfs.GREP: nfs.TAGS, can.sup.Option("word")]) }
			if (event.key == lang.ESCAPE) { event.target.blur() }
		}},
		{type: html.BUTTON, name: nfs.TAGS},
		{type: html.BUTTON, name: nfs.GREP},
		{type: html.BUTTON, name: cli.MAKE},
		{type: html.BUTTON, name: "history"},
		{type: html.BUTTON, name: "last", _trans: "返回"},
	], function(msg, cmds, cb) { if (can.misc.runAction(can, msg, cmds, cb, kit.Dict(
		"history", function(cmds) {
			can.core.List(can.history, function(item) {
				msg.Push(nfs.FILE, item.file)
				msg.Push(nfs.LINE, item.line)
				msg.Push(mdb.TEXT, item.text)
			})
			show(msg)
		},
		nfs.TAGS, function(cmds) { msg.Option(kit.Dict(ice.MSG_HANDLE, ice.TRUE, ice.MSG_FIELDS, "file,line,text"))
			can.run(msg._event, [ctx.ACTION, mdb.SEARCH, can.parse, cmds[0], can.Option(nfs.PATH)], function(msg) { var sub = msg._can
				can.page.style(can, sub._output, html.MAX_HEIGHT, can.ConfHeight()/4), show(msg, msg._word = cmds[0])
				can.page.ClassList.has(sub, sub._target, html.SELECT) || sub._legend.click()
				can.onmotion.focus(can, msg._can._inputs["word"]._target)
			}, true)
		},
		nfs.GREP, function(cmds) { msg.Option(kit.Dict(ice.MSG_HANDLE, ice.TRUE, ice.MSG_FIELDS, "file,line,text", nfs.PATH, can.Option(nfs.PATH)))
			can.run(msg._event, [ctx.ACTION, nfs.GREP, cmds[0]], function(msg) { var sub = msg._can
				can.page.style(can, sub._output, html.MAX_HEIGHT, can.ConfHeight()/4), show(msg, msg._word = cmds[0])
				can.page.ClassList.has(sub, sub._target, html.SELECT) || sub._legend.click()
				can.onmotion.focus(can, msg._can._inputs["word"]._target)
			}, true)
		},
		"last", function(cmds) { history.pop(), show(history.pop()) },
	))) { return } can.run(msg._event, cmds, function(msg) { show(msg) }, true) }))
	can.onimport.toolkit(can, {index: SEARCH}, function(sub) {
		can.ui.search = sub, can.base.isFunc(cb) && cb(sub)
		can.ui.search._show = show
	})
}})
