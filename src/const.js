export const ITEMS_PER_PAGE = [10, 50, 100]
export const DEFAULT_ITEMS_PER_PAGE = ITEMS_PER_PAGE[0]
export const DATA_AMOUNT = 1000
export const COMPANY_NAME_KEY = "Компания"
export const TOTAL_PRICE_KEY = "Итого (руб.)"
export const TOTAL_PRODUCTS_KEY = "Всего товара (шт.)"

export const SortMode = {
    NONE: "none",
    ASCENDING: "ascending",
    DESCENDING: "descending"
}

export const sortModes = Object.values(SortMode)

export function priceKeyOf(productId) {
    return `${productId} (руб.)`
}

export function amountKeyOf(productId) {
    return `${productId} (шт.)`
}
