import {amountKeyOf, priceKeyOf, COMPANY_NAME_KEY, DATA_AMOUNT, TOTAL_PRICE_KEY, TOTAL_PRODUCTS_KEY} from "./const.js";
import {generateData, PRODUCT_PRICES} from "./generate.js";
import {distinct} from "./utils.js";

function isNotEmpty(str) {
    return str !== ""
}

function predicate(companyModel) {
    return isNotEmpty(companyModel.company) && isNotEmpty(companyModel.product) && companyModel.count >= 0
}

function getAmountToPricePairs() {
    return Object.keys(PRODUCT_PRICES).map(key => [amountKeyOf(key), priceKeyOf(key)])
}

export function getMetricsHeaders() {
    return [
        ...getAmountToPricePairs().flat(),
        TOTAL_PRICE_KEY,
        TOTAL_PRODUCTS_KEY
    ]
}

export function getAllHeaders() {
    return [
        COMPANY_NAME_KEY,
        ...getMetricsHeaders()
    ]
}

export function fetchCompanyData(amount = DATA_AMOUNT) {
    const priceList = PRODUCT_PRICES
    const records = generateData(amount).filter(predicate)

    const companyIds = distinct(records.map(it => it.company))

    const mappedCompanies = companyIds.reduce((acc, companyId) => {
        const company = {}

        company[COMPANY_NAME_KEY] = companyId
        company[TOTAL_PRICE_KEY] = 0
        company[TOTAL_PRODUCTS_KEY] = 0

        Object.keys(priceList).forEach(productId => {
            company[amountKeyOf(productId)] = 0
            company[priceKeyOf(productId)] = 0
        })

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
            company[TOTAL_PRODUCTS_KEY] += amount
            company[TOTAL_PRICE_KEY] += price
        })
    })

    return Object.values(mappedCompanies).filter(it => it[TOTAL_PRICE_KEY] > 0)
}