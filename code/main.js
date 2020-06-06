var port = chrome.extension.connect({ name: 'api' })

port.postMessage({ request: 'getTokens' });

port.onMessage.addListener(({ result }) => {
  const { token } = result[0]
  if (token) {
    getSuggestions(token).then(data =>
      port.postMessage({
        request: 'openModal',
        data,
      })
    )
  }
})
