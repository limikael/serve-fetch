# serve-fetch

This is a tiny ponyfill that makes it easy to write servers compliant with the [WHATWG Fetch Standard](https://fetch.spec.whatwg.org/). I.e., yu can create a server like this:

```js
export default async function(request) {
    return new Response("hello, i'm a little server...");
}
```

Where the `request` parameter is a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object, and the function returns a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. The module exposes three functions:

- `requestFromNodeRequest(nodeRequest)`<br/>Takes a Node.js [IncomingMessage)(https://nodejs.org/api/http.html#class-httpincomingmessage) and turns it into a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).
- `applyResponseToNodeResponse(response, nodeResponse)`<br/>Takes a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) as first parameter, and applies it to the Node.js [ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse).
- `createNodeRequestListener(handler)`<br/>Higher level function utilising the two functions above. It takes a function that turns a Request into a response, like the function in the example above. It returns a handler function that can be passed to the Node.js [http.createServer](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener) function.

## Command Line
This package also includes a command line tool to run simple servers. E.g. with a server like the following stored in the file `handler.js`:

```js
export default async function(request) {
    return new Response("hello, i'm a little server...");
}
```

You can start it as a server with:
```bash
serve-fetch --port 3000 handler.js
```

## References

At the time of writing, I couldn't find a stand alone package that did what I needed. However, there are implementations as part of other packages, the [node-server](https://github.com/honojs/node-server/) module for [Hono](https://hono.dev/) and the [WHATWG Node Generic Server Adapter](https://github.com/ardatan/whatwg-node/tree/master/packages/server). 
