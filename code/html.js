
var generateComparisonsOverview = (comparisons) => (
    `
    <table>
    ${
        !comparisons.length?
            nothingFoundErr() :
            comparisons
                .map(comparisonRow)
                .join('\n')
    }
    </table>
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


