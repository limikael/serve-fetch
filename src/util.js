// from: https://github.com/honojs/node-server/blob/main/src/utils.ts
export function writeFromReadableStream(stream, writable) {
	if (stream.locked) {
		throw new TypeError('ReadableStream is locked.')
	} else if (writable.destroyed) {
		stream.cancel()
		return
	}

	const reader = stream.getReader()
	writable.on('close', cancel)
	writable.on('error', cancel)
	reader.read().then(flow, cancel)
	return reader.closed.finally(() => {
		writable.off('close', cancel)
		writable.off('error', cancel)
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function cancel(error) {
		reader.cancel(error).catch(() => {})
		if (error) {
			writable.destroy(error)
		}
	}
	function onDrain() {
		reader.read().then(flow, cancel)
	}
	function flow({ done, value }) {
		try {
			if (done) {
				writable.end()
			} else if (!writable.write(value)) {
				writable.once('drain', onDrain)
			} else {
				return reader.read().then(flow, cancel)
			}
		} catch (e) {
			cancel(e)
		}
	}
}

export const buildOutgoingHttpHeaders = headers => {
	const res = {}

	const cookies = []
	for (const [k, v] of headers) {
		if (k === 'set-cookie') {
			cookies.push(v)
		} else {
			res[k] = v
		}
	}
	if (cookies.length > 0) {
		res['set-cookie'] = cookies
	}

	if (!res['content-type'])
		res['content-type'] = 'text/plain; charset=UTF-8'

	return res
}