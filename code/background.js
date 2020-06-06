const browserActionHandler = ({ id }, tab) => {
  chrome.tabs.executeScript({ file: 'code/html.js' })
  chrome.tabs.executeScript({ file: 'code/api.js' })
  chrome.tabs.executeScript({ file: 'code/main.js' })
}

const getTokens = () => {
  const title = document.querySelector('head title')?.innerText
  const headlines = Object.values(document.getElementsByTagName('h1'))
    .map(headline => headline.innerText)
    .filter(headline => headline.length)

  const filteredHeadlines = headlines.filter(headline => title.includes(headline))
  return {
    token: filteredHeadlines[0] || headlines[0],
    url: '',
  }
}

const addResults = (data) => {
  const modal = document.createElement('div')
  modal.className = 'kundi-zlem'
  console.log("data", data)
  modal.innerHTML = generateComparisonsOverview(data.data.comparisons)
  document.body.appendChild(modal)
}

const messageRequestHandler = port => {
  if (port.name === 'api') {
    port.onMessage.addListener((action) => {
      switch (action.request) {
        case 'getTokens': 
          chrome.tabs.query({
            active: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT
          }, tabs => {
            const { id } = tabs[0].url
            const code = `(${getTokens.toString()})()`
            chrome.tabs.executeScript(id, { code }, result => port.postMessage({ result }))
          })
          break
        case 'openPopup':
          chrome.tabs.query({
            active: true,
            windowId: chrome.windows.WINDOW_ID_CURRENT
          }, tabs => {
            const { id } = tabs[0].url
            const code = `(${addResults.toString()})(${JSON.stringify(action)})` 
            chrome.tabs.executeScript(id, { code })
          })
          break
      }
    })
  }
}

chrome.browserAction.onClicked.addListener(browserActionHandler)
chrome.extension.onConnect.addListener(messageRequestHandler)
