const browserActionHandler = ({ id }, tab) => {
  chrome.tabs.executeScript({ file: 'code/tokenizer.js' })
  chrome.tabs.executeScript({ file: 'code/api.js' })
  chrome.tabs.executeScript({ file: 'code/main.js' })
}

const getTokens = () => {
  const title = document.querySelector('head title')?.innerText
  const headlines = Object.values(document.getElementsByTagName('h1'))
    .map(headline => headline.innerText)
    .filter(headline => headline.length)

  const filteredHeadlines = headlines.filter(headline => title.includes(headline))
  return filteredHeadlines[0] || headlines[0]
}

const messageRequestHandler = port => {
  if (port.name === 'api') {
    port.onMessage.addListener(({ request }) => {
      if (request === 'getTokens') {
        chrome.tabs.query({
          active: true,
          windowId: chrome.windows.WINDOW_ID_CURRENT
        }, tabs => {
          const { id } = tabs[0].url
          const code = `(${getTokens.toString()})()
          `
          
          chrome.tabs.executeScript(id, { code }, result => port.postMessage({ tokens: result }))
        })
      }
    })
  }
}

chrome.browserAction.onClicked.addListener(browserActionHandler)
chrome.extension.onConnect.addListener(messageRequestHandler)
