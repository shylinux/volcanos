Volcanos(chat.ONFIGURE, {province: {
	onclick: function(event, can, meta, cbs, target) { cbs(function(can, cb) {
		can.require(["/require/shylinux.com/x/echarts/echarts.js", "/require/shylinux.com/x/echarts/china.js"], function() {
			var chart = echarts.init(can.page.Append(can, can._output, [{type: html.DIV, style: {width: can.page.width()/2, height: can.page.height()/2}}]).first)
			chart.setOption({geo: {map: 'china'}}), chart.on(html.CLICK, function(params) { target.value = params.name, can.close() })
		})
	}) }
}})