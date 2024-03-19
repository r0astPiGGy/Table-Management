export const ITEMS_PER_PAGE = [25, 50, 100]
export const DATA_AMOUNT = 50
export const COMPANY_NAME_KEY = "Компания"
export const PRICE_TOTAL_KEY = "Итого"

export function priceKeyOf(productId) {
    return `${productId} (руб.)`
}

export function amountKeyOf(productId) {
    return `${productId} (шт.)`
}
