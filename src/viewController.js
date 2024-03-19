import {ITEMS_PER_PAGE} from "./const.js";
import {fetchCompanyData} from "./dataSource.js";
import {roundNumberFieldsIn} from "./utils.js";

function viewStateOf(data = []) {
    return {
        data: data,
        headers: [],
        page: 0,
        pages: 0,
        perPage: 0,
        perPageList: ITEMS_PER_PAGE,
        query: null
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
        cachedData.forEach(roundNumberFieldsIn)
        console.table(cachedData)
    }

    function onHeaderClicked(headerId) {

    }

    function onNextPageClicked() {

    }

    function onPreviousPageClicked() {

    }

    function onPaginationValueChanged(value) {

    }

    function onNameFilterValueChanged(value) {

    }

    return {
        setViewStateUpdatedListener: setViewStateUpdatedListener,
        fetchData: fetchData,
        onHeaderClicked: onHeaderClicked,
        onNextPageClicked: onNextPageClicked,
        onPreviousPageClicked: onPreviousPageClicked,
        onPaginationValueChanged: onPaginationValueChanged,
    }
}