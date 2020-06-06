const browserActionHandler = () => {
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

const addResults = ({ comparisons, title }) => {
  const newModal = document.createElement('div')
  newModal.className = 'quickComparer-5000'
  newModal.innerHTML = generateComparisonsOverview(comparisons, title)
  const oldModal = document.querySelector('.quickComparer-5000')
  if (oldModal) {
    oldModal.remove()
  }
  document.body.appendChild(newModal)
}

const messageRequestHandler = port => {
  if (port.name === 'api') {
    port.onMessage.addListener(({ request, data }) => {
      switch (request) {
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
            const code = `(${addResults.toString()})(${JSON.stringify(data)})` 
            chrome.tabs.executeScript(id, { code })
          })
          break
      }
    })
  }
}

chrome.browserAction.onClicked.addListener(browserActionHandler)
chrome.extension.onConnect.addListener(messageRequestHandler)
