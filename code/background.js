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
  return { token: filteredHeadlines[0] || headlines[0] }
}

const addResults = (data) => {
  const newModal = document.createElement('div')
  newModal.className = 'quickComparer-5000'
  newModal.innerHTML = generateComparisonsOverview(data)
  
  const oldModal = document.querySelector('.quickComparer-5000')
  if (oldModal) {
    oldModal.remove()
  }
  document.body.appendChild(newModal)
}

const queryTab = (code, callback) =>
  chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
  }, tabs => {
    const { id } = tabs[0].url
    chrome.tabs.executeScript(id, { code }, callback)
  })

const messageRequestHandler = port => {
  if (port.name === 'api') {
    port.onMessage.addListener(({ request, data }) => {
      switch (request) {
        case 'getTokens': 
          queryTab(`(${getTokens.toString()})()`, result => port.postMessage({ result }))
          break
        case 'openModal':
          queryTab(`(${addResults.toString()})(${JSON.stringify(data)})`, null)
          break
      }
    })
  }
}

chrome.browserAction.onClicked.addListener(browserActionHandler)
chrome.extension.onConnect.addListener(messageRequestHandler)
