Volcanos(chat.ONFIGURE, {help: "控件详情", list: [], province: {onclick: function(event, can, meta, cb, target) { cb(function(can, cbs) {
	can.require(["/require/shylinux.com/x/echarts/echarts.js", "/require/shylinux.com/x/echarts/china.js"], function() {
		var china_chart = echarts.init(can.page.Append(can, can._output, [{type: html.DIV, style: {width: 600, height: 400}}]).first)
		china_chart.setOption({geo: {map: 'china'}}), china_chart.on(html.CLICK, function (params) {
			target.value = params.name, can.close()
		}), can.Status(mdb.TOTAL, 34), can.onlayout.figure(event, can), can.base.isFunc(cbs) && cbs(can)
	})
}) }}, })
