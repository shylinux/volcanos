Volcanos("onimport", {help: "导入数据", list: [],
    _init: function(can, meta, list, cb, target) {
    },
})
Volcanos("onaction", {help: "交互数据", list: [],
    _init: function(can, msg, list, cb, target) {
        can.onexport._init(can, msg, list, cb, target)
        can.run(msg._event, ["search", "River.onaction._init"], function(msg) {
        })
        can.run(msg._event, ["search", "Footer.onaction._init"], function(msg) {
        })
    },
    title: function(event, can, key) {
        can.run(event, ["search", "Action.onaction._init"], function(msg) {
            console.log(msg)
        })
    },
    username: function(event, can, key) {
        // can.ui[key].innerHTML = can.base.Time().split(" ")[1]
    },
})
Volcanos("onexport", {help: "导出数据", list: [],
    _init: function(can, msg, list, cb, target) { can._output.innerHTML = "";
        msg = can.request({}, {})
        can.run(msg._event, [], function(msg) {
            // if (Volcanos.meta.follow["debug"]) { debugger }
            can.Conf("username", msg.Option("user.nick")||msg.Option("user.name"))

            can.core.List(msg.result||["github.com/shylinux/contexts"], function(title) {
                can.page.Append(can, can._output, [{view: ["title", "div", title],
                    click: function(event) {can.onaction["title"](event, can, "title")},
                }])
            })

            console.log(can._root, can._name, "show", can.Conf("state"))
            can.ui = can.page.Append(can, can._output, [{view: "state", list: can.core.List(can.Conf("state"), function(item) {
                return {name: item, view: ["item", "div", can.Conf(item)||""], click: function(event) {can.onaction[item](event, can, item)}};
            })}])

            can.timer = can.Timer({interval: 1000, length: -1}, function(event) {
                can.onexport.time(event, can, "time")
            })
        })
    },
    time: function(event, can, key) {
        can.ui[key].innerHTML = can.base.Time().split(" ")[1]
    },
})
