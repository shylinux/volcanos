Volcanos(chat.ONIMPORT, {_init: function(can, msg, cb, target) {
		can.onmotion.clear(can), can.ui = can.onappend.layout(can), can.base.isFunc(cb) && cb(msg)
		!can.isCmdMode() && can.ConfHeight(window.innerHeight - 5*html.ACTION_HEIGHT - 5*html.PLUGIN_MARGIN)
		can.user.isMobile && can.ConfHeight(window.innerHeight-html.ACTION_HEIGHT)
		can.user.isMobile && can.onmotion.hidden(can, can.ui.project)
		can.user.isMobile && can.onmotion.hidden(can, can._action)
		can.user.isMobile && can.onmotion.hidden(can, can._option)
		can.user.isMobile && can.onmotion.hidden(can, can._status)

		can.page.styleWidth(can, can.ui.project, 240), can.onmotion.toggle(can, can.ui.profile, true)
		can.page.ClassList.add(can, can.ui.project, ice.AUTO)
		can.page.ClassList.add(can, can.ui.profile, ice.AUTO)

		can.onappend._status(can, can.onexport.list)
		can.require([can.base.MergeURL("https://map.qq.com/api/gljs", "v", "1.exp", "libraries", "service", "key", can.Conf(aaa.TOKEN))], function() {
			var res = {type: "unknown", latitude: 3998412, longitude: 11630748}, current = can.base.Obj(msg.Option(chat.LOCATION))
			if (current.status === 0) { res = can.onexport.point(can, current.result.location, current.result.ad_info), res.type = "ip", res.name = current.result.ip, can.Status(res) }
			can._current = res, can.onimport._layout(can), can.user.agent.getLocation(can, function(res) { res.type = "current", can.onimport.center(can, can._current = res) })
		})
	},
	_layout: function(can) { can.onmotion.clear(can, can.ui.content), can.onmotion.clear(can, can.ui.project)
		can.page.style(can, can.ui.content, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
		can.page.style(can, can.ui.project, html.MAX_HEIGHT, can.ConfHeight())

		can.onimport.zone(can, [
			{name: "direction"},
			{name: "favor", _menu: shy({"play": function(event, can, button) {
				can.core.Next(can.page.Select(can, can.ui.favor._target, html.DIV_ITEM), function(item, next) {
					item.click(), can.onmotion.delay(can, next, 2000)
				}, function() { can.user.toastSuccess(can) })
			}})},
			{name: "explore", _init: function(target, zone) {
				zone._search.onkeyup = function(event) { can.misc.Event(event, can, function(msg) {
					event.key == "Enter" && can.onimport._search0(can, event.target.value)
				}) }
			}},
			{name: "search", _init: function(target, zone) {
				zone._search.onkeyup = function(event) { can.misc.Event(event, can, function(msg) {
					event.key == "Enter" && can.onimport._search(can, event.target.value)
				}) }
			}},
			{name: "district", _init: function(target, zone) {
				can.onimport._province(can, target)
			}},
		], can.ui.project), can.onimport._show(can, can._current), can.onimport._mark(can)
		can.mark && can.mark.add({position: can.onimport.point(can, can._current), properties: can._current})
		can._msg.Table(function(item) { can.onimport._item(can, item) })
	},
	_search0: function(can, keyword) { var p = can.onimport.point(can, can.current.item)
		can.runAction(can.request({}, {"boundary": "nearby("+can.base.join([p.lat, p.lng, "500"], mdb.FS)+")", "page_index": 1, "keyword": keyword}), "search", [], function(msg) {
			var res = can.base.Obj(msg.Result()); can.core.List(res.data, function(item) {
				can.onimport._item(can, can.onexport.point(can, item.location, {type: item.category, name: item.title, text: item.address}), can.ui.explore._target)
			})
		})
	},
	_search: function(can, keyword) { var p = can.onimport.point(can, can.current.item)
		can.runAction(can.request({}, {"boundary": "region("+can.base.join([can.Status("city"), p.lat, p.lng], mdb.FS)+")", "page_index": 1, "keyword": keyword}), "search", [], function(msg) {
			var res = can.base.Obj(msg.Result()); can.core.List(res.data, function(item) {
				can.onimport._item(can, can.onexport.point(can, item.location, {type: item.category, name: item.title, text: item.address}), can.ui.search._target)
			})
		})
	},

	_list_result: function(can, msg, cb) { var res = can.base.Obj(msg.Result())
		return can.core.List(res.result[0], function(item) { item.name = item.name||item.fullname; return can.base.isFunc(cb)? cb(item): item })
	},
	_district: function(can, id, cb) {
		can.runAction(can.request({}, {id: id}), "district", [], cb)
	},
	_province: function(can, target) {
		can.onimport._district(can, "", function(msg) {
			can.onimport._list_result(can, msg, function(province) {
				can.onimport.item(can, province, function(event, _, show) { if (show === false) { return }
					can.onimport.center(can, can.onexport.point(can, province.location, {type: "province", name: province.name, text: province.fullname}))
					can.map.setZoom(can.Action("zoom", 8)), can.Status({nation: "中国", province: province.fullname})

					show === true || can.onimport._city(can, province, event.target)
				}, function() {}, target)
			})
		})
	},
	_city: function(can, province, target) {
		can.onimport._district(can, province.id, function(msg) {
			can.onimport.itemlist(can, can.onimport._list_result(can, msg), function(event, city, show) { if (show === false) { return }
				can.onimport.center(can, can.onexport.point(can, city.location, {type: "city", name: city.name, text: city.fullname}))
				can.map.setZoom(can.Action("zoom", 12)), can.Status({nation: "中国", province: province.fullname, city: city.fullname})

				show === true || can.onimport._county(can, province, city, event.target)
			}, function() {}, target)
		})
	},
	_county: function(can, province, city, target) {
		can.onimport._district(can, city.id, function(msg) {
			can.onimport.itemlist(can, can.onimport._list_result(can, msg), function(event, county) {
				can.onimport.center(can, can.onexport.point(can, county.location, {type: "county", name: city.name, text: county.fullname}))
				can.map.setZoom(can.Action("zoom", 15)), can.Status({nation: "中国", province: province.fullname, city: city.fullname})
			}, function() {}, target)
		})
	},

	_show: function(can, item) {
		can.map = new TMap.Map(can.ui.content, {center: can.onimport.point(can, item), zoom: can.Action("zoom"), pitch: can.Action("pitch"), rotation: can.Action("rotation"), mapStyleId: "style2"})
		can.page.Select(can, can._target, "div.content>div", function(item) { can.page.style(can, item, {"z-index": 3}) })
		can.current = {
			label: new TMap.MultiLabel({map: can.map, geometries: [{id: "current", position: can.onimport.point(can, item), content: item.name}]}),
			marker: new TMap.MultiMarker({map: can.map, geometries: [{id: "current", position: can.onimport.point(can, item)}]}),
			info: can.onimport.info(can, item), hover: can.onimport.info(can, item),
			circle: can.onimport.circle(can, item, 100), item: item,
		}

		can.map.on("rotate", function(event) { can.Action("rotation", can.map.getRotation()) })
		can.map.on("pitch", function(event) { can.Action("pitch", can.map.getPitch()) })
		can.map.on("zoom", function(event) { can.Action("zoom", can.map.getZoom()) })
		can.map.on("click", function(event) {
			var point = can.onaction._point(event, can, {name: event.poi? event.poi.name: ""}); can.onimport.center(can, point)
			can.Action("mode") == "insert" && can.runAction(can.request({target: {getBoundingClientRect: function() { return point }}}, point), mdb.CREATE, function(msg) {
				can.onimport._item(can, point)
			})
		})
	},
	_item: function(can, item, target) { if (!item.latitude || !item.longitude) { return }
		can.onimport.item(can, item, function(event) {
			can.onimport.center(can, item), can.onimport.plugin(can, item)
		}, function(event) {
			can.onexport.hover(can, item), can.user.carteRight(event, can, {
				direction: function(event, button) { can.onimport.center(can, item), can.onaction[button](event, can, button) },
				favor: function(event) { can.request(event, item), can.onaction.create(event, can) },
				plugin: function(event, button) { can.request(event, item, item.extra)
					can.user.input(event, can, [ctx.INDEX, ctx.ARGS], function(args, data) {
						can.base.Copy(item.extra, data), can.runAction(event, mdb.MODIFY, args)
					})
				},
			})
		}, target||can.ui.favor._target)
		can.mark && can.mark.add({position: can.onimport.point(can, item), properties: item})
		can.cluster && can.cluster.add({position: can.onimport.point(can, item)})
	},
	_cluster: function(can, msg) {
		can.cluster = new TMap.MarkerCluster({map: can.map, geometries: []})
	},
	_mark: function(can, msg) {
		can.mark = new TMap.MultiMarker({map: can.map})
		can.mark.on("click", function(event) { if (!event.geometry) { return } var item = event.geometry.properties
			can.onimport.center(can, item)
		})
		can.mark.on("hover", function(event) { if (!event.geometry) { return } var item = event.geometry.properties
			can.onexport.hover(can, item)
		})
	},

	_polyline: function(can, path) {
		return new TMap.MultiPolyline({
			map: can.map,
			styles: {
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
			},
			geometries: [{'styleId': 'style_blue', 'paths': path}]
		})
	},
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

	point: function(can, item) {
		return new TMap.LatLng(item.latitude/100000.0, item.longitude/100000.0)
	},
	center: function(can, item) { var point = can.onimport.point(can, item)
		can.map.setCenter(point), can.Status("name", ""), can.Status("text", ""), can.Status(item), can.Status({latitude: point.lat, longitude: point.lng})
		can.current.info.setPosition(point), can.current.info.setContent((item.name||"")+"<br/>"+(item.text||""))
		can.current.label.updateGeometries([{id: "current", position: point, content: item.name}])
		can.current.marker.updateGeometries([{id: "current", position: point}])
		can.current.circle.setGeometries([{center: point, radius: 300}])
		can.current.item = item
		item._plugin && can.onmotion.toggle(can, item._plugin._target)
	},
	info: function(can, item) {
		return new TMap.InfoWindow({map: can.map,
			position: can.onimport.point(can, item), offset: {x: 0, y: -32},
			content: (item.name||"")+"<br/>"+(item.text||""),
		})
	},
	circle: function(can, item, radius) {
		return new TMap.MultiCircle({ 
			map: can.map, styles: {
				circle: new TMap.CircleStyle({
					color: 'rgba(41,91,255,0.16)',
					showBorder: true,
					borderColor: 'rgba(41,91,255,1)',
					borderWidth: 2,
				}),
			},
			geometries: [{styleId: 'circle', center: can.onimport.point(can, item), radius: radius||300}],
		})
	},
	plugin: function(can, item) {
		if (can.onmotion.cache(can, function() { return item.hash }, can.ui.profile)) {

		} else { item.extra = can.base.Obj(item.extra, {})
			item.extra.index && can.onimport.plug(can, {index: item.extra.index, args: item.extra.args}, function(sub) { item._plugin = sub
				can.page.style(can, sub._target, html.MAX_HEIGHT, sub.ConfHeight(can.ConfHeight()), html.MAX_WIDTH, sub.ConfWidth(can.ConfWidth()*3/4))
				can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(can.ConfHeight()-2*html.ACTION_HEIGHT), html.MAX_WIDTH, sub.ConfWidth(can.ConfWidth()*3/4))
			}, can.ui.profile)
		}
	},
	_plugin: function(can, item, meta) {
		function myInfoWindow(options) { TMap.DOMOverlay.call(this, options) }
		myInfoWindow.prototype = new TMap.DOMOverlay()
		myInfoWindow.prototype.onInit = function(options) { this.position = options.position, this.meta = options.meta }

		myInfoWindow.prototype.createDOM = function() {
			var meta = this.meta, ui = can.onappend.field(can, chat.FLOAT, {}, can._output)
			can.onappend.plugin(can, meta, function(sub) {
				sub.run = function(event, cmds, cb) { can.runAction(can.request(event), ice.RUN, [meta.index].concat(cmds), cb) }
				sub.onaction.close = function(event) { can.misc.Event(event, can, function(msg) {
					can.onmotion.hidden(can, sub._target)
				}) }
				// can.page.style(can, sub._output, html.MAX_HEIGHT, sub.ConfHeight(can.ConfHeight()/2))
				// can.page.style(can, sub._output, html.MAX_WIDTH, sub.ConfWidth(can.ConfWidth()/2))
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
Volcanos(chat.ONACTION, {list: [["mode", "select", "insert"],
	{type: html.TEXT, name: "zoom", value: 17, range: [3, 21]},
	{type: html.TEXT, name: "pitch", value: 30, range: [0, 80, 5]},
	{type: html.TEXT, name: "rotation", value: "0", range: [0, 360, 10]},
	"current", "explore", "create", "direction"],
	_trans: {current: "定位", favor: "收藏"},

	zoom: function(event, can) { can.map.setZoom(can.Action("zoom")) },
	pitch: function(event, can) { can.map.setPitch(can.Action("pitch")) },
	rotation: function(event, can) { can.map.setRotation(can.Action("rotation")) },
	current: function(event, can) { can.onimport.center(can, can._current), can.map.setZoom(can.Action("zoom", 17)), can.map.setPitch(can.Action("pitch", 30)), can.map.setRotation(can.Action("rotation", 0)) },

	explore: function(event, can, button) { var p = can.onimport.point(can, can.current.item); can.onmotion.clear(can, can.ui.explore._target)
		for (var i = 1; i < 6; i++) {
			can.runAction(can.request({}, {"boundary": "nearby("+can.base.join([p.lat, p.lng, "500"], mdb.FS)+")", "page_index": i}), button, [], function(msg) {
				var res = can.base.Obj(msg.Result()); can.core.List(res.data, function(item) {
					can.onimport._item(can, can.onexport.point(can, item.location, {type: item.category, name: item.title, text: item.address}), can.ui.explore._target)
				})
			})
		}
	},
	direction: function(event, can, button) { var p = can.map.getCenter(); can.onmotion.clear(can, can.ui.direction._target)
		can.user.input(event, can, [["type", "driving", "walking", "bicycling", "transit"]], function(list) {
			var from = can.onimport.point(can, can._current), to = can.onimport.point(can, can.current.item)
			var msg = can.request({}, {type: list[0], "from": can.base.join([from.lat, from.lng], mdb.FS), "to": can.base.join([to.lat, to.lng], mdb.FS)})
			can.runAction(msg._event, button, [], function(msg) { var res = can.base.Obj(msg.Result()), route = res.result.routes[0]
					var coors = route.polyline, pl = [], kr = 1000000
					for (var i = 2; i < coors.length; i++) { coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr }
					for (var i = 0; i < coors.length; i += 2) { pl.push(new TMap.LatLng(coors[i], coors[i+1])) }
					can.onimport._polyline(can, pl)

					can.core.List(route.steps, function(item) { var i = item.polyline_idx[0]
						can.onimport._item(can, can.onexport.point(can, {lat: coors[i], lng: coors[i+1]}, {type: item.category, name: item.instruction, text: item.act_desc}), can.ui.direction._target)
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
	_point: function(event, can, item) { var rect = can.ui.content.getBoundingClientRect()
		return can.base.Copy({left: rect.left+event.point.x, bottom: rect.top+event.point.y, latitude: parseInt(event.latLng.lat*100000), longitude: parseInt(event.latLng.lng*100000)}, item, true)
	},
})
Volcanos(chat.ONEXPORT, {list: ["nation", "province", "city", "latitude", "longitude",  "type", "name", "text"],
	point: function(can, point, item) { return can.base.Copy({latitude: parseInt(point.lat*100000), longitude: parseInt(point.lng*100000)}, item, true) },
	center: function(can) { return can.onexport.point(can, can.map.getCenter()) },
	current: function(can) {
		var p = can.onexport.center(can); p.latitude /= 100000, p.longitude /= 100000; can.Status(p)
		can.current.marker.updateGeometries([{id: "current", position: can.map.getCenter()}])
		can.current.label.updateGeometries([{id: "current", position: can.map.getCenter()}])
		can.current.circle.setGeometries([{center: can.map.getCenter(), radius: 300}])
	},
	hover: function(can, item) {
		can.current.hover.setPosition(can.onimport.point(can, item))
		can.current.hover.setContent(item.name+"<br/>"+item.text)
	},
})
