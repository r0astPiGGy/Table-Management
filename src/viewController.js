import {COMPANY_NAME_KEY, DEFAULT_ITEMS_PER_PAGE, ITEMS_PER_PAGE, SortMode, sortModes} from "./const.js";
import {fetchCompanyData, getAllHeaders, getMetricsHeaders} from "./dataSource.js";
import {calculateAverage, calculateMaximum, calculateMedian, calculateTotal} from "./metrics.js";

const ViewState = function() {
    return {
        data: [],
        headers: [],

        page: 0,
        pages: 0,
        perPage: DEFAULT_ITEMS_PER_PAGE,
        perPageList: ITEMS_PER_PAGE,

        searchQuery: null,

        headerIdToSortBy: null,
        sortMode: SortMode.NONE,
        sortModeIterator: 0
    }
}

export const ViewController = function () {

    let state = null
    let stateUpdatedListener = null

    let cachedData = []
    let filteredData = []

    let metricsHeaders = []

    function setViewStateUpdatedListener(listener) {
        stateUpdatedListener = listener
    }

    function fireViewStateUpdatedEvent() {
        if (stateUpdatedListener === null) return

        stateUpdatedListener(state)
    }

    function fetchData() {
        cachedData = fetchCompanyData()
        filteredData = cachedData

        state = ViewState()
        state.headers = getAllHeaders()
        metricsHeaders = getMetricsHeaders()

        updatePagination(filteredData, DEFAULT_ITEMS_PER_PAGE)
        updateData()

        fireViewStateUpdatedEvent()
    }

    function updatePagination(data, perPage) {
        state.page = 0
        state.pages = Math.floor(data.length / perPage)
        state.perPage = perPage
    }

    function updateData() {
        state.data = includeMetrics(paginate(sort(filteredData)))
    }

    function includeMetrics(data) {
        return [
            ...data,
            // Метрики были взяты с текущей страницы, а не со всех
            calculateTotal(data, metricsHeaders),
            calculateMaximum(data, metricsHeaders),
            calculateAverage(data, metricsHeaders),
            calculateMedian(data, metricsHeaders),
        ]
    }

    function sort(data) {
        if (data.length === 0) return data

        const keyToSortBy = state.headerIdToSortBy

        if (keyToSortBy === null || state.sortMode === SortMode.NONE) return data

        let comparator;

        if (typeof data[0][keyToSortBy] === "number") {
            comparator = (a, b) => a - b;
        } else {
            comparator = (a, b) => a.localeCompare(b);
        }

        return [...data].sort((a, b) => {
            const valueA = a[keyToSortBy]
            const valueB = b[keyToSortBy]

            return state.sortMode === SortMode.ASCENDING ? comparator(valueA, valueB) : comparator(valueB, valueA);
        })
    }

    function paginate(data) {
        const offset = state.page * state.perPage

        return data.slice(offset, offset + state.perPage)
    }

    function filter(data) {
        if (state.searchQuery === null) return data

        function isNameStartsWith(query, record) {
            query = query.toLowerCase()

            return record[COMPANY_NAME_KEY].toLowerCase().startsWith(query)
        }

        return data.filter(record => isNameStartsWith(state.searchQuery, record))
    }

    function onHeaderClicked(headerId) {
        if (headerId !== state.headerIdToSortBy) {
            state.headerIdToSortBy = headerId
            state.sortModeIterator = 0
        }

        state.sortMode = sortModes[++state.sortModeIterator % sortModes.length]

        updateData()
        fireViewStateUpdatedEvent()
    }

    function onNextPageClicked() {
        setPage(state.page + 1)
    }

    function onPreviousPageClicked() {
        setPage(state.page - 1)
    }

    function setPage(page) {
        if (page < 0 || page > state.pages) return

        state.page = page
        updateData()
        fireViewStateUpdatedEvent()
    }

    function onPaginationValueChanged(value) {
        if (state.perPage === value) return

        updatePagination(filteredData, value)
        updateData()

        fireViewStateUpdatedEvent()
    }

    function onNameFilterValueChanged(value) {
        if (state.searchQuery === value) return

        state.searchQuery = value

        filteredData = filter(cachedData)

        updatePagination(filteredData, state.perPage)
        updateData()

        fireViewStateUpdatedEvent()
    }

    return {
        setViewStateUpdatedListener: setViewStateUpdatedListener,
        fetchData: fetchData,
        onHeaderClicked: onHeaderClicked,
        onNextPageClicked: onNextPageClicked,
        onPreviousPageClicked: onPreviousPageClicked,
        onPaginationValueChanged: onPaginationValueChanged,
        onNameFilterValueChanged: onNameFilterValueChanged
    }
}