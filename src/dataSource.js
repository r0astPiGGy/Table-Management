import {amountKeyOf, priceKeyOf, COMPANY_NAME_KEY, DATA_AMOUNT, PRICE_TOTAL_KEY} from "./const.js";
import {generateData, PRODUCT_PRICES} from "./generate.js";
import {distinct} from "./utils.js";

function isNotEmpty(str) {
    return str !== ""
}

function predicate(companyModel) {
    return isNotEmpty(companyModel.company) && isNotEmpty(companyModel.product) && companyModel.count >= 0
}

export function fetchCompanyData(amount = DATA_AMOUNT) {
    const priceList = PRODUCT_PRICES
    const records = generateData(amount).filter(predicate)

    const companyIds = distinct(records.map(it => it.company))

    const mappedCompanies = companyIds.reduce((acc, companyId) => {
        const company = {}

        company[COMPANY_NAME_KEY] = companyId

        Object.keys(priceList).forEach(productId => {
            company[amountKeyOf(productId)] = 0
            company[priceKeyOf(productId)] = 0
        })

        company[PRICE_TOTAL_KEY] = 0

        acc[companyId] = company
        return acc
    }, {})

    records.forEach(record => {
        mappedCompanies[record.company][amountKeyOf(record.product)] = record.count
    })

    Object.values(mappedCompanies).forEach(company => {
        Object.keys(priceList).forEach(productId => {
            const amount = company[amountKeyOf(productId)]
            const price = amount * priceList[productId]

            company[priceKeyOf(productId)] = price
            company[PRICE_TOTAL_KEY] += price
        })
    })

    return Object.values(mappedCompanies)
}