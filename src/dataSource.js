import {amountKeyOf, priceKeyOf, COMPANY_NAME_KEY, DATA_AMOUNT, TOTAL_PRICE_KEY, TOTAL_PRODUCTS_KEY} from "./const.js";
import {generateData, PRODUCT_PRICES} from "./generate.js";
import {distinct} from "./utils.js";

function getAmountToPricePairs(productKeys) {
    return productKeys.map(key => [amountKeyOf(key), priceKeyOf(key)])
}

function getMetricsHeaders(productKeys) {
    return [
        ...getAmountToPricePairs(productKeys).flat(),
        TOTAL_PRICE_KEY,
        TOTAL_PRODUCTS_KEY
    ]
}

function getAllHeaders(productKeys) {
    return [
        COMPANY_NAME_KEY,
        ...getMetricsHeaders(productKeys)
    ]
}

export function fetchCompanyData(amount = DATA_AMOUNT) {
    const priceList = PRODUCT_PRICES
    const records = generateData(amount)
        .filter(it => it.company !== "")
        .filter(it => it.product !== "")
        .filter(it => it.count > 0)

    const companyIds = distinct(records.map(it => it.company))
    const productIds = distinct(records.map(it => it.product))

    const mappedCompanies = companyIds.reduce((acc, companyId) => {
        const company = {}

        company[COMPANY_NAME_KEY] = companyId
        company[TOTAL_PRICE_KEY] = 0
        company[TOTAL_PRODUCTS_KEY] = 0

        productIds.forEach(productId => {
            company[amountKeyOf(productId)] = 0
            company[priceKeyOf(productId)] = 0
        })

        acc[companyId] = company
        return acc
    }, {})

    records.forEach(record => {
        mappedCompanies[record.company][amountKeyOf(record.product)] = record.count
    })

    const companies = Object.values(mappedCompanies)

    companies.forEach(company => {
        productIds.forEach(productId => {
            const amount = company[amountKeyOf(productId)]
            const price = amount * priceList[productId]

            company[priceKeyOf(productId)] = price
            company[TOTAL_PRODUCTS_KEY] += amount
            company[TOTAL_PRICE_KEY] += price
        })
    })

    return {
        metricHeaders: getMetricsHeaders(productIds),
        allHeaders: getAllHeaders(productIds),
        companies: companies
    }
}