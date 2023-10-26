Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb) { msg.Option(ice.MSG_ACTION, ""), cb && cb(msg)
		can.ui = can.onappend.layout(can); if (can.user.isMobile) {
			can.page.style(can, can.ui.project, "z-index", 10, "position", "absolute")
			can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
			can.page.Select(can, can._action, "div.item.text", function(target) { can.onmotion.hidden(can, target) })
			can.onmotion.hidden(can, can._status)
		} else {
			can.ui.layout(can.ConfHeight(), can.ConfWidth())
		}
		can.require([msg.Option(nfs.SCRIPT)], function() {
			var res = {type: "unknown", latitude: 39.984120, longitude: 116.307480}, current = can.base.Obj(msg.Option(chat.LOCATION), {})
			res.nation = current.nation||current.country, res.province = current.province||current.regionName, res.city = current.city
			res.latitude = current.latitude||current.lat||res.latitude, res.longitude = current.longitude||current.lon||res.longitude
			res.name = current.name||"当前位置", res.text = current.text||"某某大街", res.ip = current.ip||current.query
			can.onimport._content(can, can._current = res), can.Status(can._current = res)
			can.onimport._project(can), can.db.list = {}
			if (msg.IsDetail()) {
				can.onaction.center(can, can._current = can.onimport._item(can, msg.TableDetail()))
			} else {
				msg.Table(function(item) { can.onimport._item(can, item) }), can.ui.zone.favor._total(msg.Length())
				var item = can.db.list[can.db.hash[0]]; item? item.click(): can.user.agent.getLocation(can, function(res) { res.type = "current", can.onaction.center(can, can._current = res) })
			}
			can.user.isMobile && can.core.Item(can.ui.zone, function(key, item) { key == "favor" || item._legend.click() })
		})
	},
	_project: function(can) { can.onmotion.clear(can, can.ui.project), can.onimport.zone(can, [
		{name: "explore"}, {name: "search"}, {name: "direction"},
		{name: "favor", _menu: shy({"play": function(event, can, button) {
			can.core.Next(can.page.Select(can, can.ui.zone.favor._target, html.DIV_ITEM), function(item, next) {
				item.click(), can.onmotion.delay(can, next, 3000)
			}, function() { can.user.toastSuccess(can) })
		}})},
		{name: "district", _delay_init: function(target, zone) {
			can.onimport._province(can, target)
		}},
	], can.ui.project) },
	_explore: function(can, keyword, i) { var p = can.onimport.point(can, can.current.item)
		can.runAction(can.request({}, {_method: http.GET, "boundary": "nearby("+can.base.join([p.lat, p.lng, "500"], mdb.FS)+")", "page_index": i||1, "keyword": keyword}), "search", [], function(msg) {
			var res = can.base.Obj(msg.Result()); can.core.List(res.data, function(item) {
				can.onimport._item(can, can.onexport.point(can, item.location, {type: item.category, name: item.title, text: item.address}), can.ui.zone.explore._target)
			})
		})
	},
	_search: function(can, keyword, i) { var p = can.onimport.point(can, can.current.item)
		can.runAction(can.request({}, {_method: http.GET, "boundary": "region("+can.base.join([can.Status("city"), p.lat, p.lng], mdb.FS)+")", "page_index": i||1, "keyword": keyword}), "search", [], function(msg) {
			var res = can.base.Obj(msg.Result()); can.core.List(res.data, function(item) {
				can.onimport._item(can, can.onexport.point(can, item.location, {type: item.category, name: item.title, text: item.address}), can.ui.zone.search._target)
			})
		})
	},
	_list_result: function(can, msg, cb) { var res = can.base.Obj(msg.Result()); if (res.status) { can.user.toastFailure(can, res.message); return }
		return res && res.result && can.core.List(res.result[0], function(item) { item.name = item.name||item.fullname; return can.base.isFunc(cb)? cb(item): item })
	},
	_district: function(can, id, cb) { can.runAction(can.request({}, {_method: http.GET, id: id}), "district", [], cb) },
	_province: function(can, target) { can.onimport._district(can, "", function(msg) {
		can.onimport._list_result(can, msg, function(province) {
			can.onimport.item(can, province, function(event, _, show) { if (show === false) { return }
				can.onaction.center(can, can.onexport.point(can, province.location, {type: "province", name: province.name, text: province.fullname}))
				can.map.setZoom(can.Action("zoom", 8)), can.Status({nation: "中国", province: province.fullname})
				show === true || can.onimport._city(can, province, event.target)
			}, function() {}, target)
		})
	}) },
	_city: function(can, province, target) { can.onimport._district(can, province.id, function(msg) {
		can.onimport.itemlist(can, can.onimport._list_result(can, msg), function(event, city, show) { if (show === false) { return }
			can.onaction.center(can, can.onexport.point(can, city.location, {type: "city", name: city.name, text: city.fullname}))
			can.map.setZoom(can.Action("zoom", 12)), can.Status({nation: "中国", province: province.fullname, city: city.fullname})
			show === true || can.onimport._county(can, province, city, event.target)
		}, function() {}, target)
	}) },
	_county: function(can, province, city, target) { can.onimport._district(can, city.id, function(msg) {
		can.onimport.itemlist(can, can.onimport._list_result(can, msg), function(event, county) {
			can.onaction.center(can, can.onexport.point(can, county.location, {type: "county", name: city.name, text: county.fullname}))
			can.map.setZoom(can.Action("zoom", 15)), can.Status({nation: "中国", province: province.fullname, city: city.fullname})
		}, function() {}, target)
	}) },
	_content: function(can, item) {
		can.map = new TMap.Map(can.ui.content, {center: can.onimport.point(can, item), zoom: can.Action("zoom"), pitch: can.Action("pitch"), rotation: can.Action("rotation"), mapStyleId: 'style3'})
		can.map.on("zoom", function(event) { can.Action("zoom", can.map.getZoom().toFixed(2)) })
		can.map.on("pitch", function(event) { can.Action("pitch", can.map.getPitch().toFixed(2)) })
		can.map.on("rotate", function(event) { can.Action("rotation", can.map.getRotation().toFixed(2)) })
		can.map.on("click", function(event) { var point = can.onaction._point(event, can, {name: event.poi? event.poi.name: ""}); can.onaction.center(can, point) })
		can.current = {item: item, info: can.onfigure.info(can, item), hover: can.onfigure.info(can, item),
			label: new TMap.MultiLabel({map: can.map, geometries: [{id: "current", position: can.onimport.point(can, item), content: item.name}]}),
			marker: new TMap.MultiMarker({map: can.map, geometries: [{id: "current", position: can.onimport.point(can, item)}]}),
			circle: can.onfigure.circle(can, item, 100),
		}
		can.onfigure._mark(can), can.mark && can.mark.add({position: can.onimport.point(can, can._current), properties: can._current})
		can.page.Select(can, can._target, "div.content>div", function(item) { can.page.style(can, item, {"z-index": 3}) })
	},
	_item: function(can, item, target) { if (!item.latitude || !item.longitude) { return item }
		var _target = can.onimport.item(can, item, function(event) {
			can.onaction.center(can, item), can.misc.SearchHash(can, item.hash)
		}, function(event) {
			can.onexport.hover(can, item), can.user.carteRight(event, can, {
				direction: function(event, button) { can.onaction.center(can, item), can.onaction[button](event, can, button) },
				favor: function(event) { can.request(event, item), can.onaction.create(event, can) },
				plugin: function(event, button) { can.user.input(can.request(event, item), can, [ctx.INDEX, ctx.ARGS], function(data) {
					item.extra = can.base.Copy(item.extra||{}, data), can.onimport.plugin(can, item)
					can.runAction(event, mdb.MODIFY, ["extra.index", data.index, "extra.args", data.args], function() {})
				}) },
				remove: function(event, button) { can.runAction(event, mdb.REMOVE, [mdb.HASH, item.hash], function() { can.page.Remove(can, _target) }) },
			})
		}, target||can.ui.zone.favor._target); can.db.list[item.hash] = _target
		can.ui.zone.favor._total()
		can.mark && can.mark.add({position: can.onimport.point(can, item), properties: item})
		return item
	},
	point: function(can, item) { return new TMap.LatLng(item.latitude, item.longitude) },
	plugin: function(can, item) { var extra = can.base.Obj(item.extra, {})
		can.onmotion.toggle(can, can.ui.profile, true)
		if (can.onmotion.cache(can, function() { return item.hash }, can.ui.profile)) { return true }
		if (!extra.index) { return can.onmotion.toggle(can, can.ui.profile, false)
			var msg = can.request()
			can.core.Item(item, function(key, value) { if (key == mdb.EXTRA) { return }
				if (key == web.SPACE) { value = can.page.Format(html.A, can.misc.MergePodCmd(can, {pod: value}), value) }
				msg.Push(mdb.KEY, key), msg.Push(mdb.VALUE, value)
			}), can.onappend.table(can, msg, null, can.ui.profile)
			return
		}
		can.onappend.plugin(can, {index: extra.index, args: extra.args}, function(sub) { item._plugin = sub
			sub.onaction._close = function() { can.onmotion.hidden(can, can.ui.profile) }
			sub.onexport.output = function() { sub.onimport.size(sub, can.ConfHeight()/2, can.ConfWidth()/2, true)
				can.page.style(can, can.ui.profile, html.HEIGHT, can.ConfHeight()/2, html.WIDTH, can.ConfWidth()/2)
			}
		}, can.ui.profile)
		return true
	},
	_plugin: function(can, item, meta) {
		function myInfoWindow(options) { TMap.DOMOverlay.call(this, options) }
		myInfoWindow.prototype = new TMap.DOMOverlay()
		myInfoWindow.prototype.onInit = function(options) { this.position = options.position, this.meta = options.meta }
		myInfoWindow.prototype.createDOM = function() {
			var meta = this.meta, ui = can.onappend.field(can, chat.FLOAT, {}, can._output)
			can.onappend.plugin(can, meta, function(sub) {
				sub.run = function(event, cmds, cb) { can.runAction(can.request(event), ctx.RUN, [meta.index].concat(cmds), cb) }
				sub.onaction.close = function(event) { can.misc.Event(event, can, function(msg) {
					can.onmotion.hidden(can, sub._target)
				}) }
				item._plugin = sub
			}, can._output, ui.fieldset)
			return ui.fieldset
		}
		myInfoWindow.prototype.updateDOM = function() {
			var pixel = this.map.projectToContainer(this.position); can.page.style(can, this.dom, {
				left: pixel.getX(), top: pixel.getY()+2*html.ACTION_HEIGHT,
			})
		}
		return new myInfoWindow({map: can.map, position: can.onimport.point(can, item), meta: meta})
	},
})
Volcanos(chat.ONFIGURE, {
	circle: function(can, item, radius) {
		return new TMap.MultiCircle({
			map: can.map, styles: {circle: new TMap.CircleStyle({color: 'rgba(41,91,255,0.16)', borderColor: 'rgba(41,91,255,1)', borderWidth: 2, showBorder: true})},
			geometries: [{styleId: 'circle', center: can.onimport.point(can, item), radius: radius||300}],
		})
	},
	info: function(can, item) {
		return new TMap.InfoWindow({map: can.map,
			position: can.onimport.point(can, item), offset: {x: 0, y: -32},
			content: (item.name||"")+"<br/>"+(item.text||""),
		})
	},
	_mark: function(can, msg) { can.mark = new TMap.MultiMarker({map: can.map})
		can.mark.on("click", function(event) { if (!event.geometry) { return }
			var item = event.geometry.properties; can.db.list[item.hash].click()
		})
		can.mark.on("hover", function(event) { if (!event.geometry) { return }
			var item = event.geometry.properties; can.onexport.hover(can, item)
		})
	},
	_polyline: function(can, path) { return new TMap.MultiPolyline({
		map: can.map, styles: {
			'style_blue': new TMap.PolylineStyle({
				'color': '#3777FF', //线填充色
				'width': 6, //折线宽度
				'borderWidth': 5, //边线宽度
				'borderColor': '#FFF', //边线颜色
				'lineCap': 'butt' //线端头方式
			}),
			'style_red': new TMap.PolylineStyle({
				'color': '#CC0000', //线填充色
				'width': 6, //折线宽度
				'borderWidth': 5, //边线宽度
				'borderColor': '#CCC', //边线颜色
				'lineCap': 'round' //线端头方式
			})
		}, geometries: [{'styleId': 'style_blue', 'paths': path}]
	}) },
	_move: function(can) {
		can.mark.add({id: 'car', styleId: 'car-down', position: new TMap.LatLng(39.98481500648338, 116.30571126937866)})
		can.mark.moveAlong({"car": {path: [
			new TMap.LatLng(39.98481500648338, 116.30571126937866),
			new TMap.LatLng(39.982266575222155, 116.30596876144409),
			new TMap.LatLng(39.982348784165886, 116.3111400604248),
			new TMap.LatLng(39.978813710266024, 116.3111400604248),
			new TMap.LatLng(39.978813710266024, 116.31699800491333)
		], speed: 70}}, {autoRotation:true})
	},
})
Volcanos(chat.ONACTION, {list: [
		{type: html.TEXT, name: "zoom", value: 16, range: [3, 21]},
		{type: html.TEXT, name: "pitch", value: 30, range: [0, 80, 5]},
		{type: html.TEXT, name: "rotation", value: 0, range: [0, 360, 10]},
		"current:button", "explore", "search", "direction", mdb.CREATE,
	], _trans: {current: "定位", favor: "收藏"},
	zoom: function(event, can) { can.map.setZoom(can.Action("zoom")) },
	pitch: function(event, can) { can.map.setPitch(can.Action("pitch")) },
	rotation: function(event, can) { can.map.setRotation(can.Action("rotation")) },
	_point: function(event, can, item) { var rect = can.ui.content.getBoundingClientRect()
		return can.base.Copy({left: rect.left+event.point.x, bottom: rect.top+event.point.y, latitude: event.latLng.lat.toFixed(6), longitude: event.latLng.lng.toFixed(6)}, item, true)
	},
	center: function(can, item) { var point = can.onimport.point(can, item); can.map.setCenter(point); if (!item.name) { return }
		can.current.item = item, can.Status(mdb.NAME, ""), can.Status(mdb.TEXT, ""), can.Status(item), can.Status({latitude: point.lat, longitude: point.lng})
		can.current.info.setPosition(point), can.current.info.setContent((item.name||"")+"<br/>"+(item.text||""))
		can.current.label.updateGeometries([{id: "current", position: point, content: item.name}])
		can.current.marker.updateGeometries([{id: "current", position: point}])
		can.current.circle.setGeometries([{center: point, radius: 300}])
		can.onimport.plugin(can, item)
	},
	current: function(event, can) { can.onaction.center(can, can._current), can.map.setZoom(can.Action("zoom", 16)), can.map.setPitch(can.Action("pitch", 30)), can.map.setRotation(can.Action("rotation", 0)) },
	explore: function(event, can, button) { can.onmotion.clear(can, can.ui.zone.explore._target)
		can.user.input(event, can, ["keyword"], function(list) {
			for (var i = 1; i < 6; i++) {
				can.onimport._explore(can, list[0], i)
			}
		})
	},
	search: function(event, can, button) { can.onmotion.clear(can, can.ui.zone.search._target)
		can.user.input(event, can, ["keyword"], function(list) {
			for (var i = 1; i < 6; i++) {
				can.onimport._search(can, list[0], i)
			}
		})
	},
	direction: function(event, can, button) { var p = can.map.getCenter(); can.onmotion.clear(can, can.ui.zone.direction._target)
		can.user.input(event, can, [["type", "driving", "walking", "bicycling", "transit"]], function(list) {
			var from = can.onimport.point(can, can._current), to = can.onimport.point(can, can.current.item)
			var msg = can.request({}, {_method: http.GET, type: list[0], "from": can.base.join([from.lat, from.lng], mdb.FS), "to": can.base.join([to.lat, to.lng], mdb.FS)})
			can.runAction(msg._event, button, [], function(msg) { var res = can.base.Obj(msg.Result()), route = res.result.routes[0]
				var coors = route.polyline, pl = [], kr = 1000000
				for (var i = 2; i < coors.length; i++) { coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr }
				for (var i = 0; i < coors.length; i += 2) { pl.push(new TMap.LatLng(coors[i], coors[i+1])) }
				can.onfigure._polyline(can, pl)
				can.core.List(route.steps, function(item) { var i = item.polyline_idx[0]
					can.onimport._item(can, can.onexport.point(can, {lat: coors[i], lng: coors[i+1]}, {type: item.category, name: item.instruction, text: item.act_desc}), can.ui.zone.direction._target)
				}), can.user.toastProcess(can, "distance: "+route.distance+" duration: "+route.duration)
			})
		})
	},
	create: function(event, can) { can.request(event, can.current.item)
		can.user.input(event, can, can.core.Split("type,name,text"), function(args) { var p = can.onexport.center(can)
			can.runAction(event, mdb.CREATE, args.concat("latitude", p.latitude, "longitude", p.longitude), function(msg) {
				can.onimport._item(can, can.base.Copy(p, {name: msg.Option(mdb.NAME), text: msg.Option(mdb.TEXT)}))
			}, true)
		})
	},
})
Volcanos(chat.ONEXPORT, {list: ["nation", "province", "city", "latitude", "longitude", "ip", "type", "name", "text", "space"],
	point: function(can, point, item) { return can.base.Copy({latitude: point.lat, longitude: point.lng}, item, true) },
	center: function(can) { return can.onexport.point(can, can.map.getCenter()) },
	current: function(can) {
		var p = can.onexport.center(can); p.latitude, p.longitude; can.Status(p)
		can.current.marker.updateGeometries([{id: "current", position: can.map.getCenter()}])
		can.current.label.updateGeometries([{id: "current", position: can.map.getCenter()}])
		can.current.circle.setGeometries([{center: can.map.getCenter(), radius: 300}])
	},
	hover: function(can, item) {
		can.current.hover.setPosition(can.onimport.point(can, item))
		can.current.hover.setContent(item.name+"<br/>"+item.text)
	},
})
