Volcanos(chat.ONFIGURE, {province: {
	onclick: function(event, can, meta, target, cbs) { cbs(function(can, cb) {
		can.require(["/require/shylinux.com/x/echarts/echarts.js", "/require/shylinux.com/x/echarts/china.js"], function() {
			var chart = echarts.init(can.page.Appends(can, can._output, [{type: html.DIV, style: {width: can.page.width()/2, height: can.page.height()/2}}])._target)
			chart.setOption({geo: {map: 'china'}}), chart.on(html.CLICK, function(params) { target.value = params.name, can.close() })
		}), can.onappend._action(can, [cli.CLOSE], can._action, {close: function() { can.close() }})
	}) },
	onkeydown: function(event, can, meta, cb, target, sub, last) { if (sub && sub.hidden()) { return last(event) } switch (event.key) {
		case lang.ESCAPE: sub.close(); break
		}
	},
}})