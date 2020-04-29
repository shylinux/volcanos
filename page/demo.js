Volcanos("demo", {head: document.head, body: document.body, target: document.body,

}, ["lib/core.js", "lib/page.js", "plugin/table.js", "plugin/local/team/plan.js", "plugin/local/team/plan.css"], function(can) {
    can.target.style.background = "black"
    console.log(can)
    can.page.AppendField(can, can.target, "item", {name: "demo", help: "demo", inputs: [
        {_input: "text", name: "help"},
    ]})
})
