const refreshSearch = target => {
  const query = target.parentElement.getElementsByTagName('input')[0].value
  getSuggestions(query).then(result => {
    const newHTML = generateComparisonsOverview(result)
    target.parentElement.parentElement.innerHTML = newHTML
  })
}
