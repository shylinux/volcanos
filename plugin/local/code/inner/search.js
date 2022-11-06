Volcanos(chat.ONPLUGIN, {_init: function(can, _sub, cb) { const SEARCH = "can.code.inner.search"; var history = []
	function highlight(value) { var sub = can.ui.search
		can.page.Select(can, sub._output, "tbody>tr", function(tr) {
			can.page.ClassList.set(can, tr, html.HIDDEN, can.page.Select(can, tr, "td", function(td) { td._text = td._text||td.innerText
				if (td.innerText.indexOf(value) > -1) {
					td.innerHTML = td._text.replaceAll(value, "<span style='background-color:yellow;color:red;'>"+value+"</span>")
					return td
				} else {
					td.innerText = td._text
				}
			}).length == 0)
		})
	}
	function show(msg, word) { if (!msg) { return } history.push(msg); var sub = can.ui.search; sub.Option("main", word)
		sub.onimport.size(sub, can.ConfHeight()/4, can.ConfWidth()-can.ui.project.offsetWidth, true)
		sub.onmotion.clear(sub), sub.onappend.table(sub, msg, function(value, key, index, line) {
			return {text: ["", html.TD], list: [{text: [can.base.trimPrefix(value, nfs.PWD), html.DIV]}], onclick: function(event) { if (!line.line) { return }
					can.onimport.tabview(can, line.path||can.Option(nfs.PATH), can.base.trimPrefix(line.file, nfs.PWD)||can.Option(nfs.FILE), parseInt(line.line)), can.current.scroll(can.current.scroll()-4)
			}}
		}, sub._output), sub.onappend.board(sub, msg.Result()), sub.onappend._status(sub, msg.Option(ice.MSG_STATUS))
		!sub.page.ClassList.has(sub, sub._legend, html.SELECT) && sub.select(), sub.Focus(), sub.Option("word", word||msg._word||"")
		can.onmotion.delay(can, function() {
			word && highlight(word)
		})
	}
	can.onengine.plugin(can, SEARCH, shy("搜索", {}, [
		{type: "text", name: "main"},
		{type: "text", name: "filter", _init: function(target) {
			target.onkeyup = function(event) { highlight(event.target.value) }
		}},
		"grep:button", "make", "history", "last"], function(can, msg, cmds, cb) { can.misc.runAction(can, msg, cmds, cb, kit.Dict(
		"replace", function(cmds) { can.runAction(msg, nfs.GREP, [cmds[0]], function(msg) { show(msg, cmds[0]) }) },
		nfs.GREP, function(cmds) { can.runAction(msg, nfs.GREP, [cmds[0]], function(msg) { show(msg, cmds[0]) }) },
		"history", function(cmds) { can.core.List(can.history, function(item) { msg.PushRecord(item) }), show(msg) },
		"last", function(cmds) { history.pop(), show(history.pop()) },
	)) })), can.onimport.toolkit(can, {index: SEARCH}, function(sub) {
		can.page.style(can, sub._output, html.MIN_WIDTH, 600)
		can.ui.search = sub, sub._show = show, can.base.isFunc(cb) && cb(sub)
	})
}})
