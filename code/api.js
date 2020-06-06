var getSuggestions = async query => {
  const proxyUrl = (path) => (
    // proxy reffering to https://www.srovnanicen.cz/
    `https://mapakci.cz/quickcomparerproxy/${path}`
  )
  
  const urlToDom = async (url) => (
    await fetch(url).then(r =>
      r.text()
    ).then(stringToDom)
  )

  console.log(`getting sugestions for query: ${query}`)
  const url = proxyUrl(`q/${encodeURI(query)}/`)
  const searchDom = await urlToDom(url)
  const allProductLinks = searchDom.querySelectorAll(
    'article.item.js-offer div.block.fork a.var-2'
  )

  let allOffers = []
  let productName = ""
  if (allProductLinks.length > 0) {
    const comparisonLink = allProductLinks[0].getAttribute('href')

    const comparisonsDom = await urlToDom(proxyUrl(comparisonLink))

    productName = comparisonsDom.querySelector("h1.headline").textContent.trim()
    console.log(comparisonsDom)
    allOffers = Array.from(
      comparisonsDom.querySelectorAll('div.overview.js-offer-list div.item')
    ).map(o => ({
      companyName: o.querySelector('div.block.ratings a').title,
      companyImgSrc: o.querySelector('div.seo img')?.src,
      price: o.querySelector('strong.price.tooltip span[itemprop=price]').getAttribute('content'),
      currency: o.querySelector('strong.price.tooltip span[itemprop=priceCurrency]').textContent.trim(),
      itemLink: o.querySelector('div.fork a').getAttribute('href')
    })).sort((a, b) => a.price - b.price)
  }

  return {
    productName: productName,
    query: query,
    comparisons: allOffers
  }
}

var stringToDom = (str) => {
  const dummy = document.createElement('html')
  dummy.innerHTML = str
  return dummy
}
