var generateComparisonsOverview = (comparisons, query) => (
    `
    <div class="input-row">
        <div class="input-wrapper">
            <label for="query">
                <input placeholder="Query" type="text" class="input-field" value="${query}">
            </label>
        </div>
        <button onclick="refreshSearch(this)">Search</button>
    </div>
    <table>
    ${
        !comparisons.length?
            nothingFoundErr() :
            comparisons
                .map(comparisonRow)
                .join('\n')
    }
    </table>
    <footer>
        <div class="footer-wrapper">
            <span class="footer-text">&copy; 2020 CIRACU developers</span>
        </div>
    </footer>
    `
)

var nothingFoundErr = () => (
  `<tr class="no-results">No results found</div>`
);

var comparisonRow = (c) => (
    `
    <tr onclick="
        let win = window.open('${c.itemLink}', '_blank');
        win.focus();
    ">
        <td class="company-img">
            <img src="${c.companyImgSrc}" alt="${c.companyName}"/>
        </td>
        <td class="company-name">
            ${c.companyName}
        </td>
        <td class="item-price">
            ${c.price} ${c.currency}
        </td>
    </tr>
    `
)
