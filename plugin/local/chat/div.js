Volcanos(chat.ONIMPORT, {help: "导入数据", _init: function(can, msg, cb, target) {
		var meta = {}; msg.Table(function(value) { meta[value.key] = value.value })
		can._list = can.base.Obj(meta.text, {meta: {name: meta.name||html.DIV}, list: []})
		can.sup._keys = can.sup._keys||can._list.meta.name
		can.onimport.layout(can, can._output)
		can.base.isFunc(cb) && cb(msg)
	},
	_item: function(can, keys, item, target, width, height) { width = width||item.meta.width, height = height||item.meta.height
		var ui = can.page.Append(can, target, [{view: [html.ITEM, html.DIV, item.meta.name||html.DIV], onclick: function(event) {
			can.onmotion.select(can, can.ui.project, html.DIV_ITEM, event.target), can.current = event.target, can.onimport._profile(can, keys, item.meta)
		}, _add: function(data) { item.list.push(data), can.onimport._list(can, keys, item, ui.list, width, height) }}, {view: html.LIST}])

		var field = can.onappend.field(can, item.meta.index? chat.PLUGIN: chat.LAYOUT, item.meta, target._target)
		can.page.style(can, ui.list._target = field.output, {width: width, height: height})
		item.meta.style && can.page.ClassList.add(can, ui.list._target, item.meta.style)

		item.meta.index && can.onappend.plugin(can, can.base.Copy({}, item.meta), function(sub) {
			can.page.style(can, sub._output, {width: width, height: height-2*html.ACTION_HEIGHT})
		}, target._target, field.fieldset)

		can.onimport._list(can, keys, item, ui.list, width, height)
		can.sup._keys == keys && ui.item.click()
	},
	_list: function(can, keys, item, target, width, height) {
		if (item.meta.style == html.SPAN) { width = width / item.list.length } else { height = height / item.list.length }
		can.onmotion.clear(can, target), can.onmotion.clear(can, target._target)
		can.core.List(item.list, function(item) { can.onimport._item(can, can.core.Keys(keys, item.meta.name), item, target, width, height) })
	},
	_profile: function(can, keys, meta) { can.onmotion.clear(can, can.ui.profile)
		var msg = can.request({}); msg.Push(mdb.KEY, "keys"), msg.Push(mdb.VALUE, keys)
		can.core.List(can.core.Split("name,index,args,style,display,height,width"), function(k) {
			msg.Push(mdb.KEY, k), msg.Push(mdb.VALUE, meta[k])
		}), can.sup._keys = keys
		can.onappend.table(can, msg, function(value, key, index, line, array) {
			return {text: [value, html.TD], ondblclick: function(event) { var target = event.target
				key == mdb.VALUE && can.onmotion.modify(can, event.target, function(event, value, old) {
					target.innerText = meta[line.key] = value, can.onimport.layout(can)
				}, {name: line.key})
			}}
		}, can.ui.profile)
	},
	layout: function(can, target) { target = target||can._output
		can.onmotion.clear(can, target), can.onlayout.profile(can, target), can.ui.project._target = can.ui.content
		var width = can.ConfWidth()-320, height = can.ConfHeight()
		if (can.isCmdMode()) {
			width = can.page.width(), height = can.page.height(), can.user.title(can._list.meta.name)
		} else if (can.isFullMode()) {
			width = can.ConfWidth(), height = can.ConfHeight()
			can.onmotion.toggle(can, can.ui.project, false)
		} else {
			can.onmotion.toggle(can, can.ui.profile, true)
		}
		can.onimport._item(can, can._list.meta.name, can._list, can.ui.project, width, height)
	},
}, [""])
Volcanos(chat.ONACTION, {help: "操作数据",
	"添加": function(event, can) {
		can.user.input(event, can, [mdb.NAME, ctx.INDEX, ctx.ARGS, ctx.STYLE, html.HEIGHT, html.WIDTH], function(data) {
			can.current._add({meta: data, list: []})
		})
	},
	"保存": function(event, can) { var msg = can.request(event, can.Option())
		can.runAction(event, mdb.MODIFY, [mdb.TEXT, JSON.stringify(can._list)])
	},
})
