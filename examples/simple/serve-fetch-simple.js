import http from "http";
import {requestFromNodeRequest, applyResponseToNodeResponse} from "server-fetch";

async function fetchServer(request) {
	return new Response("hello: "+request.url);
}

let server=http.createServer(async (req, res)=>{
	let request=requestFromNodeRequest(req);
	let response=await fetchServer(request);
	applyResponseToNodeResponse(response, res);
});

server.listen(3000,(e)=>{
	if (e) {
		console.log(e)
		process.exit();
	}

	console.log("Listening on port 3000...");
});
