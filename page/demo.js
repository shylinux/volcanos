Volcanos("demo", {head: document.head, body: document.body, target: document.body,
}, ["plugin/table.js"], function(can) {
    can.target.style.background = "black"
    console.log(can)
})
