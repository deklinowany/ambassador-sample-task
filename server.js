var express = require('express'),
    app = express();

var root = __dirname + "/client-side";

app.use("/", express.static(root));
app.use("/bower_components/", express.static(__dirname+"/bower_components"));
app.get("*", function(req,res){
    res.sendfile(root + "/html/index.html");
})

app.listen(process.env.PORT || 7777);