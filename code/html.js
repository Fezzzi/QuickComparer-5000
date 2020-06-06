
var generateComparisonsOverview = (comparisons) => (
    `
    <table>
    ${comparisons.map(comparisonRow).join('\n')}
    </table>
    `
)

var comparisonRow = (c) => (
    `
    <tr>
        <td class="company-img">
            <img src="${c.companyImgSrc}" alt="${c.companyName}"/>
        </td>
        <td class="company-name">
            ${c.companyName}
        </td>
        <td class="item-price">
            ${c.price} ${c.currency}
        </td>
        <td class="item-link">
            <a href="${c.itemLink}">Otevřít</a>
        </td>
    </tr>
    `
)

