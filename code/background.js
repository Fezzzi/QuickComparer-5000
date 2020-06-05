let initialized = false;

const browserActionHandler = (info, tab) => {
  if (!initialized) {
    chrome.tabs.executeScript({ file: 'code/tokenizer.js' })
    chrome.tabs.executeScript({ file: 'code/api.js' })
    chrome.tabs.executeScript({ file: 'code/main.js' })
    initialized = true
  }
  chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
  }, tabs => {
    const { id } = tabs[0].url
    let code = `domPort.postMessage({ request: 'get' })`
    chrome.tabs.executeScript(id, { code })
  })
}

const messageRequestHandler = port => {
  if (port.name === 'dom') {
    port.onMessage.addListener(({ request }) => {
      if (request === 'get') {
        chrome.tabs.query({
          active: true,
          windowId: chrome.windows.WINDOW_ID_CURRENT
        }, tabs => {
          const { id } = tabs[0].url
          let code = 'document'
          chrome.tabs.executeScript(id, { code }, result => port.postMessage({ result }))
        })
      }
    })
  }
}

chrome.browserAction.onClicked.addListener(browserActionHandler)
chrome.extension.onConnect.addListener(messageRequestHandler)
