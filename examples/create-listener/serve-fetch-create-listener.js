import http from "http";
import {createNodeRequestListener} from "server-fetch";

let server=http.createServer(createNodeRequestListener(async req=>{
	return new Response("hello world");
}));

server.listen(3000,(e)=>{
	if (e) {
		console.log(e)
		process.exit();
	}

	console.log("Listening on port 3000...");
});
