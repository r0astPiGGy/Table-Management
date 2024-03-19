
export function round(number) {
    return +number.toFixed(2)
}

export function roundNumberFieldsIn(object) {
    Object.entries(object).forEach(([key, value]) => {
        if (typeof value === "number") {
            object[key] = round(value)
        }
    })
}

export function distinct(array) {
    return [...new Set(array)]
}