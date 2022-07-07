Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		var meta = {}; msg.Table(function(value) { meta[value.key] = value.value })
		can._meta = can.base.Obj(meta.text, {meta: {name: meta.name||"hi"}, list: []})
		can.base.isFunc(cb) && cb(msg)

		can.ui = can.page.Appends(can, target, [{view: [chat.LAYOUT, html.TABLE], list: [{type: html.TR, list: [
			{type: html.TD, list: [{view: chat.PROJECT}]},
			{type: html.TD, list: [{view: chat.DISPLAY}]},
			{type: html.TD, list: [{view: chat.PROFILE}]},
		]}] }]), can.ui.project._fieldset = can.ui.display

		can.onimport._item(can, can._meta, can.ui.project, can.onimport._size(can)).click()
	},
	_size: function(can) {
		var width = can.ConfWidth()-260, height = can.ConfHeight()-100
		if (can.Conf("auto.cmd")) {
			width = can.ConfWidth(), height = can.ConfHeight()
			can.onmotion.hidden(can, can.ui.project)
			can.onmotion.hidden(can, can.ui.profile)
			can.onmotion.hidden(can, can._option)
			can.onmotion.hidden(can, can._action)
		}
		if (can.isCmdMode() || can.user.mod.isDiv) {
			width = can._root._width, height = can._root._height
			can.page.style(can, can._output, {width: width, height: height})
		}
		return width
	},
	_item: function(can, node, target, width) { width = width||node.meta.width
		var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, node.meta.name||"hi"]}, {view: [html.LIST]}])
		ui.list._fieldset = can.onimport._plugin(can, node.meta, target._fieldset, width)

		var msg = can.request({}); msg.Push(node.meta, "", true)
		ui.item.onclick = function(event) {
			can.onmotion.select(can, can.ui.project, "div.item", ui.item)
			can.current = ui.item, can.onmotion.clear(can, can.ui.profile)
			can.onappend.table(can, msg, function(value, key, index, line, array) {
				return {text: [value, html.TD], ondblclick: function(event) {
					key == "value" && can.onmotion.modifys(can, event.target, function(event, value, old) {
						node.meta[line.key] = value
					})
				}}
			}, can.ui.profile)
		}

		ui.item._add = function(data) {
			if (node.meta.style == html.SPAN) { width = width * node.list.length }
			node.list.push(data)
			if (node.meta.style == html.SPAN) { width = width / node.list.length }
			can.onmotion.clear(can, ui.list), can.onmotion.clear(can, ui.list._fieldset)
			can.core.List(node.list, function(node) { can.onimport._item(can, node, ui.list, width) })
		}
		if (node.meta.style == html.SPAN) { width = width / node.list.length }
		can.core.List(node.list, function(node) { can.onimport._item(can, node, ui.list, width) })
		return ui.item
	},
	_plugin: function(can, meta, target, width) {
		var size = {width: width, height: meta.height}
		var field = can.onappend.field(can, chat.LAYOUT, {}, target).fieldset
		can.page.ClassList.add(can, field, meta.style)
		can.page.style(can, field, size)

		meta.index && can.runAction(event, ctx.COMMAND, [meta.index], function(msg) {
			can.onappend._init(can, can.base.Copy({
				feature: can.base.Obj(msg.Append("meta")), 
				inputs: can.base.Obj(msg.Append("list")),
				args: meta.args,
				name: meta.name,
			}, size), ["/plugin/state.js"], function(sub) {
				can.page.style(can, sub._output, size)
				sub.run = function(event, cmds, cb) {
					can.runActionCommand(event, meta.index, cmds, cb)
				}
			}, target, field)
		})
		return field
	}, 
}, ["/plugin/local/chat/div.css"])
Volcanos(chat.ONACTION, {help: "操作数据",
	"添加": function(event, can) {
		can.user.input(event, can, [mdb.NAME, ctx.INDEX, ctx.ARGS, ctx.STYLE, html.HEIGHT, html.WIDTH], function(data) {
			can.current._add({meta: data, list: []})
		})
	},
	"保存": function(event, can) { var msg = can.request(event, can.Option())
		can.runAction(event, mdb.MODIFY, [mdb.TEXT, JSON.stringify(can._meta)])
	},
	"预览": function(event, can) {
		can.onmotion.share(event, can, [], [mdb.LINK, can.misc.MergeURL(can, {_path: "/chat/div/"+can.Option("hash")})])
	},
})
