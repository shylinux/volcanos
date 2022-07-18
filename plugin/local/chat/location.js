
Volcanos("onimport", {help: "导入数据", _init: function(can, msg, cb, target) {
		window._show_location = function(res) {
			console.log(res)
		}
		can.require(["https://apis.map.qq.com/ws/location/v1/ip?callback=_show_location&key="+can.Conf("token")], function(res) {
			console.log(res)
		})
		can.require(["https://map.qq.com/api/gljs?v=1.exp&key="+can.Conf("token")], function() {
			can.user.agent.getLocation(function(res) {
				console.log(res)

			})

			var center = new TMap.LatLng(39.984120, 116.307484)
			new TMap.Map(can._output, {center: center, zoom: 17.2, pitch: 43.5, rotation: 45})
		})
	},
})
