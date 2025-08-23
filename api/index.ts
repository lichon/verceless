"use strict";

const http = require('http');
const request = http.request;
const net = require('net');
const httpProxy = require('http-proxy');

let auth = "user:pass";
auth = new Buffer(auth).toString('base64');
auth = "Basic " + auth;

const porxyChain = function (listenPort) {

  const settings = {target: `https://vvvsss.lichon.cc`};
  const proxy = httpProxy.createProxyServer(settings);

  proxy.on('error', function(err) {
    console.log('ERR:',err);
  });
  const server = http.createServer(function (req, res) {
    proxy.web(req, res, settings)
  });
  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head)
  })
  server.on('connect', function (req, socket) {
    if (!req.headers['proxy-authorization'] || req.headers['proxy-authorization'] !== auth) {
      socket.write("HTTP/1.1 401 UNAUTHORIZED\r\n\r\n");
      socket.end();
      socket.destroy();
      return;
    }
    delete req.headers['proxy-authorization'];
    socket.on('error', function () {
      console.log('socket error');
    });
    const parts = req.url.split(':', 2);
    const conn = net.connect(parts[1], parts[0], function () {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      socket.pipe(conn);
      conn.pipe(socket);
    });
    conn.on('error', function () {
      socket.write("HTTP/1.1 500 SERVER ERROR\r\n\r\n");
      socket.end();
      socket.destroy();
    });

  });
  server.listen(listenPort);
  console.log('proxy listening on port ' + listenPort);
};

porxyChain(3000)
