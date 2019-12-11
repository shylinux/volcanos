Volcanos("onimport", {help: "导入数据", list: [],
    login: function(event, can, value, cmd, output) {
        if (!can.user.Cookie("sessid")) {can.Show(); return}

        can.run(event||{}, [], function(msg) {
            msg.nickname && msg.nickname.length > 0?
                can.Export(event, msg.nickname[0], "username"): can.Show()
        })
    },
})
Volcanos("onaction", {help: "组件交互", list: []})
Volcanos("onchoice", {help: "组件菜单", list: []})
Volcanos("ondetail", {help: "组件详情", list: []})
Volcanos("onexport", {help: "导出数据", list: []})

