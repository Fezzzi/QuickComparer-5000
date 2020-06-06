var getSuggestions = async query => {
  const proxyUrl = (path) => (
    // proxy reffering to https://www.srovnanicen.cz/
    `https://mapakci.cz/quickcomparerproxy/${path}`
  )
  
  const urlToDom = async (url) => (
    await fetch(url).then( r =>
        r.text()
    ).then((html) => {
      const dummy = document.createElement( 'html' )
      dummy.innerHTML = html
      return dummy
    })
  )

  console.log(`getting sugestions for query: ${query}`)
  const url = proxyUrl(`q/${encodeURI(query)}/`)
  const searchDom = await urlToDom(url)

  const knownItem = true // TODO
  let allOffers = []
  let title = "not found"
  if (knownItem) {
    const comparisonLink = searchDom.querySelector(
        "article.item.js-offer div.block.fork a.var-2"
    ).getAttribute("href")

    const comparisonsDom = await urlToDom(proxyUrl(comparisonLink))

    title = comparisonsDom.querySelector("h1.headline").textContent.trim()
    console.log(comparisonsDom)
    allOffers = Array.from(
        comparisonsDom.querySelectorAll("div.overview.js-offer-list div.item")
    ).map(o => ({
      companyName: o.querySelector("div.block.ratings a").title,
      companyImgSrc: o.querySelector("div.seo img")?.src,
      price: o.querySelector("strong.price.tooltip span[itemprop=price]").getAttribute("content"),
      currency: o.querySelector("strong.price.tooltip span[itemprop=priceCurrency]").textContent.trim(),
      itemLink: o.querySelector("div.fork a").getAttribute("href")
    }))
  } else {
    // TODO
  }

  ret = {
    title: title,
    comparisons: allOffers
  }
  console.log(ret)
  return ret
}
