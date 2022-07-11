Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.base.isFunc(cb) && cb(msg)
		can.onimport._title(can, msg, target)
		can.onimport._state(can, msg, target)
		can.onimport._toast(can, msg, target)
		can.onimport._command(can, msg, target)
	},
	_title: function(can, msg, target) { if (can.user.isMobile) { return }
		can.core.List(msg.result, function(item) {
			can.page.Append(can, target, [{view: [chat.TITLE, html.DIV, item], title: "联系站长"}])
		})
	},
	_state: function(can, msg, target) {
		can.core.List(can.base.Obj(msg.Option(chat.STATE)||can.Conf(chat.STATE), ["ncmd", "ntip"]), function(item) {
			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, can.Conf(item)], list: [
				{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
			], onclick: function(event) { can.onexport[item](can) }}])
		})
	},
	_toast: function(can, msg, target) {
		can.toast = can.page.Append(can, target, [{view: chat.TOAST, onclick: function(event) { can.onexport["ntip"](can) }}]).first
	},
	_command: function(can, msg, target) {
		can.onappend.input(can, {type: html.TEXT, name: "cmd", onkeydown: function(event) {
			can.onkeymap.input(event, can); if (event.key != lang.ENTER) { return }
			switch (event.target.value) {
				case cli.CLOSE: can.cli && can.cli.close(); break
				case cli.CLEAR: can.cli && can.cli.close(); break
				default:
					can.runAction(event, ice.RUN, can.core.Split(event.target.value, ice.SP), function(msg) {
						can.cli && can.cli.close(), can.onexport.float(can, msg, function(value, key, index, line, list) {}, "cli", true)
					})
			}
		}}, "", target, "title cmd")
	},

	toast: function(can, msg, title, content, fileline, time) { can._tips = can._tips||can.request()
		can._tips.Push({time: time, fileline: fileline, title: title, content: content})
		can.onimport.count(can, "ntip")
		can.page.Modify(can, can.toast, [time.split(ice.SP).pop(), title, content].join(ice.SP))
	},
	count: function(can, name) {
		can.page.Select(can, can._output, can.core.Keys(html.SPAN, name), function(item) {
			item.innerHTML = can.Conf(name, parseInt(can.Conf(name)||"0")+1+"")+""
		})
	},
	ncmd: function(can, msg, _follow, _cmds) { can._cmds = can._cmds||can.request()
		can._cmds.Push({time: can.base.Time(), follow: _follow, cmds: _cmds})
		can.onimport.count(can, "ncmd")
	},
})
Volcanos(chat.ONACTION, {help: "交互数据", _init: function(can, cb, target) {
		if (can.user.mod.isPod || can.user.isExtension) { can.onmotion.hidden(can, can._target) }
		can.base.isFunc(cb) && cb()
	},
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onimport._init(can, msg, null, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onaction_cmd: function(can, msg) { can.onmotion.hidden(can) },
	oncommandfocus: function(can) { can.page.Select(can, can._output, ["div.cmd", "input"], function(target) { can.onmotion.focus(can, target) }) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	height: function(can) { return can._target.offsetHeight },
	float: function(can, msg, cb, name, bottom) { if (can[name]) { return can[name].close() }
		var ui = can.onappend.field(can, "story toast float", {}, can._root._target)
		ui.close = function() { can.page.Remove(can, ui.first), delete(can[name]) }

		can.getActionSize(function(left, top, height, width) {
			can.page.style(can, ui.first, html.LEFT, left, html.TOP, top)
			can.page.style(can, ui.output, html.MAX_HEIGHT, height-28, html.MAX_WIDTH, width)
		})

		can.onappend._action(can, [cli.CLOSE, cli.REFRESH, {input: html.TEXT, placeholder: "filter", _init: function(input) {
			can.onengine.signal(can, "keymap.focus", can.request({}, {cb: function(event) {
				if (can.page.tagis(html.INPUT, event.target)) { return }
				if (event.key == lang.ESCAPE) { ui.close(); return }
				if (event.key == ice.SP) { input.focus(), can.onkeymap.prevent(event) }
			}}))
		}, onkeydown: function(event) { can.onkeymap.input(event, can)
			if (event.key != lang.ENTER) { return }
			event.target.setSelectionRange(0, -1)

			can.page.Select(can, ui.output, html.TR, function(tr, index) { if (index == 0) { return }
				can.page.ClassList.add(can, tr, html.HIDDEN)
				can.page.Select(can, tr, html.TD, function(td) { if (td.innerText.indexOf(event.target.value) > -1) {
					can.page.ClassList.del(can, tr, html.HIDDEN)
				} })
			})
		}}], ui.action, kit.Dict(cli.CLOSE, ui.close, cli.REFRESH, function(event) { ui.close(), can.toast.click()}))

		if (msg) {
			can.onappend.table(can, msg, function(value, key, index, line, list) {
				return {text: [value, html.TD], onclick: function(event) {
					can.base.isFunc(cb) && cb(value, key, index, line, list)
				}}
			}, ui.output), can.onappend.board(can, msg.Result(), ui.output)
		}
		return can.page.style(can, ui.first, bottom? {bottom: html.ACTION_HEIGHT, top: ""}: {}), can[name] = ui
	},
	ntip: function(can) {
		can.onexport.float(can, can._tips, function() {}, "ntip")
	},
	ncmd: function(can) {
		can.onexport.float(can, can._cmds, function(value, key, index, line, list) {
			var cmds = can.base.Obj(line.cmds); switch (line.follow) {
				case "can.Action": cmds = cmds.slice(2); break
				case "can.Footer": cmds = cmds.slice(2); break
			}
			switch (cmds[0]) {
				case "web.wiki.word": cmds = cmds.slice(5); break
			}

			can.getActionSize(function(msg, top, left, width, height) {
				can.onappend.plugin(can, {index: cmds[0], args: cmds.slice(1), height: height-100, width: width}, function(sub) {
					sub.run = function(event, cmd, cb) { can.runActionCommand(event, cmds[0], cmd, cb) }

					can.page.style(can, sub._target, {top: top+100, left: left})
					can.page.style(can, sub._legend, {display: html.BLOCK})
					can.page.style(can, sub._output, {"max-width": width})
					can.page.ClassList.add(can, sub._target, chat.FLOAT)
				}, can._root._target)
			})
		}, "ncmd")
	},
})
