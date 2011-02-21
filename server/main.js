var connect = require("./lib/connect/lib/connect"),
    express = require("express"),
    http = require("http"),
    url = require("url");

var app = express.createServer();

app.configure(function(){
    app.use(app.router);
    app.use(connect.staticProvider({root: "..", exclude: /.*\/server\/.*/ig}));
});

app.get('/proxy', function(req, res){
    var hrefParam = req.param("href"),
        href = url.parse(hrefParam),
        options = {
            host: href.hostname,
            port: href.port || 80,
            path: (href.pathname || "") + (href.search || "")
        },
        len = 0;

    http.get(options, function(sourceRes) {
        sourceRes.on("data", function(chunk) {
            res.write(chunk);
            len += chunk.length;
        });
        sourceRes.on("end", function() {
            console.info("proxied url", hrefParam, "length", len, "status", sourceRes.statusCode);
            res.end();
        });

        res.writeHead(sourceRes.statusCode, sourceRes.headers);
    }).on("error", function(e) {
        console.info("error", e);
        res.send(502);
    });
});

app.listen(3000);
