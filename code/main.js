var domPort = chrome.extension.connect({ name: 'dom' })

domPort.postMessage({request: "get"});

domPort.onMessage.addListener(({ result }) => {
    if (result) {
      const tokens = getTokens(result)
      const suggestions = getSuggestions(tokens)
      console.log(`got suggestions: ${JSON.stringify(suggestions)}`)
      // todo: handle displaying of suggestions
    }
})
