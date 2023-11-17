const {ice, mdb, nfs, code, http} = require("../const.js")
const {Volcanos} = require("../proto.js")
module.exports =
Volcanos("page", {
	setData: function(can, list) {
		can.ui.setData({list: list||can.ui.data.list})
	}
})
