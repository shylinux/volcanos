Volcanos(chat.ONIMPORT, {_init: function(can, msg) { var select; can.page.Append(can, can._output, msg.Table(function(item, index) {
		return can.onimport._river(can, item, function(target) { (index == 0 || item.hash == can._main_river) && (select = target) })
	})), select && select.click() },
	_main: function(can, msg) { can.river_list = {}, can.storm_list = {}, can.sublist = {}
		var ls = []; can.user.isExtension && (ls = (can.misc.localStorage(can, "main")||"").split(","))
		can._main_river = ls[0]||can.misc.SearchOrConf(can, chat.RIVER)||msg.Option(ice.MSG_RIVER)||can._main_river||"project"
		can._main_storm = ls[1]||can.misc.SearchOrConf(can, chat.STORM)||msg.Option(ice.MSG_STORM)||can._main_storm||"studio"
	},
	_menu: function(can, msg) { if (can.user.mod.isPod) { return } return
		can.setHeaderMenu(can.base.Obj(can.Conf(chat.MENUS)||msg.Option(chat.MENUS), can.ondetail._menus), function(event, button) {
			can.core.CallFunc([can.ondetail, button], [event, can, button, can.Conf(chat.RIVER), can.Conf(chat.STORM)])
		}), can.onappend._action(can, can.Conf(ctx.ACTION)||can.onaction.list)
	},
	_river: function(can, meta, cb) { return {text: [meta.name, html.DIV, html.ITEM],
		onclick: function(event) { can.onaction.storm(event, can, meta.hash) },
		onmouseenter: function(event) { can.onimport._carte(can, can.ondetail.list, meta.hash) },
		_init: function(target) { can.river_list[meta.hash] = target, cb(target) },
	} },
	_storm: function(can, meta, river) { return {text: [meta.name, html.DIV, html.ITEM],
		onclick: function(event) { can.onaction.action(event, can, river, meta.hash) },
		onmouseenter: function(event) { can.onimport._carte(can, can.ondetail.sublist, river, meta.hash) },
		_init: function(target) { can.storm_list[can.core.Keys(river, meta.hash)] = target },
	} },
	_carte: function(can, list, river, storm) { if (can.user.isMobile) { return } if (can.core.Value(can._root, can.core.Keys(chat.RIVER, river))) { return }
		can.onaction.carte(event, can, list, function(event, button, meta) { meta[button](event, can, button, river, storm) })
	},
})
Volcanos(chat.ONACTION, {list: [mdb.CREATE, web.REFRESH], _init: function(can) { can.onmotion.hidden(can) },
	onsize: function(can) { can.ConfHeight(can._target.offsetHeight), can.ConfWidth(can._target.offsetWidth) },
	onlogin: function(can, msg) { can.run({}, [], function(msg) { if (msg.Option(ice.MSG_RIVER) == "_share") { return }
 		can.onmotion.clear(can), can.onimport._main(can, msg), can.onimport._init(can, msg), can.onimport._menu(can, msg)
		can.user.isMobile || can.user.isExtension || can.onmotion.toggle(can, can._target, true)
	}) },
	onaction_touch: function(can, msg) { can.user.isMobile && can.onmotion.hidden(can) },
	onaction_notool: function(can, msg, river, storm) { can.ondetail["添加工具"](msg._event, can, "添加工具", river, storm) },
	onsearch: function(can, msg, arg) { if (arg[0] == mdb.FOREACH || arg[0] == chat.STORM) { can.onexport.storm(can, msg, arg) } },
	onresize: function(can, msg) { can.user.isMobile && can.onmotion.hidden(can, can._target) },
	onprint: function(can, msg) { can.page.styleHeight(can, can._target, "") },
	onlayout: function(can, layout) { can.user.isMobile || can.onmotion.toggle(can, can._target, !layout || layout == "tabs") },

	create: function(event, can) { can.user.input(event, can, [{name: mdb.TYPE, values: [aaa.TECH, aaa.VOID], _trans: "类型"}, {name: mdb.NAME, value: "hi", _trans: "群名"}, {name: mdb.TEXT, value: "hello", _trans: "简介"}], function(args) {
		can.runAction(event, mdb.CREATE, args, function(msg) { can.misc.Search(can, {river: msg.Result()}) })
	}) },
	refresh: function(event, can) { can.misc.Search(can, {river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM), layout: can.getAction(html.LAYOUT)}) },
	share: function(event, can) { can.onmotion.share(event, can, [{name: chat.TITLE, value: can.Conf(chat.STORM)}], [mdb.TYPE, chat.STORM, RIVER, can.Conf(RIVER), STORM, can.Conf(STORM)]) },
	
	storm: function(event, can, river) { can.onmotion.select(can, can._output, html.DIV_ITEM, can.river_list[river])
		var list = can.sublist[river]; if (list) { return can.onmotion.toggle(can, list) }
		can.run({}, [river, chat.STORM], function(msg) { var select = 0; list = can.page.Append(can, can._output, [{view: html.LIST, list: msg.Table(function(item, index) {
			return river == can._main_river && item.hash == can._main_storm && (select = index), can.onimport._storm(can, item, river)
		}) }])._target, can.sublist[river] = list, list.children.length > 0 && list.children[select].click(), event.target.nextSibling && can._output.insertBefore(list, event.target.nextSibling) })
	},
	action: function(event, can, river, storm) { can.onmotion.select(can, can._output, html.DIV_ITEM, can.river_list[river])
		can.onmotion.select(can, can._output, [html.DIV_LIST, html.DIV_ITEM], can.storm_list[can.core.Keys(river, storm)]), can.onmotion.toggle(can, can.sublist[river], true)
		can.onmotion.delay(can, function() { can.onengine.signal(can, chat.ONSTORM_SELECT, can.request(event, {river: can.Conf(chat.RIVER, river), storm: can.Conf(chat.STORM, storm)})) })
		can.user.isExtension && can.misc.localStorage(can, "main", river+","+storm)
	},
	carte: function(event, can, list, cb) { can.user.carteRight(event, can, can.ondetail, list, cb) },
})
Volcanos(chat.ONDETAIL, {list: ["添加应用", "重命名群组", "删除群组"],
	sublist: ["共享应用", "添加工具", "保存参数", "重命名应用", "删除应用"],

	"创建群组": function(event, can) { can.onaction.create(event, can) },
	"重命名群组": function(event, can, button, river) { can.user.input(event, can, [mdb.NAME], function(args) {
			can.runAction(event, mdb.MODIFY, [mdb.HASH, river].concat(args), function(msg) { can.page.Modify(can, can.river_list[river], args[1]), can.user.toastSuccess(can) })
		}) },
	"删除群组": function(event, can, button, river) { can.runAction(event, mdb.REMOVE, [mdb.HASH, river], function(msg) { can.misc.Search(can, {river: "", storm: ""}) }) },

	"添加应用": function(event, can, button, river) { can.ondetail.create(event, can, button, river) },
	"共享应用": function(event, can, button, river, storm) { can.onmotion.share(event, can, [{name: chat.TITLE, value: can.user.title()}, {name: chat.THEME, values: [cli.WHITE, cli.BLACK]}], [mdb.TYPE, chat.STORM, chat.RIVER, river, chat.STORM, storm]) },
	"添加工具": function(event, can, button, river, storm) { can.user.select(event, can, ctx.COMMAND, ctx.INDEX, function(item, next) {
			can.run({}, [river, storm, chat.STORM, ctx.ACTION, mdb.INSERT].concat([web.SPACE, can.misc.Search(can, ice.POD)||"", ctx.INDEX, item[0]]), function(msg) { next() })
		}, function() { can.misc.Search(can, {river: river, storm: storm}) }) },
	"保存参数": function(event, can, button, river, storm) { can.getAction(ctx.ARGS, function(args, sub, next, index, array) { var toast = can.user.toast(can, (index+1)+ice.PS+array.length, button, 10000, (index+1)*100/array.length)
			can.run({}, [river, storm, chat.STORM, ctx.ACTION, mdb.MODIFY, mdb.ID, sub.Conf(mdb.ID), ctx.ARGS, JSON.stringify(args)], function() {
				can.onmotion.delay(can, function() { toast.close(), next(), index == array.length-1 && can.user.toastSuccess(can) })
			})
		}) },
	"重命名应用": function(event, can, button, river, storm) { can.user.input(event, can, [mdb.NAME], function(args) {
			can.run(event, [river, storm, chat.STORM, ctx.ACTION, mdb.MODIFY].concat(args), function() { can.page.Modify(can, can.storm_list[can.core.Keys(river, storm)], args[1]), can.user.toastSuccess(can) })
		}) },
	"删除应用": function(event, can, button, river, storm) { can.run(event, [river, storm, chat.STORM, ctx.ACTION, mdb.REMOVE], function(msg) { can.misc.Search(can, {river: river, storm: ""}) }) },

	create: function(event, can, button, river) { can.user.input(event, can, [{name: mdb.NAME, value: "hi", _trans: "名称"}, {name: mdb.TEXT, value: "hello", _trans: "简介"}], function(args) {
		can.run({}, [river, chat.STORM, ctx.ACTION, mdb.CREATE].concat(args), function(msg) { can.misc.Search(can, {river: river, storm: msg.Result()}) })
	}) },
})
Volcanos(chat.ONEXPORT, {width: function(can) { return can._target.offsetWidth },
	storm: function(can, msg, arg) { can.core.Item(can._root.river, function(river, value) { can.core.Item(value.storm, function(storm, item) { if (arg[1] != "" && storm.indexOf(arg[1]) == -1 && item.name.indexOf(arg[1]) == -1) { return }
		msg.Push({ctx: ice.CAN, cmd: can._name, type: river, name: storm, text: shy("跳转", function(event) {
			can.onaction.action(event, can, river, storm)
		})})
	}) }) },
})
Volcanos(chat.ONENGINE, {_engine: function(event, can, msg, panel, cmds, cb) { var list = can.river
	cmds.length == 0 && can.core.ItemOrder(list, "order", function(key, value) { can.core.Item(value.storm).length > 0 && msg.Push({hash: key, name: can.user.language(can) == "en"? key: value.name}) })
	if (cmds.length != 1 && cmds[1] != chat.STORM) { return false }

	var river = list[cmds[0]]; if (!river) { return false }
	can.core.ItemOrder(river.storm, "order", function(key, value) { msg.Push({hash: key, name: can.user.language(can) == "en"? key: value.name}) })
	can.base.isFunc(cb) && cb(msg); return true
}})
