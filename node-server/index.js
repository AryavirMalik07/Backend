const fs = require("fs");
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const pathName = req.url;
  if (pathName === "/overview" || pathName === "/") {
    res.end("this is overview");
  } else if (pathName === "/product") {
    res.end("this is product");
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1> page not found </h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("port on 3000");
});
