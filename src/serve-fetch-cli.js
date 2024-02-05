#!/usr/bin/env node

import http from "http";
import {createNodeRequestListener} from "./main.js";
import path from "path";

let argv=process.argv.slice(2);
let port=3000;

if (argv.includes("--port")) {
	port=argv[argv.indexOf("--port")+1];
	argv.splice(argv.indexOf("--port"),2);
}

if (argv.length!=1) {
	console.log("Usage:")
	console.log("  serve-fetch [--port <port>] <entry-point>")
	console.log("");
	console.log("Options:");
	console.log("  --port <port>  Port to listen to.");
	console.log("");
	console.log("More info:");
	console.log("  https://github.com/limikael/serve-fetch");
	process.exit(1);
}

let modulePath=path.resolve(argv[0]);
let handler=(await import(modulePath)).default;
let server=http.createServer(createNodeRequestListener(handler));

server.listen(3000,(e)=>{
	if (e) {
		console.log(e)
		process.exit();
	}

	console.log(`Listening to port ${port}...`);
});
