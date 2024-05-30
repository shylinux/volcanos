(function() { const CAN_RIVER = "can.river", CAN_STORM = "can.storm"
Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { can.onimport._main(can, msg), can.onappend.style(can, html.FLEX, can._action)
		var select; can.page.Appends(can, can._output, msg.Table(function(item, index) {
			return can.onimport._river(can, item, function(target) { (index == 0 || item.hash == can._main_river) && (select = target) })
		})), select && select.click(), can.onimport._menu(can, msg)
	},
	_main: function(can, msg) { can.ui = {river_list: {}, storm_list: {}, sublist: {}}
		var ls = can.misc.SearchHash(can); msg.Table(function(item) { item.main && (can._main_river = item.hash) })
		can._main_river = ls[0]||can.misc.SearchOrConf(can, chat.RIVER)||msg.Option(ice.MSG_RIVER)||can._main_river||(can.misc.Search(can, ice.MSG_DEBUG) == ice.TRUE? "project": "profile")
		can._main_storm = ls[1]||can.misc.SearchOrConf(can, chat.STORM)||msg.Option(ice.MSG_STORM)
	},
	_river: function(can, meta, cb) { return {view: html.ITEM, title: meta.name, list: [{icon: meta.icon}, {text: meta.name}, {icon: icon.CHEVRON_DOWN}], _init: function(target) { can.ui.river_list[meta.hash] = target, cb(target) },
		onclick: function(event) { can.onaction.storm(event, can, meta.hash) }, oncontextmenu: function(event) { can.onaction.carte(event, can, can.onaction._menu, meta.hash) },
	} },
	_storm: function(can, meta, river) { return {view: html.ITEM, title: meta.name, list: [{icon: meta.icon}, {text: meta.name}], _init: function(target) { can.ui.storm_list[can.core.Keys(river, meta.hash)] = target },
		onclick: function(event) { can.onaction.action(event, can, river, meta.hash) }, oncontextmenu: function(event) { can.onaction.carte(event, can, can.ondetail._menu, river, meta.hash) },
	} },
	_menu: function(can, msg) { can.user.isMobile || can.user.mod.isPod? can.onmotion.hidden(can, can._action): can.onappend._action(can, can.onaction.list, can._action) },
})
Volcanos(chat.ONACTION, {list: [mdb.CREATE, web.SHARE, web.REFRESH],
	_init: function(can) {
		can.db.storm_list = {}, can.onmotion.hidden(can)
		var next = can.page.unicode.next, prev = can.page.unicode.prev
		can._prev = can.page.Append(can, can._target, [{view: [[html.TOGGLE, mdb.PREV], "", prev], onclick: function(event) {
			can._output.scrollBy && can._output.scrollBy(0, -10000)
		}}])._target
		can._next = can.page.Append(can, can._target, [{view: [[html.TOGGLE, mdb.NEXT], "", next], onclick: function(event) {
			can._output.scrollBy && can._output.scrollBy(0, 10000)
		}}])._target
		can._output.onscroll = function() { can.onexport.scroll(can) }
	},
	onlogin: function(can, msg) { can.run(can.request({}, {_method: http.GET}), [], function(msg) { if (msg.Option(ice.MSG_RIVER)) { return can.page.Remove(can, can._target) }
		can.onimport._init(can, msg); if (can.user.isMobile || can.user.isExtension) { return can.page.ClassList.add(can, can._target, ice.AUTO) }
		can.onmotion.toggle(can, can._target, true), can.onlayout._init(can)
	}) },
	onaction_touch: function(can, msg) { can.user.isMobile && can.onmotion.hidden(can) },
	onaction_notool: function(can, msg, river, storm) { can.ondetail["addcmd"](msg._event, can, "addcmd", river, storm) },
	onsearch: function(can, msg, arg) { if (arg[0] == chat.STORM) { can.onexport.storm(can, msg, arg) } },
	onlayout: function(can, layout, before) { can.page.ClassList.del(can, can._target, before), can.page.ClassList.add(can, can._target, layout) },
	create: function(event, can) { can.user.input(can.request(event, {title: "创建群组"}), can, [
		{name: mdb.TYPE, values: [aaa.TECH, aaa.VOID], _trans: "类型"},
		{name: mdb.NAME, value: "hi", _trans: "群名", need: "must"},
		{name: mdb.ICON, value: "", _trans: "图标"},
		{name: mdb.TEXT, value: "hello", _trans: "简介"},
	], function(args) { can.runAction(event, mdb.CREATE, args, function(msg) { can.misc.Search(can, {river: msg.Result()}) }) }) },
	share: function(event, can) { can.core.CallFunc(can.ondetail.share, {event: event, can: can}) },
	onsize: function(can, height) { var margin = 68, _margin = margin
		can.page.style(can, can._output, html.MARGIN, "0px", html.HEIGHT, "", html.MAX_HEIGHT, "")
		if (can.user.isMobile || !can.user.isTechOrRoot(can)) { margin = 16 }
		if (can._output.offsetHeight < height-margin) {
			margin += (height-margin-can._output.offsetHeight)/4
		} else {
			can.page.style(can, can._output, html.MAX_HEIGHT, height-margin-16)
		}
		can.page.style(can, can._output, html.MARGIN, margin+"px 0px "+(margin-_margin)+"px")
		can._output.scrollTop = can._scrollTop
		can.onexport.scroll(can)
	},
	refresh: function(event, can) { can.misc.Search(can, {river: can.Conf(chat.RIVER), storm: can.Conf(chat.STORM)}) },
	storm: function(event, can, river) { can.onmotion.select(can, can._output, html.DIV_ITEM, can.ui.river_list[river])
		function _menu(list) { can.onlayout._init(can), can.page.ClassList.set(can, can.ui.river_list[river], "open", can.page.isDisplay(list)) }
		var list = can.ui.sublist[river]; if (list) { return can.onmotion.toggle(can, list), _menu(list) }
		can.run({}, [river, chat.STORM], function(msg) { var next = can.ui.river_list[river].nextSibling
			if (msg.Length() == 0) { return can.user.isLocalFile? can.user.toastFailure(can, "miss data"): can.onengine.signal(can, chat.ONACTION_NOSTORM, can.request({}, {river: river})) }
			can.db.storm_list[river] = msg.Table()
			var _main_storm; msg.Table(function(item) { item.main && (_main_storm = item.hash) }), _main_storm = can._main_storm || _main_storm || (
				can.user.info.nodetype == web.WORKER? web.DESKTOP: can.misc.Search(can, ice.MSG_DEBUG) == ice.TRUE? "studio": (can.user.info.nodetype == web.SERVER? web.DREAM: "desktop")
			)
			var select = 0; list = can.page.Append(can, can._output, [{view: html.LIST, list: msg.Table(function(item, index) {
				river == can._main_river && (item.hash == _main_storm) && (select = index)
				return can.onimport._storm(can, item, river)
			}) }])._target, next && can._output.insertBefore(list, next), can.ui.sublist[river] = list, _menu(list), list.children.length > 0 && list.children[select].click()
		})
	},
	action: function(event, can, river, storm) {
		can._scrollTop = can._output.scrollTop
		can.page.Select(can, can._output, [html.DIV_LIST, html.DIV_ITEM], function(target) { can.page.ClassList.del(can, target, html.SELECT) })
		can.onmotion.toggle(can, can.ui.sublist[river], true)
		can.onmotion.select(can, can.ui.sublist[river], html.DIV_ITEM, can.ui.storm_list[can.core.Keys(river, storm)])
		can.onmotion.select(can, can._output, html.DIV_ITEM, can.ui.river_list[river])
		var list = can.db.storm_list[river];
		can.user.isMobile && can.onmotion.hidden(can, can._root.Footer._target, list.length > 1)
		can.user.isMobile && can.onmotion.delay(can, function() {
			var menu = can.setFooterMenu(list, function(event, button, list) { can.onaction.action(event, can, river, button) })
			can.page.SelectChild(can, menu, html.DIV_ITEM, function(target, index) { can.page.ClassList.set(can, target, html.SELECT, list[index].hash == can.Conf("storm")) })
		}, 300), can.onengine.signal(can, chat.ONSTORM_SELECT, can.request(event, {river: can.Conf(chat.RIVER, river), storm: can.Conf(chat.STORM, storm)}))
	},
	carte: function(event, can, list, river, storm) { can.onkeymap.prevent(event); if (can.core.Value(can._root, can.core.Keys(chat.RIVER, river))) { return }
		can.request(event, {river: river, storm: storm}); storm? can.user.carteRight(event, can, can.ondetail, list): can.user.carteRight(event, can, can.onaction, list)
	},
	_menu: ["addapp", "rename", "remove"],
	_trans: {addapp: "添加应用", rename: "重命名群组", remove: "删除群组"},
	addapp: function(event, can, button, river) { can.ondetail.create(event, can, button, river) },
	rename: function(event, can, button, river) { can.user.input(event, can, [mdb.NAME, mdb.ICON], function(args) {
		can.runAction(event, mdb.MODIFY, [mdb.HASH, river].concat(args), function(msg) { can.page.Modify(can, can.ui.river_list[river], args[1]), can.user.toastSuccess(can) })
	}) },
	remove: function(event, can, button, river) { can.runAction(event, mdb.REMOVE, [mdb.HASH, river], function(msg) { can.misc.Search(can, {river: "", storm: ""}) }) },
	onaction_nostorm: function(can, msg, river) { can.ondetail.create({}, can, mdb.CREATE, river) },
	onaction_remove: function(can, msg, river, storm, id) { can.run(can.request({}), [river, storm, chat.STORM, ctx.ACTION, mdb.DELETE, mdb.ID, id], function() { }) },
})
Volcanos(chat.ONDETAIL, {
	_menu: ["share", "savearg", "addcmd", "rename", "remove"],
	_trans: {share: "共享应用", savearg: "保存参数", addcmd: "添加工具", rename: "重命名应用", remove: "删除应用"},
	share: function(event, can, button, river, storm) { can.onmotion.share(event, can, [{name: chat.TITLE, value: can.user.title()}, {name: chat.THEME, values: [ice.AUTO, html.DARK, html.LIGHT, cli.WHITE, cli.BLACK]}], [mdb.TYPE, chat.STORM, chat.RIVER, river, chat.STORM, storm]) },
	savearg: function(event, can, button, river, storm) { can.getAction(ctx.ARGS, function(args, sub, next, index, array) { var toast = can.user.toast(can, (index+1)+nfs.PS+array.length, button, 10000, (index+1)*100/array.length)
		can.run({}, [river, storm, chat.STORM, ctx.ACTION, mdb.MODIFY, mdb.ID, sub.Conf(mdb.ID), ctx.ARGS, JSON.stringify(args)], function() {
			can.onmotion.delay(can, function() { toast.close(), next(), index == array.length-1 && can.user.toastSuccess(can) })
		})
	}) },
	addcmd: function(event, can, button, river, storm) { can.user.input(can.request(event, {title: "添加工具"}), can, [
		{name: web.SPACE, _trans: "空间"},
		{name: ctx.INDEX, need: "must", _trans: "命令"}, {name: ctx.ARGS, _trans: "参数"},
		{name: mdb.ICON, _trans: "图标"}, {name: ctx.STYLE, _trans: "样式"}, {name: ctx.DISPLAY, _trans: "脚本"},
	], function(args) { can.run({}, [river, storm, chat.STORM, ctx.ACTION, mdb.INSERT].concat(args), function(msg) {
		can.onengine.signal(can, chat.ONSTORM_SELECT, can.request(event, {river: can.Conf(chat.RIVER, river), storm: can.Conf(chat.STORM, storm), refresh: ice.TRUE}))
	}) }) },
	rename: function(event, can, button, river, storm) { can.user.input(event, can, [mdb.NAME, mdb.ICON], function(args) {
		can.run(event, [river, storm, chat.STORM, ctx.ACTION, mdb.MODIFY].concat(args), function() { can.page.Modify(can, can.ui.storm_list[can.core.Keys(river, storm)], args[1]), can.user.toastSuccess(can) })
	}) },
	remove: function(event, can, button, river, storm) { can.run(event, [river, storm, chat.STORM, ctx.ACTION, mdb.REMOVE], function(msg) { can.misc.Search(can, {river: river, storm: ""}) }) },
	create: function(event, can, button, river) { can.user.input(can.request(event, {title: "添加应用"}), can, [
		{name: mdb.NAME, value: "hi", _trans: "名称", need: "must"},
		{name: mdb.ICON, value: "", _trans: "图标"},
		{name: mdb.TEXT, value: "hello", _trans: "简介"},
	], function(args) { can.run({}, [river, chat.STORM, ctx.ACTION, mdb.CREATE].concat(args), function(msg) { can.misc.Search(can, {river: river, storm: msg.Result()}) }) }) },
})
Volcanos(chat.ONEXPORT, {
	width: function(can) { return can._target.offsetWidth },
	storm: function(can, msg, arg) { can.core.Item(can._root.river, function(river, value) { can.core.Item(value.storm, function(storm, item) { if (arg[1] != "" && storm.indexOf(arg[1]) == -1 && item.name.indexOf(arg[1]) == -1) { return }
		msg.Push({ctx: ice.CAN, cmd: can._name, type: river, name: storm, text: shy("跳转", function(event) { can.onaction.action(event, can, river, storm) })})
	}) }) },
	scroll: function(can) { can.onmotion.delayOnce(can, function() {
		if (can._output.offsetHeight == can._output.scrollHeight) {
			can.onmotion.hidden(can, can._prev), can.onmotion.hidden(can, can._next)
		} else {
			can.onmotion.toggle(can, can._prev, can._output.scrollTop > 10)
			can.onmotion.toggle(can, can._next, can._output.scrollTop+can._output.offsetHeight < can._output.scrollHeight-10)
		}
	}) },
})
Volcanos(chat.ONENGINE, {
	_engine: function(event, can, msg, panel, cmds, cb) {
		if (typeof can.river == code.FUNCTION) { can.river = can.river(can) } var list = can.river
		cmds.length == 0 && can.core.ItemOrder(list, mdb.ORDER, function(key, value) { if (!value) { return }
			if (value.debug && can.misc.Search(can, ice.MSG_DEBUG) != ice.TRUE) { return }
			if (value.nodetype && value.nodetype != can.user.info.nodetype) { return }
			if (can.base.isIn(can.user.info.userrole, value.type||aaa.VOID, aaa.TECH, aaa.ROOT)) {
				can.core.Item(value.storm).length > 0 && msg.Push({hash: key, name: can.user.isEnglish(can)? key: value.name, icon: value.icon||"", main: value.main||false})
			}
		})
		if (cmds.length != 1 && cmds[1] != chat.STORM) { return false } var river = list[cmds[0]]; if (!river) { return false }
		can.core.ItemOrder(river.storm, mdb.ORDER, function(key, value) { if (!value) { return }
			if (value.nodetype && value.nodetype != can.user.info.nodetype) { return }
			if (can.base.isIn(can.user.info.userrole, value.type||aaa.VOID, aaa.TECH, aaa.ROOT)) {
				msg.Push({hash: key, name: can.user.isEnglish(can)? key: value.name||(can.user.trans(can, key)+" "+key), icon: value.icon||icon[key]||"", main: value.main||false})
			}
		}), can.base.isFunc(cb) && cb(msg); return true
	},
})
})()
