export function round(number) {
    return +number.toFixed(2)
}

export function tryRoundNumber(number) {
    if (typeof number === 'number') {
        return round(number)
    } else {
        return number
    }
}

export function getMedianInArray(array) {
    const copy = [...array]
    copy.sort((a, b) => a - b)

    const half = Math.floor(copy.length / 2)
    return copy.length % 2
        ? copy[half]
        : (copy[half - 1] + copy[half]) / 2.0
}

export function distinct(array) {
    return [...new Set(array)]
}