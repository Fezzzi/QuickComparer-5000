var port = chrome.extension.connect({ name: 'api' })

port.postMessage({ request: 'getTokens' });

port.onMessage.addListener(({ result }) => {
  const { token, url } = result[0]
  if (token) {
    getSuggestions(token).then(result => port.postMessage({
      request: 'openPopup',
      data: result,
      url,
    }))
  }
})
