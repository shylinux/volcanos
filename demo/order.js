Volcanos("demo", {
    _head: document.head, _body: document.body, _target: document.body,
}, ["lib/core.js", "lib/page.js", "frame.js"], function(can) {
    can._body.style.background = "black"
    can._body.style.color = "cyan"
    console.log("", "demo", can);

    can.core.Next([
        {type: "item", name: "Header", help: "head", list: ["pane/Header.js", "pane/Header.css"]},
        {type: "item", name: "Footer", help: "foot", list: ["pane/Footer.js", "pane/Footer.css"]},
    ], function(item, next) {
        can.onappend.init(can, item.type, item, item.list, function(sub) {
            can[item.name] = sub, next()
        }, can._target);
    })
})

