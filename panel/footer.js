Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, target) {
		can.onmotion.clear(can)
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
		can.core.List(can.base.Obj(can.Conf(chat.STATE)||msg.Option(chat.STATE), ["ncmd", "ntip"]), function(item) {
			can.page.Append(can, target, [{view: [can.base.join([chat.STATE, item]), html.DIV, can.Conf(item)], list: [
				{text: [item, html.LABEL]}, {text: [": ", html.LABEL]}, {text: [can.Conf(item)||"", html.SPAN, item]},
			], onclick: function(event) { can.onexport[item](can) }}])
		})
	},
	_toast: function(can, msg, target) {
		can.toast = can.page.Append(can, target, [{view: chat.TOAST, onclick: function(event) { can.onexport["ntip"](can) }}]).first
	},
	_command: function(can, msg, target) {
		can.onappend.input(can, {type: html.TEXT, name: ice.CMD, onkeydown: function(event) {
			can.onkeymap.input(event, can); if (event.key != lang.ENTER) { return }
			switch (event.target.value) {
				case cli.CLOSE: can.cli && can.cli.close(); break
				case cli.CLEAR: can.cli && can.cli.close(); break
				default:
					can.runAction(event, ice.RUN, can.core.Split(event.target.value, ice.SP), function(msg) { can.cli && can.cli.close()
						var ui = can.onexport.float(can, msg, "cli"); can.getActionSize(function(left, top, height, width) {
							can.page.style(can, ui.first, html.LEFT, left, html.RIGHT, "", html.BOTTOM, can.onexport.height(can))
						})
					})
			}
		}}, "", target, "title cmd")
	},

	toast: function(can, msg, title, content, fileline, time) { can._tips = can._tips||can.request()
		can._tips.Push({time: time, fileline: fileline, title: title, content: content})
		can.page.Modify(can, can.toast, [time, title, content].join(ice.SP))
		can.onimport.count(can, "ntip")
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
Volcanos(chat.ONACTION, {help: "交互数据", _init: function(can, cb) {
		if (can.user.mod.isPod || can.user.isExtension) { can.onmotion.hidden(can) }
		can.base.isFunc(cb) && cb()
	},
	onlogin: function(can, msg) { can.run({}, [], function(msg) { can.onimport._init(can, msg, can._output) }) },
	ontoast: function(can, msg) { can.core.CallFunc(can.onimport.toast, {can: can, msg: msg}) },
	onremote: function(can, msg) { can.core.CallFunc(can.onimport.ncmd, {can: can, msg: msg}) },
	onaction_cmd: function(can, msg) { can.onmotion.hidden(can) },
	oncommand_focus: function(can) { can.page.Select(can, can._output, ["div.cmd", "input"], function(target) { can.onmotion.focus(can, target) }) },
})
Volcanos(chat.ONEXPORT, {help: "导出数据",
	height: function(can) { return can._target.offsetHeight },
	float: function(can, msg, name, cb) { if (can[name]) { return can[name].close() }
		var ui = can.onappend.field(can, "story toast float", {}, can._root._target); can[name] = ui
		ui.close = function() { can.page.Remove(can, ui.first), delete(can[name]) }
		ui.refresh = function() { ui.close(), can.toast.click() }

		can.getActionSize(function(left, top, height, width) {
			can.page.style(can, ui.first, html.RIGHT, 0, html.BOTTOM, can.onexport.height(can))
			can.page.style(can, ui.output, html.MAX_HEIGHT, height-html.ACTION_HEIGHT, html.MAX_WIDTH, width)
		})

		can.onappend._action(can, [cli.CLOSE, web.REFRESH, {input: html.TEXT, placeholder: "filter", onkeydown: function(event) {
			can.onkeymap.input(event, can); if (event.key != lang.ENTER) { return }
			can.onmotion.tableFilter(can, ui.output, event.target.value)
			can.onmotion.focus(can, event.target)
		}}], ui.action, ui)

		can.onappend.table(can, msg, function(value, key, index, line, list) {
			return {text: [value, html.TD], onclick: function(event) { can.base.isFunc(cb) && cb(value, key, index, line, list) }}
		}, ui.output), can.onappend.board(can, msg.Result(), ui.output)
		return ui
	},
	ntip: function(can) { can.onexport.float(can, can._tips, "ntip", function(value, key, index, line) {
		can.onappend.plugin(can, {type: chat.SRORY, mode: chat.FLOAT, index: "web.code.inner", args: ["usr/volcanos/"].concat(line.fileline.split(ice.DF))}, function(sub) {
			can.getActionSize(function(left, top, width, height) { left = left||0, top = top||0
				sub.onimport.size(sub, sub.ConfHeight(height/2), sub.ConfWidth(width))
				can.onmotion.move(can, sub._target, {left: left, top: top+height/4})
			}), sub.onaction.close = function() { can.page.Remove(can, sub._target) }
		}, can._root._target)
	}) },
	ncmd: function(can) {
		can.onexport.float(can, can._cmds, "ncmd", function(value, key, index, line) {
			var cmds = can.base.Obj(line.cmds); switch (line.follow) {
				case "can.Action": cmds = cmds.slice(2); break
				case "can.Footer": cmds = cmds.slice(2); break
			}
			switch (cmds[0]) {
				case "web.wiki.word": cmds = cmds.slice(5); break
			}

			can.getActionSize(function(msg, left, top, width, height) {
				can.onappend.plugin(can, {type: "story", mode: chat.FLOAT, index: cmds[0], args: cmds.slice(1)}, function(sub) {
					sub.run = function(event, cmd, cb) { can.runActionCommand(event, cmds[0], cmd, cb) }
					sub.onimport.size(sub, height-120-2*html.ACTION_HEIGHT-can.onexport.height(can), width, true)
					sub.onmotion.move(sub, sub._target, {left: left, top: top+120})
				}, can._root._target)
			})
		})
	},
})
