import {COMPANY_NAME_KEY} from "./const.js";
import {getMedianInArray} from "./utils.js";

function aggregate(name, data, headers, aggregateFunc) {
    const object = {}

    object[COMPANY_NAME_KEY] = name

    headers.forEach(header => {
        object[header] = data.length > 0 ? aggregateFunc(data.map(it => it[header])) : 0
    })

    return object
}

export function calculateTotal(data, headers) {
    return aggregate(
        "Итого",
        data,
        headers,
        (values) => values.reduce((acc, v) => acc + v)
    )
}

export function calculateMaximum(data, headers) {
    return aggregate(
        "Максимум",
        data,
        headers,
        (values) => values.sort((a, b) => b - a)[0]
    )
}

export function calculateAverage(data, headers) {
    return aggregate(
        "Среднее",
        data,
        headers,
        (values) => values.reduce((acc, v) => acc + v) / values.length
    )
}

export function calculateMedian(data, headers) {
    return aggregate(
        "Медиана",
        data,
        headers,
        getMedianInArray
    )
}
