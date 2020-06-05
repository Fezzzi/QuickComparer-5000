var port = chrome.extension.connect({ name: 'api' })

port.postMessage({request: "getTokens"});

port.onMessage.addListener(({ tokens }) => {
    if (tokens && tokens[0]) {
      const suggestions = getSuggestions(tokens[0])
      console.log(`got suggestions: ${JSON.stringify(suggestions)}`)
      // todo: handle displaying of suggestions
    }
})
