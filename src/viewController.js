import {DEFAULT_ITEMS_PER_PAGE, ITEMS_PER_PAGE} from "./const.js";
import {fetchCompanyData, getHeaders} from "./dataSource.js";
import {roundNumberFieldsIn} from "./utils.js";

const ViewState = function() {
    return {
        data: [],
        headers: [],
        page: 0,
        pages: 0,
        perPage: DEFAULT_ITEMS_PER_PAGE,
        perPageList: ITEMS_PER_PAGE,
        searchQuery: null
    }
}

export const ViewController = function () {

    let state = null
    let stateUpdatedListener = null

    let cachedData = []

    function setViewStateUpdatedListener(listener) {
        stateUpdatedListener = listener
    }

    function fireViewStateUpdatedEvent() {
        if (stateUpdatedListener === null) return

        stateUpdatedListener(state)
    }

    function fetchData() {
        cachedData = fetchCompanyData()
        cachedData.forEach(it => roundNumberFieldsIn(it))

        state = ViewState()
        state.headers = getHeaders()
        updatePagination(DEFAULT_ITEMS_PER_PAGE)
        updateData()

        fireViewStateUpdatedEvent()
    }

    function updatePagination(perPage) {
        state.page = 0
        state.pages = Math.floor(cachedData.length / perPage)
        state.perPage = perPage
    }

    function updateData() {
        state.data = includeMetrics(paginateData(cachedData))
    }

    function paginateData(data) {
        const offset = state.page * state.perPage

        return data.slice(offset, offset + state.perPage)
    }

    function includeMetrics(data) {
        return [
            ...data,
        ]
    }

    function onHeaderClicked(headerId) {

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

        updatePagination(value)
        updateData()

        fireViewStateUpdatedEvent()
    }

    function onNameFilterValueChanged(value) {
        if (state.searchQuery === value) return

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