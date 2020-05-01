Volcanos("demo", { _head: document.head, _body: document.body, _target: document.body,
}, [Config.volcano].concat(Config.libs).concat(Preload), function(can) { can.Conf(Config); can.core.Next(can.Conf("panes"), function(item, next) {
        can.onappend._init(can, item, Config.libs.concat(item.list), function(sub) {
            sub.run = function(event, cmds, cb, silent) { var msg = sub.request(event);
                switch (cmds[0]) {
                    case "search":
                        can.onsearch.start(event, can, cmds[1], cb)
                        return
                }

                // 发送请求
                Volcanos.meta.debug["request"] && console.log("volcano", sub._name, "request", msg._name, cmds, msg);
                can.misc.Run(event, can, {names: item.name}, cmds, function(msg) {
                    // 接收响应
                    Volcanos.meta.debug["request"] && console.log("volcano", sub._name, "response", msg._name, msg.result, msg);
                    cb(msg);
                })
            }
            can[item.name] = sub, next()
        }, can._target);
    }, function() {
        // 启动入口
        can.onlayout.start(can, can._target, window.innerWidth, window.innerHeight);
        console.log("volcano", "demo", "start", can);
        can.Action.onexport.action({}, can.Action, function() {
        })
    })
})

