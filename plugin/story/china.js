Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { var field = can.Conf(mdb.FIELD)||mdb.VALUE, cache = {}, path = msg.Option(nfs.PATH)||can.Conf(nfs.PATH)||"10"
		var max = 0, data = msg.Table(function(value) { if (parseFloat(value[field]) > max) { max = parseFloat(value[field]) } return {name: value.name, value: value[field]} })
		var option = {title: {text: msg.Option("title")||can.Conf("title"), textStyle: {fontSize: '24'}, left: '5%'},
			tooltip: {formatter: function (item) { return item.name+': '+(item.value||"0") }}, visualMap: {min: 0, max: max, text: [max]},
		}
		if (can.Conf(ctx.STYLE) == html.FLOAT && !can.page.ClassList.has(can, can._fields, html.FLOAT)) { msg.Option(ice.MSG_STATUS, ""), can.onlayout._float(can) }
		can.page.requireModules(can, ["echarts/dist/echarts.min.js"], function() { can.misc.GET(can, "/wiki/geoarea/city.json", function(text) { can.onimport.adcode = JSON.parse(text)
			!can.onimport.adcode[path] && can.core.Item(can.onimport.adcode, function(code, list) { list.name == path && (path = code) })
			can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
			function load(path, name) { if (cache[path]) { return cache[path]._tabs.click() } can.onimport.load(can, path, function(text) { echarts.registerMap(path, JSON.parse(text))
				can.onimport.tabs(can, [{name: name}], function(event, tabs) { var list = can.onimport.adcode[path]; msg.Length() == 0 && can.Status(mdb.COUNT, list && list.list? can.core.Item(list.list).length: 0)
					if (cache[path]) { return can.page.SelectChild(can, can._output, html.DIV_ITEM, function(target) { can.onmotion.toggle(can, target, target == cache[path]) }) }
					var chart = echarts.init(cache[path] = can.page.Append(can, can._output, [{view: html.ITEM, style: {height: can.ConfHeight(), width: can.ConfWidth()}}])._target)
					option.series = [{data: data, mapType: path, type: "map"}], option.geo = {map: path}, chart.setOption(option)
					chart.on(html.CLICK, function(item) { if (list && list.list) { var code = list.list[item.name]; code && load(code, item.name) } })
					cache[path]._tabs = tabs._target, can.page.SelectChild(can, can._output, html.DIV_ITEM, function(target) { can.onmotion.toggle(can, target, target == cache[path]) })
				}, function() { can.page.Remove(can, cache[path]), delete(cache[path]) })
			}) } load(path, can.onimport.adcode[path].name)
		}) })
	}, adcode: {},
	load: function(can, path, cb) { var _path = path
		path.length == 2 && (path += "0000"), path.length == 4 && (path += "00")
		path = "/wiki/geoarea/"+path+(can.base.endWith(path, "00")? "_full": "")+".json"
		can.misc.GET(can, path, function(text) { text? cb(text): can.misc.GET(can, path.replace("_full", ""), cb) })
	},
})
