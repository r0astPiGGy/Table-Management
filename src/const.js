export const ITEMS_PER_PAGE = [25, 50, 100]
export const DEFAULT_ITEMS_PER_PAGE = ITEMS_PER_PAGE[0]
export const DATA_AMOUNT = 1000
export const COMPANY_NAME_KEY = "Компания"
export const PRICE_TOTAL_KEY = "Итого"

export function priceKeyOf(productId) {
    return `${productId} (руб.)`
}

export function amountKeyOf(productId) {
    return `${productId} (шт.)`
}
