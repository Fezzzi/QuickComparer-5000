const browserActionHandler = ({ id }, tab) => {
  chrome.tabs.executeScript({ file: 'code/tokenizer.js' })
  chrome.tabs.executeScript({ file: 'code/api.js' })
  chrome.tabs.executeScript({ file: 'code/main.js' })
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
          const code = `document.all[0]`
          
          chrome.tabs.executeScript(id, { code }, result => port.postMessage({ result }))
        })
      }
    })
  }
}

chrome.browserAction.onClicked.addListener(browserActionHandler)
chrome.extension.onConnect.addListener(messageRequestHandler)
