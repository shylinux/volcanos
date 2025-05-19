Volcanos(chat.ONFIGURE, {upload: {
	onclick: function(event, can, meta, target, cbs) {
		can.user.upload(event, can, function(msg) {
			target.value = msg.Result()
		})
	},
}})