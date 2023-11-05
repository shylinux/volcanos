Volcanos(chat.ONIMPORT, {
	_init: function(can, msg) { var cache = {}
		if (can.Conf(ctx.STYLE) == html.FLOAT && !can.page.ClassList.has(can, can._fields, html.FLOAT)) { msg.Option(ice.MSG_STATUS, ""), can.onlayout._float(can) }
		var title = msg.Option("title")||can.Conf("title"), field = can.Conf(mdb.FIELD)||mdb.VALUE, name = msg.Option(mdb.NAME)||can.Conf(mdb.NAME)||"中国", path = msg.Option(nfs.PATH)||can.Conf(nfs.PATH)||"100000"
		var max = 0, data = msg.Table(function(value) { if (parseFloat(value[field]) > max) { max = parseFloat(value[field]) } return {name: value.name, value: value[field]} })
		var option = {title: {text: title, left: '5%', textStyle: {fontSize: '24'}},
			tooltip: {show: true, trigger: "item", formatter: function (params) { return params.name+': '+(params.value||"0") }},
			visualMap: {min: 0, max: max, text: ['高', '低'], calculable: true, left: 'left', top: 'bottom'},
		}
		can.user.toastProcess(can), can.page.requireModules(can, ["echarts/dist/echarts.js"], function() {
			can.page.style(can, can._output, html.HEIGHT, can.ConfHeight(), html.WIDTH, can.ConfWidth())
			function load(name, path) { can.onimport.load(can, name, path, function() {
				can.onimport.tabs(can, [{name:name}], function() {
					if (cache[name]) { return can.page.SelectChild(can, can._output, html.DIV_ITEM, function(target) { can.onmotion.toggle(can, target, target == cache[name]) }) }
					var chart = echarts.init(cache[name] = can.page.Append(can, can._output, [{view: html.ITEM, style: {height: can.ConfHeight(), width: can.ConfWidth()}}])._target)
					option.series = [{name: title, data: data, mapType: name, type: "map"}], option.geo = {map: name}, chart.setOption(option), can.user.toastSuccess(can)
					chart.on(html.CLICK, function(params) {
						var p = can.onimport.adcode[params.name]; if (p) { return load(params.name, p) }
						var p = can.onimport.adcode[name+params.name]; if (p) { return load(name+params.name, p) }
						can.user.input({}, can, ["adcode"], function(list) { load(name+params.name, can.onimport.adcode[name+params.name] = list[0]) })
					}), can.page.SelectChild(can, can._output, html.DIV_ITEM, function(target) { can.onmotion.toggle(can, target, target == cache[name]) })
				}, function() {
				})
			}) } load(name, path)
		})
	},
	load: function(can, name, path, cb) {
		path.length == 2 && (path += "0000"), path.length == 4 && (path += "00")
		path = "/wiki/geoarea/"+path+(can.base.endWith(path, "00")? "_full": "")+".json"
		can.misc.POST(can, can.request({}, {_method: "GET"}), path, {}, function(msg) { echarts.registerMap(name, JSON.parse(msg._xhr.responseText)), cb() })
	},
	adcode: {
		"中国": "100000",
		"广东省": "440000",
		"深圳市": "440300",
		"宝安区": "440306",
	},
})
