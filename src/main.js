import {writeFromReadableStream, buildOutgoingHttpHeaders} from "./util.js";
import {Readable} from 'node:stream';

// ref:
// https://github.com/honojs/node-server/
// https://github.com/nodejs/node/issues/42529
// https://github.com/ardatan/whatwg-node/

export function requestFromNodeRequest(nodeRequest) {
	let proto="http:";
	if (nodeRequest.headers["x-forwarded-proto"]=="https:")
		proto="https:";

	let url=proto+nodeRequest.headers.host+nodeRequest.url;
	let options={
		method: nodeRequest.method,
		headers: nodeRequest.headers,
	};

	if (nodeRequest.method!="GET" && nodeRequest.method!="HEAD") {
		options.body=Readable.toWeb(nodeRequest);
		options.duplex="half";
	}

	return new Request(url,options);
}

export function applyResponseToNodeResponse(response, nodeResponse) {
	let headers=buildOutgoingHttpHeaders(response.headers);
	nodeResponse.writeHead(response.status,headers);
	writeFromReadableStream(response.body,nodeResponse)
		.then(()=>nodeResponse.end())
		.catch((e)=>{
			console.log("Unable to write stream");
			nodeResponse.end();
		});
}

export function createNodeRequestListener(handler) {
	return ((req, res)=>{
		let request=requestFromNodeRequest(req);
		handler(request)
			.then(response=>{
				if (!response)
					response=new Response("Not Found.",{status: 404});

				applyResponseToNodeResponse(response, res);
			})
			.catch(e=>{
				if (!res.headersSent)
					res.writeHead(500);

				res.end(String(e));
			})
	});	
}