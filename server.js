var express = require('express'),
    app = express();

var root = __dirname + "/client-side";

app.use("/", express.static(root));
app.get("*", function(req,res){
    res.sendfile(root + "/html/index.html");
})

app.listen(process.env.PORT || 7777);