var express = require("express"),
    http = require("http"),
    url = require("url");

var app = express.createServer(),
    port = process.env.PORT || 3000;

app.configure(function(){
    app.use(app.router);
    app.use(function(req, res, next) {
      // Filter out non-content. Ideally this would be in a subdir
      // but didn't want to move as the focus is the static client content.
      if ('/' === req.url
          || '/index.html' === req.url
          || '/index.htm' === req.url
          || /^\/css\//.test(req.url)
          || /^\/lib\//.test(req.url)
          || /^\/js\//.test(req.url)) {
        next();
      } else {
        res.send(404);
      }
	  });
    app.use(express.static(__dirname));
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

console.log("Starting gradient scanner server on port", port);
app.listen(port);
